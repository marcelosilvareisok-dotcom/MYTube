import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {videos.map(video => (
        <Link key={video.id} to={`/watch/${video.id}`} className="bg-gray-800 rounded-lg overflow-hidden">
          <img src={video.thumbnailURL} alt={video.title} className="w-full h-48 object-cover" />
          <div className="p-2">
            <h3 className="font-bold text-white">{video.title}</h3>
            <p className="text-gray-400 text-sm">{video.authorUID}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
