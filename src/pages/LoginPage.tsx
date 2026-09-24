import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Film, Tv, PlaySquare, List, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (error) {
      console.error("Google login failed:", error);
      setErrorMsg('Google sign in failed or was cancelled.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans text-white"
    >
      <div className="w-full max-w-[1000px] min-h-[600px] bg-[#111111] rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl">
        
        {/* Left Side - Hero / Brand */}
        <div className="hidden lg:flex w-[45%] relative bg-black overflow-hidden flex-col justify-between p-10 border-r border-white/5">
          {/* Subtle Abstract Background Glow */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">Scenic</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-white leading-tight tracking-tight">
                Track every <br/>
                <span className="text-white/60">
                  story you love.
                </span>
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-[280px]">
                Your personal cinematic universe. Build watchlists, rate media, and never lose your place.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex gap-6 mt-8">
            <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
              <Film className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Movies</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
              <Tv className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Series</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
              <PlaySquare className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Anime</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
              <List className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Lists</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[55%] p-10 sm:p-14 flex flex-col justify-center relative bg-[#111111]">
          <div className="max-w-[360px] w-full mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h2>
              <p className="text-white/50 text-sm mt-1.5">Sign in to continue to Scenic</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-500">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-white/70 ml-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 text-white placeholder:text-white/30 text-sm transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-white/70 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 text-white placeholder:text-white/30 text-sm transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-white/20 bg-black/50 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <input type="checkbox" className="opacity-0 absolute w-0 h-0" />
                    {/* Add a check icon here conditionally if checked, omitted for brevity */}
                  </div>
                  <span className="text-[13px] text-white/60 group-hover:text-white/90 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-white/90 text-black text-sm font-semibold rounded-lg transition-all mt-4 disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6 opacity-60">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[11px] text-white/40 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-white/10 text-white text-sm font-medium rounded-lg transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-[13px] text-white/50 mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
