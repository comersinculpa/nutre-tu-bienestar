import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Brain, 
  Heart, 
  Activity,
  Shield,
  Bell,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RiskFactor {
  id: string;
  type: 'behavioral' | 'emotional' | 'physical' | 'temporal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  detected: number;
  trend: 'improving' | 'stable' | 'worsening';
  recommendations: string[];
}

interface PredictiveAlert {
  id: string;
  type: 'early_warning' | 'intervention_needed' | 'crisis_risk';
  title: string;
  message: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  factors: string[];
}

export const AdvancedRiskDetection: React.FC = () => {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRiskAnalysis();
    runAdvancedAnalysis();
  }, []);

  const loadRiskAnalysis = () => {
    const storedFactors = localStorage.getItem('advancedRiskFactors');
    const storedAlerts = localStorage.getItem('predictiveAlerts');
    
    if (storedFactors) {
      setRiskFactors(JSON.parse(storedFactors));
    }
    
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulación de análisis avanzado
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const foodLogs = JSON.parse(localStorage.getItem('foodLogs') || '[]');
    
    const detectedFactors = analyzePatterns(checkIns, diaryEntries, foodLogs);
    const predictiveAlerts = generatePredictiveAlerts(detectedFactors);
    const riskScore = calculateOverallRisk(detectedFactors);
    
    setRiskFactors(detectedFactors);
    setAlerts(predictiveAlerts);
    setOverallRiskScore(riskScore);
    
    localStorage.setItem('advancedRiskFactors', JSON.stringify(detectedFactors));
    localStorage.setItem('predictiveAlerts', JSON.stringify(predictiveAlerts));
    
    setIsAnalyzing(false);
    
    if (predictiveAlerts.some(alert => alert.urgency === 'critical')) {
      toast({
        title: "Alerta Crítica Detectada",
        description: "Se ha detectado un patrón que requiere atención inmediata.",
        variant: "destructive",
      });
    }
  };

  const analyzePatterns = (checkIns: any[], diaryEntries: any[], foodLogs: any[]): RiskFactor[] => {
    const factors: RiskFactor[] = [];
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Análisis de patrones emocionales
    const recentCheckIns = checkIns.filter(c => c.timestamp > sevenDaysAgo);
    if (recentCheckIns.length > 0) {
      const negativeEmotions = recentCheckIns.filter(c => 
        ['triste', 'ansioso', 'enojado', 'abrumado'].includes(c.emotion?.toLowerCase())
      );
      
      if (negativeEmotions.length / recentCheckIns.length > 0.7) {
        factors.push({
          id: 'emotional-distress',
          type: 'emotional',
          severity: negativeEmotions.length / recentCheckIns.length > 0.9 ? 'critical' : 'high',
          description: 'Patrón persistente de emociones negativas',
          confidence: 0.85,
          detected: now,
          trend: 'worsening',
          recommendations: [
            'Considera una sesión de terapia adicional',
            'Practica técnicas de mindfulness diariamente',
            'Conecta con tu sistema de apoyo'
          ]
        });
      }
    }
    
    // Análisis de patrones alimentarios
    const recentFoodLogs = foodLogs.filter(f => f.timestamp > sevenDaysAgo);
    if (recentFoodLogs.length > 0) {
      const restrictiveDays = recentFoodLogs.filter(f => f.meals && f.meals.length < 2);
      
      if (restrictiveDays.length > 3) {
        factors.push({
          id: 'restrictive-eating',
          type: 'behavioral',
          severity: restrictiveDays.length > 5 ? 'critical' : 'high',
          description: 'Patrón de alimentación restrictiva detectado',
          confidence: 0.78,
          detected: now,
          trend: 'worsening',
          recommendations: [
            'Consulta con tu nutricionista',
            'Utiliza el plan de comidas estructurado',
            'Practica alimentación consciente'
          ]
        });
      }
    }
    
    // Análisis de inactividad
    const lastActivity = Math.max(
      checkIns.length > 0 ? Math.max(...checkIns.map(c => c.timestamp)) : 0,
      diaryEntries.length > 0 ? Math.max(...diaryEntries.map(d => d.timestamp)) : 0
    );
    
    const daysSinceActivity = (now - lastActivity) / (24 * 60 * 60 * 1000);
    
    if (daysSinceActivity > 2) {
      factors.push({
        id: 'inactivity',
        type: 'temporal',
        severity: daysSinceActivity > 5 ? 'high' : 'medium',
        description: `${Math.floor(daysSinceActivity)} días sin actividad registrada`,
        confidence: 0.95,
        detected: now,
        trend: 'worsening',
        recommendations: [
          'Establece recordatorios diarios',
          'Comienza con registros pequeños',
          'Contacta a tu terapeuta si necesitas apoyo'
        ]
      });
    }
    
    // Análisis de texto de entradas del diario
    const recentEntries = diaryEntries.filter(e => e.timestamp > sevenDaysAgo);
    const concerningPhrases = [
      'no puedo más', 'quiero desaparecer', 'no vale la pena', 
      'odio mi cuerpo', 'no como', 'me siento gorda'
    ];
    
    const concerningEntries = recentEntries.filter(entry => 
      concerningPhrases.some(phrase => 
        entry.content?.toLowerCase().includes(phrase.toLowerCase())
      )
    );
    
    if (concerningEntries.length > 0) {
      factors.push({
        id: 'concerning-language',
        type: 'emotional',
        severity: concerningEntries.length > 2 ? 'critical' : 'high',
        description: 'Lenguaje preocupante detectado en entradas del diario',
        confidence: 0.82,
        detected: now,
        trend: 'stable',
        recommendations: [
          'Busca apoyo profesional inmediato',
          'Utiliza líneas de crisis si es necesario',
          'Comparte estos sentimientos con tu terapeuta'
        ]
      });
    }
    
    return factors;
  };

  const generatePredictiveAlerts = (factors: RiskFactor[]): PredictiveAlert[] => {
    const alerts: PredictiveAlert[] = [];
    const now = Date.now();
    
    const criticalFactors = factors.filter(f => f.severity === 'critical');
    const highFactors = factors.filter(f => f.severity === 'high');
    
    if (criticalFactors.length > 0) {
      alerts.push({
        id: 'crisis-risk',
        type: 'crisis_risk',
        title: 'Riesgo de Crisis Detectado',
        message: 'Se han identificado múltiples factores críticos que requieren intervención inmediata.',
        confidence: 0.92,
        urgency: 'critical',
        timestamp: now,
        factors: criticalFactors.map(f => f.id)
      });
    } else if (highFactors.length >= 2) {
      alerts.push({
        id: 'intervention-needed',
        type: 'intervention_needed',
        title: 'Intervención Preventiva Recomendada',
        message: 'Los patrones actuales sugieren que sería beneficioso aumentar el nivel de apoyo.',
        confidence: 0.78,
        urgency: 'high',
        timestamp: now,
        factors: highFactors.map(f => f.id)
      });
    } else if (factors.length > 0) {
      alerts.push({
        id: 'early-warning',
        type: 'early_warning',
        title: 'Señales Tempranas Detectadas',
        message: 'Se han identificado algunos patrones que requieren monitoreo cercano.',
        confidence: 0.65,
        urgency: 'medium',
        timestamp: now,
        factors: factors.map(f => f.id)
      });
    }
    
    return alerts;
  };

  const calculateOverallRisk = (factors: RiskFactor[]): number => {
    if (factors.length === 0) return 0;
    
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalWeight = factors.reduce((sum, factor) => 
      sum + severityWeights[factor.severity] * factor.confidence, 0
    );
    
    return Math.min((totalWeight / (factors.length * 4)) * 100, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-destructive/10 border-destructive';
      case 'high': return 'bg-slate-500/10 border-slate-500';
      case 'medium': return 'bg-slate-500/10 border-slate-500';
      default: return 'bg-green-500/10 border-green-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'worsening': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emotional': return <Heart className="w-4 h-4" />;
      case 'behavioral': return <Brain className="w-4 h-4" />;
      case 'temporal': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Análisis Predictivo de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{
              color: overallRiskScore > 75 ? '#ef4444' : 
                     overallRiskScore > 50 ? '#f97316' : 
                     overallRiskScore > 25 ? '#eab308' : '#22c55e'
            }}>
              {Math.round(overallRiskScore)}%
            </div>
            <p className="text-sm text-muted-foreground">Puntuación de Riesgo General</p>
          </div>
          
          <Progress 
            value={overallRiskScore} 
            className="h-3"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo</span>
            <span>Moderado</span>
            <span>Alto</span>
            <span>Crítico</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button 
              onClick={runAdvancedAnalysis} 
              disabled={isAnalyzing}
              size="sm"
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Actualizar Análisis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Alertas Predictivas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={getUrgencyColor(alert.urgency)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(alert.confidence * 100)}% confianza
                    </Badge>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <div className="text-xs text-muted-foreground">
                    Detectada: {new Date(alert.timestamp).toLocaleString('es-ES')}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Factores de Riesgo Detectados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskFactors.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Sin Factores de Riesgo</h3>
              <p className="text-sm text-muted-foreground">
                El análisis no ha detectado patrones de riesgo significativos.
              </p>
            </div>
          ) : (
            riskFactors.map((factor) => (
              <div key={factor.id} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(factor.type)}
                    <h4 className="font-semibold text-foreground">{factor.description}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(factor.trend)}
                    <Badge className={getSeverityColor(factor.severity)} variant="outline">
                      {factor.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>Confianza: {Math.round(factor.confidence * 100)}%</span>
                  <span>Detectado: {new Date(factor.detected).toLocaleDateString('es-ES')}</span>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Recomendaciones:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {factor.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};