import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Download, 
  Heart, 
  Sparkles, 
  Leaf, 
  Eye, 
  Loader2,
  BookOpen,
  Star,
  Zap,
  Info,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mandalaDesigns, getMandalaCollections, createMandalaContent, type MandalaDesign } from '@/services/mandalaGenerator';
import { pdfGenerator } from '@/services/pdfGenerator';

export const MandalasParaColorear: React.FC = () => {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const collections = getMandalaCollections();

  const handleDownloadSingle = async (design: MandalaDesign) => {
    setDownloading(prev => ({ ...prev, [design.id]: true }));
    
    try {
      await pdfGenerator.generateSingleMandala(design);
      
      toast({
        title: "✅ ¡Descarga Completa!",
        description: `El mandala "${design.name}" se ha descargado exitosamente.`,
      });
    } catch (error) {
      console.error('Error downloading mandala:', error);
      toast({
        title: "❌ Error de Descarga",
        description: "Hubo un problema descargando el mandala. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setDownloading(prev => ({ ...prev, [design.id]: false }));
    }
  };

  const handleDownloadCollection = async (collectionName: string, designs: MandalaDesign[]) => {
    const collectionKey = `collection-${collectionName}`;
    setDownloading(prev => ({ ...prev, [collectionKey]: true }));
    
    try {
      await pdfGenerator.generateMandalaCollection(designs, collectionName);
      
      toast({
        title: "🎨 ¡Colección Descargada!",
        description: `La colección "${collectionName}" con ${designs.length} mandalas se ha descargado.`,
      });
    } catch (error) {
      console.error('Error downloading collection:', error);
      toast({
        title: "❌ Error de Descarga",
        description: "Hubo un problema descargando la colección. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setDownloading(prev => ({ ...prev, [collectionKey]: false }));
    }
  };

  const handleDownloadCompleteBook = async () => {
    setDownloading(prev => ({ ...prev, 'complete-book': true }));
    
    try {
      await pdfGenerator.generateCompleteMandalaBook(collections);
      
      toast({
        title: "📚 ¡Libro Completo Descargado!",
        description: `El libro con todos los ${mandalaDesigns.length} mandalas se ha descargado exitosamente.`,
      });
    } catch (error) {
      console.error('Error downloading complete book:', error);
      toast({
        title: "❌ Error de Descarga",
        description: "Hubo un problema descargando el libro completo. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setDownloading(prev => ({ ...prev, 'complete-book': false }));
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return <Leaf className="w-4 h-4 text-green-500" />;
      case 'Intermedio': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'Avanzado': return <Zap className="w-4 h-4 text-red-500" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'Naturaleza': return <Leaf className="w-4 h-4 text-green-600" />;
      case 'Espiritual': return <Eye className="w-4 h-4 text-purple-600" />;
      case 'Floral': return <Heart className="w-4 h-4 text-pink-600" />;
      case 'Geométrico': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'Abstracto': return <Sparkles className="w-4 h-4 text-indigo-600" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500/10 border-green-500/20 text-green-600';
      case 'Intermedio': return 'bg-slate-500/10 border-slate-500/20 text-slate-600';
      case 'Avanzado': return 'bg-red-500/10 border-red-500/20 text-red-600';
      default: return 'bg-muted/30 border-muted';
    }
  };

  const MandalaPreview: React.FC<{ design: MandalaDesign }> = ({ design }) => {
    const [showPreview, setShowPreview] = useState(false);
    
    return (
      <Card className="bg-gradient-card border-0 shadow-card hover:shadow-warm transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {getThemeIcon(design.theme)}
                {design.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{design.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge className={getDifficultyColor(design.difficulty)} variant="outline">
              {getDifficultyIcon(design.difficulty)}
              <span className="ml-1">{design.difficulty}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {design.theme}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Preview del mandala */}
          <div className="relative">
            {showPreview ? (
              <div 
                className="w-full h-48 border-2 border-dashed border-muted rounded-lg bg-background-submenu flex items-center justify-center cursor-pointer"
                onClick={() => setShowPreview(false)}
                dangerouslySetInnerHTML={{ __html: createMandalaContent(design) }}
              />
            ) : (
              <div 
                className="w-full h-48 border-2 border-dashed border-muted rounded-lg bg-muted/20 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setShowPreview(true)}
              >
                <div className="text-center">
                  <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Haz clic para previsualizar</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Beneficios */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Beneficios Terapéuticos:</h4>
            <div className="flex flex-wrap gap-1">
              {design.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Botón de descarga */}
          <Button
            onClick={() => handleDownloadSingle(design)}
            disabled={downloading[design.id]}
            className="w-full"
            variant="outline"
          >
            {downloading[design.id] ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto">
          <Palette className="w-8 h-8 text-sage-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Mandalas para Colorear</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubre la paz interior coloreando nuestros {mandalaDesigns.length} mandalas terapéuticos únicos. 
          Cada diseño está cuidadosamente creado para promover la relajación, mindfulness y bienestar emocional.
        </p>
      </div>

      {/* Info sobre beneficios */}
      <Alert className="border-blue-500/20 bg-blue-500/10">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Beneficios de colorear mandalas:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Reduce el estrés y la ansiedad</li>
            <li>• Mejora la concentración y el enfoque</li>
            <li>• Promueve la meditación activa</li>
            <li>• Estimula la creatividad y autoexpresión</li>
            <li>• Ayuda en el proceso de sanación emocional</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Descarga completa */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Libro Completo de Mandalas
          </CardTitle>
          <p className="text-muted-foreground">
            Descarga todos los {mandalaDesigns.length} mandalas en un solo libro PDF organizado por colecciones
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={handleDownloadCompleteBook}
            disabled={downloading['complete-book']}
            size="lg"
            className="bg-gradient-primary text-white"
          >
            {downloading['complete-book'] ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generando Libro Completo...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-2" />
                Descargar Libro Completo ({mandalaDesigns.length} mandalas)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Tabs por categorías */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
          <TabsTrigger value="easy" className="text-xs">Fácil</TabsTrigger>
          <TabsTrigger value="intermediate" className="text-xs">Intermedio</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Avanzado</TabsTrigger>
          <TabsTrigger value="nature" className="text-xs">Naturaleza</TabsTrigger>
          <TabsTrigger value="spiritual" className="text-xs">Espiritual</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Colecciones */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Colecciones Temáticas</h2>
            <div className="grid gap-4">
              {collections.map((collection) => (
                <Card key={collection.name} className="bg-gradient-card border-0 shadow-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{collection.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {collection.designs.length} mandalas únicos
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDownloadCollection(collection.name, collection.designs)}
                        disabled={downloading[`collection-${collection.name}`]}
                        variant="outline"
                      >
                        {downloading[`collection-${collection.name}`] ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Descargar Colección
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {collection.designs.map((design) => (
                        <Badge key={design.id} variant="secondary" className="text-xs">
                          {design.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Todos los mandalas */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Todos los Mandalas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mandalaDesigns.map((design) => (
                <MandalaPreview key={design.id} design={design} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="easy">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandalaDesigns.filter(d => d.difficulty === 'Fácil').map((design) => (
              <MandalaPreview key={design.id} design={design} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandalaDesigns.filter(d => d.difficulty === 'Intermedio').map((design) => (
              <MandalaPreview key={design.id} design={design} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandalaDesigns.filter(d => d.difficulty === 'Avanzado').map((design) => (
              <MandalaPreview key={design.id} design={design} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nature">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandalaDesigns.filter(d => d.theme === 'Naturaleza').map((design) => (
              <MandalaPreview key={design.id} design={design} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="spiritual">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandalaDesigns.filter(d => d.theme === 'Espiritual').map((design) => (
              <MandalaPreview key={design.id} design={design} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};