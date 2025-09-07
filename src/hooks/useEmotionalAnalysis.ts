import { useState, useCallback } from 'react';

interface EmotionalAnalysis {
  risk: 'low' | 'medium' | 'high';
  emotions: string[];
  triggers: string[];
  recommendations: string[];
  needsSupport: boolean;
}

const riskKeywords = {
  high: ['atracón', 'odio', 'culpa', 'horrible', 'fracaso', 'no puedo', 'desesperada', 'ansiedad extrema', 'pánico'],
  medium: ['preocupada', 'ansiosa', 'triste', 'frustrada', 'cansada', 'estrés', 'agobiada'],
  triggers: ['trabajo', 'relaciones', 'soledad', 'aburrimiento', 'celebración', 'conflicto', 'presión']
};

const recommendations = {
  high: [
    'Técnica de respiración inmediata',
    'Contactar con apoyo profesional',
    'Ejercicio de grounding 5-4-3-2-1',
    'Pausa guiada de emergencia'
  ],
  medium: [
    'Meditación de 5 minutos',
    'Técnica STOP',
    'Registro de emociones',
    'Actividad de autocuidado'
  ],
  low: [
    'Reflexión consciente',
    'Diario de gratitud',
    'Técnica de relajación',
    'Planificación del día'
  ]
};

export const useEmotionalAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = useCallback(async (text: string, selectedEmotion?: string): Promise<EmotionalAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const textLower = text.toLowerCase();
    
    // Risk assessment
    let risk: 'low' | 'medium' | 'high' = 'low';
    
    const highRiskCount = riskKeywords.high.filter(keyword => textLower.includes(keyword)).length;
    const mediumRiskCount = riskKeywords.medium.filter(keyword => textLower.includes(keyword)).length;
    
    if (highRiskCount > 0) {
      risk = 'high';
    } else if (mediumRiskCount > 1 || selectedEmotion === 'ansiedad' || selectedEmotion === 'tristeza') {
      risk = 'medium';
    }
    
    // Extract emotions
    const detectedEmotions = [];
    if (selectedEmotion) detectedEmotions.push(selectedEmotion);
    
    // Extract triggers
    const detectedTriggers = riskKeywords.triggers.filter(trigger => 
      textLower.includes(trigger)
    );
    
    // Get recommendations
    const contextualRecommendations = recommendations[risk];
    
    setIsAnalyzing(false);
    
    return {
      risk,
      emotions: detectedEmotions,
      triggers: detectedTriggers,
      recommendations: contextualRecommendations,
      needsSupport: risk === 'high'
    };
  }, []);

  return {
    analyzeText,
    isAnalyzing
  };
};