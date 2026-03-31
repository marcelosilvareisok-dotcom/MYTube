import { Link } from 'react-router-dom';
import { Search, Upload, User, Menu, Youtube, Bell, Video, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-1 group">
          <Youtube className="text-red-600 group-hover:scale-110 transition-transform" size={28} fill="currentColor" />
          <span className="text-xl font-bold tracking-tighter">MyTube</span>
        </Link>
      </div>

      <div className="flex-grow max-w-2xl mx-4 hidden md:flex items-center">
        <div className="flex-grow flex items-center bg-gray-900 border border-gray-700 rounded-l-full px-4 py-1.5 focus-within:border-blue-500 transition-colors group">
          <Search size={18} className="text-gray-400 group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Pesquisar" 
            className="w-full bg-transparent border-none outline-none px-3 text-sm" 
          />
        </div>
        <button className="bg-gray-800 border border-l-0 border-gray-700 px-5 py-1.5 rounded-r-full hover:bg-gray-700 transition-colors">
          <Search size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/upload" className="p-2 hover:bg-gray-800 rounded-full transition-colors group" title="Criar">
          <Video size={20} className="group-hover:text-blue-400" />
        </Link>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors group hidden sm:block" title="Notificações">
          <Bell size={20} className="group-hover:text-blue-400" />
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/profile/me" className="p-1 hover:bg-gray-800 rounded-full transition-colors group" title="Perfil">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Perfil" className="w-8 h-8 rounded-full border border-gray-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              )}
            </Link>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-800 text-gray-400 hover:text-red-400 rounded-full transition-colors" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full transition-colors text-sm font-medium"
          >
            <LogIn size={16} />
            Fazer Login
          </button>
        )}
      </div>
    </nav>
  );
}
