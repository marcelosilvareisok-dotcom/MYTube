import { Link } from 'react-router-dom';
import { Search, Upload, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <Link to="/" className="text-2xl font-bold">MyTube</Link>
      <div className="flex items-center gap-4">
        <Link to="/search"><Search /></Link>
        <Link to="/upload"><Upload /></Link>
        <Link to="/profile/me"><User /></Link>
      </div>
    </nav>
  );
}
