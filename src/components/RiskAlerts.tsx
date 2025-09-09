import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, X, Heart, Phone, MessageCircle } from 'lucide-react';
import { useRiskDetection, RiskAlert } from '@/hooks/useRiskDetection';
import { CrisisSupport } from './CrisisSupport';

const severityConfig = {
  low: {
    icon: Info,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20'
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20'
  },
  critical: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
    borderColor: 'border-destructive'
  }
};

interface RiskAlertsProps {
  className?: string;
}

export const RiskAlerts = ({ className }: RiskAlertsProps) => {
  const { getActiveAlerts, dismissAlert, getRiskSummary } = useRiskDetection();
  
  const activeAlerts = getActiveAlerts();
  const riskSummary = getRiskSummary();
  const hasCriticalAlerts = activeAlerts.some(alert => alert.severity === 'critical');

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
  };

  const AlertCard = ({ alert }: { alert: RiskAlert }) => {
    const config = severityConfig[alert.severity];
    const IconComponent = config.icon;

    return (
      <Alert className={`${config.bgColor} ${config.borderColor} border-2`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <IconComponent className={`w-5 h-5 mt-0.5 ${config.color}`} />
            <div className="flex-1">
              <AlertTitle className="text-sm font-medium">
                {alert.title}
              </AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {alert.message}
              </AlertDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  {new Date(alert.timestamp).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Badge>
                {alert.severity === 'critical' && (
                  <CrisisSupport 
                    trigger={
                      <Button
                        size="sm"
                        className="text-xs h-6 px-2"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Necesito apoyo
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(alert.id)}
            className="ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    );
  };

  if (activeAlerts.length === 0 && riskSummary.total === 0) {
    return null;
  }

  return (
    <>
      <div className={className}>
        {/* Crisis Support Banner */}
        {hasCriticalAlerts && (
          <Card className="bg-destructive/10 border-destructive/50 border-2 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-medium text-destructive">
                    Tu bienestar es nuestra prioridad
                  </h3>
                  <p className="text-sm text-destructive/80">
                    Detectamos que podrías necesitar apoyo inmediato.
                  </p>
                </div>
                <CrisisSupport 
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Ayuda
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Card className="bg-gradient-card border-0 shadow-card mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Alertas Activas ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Risk Summary */}
        {riskSummary.total > 0 && (
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5 text-primary" />
                Resumen de Patrones (7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {riskSummary.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Patrones detectados</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-destructive">
                    {riskSummary.high + riskSummary.critical}
                  </div>
                  <div className="text-xs text-muted-foreground">Requieren atención</div>
                </div>
              </div>
              
              {(riskSummary.high > 0 || riskSummary.critical > 0) && (
                <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    💙 Recuerda que estos patrones son información valiosa. 
                    Considera compartirlos con tu equipo de apoyo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};