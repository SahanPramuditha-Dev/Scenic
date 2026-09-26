import { Link, useLocation } from 'react-router-dom';
import { Film, LibraryBig, LogOut, Search, Tv, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../stores/useAuth';

const links = [
  { name: 'Home', path: '/home', icon: Film },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Anime', path: '/anime', icon: Tv },
  { name: 'Library', path: '/library', icon: LibraryBig },
];

export function NavBar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
          <div className="flex items-center gap-10">
            <Link to="/home" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white" aria-label="Scenic home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600"><Film className="h-5 w-5" /></span>
              Scenic
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              {links.map(({ name, path }) => <Link key={path} to={path} aria-current={location.pathname === path ? 'page' : undefined} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${location.pathname === path ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>{name}</Link>)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-44 truncate text-sm text-zinc-400 sm:block">{user?.displayName || user?.email || 'Your account'}</span>
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800" aria-hidden="true">
              {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-zinc-400" />}
            </span>
            <button onClick={() => void signOut(auth)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
      </nav>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/10 bg-[#0a0a0a]/95 px-3 py-2 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {links.map(({ name, path, icon: Icon }) => <Link key={path} to={path} aria-current={location.pathname === path ? 'page' : undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${location.pathname === path ? 'text-indigo-300' : 'text-zinc-400'}`}><Icon className="h-5 w-5" />{name}</Link>)}
      </nav>
    </>
  );
}
