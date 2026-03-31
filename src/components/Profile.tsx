import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { user: userId } = useParams<{ user: string }>();
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div className="p-10 text-center text-gray-500">Você precisa estar logado para ver seu perfil.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-gray-900 rounded-2xl p-8 flex items-center gap-6 shadow-xl">
        {user.photoURL ? (
          <img src={user.photoURL} alt="Perfil" className="w-24 h-24 rounded-full border-4 border-gray-800" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <UserIcon size={48} className="text-white" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.displayName || 'Usuário'}</h1>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-sm text-blue-400 mt-2">ID: {user.uid}</p>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Meus Vídeos</h2>
        <div className="text-gray-500 text-center py-10 bg-gray-900 rounded-xl">
          Você ainda não publicou nenhum vídeo.
        </div>
      </div>
    </div>
  );
}
