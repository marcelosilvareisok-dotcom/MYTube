import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { generateThumbnailSuggestion } from '../services/geminiService';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';

const CATEGORIES = ['Música', 'Games', 'Educação', 'Tecnologia', 'Humor'];

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const navigate = useNavigate();

  const handleAiSuggestion = async () => {
    if (!title) return;
    const suggestion = await generateThumbnailSuggestion(title, description);
    setAiSuggestion(suggestion);
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser || !title) return;
    setIsUploading(true);

    try {
      // Upload Video
      const videoRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const videoUploadTask = await uploadBytesResumable(videoRef, file);
      const videoURL = await getDownloadURL(videoUploadTask.ref);

      // Upload Thumbnail (if any, otherwise use a placeholder)
      let thumbnailURL = `https://picsum.photos/seed/${title}/1280/720`;
      if (thumbnailFile) {
        const thumbRef = ref(storage, `thumbnails/${Date.now()}_${thumbnailFile.name}`);
        const thumbUploadTask = await uploadBytesResumable(thumbRef, thumbnailFile);
        thumbnailURL = await getDownloadURL(thumbUploadTask.ref);
      }

      await addDoc(collection(db, 'videos'), {
        title,
        description,
        category,
        videoURL,
        thumbnailURL,
        authorUID: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        viewCount: 0
      });

      navigate('/');
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UploadIcon className="text-blue-500" /> Publicar Vídeo
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
          <input 
            type="text" 
            placeholder="O que está acontecendo no seu vídeo?" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            onBlur={handleAiSuggestion}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
          <textarea 
            placeholder="Conte mais sobre o vídeo..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Vídeo (MP4, etc)</label>
            <input 
              type="file" 
              accept="video/*"
              onChange={e => setFile(e.target.files?.[0] || null)} 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail (Opcional)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => setThumbnailFile(e.target.files?.[0] || null)} 
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm" 
          />
          {aiSuggestion && (
            <p className="mt-2 text-xs text-blue-400 italic">💡 Sugestão da IA: {aiSuggestion}</p>
          )}
        </div>

        <button 
          onClick={handleUpload} 
          disabled={isUploading || !file || !title}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" /> Enviando...
            </>
          ) : (
            'Publicar Agora'
          )}
        </button>
      </div>
    </div>
  );
}
