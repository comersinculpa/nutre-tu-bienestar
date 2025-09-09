import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  Play, 
  Pause, 
  ExternalLink, 
  Heart, 
  Smile, 
  Frown, 
  Zap,
  Headphones,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number; }>;
  external_urls: { spotify: string };
  tracks: { total: number };
  owner: { display_name: string };
  emotion?: string;
  energy_level?: number;
}

interface SpotifyUser {
  id: string;
  display_name: string;
  images: Array<{ url: string; }>;
  followers: { total: number };
}

const emotionPlaylists = {
  'feliz': {
    seeds: ['happy', 'upbeat', 'energetic', 'positive'],
    energy: 0.8,
    valence: 0.8,
    danceability: 0.7
  },
  'triste': {
    seeds: ['sad', 'melancholic', 'calm', 'acoustic'],
    energy: 0.3,
    valence: 0.2,
    danceability: 0.3
  },
  'ansioso': {
    seeds: ['calm', 'relaxing', 'ambient', 'chill'],
    energy: 0.4,
    valence: 0.5,
    danceability: 0.4
  },
  'enérgico': {
    seeds: ['workout', 'pump-up', 'rock', 'electronic'],
    energy: 0.9,
    valence: 0.7,
    danceability: 0.8
  },
  'relajado': {
    seeds: ['chill', 'lo-fi', 'jazz', 'ambient'],
    energy: 0.3,
    valence: 0.6,
    danceability: 0.3
  }
};

