import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import VideoPlayer from './VideoPlayer';
import { getRecommendedVideos } from '../services/geminiService';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    const fetchVideo = async () => {
      const docRef = doc(db, 'videos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const videoData = { id: docSnap.id, ...docSnap.data() } as any;
        setVideo(videoData);
        
        // Fetch all videos for AI recommendation
        const allVideosSnap = await getDocs(query(collection(db, 'videos'), limit(20)));
        const allVideos = allVideosSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        // Get AI recommendations
        const recommendedIds = await getRecommendedVideos(videoData.title, allVideos);
        const filteredRecs = allVideos.filter(v => recommendedIds.includes(v.id) && v.id !== id);
        
        // Fallback if AI fails or returns nothing
        if (filteredRecs.length === 0) {
          setRecommendations(allVideos.filter(v => v.id !== id).slice(0, 5));
        } else {
          setRecommendations(filteredRecs);
        }
      }
      setLoading(false);
    };

    fetchVideo();
  }, [id]);

  if (loading) return <div className="p-4 animate-pulse">Carregando vídeo...</div>;
  if (!video) return <div className="p-4 text-center">Vídeo não encontrado.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1800px] mx-auto">
      {/* Main Content */}
      <div className="flex-grow lg:max-w-[calc(100%-400px)]">
        <VideoPlayer videoURL={video.videoURL} thumbnailURL={video.thumbnailURL} />
        
        <div className="mt-4">
          <h1 className="text-xl font-bold mb-2">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              <div>
                <p className="font-bold text-sm">{video.authorName || 'Canal MyTube'}</p>
                <p className="text-gray-400 text-xs">1.2M inscritos</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                Inscrever-se
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors border-r border-gray-700">
                  <ThumbsUp size={18} /> <span className="text-sm font-medium">12K</span>
                </button>
                <button className="px-4 py-2 hover:bg-gray-700 transition-colors">
                  <ThumbsDown size={18} />
                </button>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copiado para a área de transferência!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Share2 size={18} /> <span className="text-sm font-medium">Compartilhar</span>
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-800 rounded-xl text-sm">
            <div className="font-bold mb-1">
              {video.viewCount || 0} visualizações • há 2 dias
            </div>
            <p className="whitespace-pre-wrap text-gray-300">
              {video.description || 'Nenhuma descrição fornecida.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Recommendations */}
      <div className="w-full lg:w-[400px] flex flex-col gap-3">
        <h3 className="font-bold text-sm mb-1 text-blue-400">Recomendados pela IA</h3>
        {recommendations.map(rec => (
          <Link key={rec.id} to={`/watch/${rec.id}`} className="flex gap-2 group">
            <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
              <img src={rec.thumbnailURL} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors">
                {rec.title}
              </h4>
              <p className="text-gray-400 text-xs">{rec.authorName || 'Canal MyTube'}</p>
              <p className="text-gray-400 text-xs">{rec.viewCount || 0} visualizações</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
