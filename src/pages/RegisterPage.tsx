import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordStrength = [
    password.length > 5,
    password.length > 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length * 25;
  const navigate = useNavigate();

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 100) return 'Fair';
    return 'Strong';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (passwordStrength < 50) {
      setErrorMsg('Password is too weak. Please use at least 6 characters.');
      return;
    }
    
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      useAuthStore.getState().setUser(credential.user, await credential.user.getIdToken());
      navigate('/home'); // Skip onboarding for now
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
      if (code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already in use.');
      } else {
        setErrorMsg('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      useAuthStore.getState().setUser(credential.user, await credential.user.getIdToken());
      navigate('/home'); // Skip onboarding for now
    } catch (error) {
      console.error("Google login failed:", error);
      setErrorMsg('Google sign up failed or was cancelled.');
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
              <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Create an account</h2>
              <p className="text-zinc-400 text-sm mt-1.5">Sign up to get started with Scenic</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
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
                    placeholder="Create a password"
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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Password strength</span>
                      <span className={`text-[11px] font-medium ${
                        passwordStrength < 50 ? 'text-red-400' : passwordStrength < 100 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${Math.min(passwordStrength, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#18181b] border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder:text-zinc-600 text-sm transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
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
              Sign Up with Google
            </button>

            <p className="text-center text-[13px] text-white/50 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
