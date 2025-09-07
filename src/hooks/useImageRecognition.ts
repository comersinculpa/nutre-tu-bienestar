import { useState, useCallback } from 'react';

interface FoodAnalysis {
  foods: string[];
  category: 'nutritiva' | 'procesada' | 'emocional';
  emotionalTrigger: boolean;
  suggestions: string[];
}

interface EmotionAnalysis {
  primaryEmotion: string;
  intensity: number;
  confidence: number;
}

const foodDatabase = {
  nutritiva: ['ensalada', 'fruta', 'verduras', 'pescado', 'pollo', 'legumbres', 'cereales'],
  procesada: ['pizza', 'hamburguesa', 'dulces', 'patatas fritas', 'refrescos', 'bollería'],
  emocional: ['chocolate', 'helado', 'galletas', 'dulces', 'comida rápida']
};

const emotionSuggestions = {
  nutritiva: [
    'Excelente elección nutritiva',
    'Sigue cuidándote así',
    'Tu cuerpo te lo agradece'
  ],
  procesada: [
    'Sin juicios, pero observa cómo te sientes',
    'Considera acompañar con algo nutritivo',
    'Escucha las señales de tu cuerpo'
  ],
  emocional: [
    'Reconoce si hay hambre física o emocional',
    'Respira antes de continuar',
    'Considera una pausa de autocuidado'
  ]
};

export const useImageRecognition = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFoodImage = useCallback(async (imageFile: File): Promise<FoodAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on filename or random selection
    const mockFoods = ['chocolate', 'ensalada', 'pizza', 'fruta'];
    const detectedFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    
    let category: 'nutritiva' | 'procesada' | 'emocional' = 'nutritiva';
    
    if (foodDatabase.emocional.includes(detectedFood)) {
      category = 'emocional';
    } else if (foodDatabase.procesada.includes(detectedFood)) {
      category = 'procesada';
    }
    
    const emotionalTrigger = category === 'emocional';
    const suggestions = emotionSuggestions[category];
    
    setIsAnalyzing(false);
    
    return {
      foods: [detectedFood],
      category,
      emotionalTrigger,
      suggestions
    };
  }, []);

  const analyzeEmotionFromSelfie = useCallback(async (imageFile: File): Promise<EmotionAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate emotion detection from selfie
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emotions = ['alegría', 'tristeza', 'ansiedad', 'calma', 'preocupación'];
    const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.floor(Math.random() * 10) + 1;
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    setIsAnalyzing(false);
    
    return {
      primaryEmotion,
      intensity,
      confidence
    };
  }, []);

  return {
    analyzeFoodImage,
    analyzeEmotionFromSelfie,
    isAnalyzing
  };
};