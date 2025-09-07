import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useImageRecognition } from '@/hooks/useImageRecognition';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  type: 'food' | 'selfie';
  onAnalysisComplete?: (result: any) => void;
  className?: string;
}

export const ImageUpload = ({ type, onAnalysisComplete, className = '' }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeFoodImage, analyzeEmotionFromSelfie, isAnalyzing } = useImageRecognition();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    try {
      let result;
      if (type === 'food') {
        result = await analyzeFoodImage(selectedImage);
        toast({
          title: "Imagen analizada",
          description: `Detecté: ${result.foods.join(', ')}`,
        });
      } else {
        result = await analyzeEmotionFromSelfie(selectedImage);
        toast({
          title: "Emoción detectada",
          description: `${result.primaryEmotion} (${result.confidence}% confianza)`,
        });
      }
      
      onAnalysisComplete?.(result);
    } catch (error) {
      toast({
        title: "Error en análisis",
        description: "No pude procesar la imagen. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTitle = () => {
    return type === 'food' ? 'Sube una foto de tu comida' : 'Toma una selfie para detectar tu emoción';
  };

  const getDescription = () => {
    return type === 'food' 
      ? 'Te ayudaré a identificar los alimentos y su relación emocional'
      : 'Analizaré tu expresión para entender mejor cómo te sientes';
  };

  return (
    <Card className={`bg-gradient-card shadow-card border-0 ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-foreground mb-2">{getTitle()}</h3>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </div>

        {!previewUrl ? (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col gap-2 h-20"
              >
                <Upload className="w-5 h-5" />
                <span className="text-xs">Subir foto</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // In a real app, this would open camera
                  fileInputRef.current?.click();
                }}
                className="flex flex-col gap-2 h-20"
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs">Tomar foto</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={clearImage}
                className="absolute top-2 right-2 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="w-full bg-gradient-primary shadow-soft"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  {type === 'food' ? 'Analizar comida' : 'Detectar emoción'}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};