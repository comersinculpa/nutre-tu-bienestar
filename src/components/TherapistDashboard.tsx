import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Clock,
  Heart,
  Brain,
  Activity,
  CheckCircle,
  XCircle,
  Phone,
  Mail
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  diagnosisDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: number;
  treatmentDays: number;
  compliance: number;
  recentAlerts: number;
  nextAppointment?: number;
  therapistNotes: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface ClinicalMetrics {
  totalPatients: number;
  highRiskPatients: number;
  averageCompliance: number;
  activeAlerts: number;
  completedSessions: number;
  missedAppointments: number;
}

export const TherapistDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<ClinicalMetrics>({
    totalPatients: 0,
    highRiskPatients: 0,
    averageCompliance: 0,
    activeAlerts: 0,
    completedSessions: 0,
    missedAppointments: 0
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = () => {
    // Datos simulados de pacientes
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Ana García',
        age: 22,
        avatar: '/avatars/patient1.jpg',
        diagnosisDate: '2024-01-15',
        riskLevel: 'medium',
        lastActivity: Date.now() - 3600000,
        treatmentDays: 45,
        compliance: 78,
        recentAlerts: 2,
        nextAppointment: Date.now() + 86400000,
        therapistNotes: 'Progreso constante, trabajando en autoimagen corporal.',
        emergencyContact: {
          name: 'María García',
          phone: '+34 600 123 456',
          relation: 'Madre'
        }
      },
      {
        id: '2',
        name: 'Laura Martín',
        age: 19,
        avatar: '/avatars/patient2.jpg',
        diagnosisDate: '2023-11-20',
        riskLevel: 'critical',
        lastActivity: Date.now() - 86400000 * 2,
        treatmentDays: 120,
        compliance: 45,
        recentAlerts: 5,
        nextAppointment: Date.now() + 43200000,
        therapistNotes: 'Alerta crítica - Requiere seguimiento intensivo.',
        emergencyContact: {
          name: 'Pedro Martín',
          phone: '+34 600 789 012',
          relation: 'Padre'
        }
      },
      {
        id: '3',
        name: 'Carmen López',
        age: 25,
        avatar: '/avatars/patient3.jpg',
        diagnosisDate: '2024-02-01',
        riskLevel: 'low',
        lastActivity: Date.now() - 1800000,
        treatmentDays: 30,
        compliance: 92,
        recentAlerts: 0,
        nextAppointment: Date.now() + 172800000,
        therapistNotes: 'Excelente progreso, muy comprometida con el tratamiento.',
        emergencyContact: {
          name: 'Juan López',
          phone: '+34 600 345 678',
          relation: 'Hermano'
        }
      }
    ];

    setPatients(mockPatients);
    
    // Calcular métricas
    const totalPatients = mockPatients.length;
    const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
    const averageCompliance = mockPatients.reduce((sum, p) => sum + p.compliance, 0) / totalPatients;
    const activeAlerts = mockPatients.reduce((sum, p) => sum + p.recentAlerts, 0);
    
    setMetrics({
      totalPatients,
      highRiskPatients,
      averageCompliance: Math.round(averageCompliance),
      activeAlerts,
      completedSessions: 28,
      missedAppointments: 3
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-slate-500 bg-slate-500/10';
      case 'medium': return 'text-slate-500 bg-slate-500/10';
      default: return 'text-green-500 bg-green-500/10';
    }
  };

  const getLastActivityText = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'Hace menos de 1 hora';
  };

  const sortedPatients = [...patients].sort((a, b) => {
    const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-4">
        <div className="mb-6 pt-4">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Dashboard Clínico
          </h1>
          <p className="text-muted-foreground">
            Panel de control para el seguimiento de pacientes con TCA
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="patients">
              Pacientes
              {metrics.activeAlerts > 0 && (
                <Badge className="ml-1 h-4 w-4 p-0 text-xs">{metrics.activeAlerts}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Métricas Generales */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{metrics.totalPatients}</div>
                  <div className="text-xs text-muted-foreground">Pacientes Activos</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{metrics.highRiskPatients}</div>
                  <div className="text-xs text-muted-foreground">Alto Riesgo</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{metrics.averageCompliance}%</div>
                  <div className="text-xs text-muted-foreground">Adherencia Media</div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas Activas */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Alertas Activas ({metrics.activeAlerts})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedPatients.filter(p => p.recentAlerts > 0).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.recentAlerts} alerta{patient.recentAlerts > 1 ? 's' : ''} activa{patient.recentAlerts > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Próximas Citas */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patients
                  .filter(p => p.nextAppointment)
                  .sort((a, b) => (a.nextAppointment || 0) - (b.nextAppointment || 0))
                  .map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(patient.nextAppointment!).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            {sortedPatients.map((patient) => (
              <Card key={patient.id} className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.age} años</p>
                        <p className="text-xs text-muted-foreground">
                          En tratamiento {patient.treatmentDays} días
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                      {patient.recentAlerts > 0 && (
                        <Badge variant="destructive">{patient.recentAlerts} alertas</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Adherencia al Tratamiento</div>
                      <div className="flex items-center gap-2">
                        <Progress value={patient.compliance} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{patient.compliance}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Última Actividad</div>
                      <div className="text-sm font-medium">{getLastActivityText(patient.lastActivity)}</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Notas del Terapeuta</div>
                    <p className="text-sm text-foreground">{patient.therapistNotes}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{patient.emergencyContact.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{patient.emergencyContact.relation}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        Historial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Estadísticas de Sesiones */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{metrics.completedSessions}</div>
                  <div className="text-xs text-muted-foreground">Sesiones Completadas</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{metrics.missedAppointments}</div>
                  <div className="text-xs text-muted-foreground">Citas Perdidas</div>
                </CardContent>
              </Card>
            </div>

            {/* Distribución de Riesgo */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle>Distribución de Niveles de Riesgo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['low', 'medium', 'high', 'critical'].map((level) => {
                    const count = patients.filter(p => p.riskLevel === level).length;
                    const percentage = patients.length > 0 ? (count / patients.length) * 100 : 0;
                    
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            level === 'critical' ? 'bg-destructive' :
                            level === 'high' ? 'bg-slate-500' :
                            level === 'medium' ? 'bg-slate-500' : 'bg-green-500'
                          }`}></div>
                          <span className="text-sm font-medium capitalize">{level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground w-12">{count} ({Math.round(percentage)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};