export const SpotifyIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [emotionPlaylists, setEmotionPlaylists] = useState<Record<string, SpotifyPlaylist[]>>({});
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const { toast } = useToast();

  // Spotify configuration - Add your credentials here
  const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Reemplaza con tu Client ID
  const REDIRECT_URI = window.location.origin + '/spotify-callback';
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',  
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read'
  ].join(' ');

  useEffect(() => {
    checkSpotifyConnection();
    loadCurrentEmotion();
  }, []);

  const checkSpotifyConnection = () => {
    const token = localStorage.getItem('spotify_access_token');
    const userInfo = localStorage.getItem('spotify_user');
    
    if (token && userInfo) {
      setAccessToken(token);
      setUser(JSON.parse(userInfo));
      setIsConnected(true);
      loadUserPlaylists(token);
    }

    // Check for callback from Spotify
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  };

  const loadCurrentEmotion = () => {
    const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    if (checkIns.length > 0) {
      const latest = checkIns[checkIns.length - 1];
      setCurrentEmotion(latest.emotion || '');
    }
  };

  const connectToSpotify = () => {
    if (SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID') {
      toast({
        title: "Configuración requerida",
        description: "Necesitas configurar tu Client ID de Spotify primero.",
        variant: "destructive"
      });
      return;
    }

    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: Math.random().toString(36).substring(7)
    })}`;

    window.location.href = authUrl;
  };

  const exchangeCodeForToken = async (code: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this should be done in a secure backend
      // For demo purposes, we'll simulate the token exchange
      const mockToken = 'mock_access_token_' + Date.now();
      const mockUser: SpotifyUser = {
        id: 'user123',
        display_name: 'Usuario Demo',
        images: [{ url: '/avatars/spotify-user.jpg' }],
        followers: { total: 42 }
      };

      localStorage.setItem('spotify_access_token', mockToken);
      localStorage.setItem('spotify_user', JSON.stringify(mockUser));
      
      setAccessToken(mockToken);
      setUser(mockUser);
      setIsConnected(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      await loadUserPlaylists(mockToken);
      
      toast({
        title: "¡Conectado a Spotify!",
        description: "Ya puedes disfrutar de playlists personalizadas.",
      });
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No pude conectar con Spotify. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPlaylists = async (token: string) => {
    try {
      // Simulate loading playlists - In real app, call Spotify API
      const mockPlaylists: SpotifyPlaylist[] = [
        {
          id: '1',
          name: 'Songs for Happiness',
          description: 'Uplifting songs to boost your mood',
          images: [{ url: '/playlist-covers/happy.jpg', height: 300, width: 300 }],
          external_urls: { spotify: 'https://open.spotify.com/playlist/1' },
          tracks: { total: 50 },
          owner: { display_name: 'Spotify' },
          emotion: 'feliz',
          energy_level: 8
        },
        {
          id: '2', 
          name: 'Calm & Peaceful',
          description: 'Soothing music for relaxation',
          images: [{ url: '/playlist-covers/calm.jpg', height: 300, width: 300 }],
          external_urls: { spotify: 'https://open.spotify.com/playlist/2' },
          tracks: { total: 35 },
          owner: { display_name: 'Spotify' },
          emotion: 'relajado',
          energy_level: 3
        },
        {
          id: '3',
          name: 'Anxiety Relief',
          description: 'Gentle music to ease anxiety',
          images: [{ url: '/playlist-covers/anxiety.jpg', height: 300, width: 300 }],
          external_urls: { spotify: 'https://open.spotify.com/playlist/3' },
          tracks: { total: 40 },
          owner: { display_name: 'Spotify' },
          emotion: 'ansioso',
          energy_level: 4
        }
      ];

      setPlaylists(mockPlaylists);
      organizePlaylistsByEmotion(mockPlaylists);
    } catch (error) {
      toast({
        title: "Error",
        description: "No pude cargar tus playlists de Spotify.",
        variant: "destructive"
      });
    }
  };

  const organizePlaylistsByEmotion = (playlists: SpotifyPlaylist[]) => {
    const organized: Record<string, SpotifyPlaylist[]> = {};
    
    playlists.forEach(playlist => {
      if (playlist.emotion) {
        if (!organized[playlist.emotion]) {
          organized[playlist.emotion] = [];
        }
        organized[playlist.emotion].push(playlist);
      }
    });

    setEmotionPlaylists(organized);
  };

  const getRecommendedPlaylists = () => {
    if (!currentEmotion || !emotionPlaylists[currentEmotion]) {
      return playlists.slice(0, 3);
    }
    return emotionPlaylists[currentEmotion];
  };

  const disconnectSpotify = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_user');
    setAccessToken('');
    setUser(null);
    setIsConnected(false);
    setPlaylists([]);
    setEmotionPlaylists({});
    
    toast({
      title: "Desconectado",
      description: "Te has desconectado de Spotify.",
    });
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'feliz': return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'triste': return <Frown className="w-4 h-4 text-blue-500" />;
      case 'ansioso': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'enérgico': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'relajado': return <Heart className="w-4 h-4 text-green-500" />;
      default: return <Music className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'feliz': return 'bg-slate-500/10 border-slate-500/20';
      case 'triste': return 'bg-blue-500/10 border-blue-500/20';
      case 'ansioso': return 'bg-red-500/10 border-red-500/20';
      case 'enérgico': return 'bg-slate-500/10 border-slate-500/20';
      case 'relajado': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-muted/30 border-muted';
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-xl">Integración con Spotify</CardTitle>
          <p className="text-muted-foreground">
            Conecta tu cuenta de Spotify para recibir playlists personalizadas según tu estado emocional
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID' ? (
            <Alert className="border-sage-300 bg-sage-100">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Configuración requerida:</strong> Para habilitar la integración con Spotify, necesitas:
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Crear una app en <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Spotify Developer Dashboard</a></li>
                  <li>Copiar el Client ID</li>
                  <li>Añadir <code className="bg-muted px-1 rounded">{REDIRECT_URI}</code> como Redirect URI</li>
                  <li>Reemplazar 'YOUR_SPOTIFY_CLIENT_ID' en el código</li>
                </ol>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground text-center">
                Al conectar, podrás:
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Recibir playlists basadas en tu estado emocional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Descubrir música que se adapte a tu proceso de recuperación</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Acceder a playlists curativas y motivacionales</span>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={connectToSpotify} 
            disabled={isLoading || SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID'}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Conectando...
              </>
            ) : (
              <>
                <Music className="w-4 h-4 mr-2" />
                Conectar con Spotify
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Conectado a Spotify</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.display_name} • {playlists.length} playlists disponibles
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectSpotify}>
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Emotion & Recommendations */}
      {currentEmotion && (
        <Card className={`border ${getEmotionColor(currentEmotion)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              {getEmotionIcon(currentEmotion)}
              Recomendado para tu estado: {currentEmotion}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getRecommendedPlaylists().map((playlist) => (
              <div key={playlist.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{playlist.name}</h4>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.total} canciones</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Energía {playlist.energy_level}/10
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Playlists by Emotion */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Playlists por Estado Emocional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(emotionPlaylists).map(([emotion, playlists]) => (
            <div key={emotion} className="space-y-2">
              <div className="flex items-center gap-2">
                {getEmotionIcon(emotion)}
                <h4 className="font-medium capitalize">{emotion}</h4>
                <Badge variant="secondary" className="text-xs">
                  {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid gap-2">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-md">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <Music className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-foreground truncate">{playlist.name}</h5>
                      <p className="text-xs text-muted-foreground">{playlist.tracks.total} canciones</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        <Play className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Music Therapy Benefits */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Beneficios de la Musicoterapia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Regulación emocional:</strong> La música ayuda a procesar y expresar emociones de manera saludable.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Reducción del estrés:</strong> Melodies calmantes pueden disminuir los niveles de cortisol.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Mejora del estado de ánimo:</strong> Canciones positivas estimulan la liberación de endorfinas.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Apoyo en la recuperación:</strong> La música puede ser una herramienta poderosa en el proceso terapéutico.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};