import React, { useState } from 'react';
import { User } from '../types';
import { authService } from "../services/authService";
import { 
  Mail, Lock, User as UserIcon, Loader2, CheckCircle2, AlertCircle,
  Heart, Utensils, CircleDollarSign, ShoppingBag, Flower2, MapPin, Sparkles, 
  ScanLine, Stethoscope, Dog, Film, Shirt, Wine, FileText, Music, Recycle
} from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

type AuthView = 'LOGIN' | 'REGISTER_EMAIL' | 'OTP' | 'REGISTER_DETAILS';

const DEMO_SCANS = [
  { icon: Heart, label: "Health", color: "text-pink-500", border: "border-pink-500/20", bg: "bg-pink-500/10" },
  { icon: Utensils, label: "Food", color: "text-lime-400", border: "border-lime-400/20", bg: "bg-lime-400/10" },
  { icon: CircleDollarSign, label: "Finance", color: "text-amber-400", border: "border-amber-400/20", bg: "bg-amber-400/10" },
  { icon: ShoppingBag, label: "Shop", color: "text-blue-400", border: "border-blue-400/20", bg: "bg-blue-400/10" },
  { icon: Flower2, label: "Plants", color: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/10" },
  { icon: MapPin, label: "Travel", color: "text-teal-400", border: "border-teal-400/20", bg: "bg-teal-400/10" },
  { icon: Sparkles, label: "Beauty", color: "text-purple-400", border: "border-purple-400/20", bg: "bg-purple-400/10" },
  { icon: Lock, label: "Privacy", color: "text-indigo-400", border: "border-indigo-400/20", bg: "bg-indigo-400/10" },
  { icon: Stethoscope, label: "Diagnosis", color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10" },
  { icon: Dog, label: "Pets", color: "text-orange-400", border: "border-orange-400/20", bg: "bg-orange-400/10" },
  { icon: Film, label: "Movies", color: "text-fuchsia-400", border: "border-fuchsia-400/20", bg: "bg-fuchsia-400/10" },
  { icon: FileText, label: "Docs", color: "text-slate-400", border: "border-slate-400/20", bg: "bg-slate-400/10" },
  { icon: Shirt, label: "Fashion", color: "text-violet-400", border: "border-violet-400/20", bg: "bg-violet-400/10" },
  { icon: Wine, label: "Wine", color: "text-rose-700", border: "border-rose-700/20", bg: "bg-rose-700/10" },
  { icon: Music, label: "Music", color: "text-cyan-400", border: "border-cyan-400/20", bg: "bg-cyan-400/10" },
  { icon: Recycle, label: "Eco", color: "text-green-400", border: "border-green-400/20", bg: "bg-green-400/10" },
  { icon: ScanLine, label: "Quick Info", color: "text-zinc-400", border: "border-zinc-400/20", bg: "bg-zinc-400/10" },
  { icon: Heart, label: "Vitals", color: "text-rose-400", border: "border-rose-400/20", bg: "bg-rose-400/10" },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const { data, error } = await authService.login(email, password);

  if (error) {
    setError(error.message);
  } else {
    onLogin(data.user);
  }

  setLoading(false);
};

  const handleGoogleLogin = async () => {
  setLoading(true);
  setError(null);

  const { error } = await authService.googleLogin();

  if (error) {
    setError(error.message);
  }

  setLoading(false);
};

  const handleRegisterStep1 = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const { error } = await authService.sendOtp(email);

  if (error) {
    setError(error.message);
  } else {
    setView("OTP");
  }

  setLoading(false);
};

  const handleOtpVerify = async () => {
  const code = otp.join("");

  if (code.length !== 6) {
    setError("Enter 6-digit code");
    return;
  }

  setLoading(true);

  const { data, error } = await authService.verifyOtp(email, code);

  if (error) {
    setError(error.message);
  } else {
    onLogin(data.user); // 🔥 directly login
  }

  setLoading(false);
};

  const handleRegisterFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authService.registerFinal(email, password, firstName, lastName);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- PREMIUM BACKGROUND START --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         
         {/* 1. Base Gradient */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(9,9,11,1)_100%)]"></div>

         {/* 2. Cyberpunk Grid Floor */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

         {/* 3. Nebula Orbs */}
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#CCFF00]/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
         <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse delay-1000"></div>

         {/* 4. Floating Icon Grid */}
         <div className="absolute inset-[-25%] grid grid-cols-4 md:grid-cols-6 gap-8 p-8 transform -rotate-[15deg] scale-105 opacity-30 z-0">
             {[...DEMO_SCANS, ...DEMO_SCANS, ...DEMO_SCANS].map((item, idx) => (
                 <div key={idx} className={`flex flex-col items-center justify-center aspect-square rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm transform transition-all duration-[3000ms] hover:scale-110 shadow-lg`}>
                     <item.icon size={28} className={`mb-3 ${item.color} drop-shadow-md opacity-80`} />
                     <span className={`text-[9px] font-bold uppercase tracking-widest text-zinc-500`}>{item.label}</span>
                 </div>
             ))}
         </div>
         
         {/* 5. Vignette Overlay */}
         <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,_#09090B_100%)]"></div>
      </div>
      {/* --- PREMIUM BACKGROUND END --- */}

      {/* Auth Card */}
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-20 animate-in fade-in zoom-in duration-500 hover:border-white/20 transition-colors">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#CCFF00] rounded-b-full shadow-[0_0_15px_#CCFF00]"></div>

        {/* Header Logo */}
        <div className="text-center mb-10 mt-2">
            <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">
                ScanZeo <span className="text-[#CCFF00]">AI</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-sm font-medium tracking-wide">The Universal Intelligence Lens</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm shadow-inner">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
            </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {view === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                    <input 
                        type="email" 
                        required
                        placeholder="Email Address" 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 focus:bg-black/40 transition-all placeholder:text-zinc-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                    <input 
                        type="password" 
                        required
                        placeholder="Password" 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 focus:bg-black/40 transition-all placeholder:text-zinc-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="button" className="text-xs text-[#CCFF00] hover:text-white transition-colors hover:underline font-medium">Forgot Password?</button>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-2xl hover:bg-[#b3e600] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(204,255,0,0.25)] hover:shadow-[0_0_35px_rgba(204,255,0,0.4)] disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-[#121214] px-4 text-zinc-600 rounded-full">Or continue with</span></div>
            </div>

            <button 
                type="button" 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
            </button>

            <div className="mt-8 text-center text-sm text-zinc-400">
                Don't have an account? <button type="button" onClick={() => setView('REGISTER_EMAIL')} className="text-[#CCFF00] font-bold hover:text-white transition-colors ml-1">Create Account</button>
            </div>
          </form>
        )}

        {/* --- VIEW: REGISTER EMAIL --- */}
        {view === 'REGISTER_EMAIL' && (
          <form onSubmit={handleRegisterStep1} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-2">Create Account</h2>
            <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                <input 
                    type="email" 
                    required
                    placeholder="Enter your email" 
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 transition-all placeholder:text-zinc-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#CCFF00] text-black font-bold py-3.5 rounded-2xl hover:bg-[#b3e600] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Verification Code"}
            </button>

            <button type="button" onClick={() => setView('LOGIN')} className="w-full text-zinc-500 text-sm hover:text-white mt-2 transition-colors">
                Back to Login
            </button>
          </form>
        )}

        {/* --- VIEW: OTP --- */}
        {view === 'OTP' && (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white">Verify Email</h2>
                    <p className="text-zinc-500 text-sm mt-2">Enter the 6-digit code sent to <br/> <span className="text-[#CCFF00] font-medium">{email}</span></p>
                </div>

                <div className="flex justify-between gap-2 px-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="w-12 h-14 bg-black/30 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-[#CCFF00] focus:shadow-[0_0_15px_rgba(204,255,0,0.2)] focus:outline-none transition-all"
                        />
                    ))}
                </div>

                <button 
                    onClick={handleOtpVerify} 
                    disabled={loading}
                    className="w-full bg-[#CCFF00] text-black font-bold py-3.5 rounded-2xl hover:bg-[#b3e600] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                >
                     {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
                </button>
                
                <p className="text-center text-xs text-zinc-500">
                    Didn't receive code? <button className="text-[#CCFF00] hover:underline font-bold">Resend</button>
                </p>
            </div>
        )}

        {/* --- VIEW: REGISTER DETAILS --- */}
        {view === 'REGISTER_DETAILS' && (
            <form onSubmit={handleRegisterFinal} className="space-y-5">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#CCFF00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#CCFF00]/30 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                        <CheckCircle2 className="text-[#CCFF00]" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Email Verified!</h2>
                    <p className="text-zinc-500 text-sm">Finish setting up your profile.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group flex-1">
                        <UserIcon className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                        <input 
                            type="text" 
                            required
                            placeholder="First Name" 
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 transition-all placeholder:text-zinc-600"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="relative group flex-1">
                        <UserIcon className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                        <input 
                            type="text" 
                            required
                            placeholder="Last Name" 
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 transition-all placeholder:text-zinc-600"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#CCFF00] transition-colors" size={20} />
                    <input 
                        type="password" 
                        required
                        placeholder="Create Password" 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#CCFF00]/50 transition-all placeholder:text-zinc-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#CCFF00] text-black font-bold py-3.5 rounded-2xl hover:bg-[#b3e600] transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
                </button>
            </form>
        )}

      </div>
    </div>
  );
};