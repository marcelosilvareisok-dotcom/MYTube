import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const CATEGORIES = ['Tudo', 'Música', 'Games', 'Educação', 'Tecnologia', 'Humor'];

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    
    if (selectedCategory !== 'Tudo') {
      q = query(collection(db, 'videos'), where('category', '==', selectedCategory), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [selectedCategory]);

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      {/* Categories Bar */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-xl mb-3" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              Nenhum vídeo encontrado nesta categoria.
            </div>
          ) : (
            videos.map(video => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/watch/${video.id}`} className="group block">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-800">
                    <img 
                      src={video.thumbnailURL} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      10:00
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm line-clamp-2 leading-snug mb-1 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-0.5">{video.authorName || 'Canal MyTube'}</p>
                      <div className="flex items-center text-gray-400 text-xs">
                        <span>{video.viewCount || 0} visualizações</span>
                        <span className="mx-1">•</span>
                        <span>há 2 dias</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
