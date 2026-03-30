import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;
    const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', null, null, async () => {
      const videoURL = await getDownloadURL(uploadTask.snapshot.ref);
      await addDoc(collection(db, 'videos'), {
        title,
        videoURL,
        authorUID: auth.currentUser!.uid,
        createdAt: new Date().toISOString(),
        viewCount: 0
      });
      navigate('/');
    });
  };

  return (
    <div className="p-4">
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mb-4 bg-gray-800 text-white" />
      <input type="file" onChange={e => setFile(e.target.files![0])} className="w-full p-2 mb-4 bg-gray-800 text-white" />
      <button onClick={handleUpload} className="w-full p-2 bg-blue-600 text-white font-bold">Upload</button>
    </div>
  );
}
