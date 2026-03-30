import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<div>Watch</div>} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile/:user" element={<div>Profile</div>} />
          <Route path="/search" element={<div>Search</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
