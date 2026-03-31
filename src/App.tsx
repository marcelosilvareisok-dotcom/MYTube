import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';
import Watch from './components/Watch';
import Profile from './components/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile/:user" element={<Profile />} />
            <Route path="/search" element={<div className="p-10 text-center text-gray-500">Página de Busca em breve...</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
