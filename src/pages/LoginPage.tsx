import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      useAuthStore.getState().setUser(credential.user, await credential.user.getIdToken());
      navigate('/home');
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Please enter your email address first to reset your password.');
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Password reset email sent! Check your inbox.');
    } catch (error: unknown) {
      console.error("Reset password failed:", error);
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
      if (code === 'auth/user-not-found') {
        setErrorMsg('No account found with this email.');
      } else {
        setErrorMsg('Failed to send reset email. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      useAuthStore.getState().setUser(credential.user, await credential.user.getIdToken());
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
      className="min-h-screen flex items-center justify-center bg-[#131316] p-4 font-sans text-zinc-100"
    >
      <div className="w-full max-w-[1000px] min-h-[600px] bg-[#1c1c21] rounded-2xl border border-zinc-800/80 flex overflow-hidden shadow-2xl">
        
        {/* Left Side - Hero Image */}
        <div 
          className="hidden lg:block w-[45%] relative overflow-hidden bg-cover bg-center border-r border-zinc-800/80"
          style={{ backgroundImage: "url('/images/SigninPagePortrait.png')" }}
        >
          {/* The image itself contains all the branding, text, and icons */}
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[55%] p-10 sm:p-14 flex flex-col justify-center relative bg-[#1c1c21]">
          <div className="max-w-[360px] w-full mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Welcome back</h2>
              <p className="text-zinc-400 text-sm mt-1.5">Sign in to continue to Scenic</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-400">{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-400 ml-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-600 text-sm transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#18181b] border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-600 text-sm transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-zinc-700 bg-[#18181b] flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                    <input type="checkbox" className="opacity-0 absolute w-0 h-0" />
                  </div>
                  <span className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors">Remember me</span>
                </label>
                <button type="button" onClick={handleResetPassword} className="text-[13px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot password?</button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all mt-4 disabled:opacity-70 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6 opacity-60">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#27272a] hover:bg-[#3f3f46] border border-zinc-700/50 text-zinc-100 text-sm font-medium rounded-lg transition-all"
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
    </motion.div>
  );
}
