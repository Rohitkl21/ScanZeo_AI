
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, Share2, AlertTriangle, MapPin, ExternalLink, 
  Sparkles, Utensils, Activity, Droplet, Moon, User, Heart, Shield,
  Wind, Brain, PawPrint, Bone, Syringe, Wheat, Milk, Candy, Flame, Thermometer, Stethoscope, 
  CircleDollarSign, TrendingUp, TrendingDown, Tag, Mic, MicOff, Car, Home, Wallet, CreditCard, PieChart, Landmark,
  Scissors, Palette, Smile, Sun, Clock, ShoppingBag, Gavel, Smartphone, Shirt, Image as ImageIcon,
  Calculator, BookOpen, Leaf, Building, Lightbulb, Wifi, Eye, Radio, Lock, Film, Tv, Book, Gamepad, Music,
  CloudSun, Recycle, Flower2, Sprout, Bug, FileText, Calendar, Wine, Grape, Volume2, VolumeX, Bed, Scale, Monitor, AlignJustify, LineChart, BarChart3, DollarSign,
  Zap, Globe, Users, Briefcase, Percent, Diamond
} from 'lucide-react';
import { ScanResult, ScannerMode } from '../types';

interface ResultDisplayProps {
  result: ScanResult;
  onBack: () => void;
  isVoiceListening: boolean;
  onToggleVoice: () => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}

// --- Helper Components for Health UI ---

const HealthGauge: React.FC<{ score: number; label?: string }> = ({ score, label = "Score" }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#ef4444'; // Red
  if (score >= 50) color = '#eab308'; // Yellow
  if (score >= 80) color = '#CCFF00'; // Volt Green

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
       <div className="relative w-40 h-40">
         {/* Background Circle */}
         <svg height="100%" width="100%" className="transform -rotate-90">
           <circle
             stroke="#333"
             strokeWidth={stroke}
             fill="transparent"
             r={normalizedRadius}
             cx={radius * 1.6} // center in svg (80x2)
             cy={radius * 1.6}
             className="translate-x-[50%] translate-y-[50%]"
             style={{ transformOrigin: 'center' }}
           />
           {/* Progress Circle */}
           <circle
             stroke={color}
             fill="transparent"
             strokeWidth={stroke}
             strokeDasharray={circumference + ' ' + circumference}
             style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
             strokeLinecap="round"
             r={normalizedRadius}
             cx={radius * 1.6}
             cy={radius * 1.6}
             className="translate-x-[50%] translate-y-[50%] drop-shadow-[0_0_10px_rgba(204,255,0,0.4)]" 
           />
         </svg>
         {/* Inner Content */}
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white tracking-tighter">{score}</span>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{label}</span>
         </div>
       </div>
    </div>
  );
};

const VitalCard: React.FC<{ label: string; value: string; evaluation: string }> = ({ label, value, evaluation }) => {
  let Icon = Activity;
  if (label.toLowerCase().includes('heart') || label.toLowerCase().includes('cardio')) Icon = Heart;
  else if (label.toLowerCase().includes('skin') || label.toLowerCase().includes('inflam') || label.toLowerCase().includes('vaccine') || label.toLowerCase().includes('safety')) Icon = Shield;
  else if (label.toLowerCase().includes('hydra') || label.toLowerCase().includes('nose') || label.toLowerCase().includes('water')) Icon = Droplet;
  else if (label.toLowerCase().includes('fatigue') || label.toLowerCase().includes('sleep')) Icon = Moon;
  else if (label.toLowerCase().includes('posture')) Icon = User;
  else if (label.toLowerCase().includes('respiratory') || label.toLowerCase().includes('breath')) Icon = Wind;
  else if (label.toLowerCase().includes('stress') || label.toLowerCase().includes('tension')) Icon = Brain;
  
  // Pet specific
  else if (label.toLowerCase().includes('coat') || label.toLowerCase().includes('fur') || label.toLowerCase().includes('species')) Icon = PawPrint;
  else if (label.toLowerCase().includes('body') || label.toLowerCase().includes('dental') || label.toLowerCase().includes('mouth')) Icon = Bone;

  // Food specific
  else if (label.toLowerCase().includes('calorie') || label.toLowerCase().includes('energy')) Icon = Flame;
  else if (label.toLowerCase().includes('sugar') || label.toLowerCase().includes('carb')) Icon = Candy;
  else if (label.toLowerCase().includes('protein') || label.toLowerCase().includes('meat')) Icon = Bone;
  else if (label.toLowerCase().includes('fat') || label.toLowerCase().includes('oil')) Icon = Droplet;
  else if (label.toLowerCase().includes('gluten') || label.toLowerCase().includes('bread')) Icon = Wheat;
  else if (label.toLowerCase().includes('dairy') || label.toLowerCase().includes('calcium')) Icon = Milk;
  else if (label.toLowerCase().includes('sodium') || label.toLowerCase().includes('salt') || label.toLowerCase().includes('allergen')) Icon = AlertTriangle;
  else if (label.toLowerCase().includes('temp') || label.toLowerCase().includes('cook')) Icon = Thermometer;

  // Disease Specific
  else if (label.toLowerCase().includes('urgency') || label.toLowerCase().includes('risk') || label.toLowerCase().includes('pain')) Icon = AlertTriangle;
  else if (label.toLowerCase().includes('symptom')) Icon = Activity;
  else if (label.toLowerCase().includes('specialist')) Icon = Stethoscope;
  else if (label.toLowerCase().includes('infection') || label.toLowerCase().includes('contagious')) Icon = Shield;

  // Finance Specific
  else if (label.toLowerCase().includes('value') || label.toLowerCase().includes('price') || label.toLowerCase().includes('worth')) Icon = CircleDollarSign;
  else if (label.toLowerCase().includes('demand') || label.toLowerCase().includes('trend')) Icon = TrendingUp;
  else if (label.toLowerCase().includes('depreciation')) Icon = TrendingDown;
  else if (label.toLowerCase().includes('condition') || label.toLowerCase().includes('authenticity')) Icon = Tag;
  else if (label.toLowerCase().includes('vehicle') || label.toLowerCase().includes('mileage') || label.toLowerCase().includes('car')) Icon = Car;
  else if (label.toLowerCase().includes('mortgage') || label.toLowerCase().includes('home') || label.toLowerCase().includes('estate')) Icon = Home;
  else if (label.toLowerCase().includes('debt') || label.toLowerCase().includes('credit') || label.toLowerCase().includes('liability')) Icon = CreditCard;
  else if (label.toLowerCase().includes('savings') || label.toLowerCase().includes('fund') || label.toLowerCase().includes('cash')) Icon = Wallet;
  else if (label.toLowerCase().includes('ratio') || label.toLowerCase().includes('rate')) Icon = PieChart;
  else if (label.toLowerCase().includes('net worth') || label.toLowerCase().includes('asset')) Icon = Landmark;

  // Beauty Specific
  else if (label.toLowerCase().includes('hair') || label.toLowerCase().includes('texture')) Icon = Scissors;
  else if (label.toLowerCase().includes('face shape') || label.toLowerCase().includes('feature')) Icon = Smile;
  else if (label.toLowerCase().includes('tone') || label.toLowerCase().includes('pigment')) Icon = Palette;
  else if (label.toLowerCase().includes('acne') || label.toLowerCase().includes('blemish')) Icon = Sparkles;
  else if (label.toLowerCase().includes('sensitivity')) Icon = Shield;

  // Shopping Specific
  else if (label.toLowerCase().includes('retail') || label.toLowerCase().includes('market')) Icon = Tag;
  else if (label.toLowerCase().includes('savings') || label.toLowerCase().includes('deal')) Icon = ShoppingBag;
  else if (label.toLowerCase().includes('resale')) Icon = TrendingUp;
  else if (label.toLowerCase().includes('authenticity')) Icon = Shield;

  // Privacy Specific
  else if (label.toLowerCase().includes('camera') || label.toLowerCase().includes('lens')) Icon = Eye;
  else if (label.toLowerCase().includes('mirror')) Icon = AlertTriangle;
  else if (label.toLowerCase().includes('wifi') || label.toLowerCase().includes('network')) Icon = Wifi;
  else if (label.toLowerCase().includes('signal') || label.toLowerCase().includes('rf')) Icon = Radio;
  else if (label.toLowerCase().includes('lock') || label.toLowerCase().includes('door') || label.toLowerCase().includes('secure')) Icon = Lock;

  // General/Study Specific
  else if (label.toLowerCase().includes('math') || label.toLowerCase().includes('equation')) Icon = Calculator;
  else if (label.toLowerCase().includes('book') || label.toLowerCase().includes('study')) Icon = BookOpen;
  else if (label.toLowerCase().includes('plant') || label.toLowerCase().includes('nature') || label.toLowerCase().includes('garden')) Icon = Leaf;
  else if (label.toLowerCase().includes('landmark') || label.toLowerCase().includes('building')) Icon = Building;
  else if (label.toLowerCase().includes('fact') || label.toLowerCase().includes('did you')) Icon = Lightbulb;
  
  // Entertainment Specific
  else if (label.toLowerCase().includes('critic') || label.toLowerCase().includes('rating')) Icon = Film;
  else if (label.toLowerCase().includes('audience') || label.toLowerCase().includes('fan')) Icon = User;
  else if (label.toLowerCase().includes('stream') || label.toLowerCase().includes('tv')) Icon = Tv;
  else if (label.toLowerCase().includes('book') || label.toLowerCase().includes('read')) Icon = Book;
  else if (label.toLowerCase().includes('game') || label.toLowerCase().includes('play')) Icon = Gamepad;
  else if (label.toLowerCase().includes('music') || label.toLowerCase().includes('album')) Icon = Music;

  // Environment Specific
  else if (label.toLowerCase().includes('carbon') || label.toLowerCase().includes('air quality')) Icon = CloudSun;
  else if (label.toLowerCase().includes('recycle') || label.toLowerCase().includes('material')) Icon = Recycle;
  else if (label.toLowerCase().includes('bio')) Icon = Sprout;

  // Plant Specific
  else if (label.toLowerCase().includes('pest') || label.toLowerCase().includes('disease')) Icon = Bug;
  else if (label.toLowerCase().includes('sun') || label.toLowerCase().includes('light')) Icon = Sun;
  else if (label.toLowerCase().includes('toxic')) Icon = AlertTriangle;
  else if (label.toLowerCase().includes('soil') || label.toLowerCase().includes('fert')) Icon = Sprout;
  else if (label.toLowerCase().includes('plant id')) Icon = Flower2;

  // Document Specific
  else if (label.toLowerCase().includes('date') || label.toLowerCase().includes('calendar')) Icon = Calendar;
  else if (label.toLowerCase().includes('type') || label.toLowerCase().includes('contract')) Icon = FileText;
  else if (label.toLowerCase().includes('entities') || label.toLowerCase().includes('name')) Icon = User;
  
  // Fashion Specific
  else if (label.toLowerCase().includes('item') || label.toLowerCase().includes('style')) Icon = Shirt;
  else if (label.toLowerCase().includes('occasion')) Icon = Calendar;
  else if (label.toLowerCase().includes('material')) Icon = Sparkles;
  
  // Wine Specific
  else if (label.toLowerCase().includes('grape') || label.toLowerCase().includes('wine')) Icon = Grape;
  else if (label.toLowerCase().includes('vintage') || label.toLowerCase().includes('year')) Icon = Clock;
  else if (label.toLowerCase().includes('region')) Icon = MapPin;
  
  // Sleep Specific
  else if (label.toLowerCase().includes('light') || label.toLowerCase().includes('dark')) Icon = Moon;
  else if (label.toLowerCase().includes('clutter') || label.toLowerCase().includes('rest') || label.toLowerCase().includes('bed')) Icon = Bed;

  // Posture Specific
  else if (label.toLowerCase().includes('head') || label.toLowerCase().includes('spine') || label.toLowerCase().includes('back')) Icon = User;
  else if (label.toLowerCase().includes('desk') || label.toLowerCase().includes('workstation') || label.toLowerCase().includes('monitor')) Icon = Monitor;
  else if (label.toLowerCase().includes('shoulder')) Icon = AlignJustify;
  else if (label.toLowerCase().includes('rsi')) Icon = AlertTriangle;
  
  // Stock Specific
  else if (label.toLowerCase().includes('earnings') || label.toLowerCase().includes('date')) Icon = Calendar;
  else if (label.toLowerCase().includes('insider') || label.toLowerCase().includes('executive')) Icon = Briefcase;
  else if (label.toLowerCase().includes('short') || label.toLowerCase().includes('squeeze')) Icon = AlertTriangle;
  else if (label.toLowerCase().includes('dividend') || label.toLowerCase().includes('yield')) Icon = CircleDollarSign;
  else if (label.toLowerCase().includes('value') || label.toLowerCase().includes('p/e')) Icon = Tag;
  else if (label.toLowerCase().includes('momentum') || label.toLowerCase().includes('breakout')) Icon = Zap;
  else if (label.toLowerCase().includes('economy') || label.toLowerCase().includes('gdp')) Icon = Landmark;
  else if (label.toLowerCase().includes('global') || label.toLowerCase().includes('forex')) Icon = Globe;
  else if (label.toLowerCase().includes('sector')) Icon = PieChart;
  else if (label.toLowerCase().includes('ticker') || label.toLowerCase().includes('symbol')) Icon = Tag;
  else if (label.toLowerCase().includes('trend')) Icon = TrendingUp;
  else if (label.toLowerCase().includes('pattern')) Icon = LineChart;
  else if (label.toLowerCase().includes('rsi') || label.toLowerCase().includes('vol')) Icon = BarChart3;
  else if (label.toLowerCase().includes('support') || label.toLowerCase().includes('resistance')) Icon = DollarSign;

  // Gemstone Specific
  else if (label.toLowerCase().includes('species') || label.toLowerCase().includes('gem')) Icon = Diamond;
  else if (label.toLowerCase().includes('carat') || label.toLowerCase().includes('weight')) Icon = Scale;
  else if (label.toLowerCase().includes('color')) Icon = Palette;
  else if (label.toLowerCase().includes('clarity')) Icon = Sparkles;
  else if (label.toLowerCase().includes('cut') || label.toLowerCase().includes('shape')) Icon = Scissors;

  const isGood = evaluation.toLowerCase().includes('good') || evaluation.toLowerCase().includes('normal') || evaluation.toLowerCase().includes('low') || evaluation.toLowerCase().includes('none') || evaluation.toLowerCase().includes('aligned') || evaluation.toLowerCase().includes('ideal') || evaluation.toLowerCase().includes('clear') || evaluation.toLowerCase().includes('safe') || evaluation.toLowerCase().includes('fresh') || evaluation.toLowerCase().includes('non-urgent') || evaluation.toLowerCase().includes('no') || evaluation.toLowerCase().includes('mint') || evaluation.toLowerCase().includes('high') || evaluation.toLowerCase().includes('real') || evaluation.toLowerCase().includes('excellent') || evaluation.toLowerCase().includes('healthy') || evaluation.toLowerCase().includes('smooth') || evaluation.toLowerCase().includes('versatile') || evaluation.toLowerCase().includes('even') || evaluation.toLowerCase().includes('fresh') || evaluation.toLowerCase().includes('eco') || evaluation.toLowerCase().includes('dark') || evaluation.toLowerCase().includes('neutral') || evaluation.toLowerCase().includes('bullish') || evaluation.toLowerCase().includes('buy');
  const isBad = evaluation.toLowerCase().includes('poor') || evaluation.toLowerCase().includes('high') || evaluation.toLowerCase().includes('severe') || evaluation.toLowerCase().includes('concern') || evaluation.toLowerCase().includes('issue') || evaluation.toLowerCase().includes('check') || evaluation.toLowerCase().includes('warning') || evaluation.toLowerCase().includes('discard') || evaluation.toLowerCase().includes('urgent') || evaluation.toLowerCase().includes('er') || evaluation.toLowerCase().includes('yes') || evaluation.toLowerCase().includes('low') || evaluation.toLowerCase().includes('fake') || evaluation.toLowerCase().includes('depreciating') || evaluation.toLowerCase().includes('needs work') || evaluation.toLowerCase().includes('dehydrated') || evaluation.toLowerCase().includes('rough') || evaluation.toLowerCase().includes('overpriced') || evaluation.toLowerCase().includes('rotten') || evaluation.toLowerCase().includes('toxic') || evaluation.toLowerCase().includes('waste') || evaluation.toLowerCase().includes('bright') || evaluation.toLowerCase().includes('forward') || evaluation.toLowerCase().includes('rounded') || evaluation.toLowerCase().includes('bearish') || evaluation.toLowerCase().includes('sell');

  // Override logic for Finance/Shopping/Environment where "High" is good for demand/value/networth
  let statusColor = isGood ? 'text-[#CCFF00] bg-[#CCFF00]/10' : isBad ? 'text-red-400 bg-red-900/20' : 'text-yellow-400 bg-yellow-900/20';
  
  // Finance specific overrides
  if ((label.toLowerCase().includes('demand') || label.toLowerCase().includes('resale')) && evaluation.toLowerCase().includes('high')) {
      statusColor = 'text-[#CCFF00] bg-[#CCFF00]/10';
  }

  // Beauty specific neutral overrides
  if (label.toLowerCase().includes('shape') || label.toLowerCase().includes('tone')) {
      statusColor = 'text-purple-400 bg-purple-900/20';
  }

  return (
    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-col gap-3 hover:border-[#CCFF00]/30 transition-all shadow-lg">
       <div className="flex items-start justify-between">
          <div className="p-2 rounded-full bg-white/5 text-zinc-300">
             <Icon size={18} />
          </div>
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[100px] ${statusColor}`}>
              {evaluation}
          </div>
       </div>
       <div>
           <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-1">{label}</span>
           <span className="text-lg font-medium text-white line-clamp-1" title={value}>{value}</span>
       </div>
    </div>
  );
};

// --- Parsing Logic ---

const parseAnalysisData = (markdown: string, mode: ScannerMode) => {
  let score: number | null = null;
  let scoreLabel = "Score";
  const vitals: Array<{label: string, value: string, evaluation: string}> = [];

  if (mode === ScannerMode.HEALTH || mode === ScannerMode.PETS) {
      // Extract Score
      const scoreMatch = markdown.match(/## 📊 (?:OVERALL HEALTH|WELLNESS) SCORE:.*?(\d+)/i);
      score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
      scoreLabel = "Health Score";

      // Extract Vitals Table Rows
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1];
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  } 
  else if (mode === ScannerMode.FOOD) {
      // Extract Safety Score
      const scoreMatch = markdown.match(/Overall Safety Score:.*?(\d+(\.\d+)?)\/10/i);
      score = scoreMatch ? parseFloat(scoreMatch[1]) * 10 : null; // Convert x/10 to x/100
      scoreLabel = "Safety Score";

      // Extract Nutrition/Safety Table Rows
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1];
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  }
  else if (mode === ScannerMode.DISEASE) {
    // Extract Severity Score
    const scoreMatch = markdown.match(/## 📊 SEVERITY SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Condition Status"; // High score = Healthy/Minor in this logic to match gauge colors

    // Extract Triage Table Rows
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.FINANCE) {
      // Extract Asset Condition Score
      let scoreMatch = markdown.match(/## 📊 CONDITION SCORE:.*?(\d+)/i);
      if (!scoreMatch) {
          // Fallback to Financial Health Score
           scoreMatch = markdown.match(/## 📊 FINANCIAL SCORE:.*?(\d+)/i);
           if (scoreMatch) scoreLabel = "Health Score";
      } else {
          scoreLabel = "Condition";
      }
      
      score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

      // Extract Finance Table Rows (Valuation or Metrics)
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1].replace(/\*\*/g, ''); // Remove bold from value
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  }
  else if (mode === ScannerMode.BEAUTY) {
      // Try to find Skin Health Score
      let scoreMatch = markdown.match(/## 📊 OVERALL SKIN HEALTH:.*?(\d+(\.\d+)?)\/10/i);
      if (scoreMatch) {
          score = parseFloat(scoreMatch[1]) * 10;
          scoreLabel = "Skin Health";
      }

      // Extract Vital Indicators Table
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1];
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  }
  else if (mode === ScannerMode.SHOPPING) {
      // Extract Deal Quality Score
      const scoreMatch = markdown.match(/## 📊 DEAL QUALITY:.*?(\d+(\.\d+)?)\/10/i);
      if (scoreMatch) {
          score = parseFloat(scoreMatch[1]) * 10;
          scoreLabel = "Deal Score";
      }

      // Extract Shopping Metrics Table
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1].replace(/\*\*/g, '');
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  }
  else if (mode === ScannerMode.PRIVACY) {
    // Extract Security Score
    const scoreMatch = markdown.match(/## 📊 SECURITY SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Security Score";

    // Extract Risk Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.ENTERTAINMENT) {
      // Extract Review Scores (Simulated Score for Gauge)
      // Logic: Try to find Critic Score, otherwise default
      const scoreMatch = markdown.match(/\| \*\*Critic Score\*\* \| (\d+)/i);
      score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
      scoreLabel = "Critic Score";

      // Extract Ratings Table
      const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
      if (tableLines) {
          tableLines.forEach(line => {
              const parts = line.split('|').map(s => s.trim()).filter(s => s);
              if (parts.length >= 3) {
                 const label = parts[0].replace(/\*\*/g, '');
                 const value = parts[1];
                 const evaluation = parts[2];
                 vitals.push({ label, value, evaluation });
              }
          });
      }
  }
  else if (mode === ScannerMode.ENVIRONMENT) {
    // Extract Sustainability Score
    const scoreMatch = markdown.match(/## 📊 SUSTAINABILITY SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Eco Score";

    // Extract Eco Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.PLANT) {
    // Extract Plant Health Score
    const scoreMatch = markdown.match(/## 📊 PLANT HEALTH SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Plant Health";

    // Extract Care Stats Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.FASHION) {
    // Extract Style Score
    const scoreMatch = markdown.match(/## 📊 STYLE SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) * 10 : null; // Convert x/10 to 100
    scoreLabel = "Style Score";

    // Extract Style Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.WINE) {
    // Extract Vintage Rating
    const scoreMatch = markdown.match(/## 📊 VINTAGE RATING:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Vintage Rating";

    // Extract Bottle Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.SLEEP) {
    // Extract Sleep Score
    const scoreMatch = markdown.match(/## 📊 SLEEP SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Sleep Score";

    // Extract Vital Indicators Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.POSTURE) {
    // Extract Ergonomics Score
    const scoreMatch = markdown.match(/## 📊 ERGONOMICS SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Ergo Score";

    // Extract Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.STOCK) {
    // Extract Sentiment Score or other primary score
    let scoreMatch = markdown.match(/## 📊 (?:SENTIMENT|SQUEEZE RISK|DIVIDEND SAFETY|MOMENTUM|FUNDAMENTAL) SCORE:.*?(\d+)/i);
    if (!scoreMatch) {
       // Fallback for generic sentiment
       scoreMatch = markdown.match(/## 📊 SENTIMENT SCORE:.*?(\d+)/i);
    }
    
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Sentiment";
    if (markdown.includes("SQUEEZE RISK")) scoreLabel = "Squeeze Risk";
    if (markdown.includes("DIVIDEND SAFETY")) scoreLabel = "Div Safety";
    if (markdown.includes("MOMENTUM")) scoreLabel = "Momentum";

    // Extract Indicators/Data Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }
  else if (mode === ScannerMode.GEMSTONE) {
    // Extract Gem Quality Score
    const scoreMatch = markdown.match(/## 📊 GEM QUALITY SCORE:.*?(\d+)/i);
    score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    scoreLabel = "Quality";

    // Extract Gem Metrics Table
    const tableLines = markdown.match(/\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \|/g);
    if (tableLines) {
        tableLines.forEach(line => {
            const parts = line.split('|').map(s => s.trim()).filter(s => s);
            if (parts.length >= 3) {
               const label = parts[0].replace(/\*\*/g, '');
               const value = parts[1];
               const evaluation = parts[2];
               vitals.push({ label, value, evaluation });
            }
        });
    }
  }

  // Clean Markdown
  let cleanedMarkdown = markdown;
  
  if (score !== null) {
      cleanedMarkdown = cleanedMarkdown.replace(/## 📊 (?:OVERALL HEALTH|WELLNESS|SEVERITY|CONDITION|FINANCIAL|DEAL QUALITY|SECURITY|SUSTAINABILITY|PLANT HEALTH|STYLE|VINTAGE RATING|SLEEP|ERGONOMICS|SENTIMENT|SQUEEZE RISK|DIVIDEND SAFETY|MOMENTUM|FUNDAMENTAL|GEM QUALITY) (?:SCORE|QUALITY|RATING):.*?\n/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/Overall Safety Score:.*?\n/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 📊 OVERALL SKIN HEALTH:.*?\n/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Color code:.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(NOTE: 100 = Healthy.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(10 = Perfectly Safe.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(100 = Mint.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Calculated based on.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(10 = Amazing Deal.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Based on rarity.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Based on estimated.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(10 = Very Safe.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(100 = Eco-Friendly.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(100 = Thriving.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Critical consensus score.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Based on trends.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(100 = Perfect Setup.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(100 = Perfect Alignment.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(0 = Bearish.*?\)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/\(Based on clarity.*?\)/i, '');
  }
  
  if (vitals.length > 0) {
      cleanedMarkdown = cleanedMarkdown.replace(/## 🩺 (?:VITAL INDICATORS|DISEASE DETECTION & DIAGNOSIS)/i, ''); // Generic remove header if needed but usually distinct
      cleanedMarkdown = cleanedMarkdown.replace(/## 🩺 VITAL INDICATORS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 🚨 TRIAGE ASSESSMENT[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 📊 NUTRITION FACTS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 💵 (?:VALUATION & METRICS|FINANCIAL METRICS|PRICE METRICS|PROPERTY METRICS|VALUE METRICS)[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 💄 VITAL INDICATORS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 🛡️ VITAL INDICATORS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## ⭐ RATINGS & REVIEWS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## ♻️ ECO METRICS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 🍇 BOTTLE METRICS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 👠 STYLE METRICS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 🌙 VITAL INDICATORS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 📐 ALIGNMENT METRICS[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 📉 (?:TECHNICAL INDICATORS|DATA INSIGHTS)[\s\S]*?(?=##)/i, '');
      cleanedMarkdown = cleanedMarkdown.replace(/## 💎 GEM METRICS[\s\S]*?(?=##)/i, '');
      
      // Fallback
      if (cleanedMarkdown.includes('## 🩺 VITAL INDICATORS')) cleanedMarkdown = cleanedMarkdown.split('## 🩺 VITAL INDICATORS')[0];
  }

  return { score, scoreLabel, vitals, displayContent: cleanedMarkdown };
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack, isVoiceListening, onToggleVoice, isSpeaking, onStopSpeaking }) => {
  const isHealth = result.mode === ScannerMode.HEALTH;
  const isPet = result.mode === ScannerMode.PETS;
  const isFood = result.mode === ScannerMode.FOOD;
  const isDisease = result.mode === ScannerMode.DISEASE;
  const isFinance = result.mode === ScannerMode.FINANCE;
  const isBeauty = result.mode === ScannerMode.BEAUTY;
  const isShopping = result.mode === ScannerMode.SHOPPING;
  const isPrivacy = result.mode === ScannerMode.PRIVACY;
  const isEntertainment = result.mode === ScannerMode.ENTERTAINMENT;
  const isEnvironment = result.mode === ScannerMode.ENVIRONMENT;
  const isPlant = result.mode === ScannerMode.PLANT;
  const isFashion = result.mode === ScannerMode.FASHION;
  const isWine = result.mode === ScannerMode.WINE;
  const isSleep = result.mode === ScannerMode.SLEEP;
  const isPosture = result.mode === ScannerMode.POSTURE;
  const isStock = result.mode === ScannerMode.STOCK;
  const isGemstone = result.mode === ScannerMode.GEMSTONE;
  
  const isDashboardMode = isHealth || isPet || isFood || isDisease || isFinance || isBeauty || isShopping || isPrivacy || isEntertainment || isEnvironment || isPlant || isFashion || isWine || isSleep || isPosture || isStock || isGemstone;

  const isTravel = result.mode === ScannerMode.TRAVEL;
  const isDocument = result.mode === ScannerMode.DOCUMENT;

  // Memoize parsed data to avoid re-parsing on render
  const { score, scoreLabel, vitals, displayContent } = useMemo(() => {
      if (isDashboardMode) {
          const parsed = parseAnalysisData(result.text, result.mode);
          return { score: parsed.score, scoreLabel: parsed.scoreLabel, vitals: parsed.vitals, displayContent: parsed.displayContent };
      }
      return { score: null, scoreLabel: "", vitals: [], displayContent: result.text };
  }, [result.text, result.mode, isDashboardMode]);

  const groundingChunks = result.groundingMetadata?.groundingChunks || [];

  return (
    <div className="flex flex-col h-full bg-zinc-950 animate-in slide-in-from-bottom duration-500 md:flex-row md:h-screen md:overflow-hidden relative">
      
      {/* Header (Mobile) */}
      <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center md:hidden">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center text-white/80 hover:text-[#CCFF00] transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            
            <button 
                onClick={onToggleVoice}
                className={`p-2 rounded-full border transition-all ${
                    isVoiceListening 
                    ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.4)]' 
                    : 'bg-zinc-800/50 border-white/10 text-zinc-400 hover:text-[#CCFF00]'
                }`}
            >
                {isVoiceListening ? (
                     <div className="relative">
                       <Mic size={16} className="animate-pulse" />
                       <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-ping"></span>
                     </div>
                ) : (
                    <MicOff size={16} />
                )}
            </button>

            {isSpeaking && onStopSpeaking && (
              <button onClick={onStopSpeaking} className="p-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500 animate-pulse">
                <Volume2 size={16} />
              </button>
            )}
        </div>

        <span className="text-xs font-bold tracking-widest text-[#CCFF00] uppercase bg-[#CCFF00]/10 px-3 py-1 rounded-full border border-[#CCFF00]/20">{result.mode}</span>
        <button className="text-white/80 hover:text-[#CCFF00]">
          <Share2 size={20} />
        </button>
      </div>

      {/* Source Image Panel */}
      <div className="w-full h-72 md:w-1/2 md:h-full relative flex-shrink-0 bg-black/50 backdrop-blur-sm md:border-r md:border-white/10 flex items-center justify-center overflow-hidden">
        {/* Background Blur Image for Ambiance */}
        <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110 grayscale"
            style={{ backgroundImage: `url(${result.imageUrl})` }}
        ></div>

        <div className="absolute top-6 left-6 z-20 hidden md:block">
             <div className="flex items-center gap-3">
                 <button onClick={onBack} className="flex items-center bg-black/60 hover:bg-black/80 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-[#CCFF00]/50 hover:text-[#CCFF00]">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                <button 
                    onClick={onToggleVoice}
                    className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
                        isVoiceListening 
                        ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.4)]' 
                        : 'bg-black/60 border-white/10 text-zinc-300 hover:text-[#CCFF00] hover:border-[#CCFF00]/50'
                    }`}
                >
                    {isVoiceListening ? (
                        <div className="relative">
                        <Mic size={18} className="animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-full animate-ping"></span>
                        </div>
                    ) : (
                        <MicOff size={18} />
                    )}
                </button>
                
                {isSpeaking && onStopSpeaking && (
                   <button 
                     onClick={onStopSpeaking} 
                     className="p-2.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500 backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                   >
                     <Volume2 size={18} />
                   </button>
                )}
             </div>
        </div>

        <img 
          src={result.imageUrl} 
          alt="Scanned content" 
          className="relative z-10 w-full h-full object-contain md:p-12 p-4 transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent md:hidden pointer-events-none"></div>
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-y-auto no-scrollbar md:bg-zinc-950/90 md:backdrop-blur-xl relative">
        
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center p-8 border-b border-white/5 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className="bg-[#CCFF00] w-1.5 h-8 rounded-full shadow-[0_0_10px_#CCFF00]"></div>
                <h2 className="font-bold text-white text-2xl tracking-wide">{result.mode} ANALYSIS</h2>
            </div>
            <button className="text-zinc-400 hover:text-[#CCFF00] p-3 hover:bg-white/5 rounded-full transition-colors">
              <Share2 size={20} />
            </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto pb-32">
          
          {/* Disclaimer Cards */}
          {(isHealth || isDisease || isPosture) && (
            <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md p-4 rounded-xl flex items-start text-red-200 text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <AlertTriangle size={18} className="mt-0.5 mr-3 flex-shrink-0 text-red-500 animate-pulse" />
              <div className="flex-1">
                <strong className="block text-red-400 font-bold mb-1">MEDICAL DISCLAIMER</strong>
                <p>This analysis is AI-generated for educational purposes only. It is NOT a medical diagnosis. Always consult a qualified healthcare professional. If in doubt, visit a doctor.</p>
              </div>
            </div>
          )}

          {isPet && (
            <div className="bg-orange-500/10 border border-orange-500/30 backdrop-blur-md p-4 rounded-xl flex items-start text-orange-200 text-sm shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <AlertTriangle size={18} className="mt-0.5 mr-3 flex-shrink-0 text-orange-500" />
              <div className="flex-1">
                <strong className="block text-orange-400 font-bold mb-1">VETERINARY DISCLAIMER</strong>
                <p>This scan is for educational purposes. It is not a substitute for professional veterinary care. Consult a vet for diagnosis and treatment.</p>
              </div>
            </div>
          )}
          
          {isStock && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md p-4 rounded-xl flex items-start text-cyan-200 text-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <AlertTriangle size={18} className="mt-0.5 mr-3 flex-shrink-0 text-cyan-500" />
              <div className="flex-1">
                <strong className="block text-cyan-400 font-bold mb-1">FINANCIAL DISCLAIMER</strong>
                <p>This is NOT financial advice. Trading involves risk. Data is for educational purposes only.</p>
              </div>
            </div>
          )}

          {isBeauty && (
            <div className="bg-purple-500/5 border border-purple-500/20 backdrop-blur-md p-4 rounded-xl flex items-start text-purple-200 text-sm">
              <Sparkles size={18} className="mt-0.5 mr-3 flex-shrink-0 text-purple-400" />
              <p>For educational purposes. For severe skin conditions, always consult a dermatologist.</p>
            </div>
          )}

          {isTravel && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md p-4 rounded-xl flex items-start text-emerald-200 text-sm">
              <MapPin size={18} className="mt-0.5 mr-3 flex-shrink-0 text-emerald-400" />
              <p>Verify safety information locally. In emergencies, call 911/112.</p>
            </div>
          )}
          
          {isFood && (
            <div className="bg-lime-500/5 border border-lime-500/20 backdrop-blur-md p-4 rounded-xl flex items-start text-lime-200 text-sm">
              <Utensils size={18} className="mt-0.5 mr-3 flex-shrink-0 text-lime-400" />
              <p>Nutritional values are estimates. Always check packaging and expiration dates.</p>
            </div>
          )}

          {isPrivacy && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-md p-4 rounded-xl flex items-start text-indigo-200 text-sm">
              <Lock size={18} className="mt-0.5 mr-3 flex-shrink-0 text-indigo-400" />
              <p>This tool assists manual inspection but cannot guarantee 100% detection. Always verify suspicious findings manually.</p>
            </div>
          )}

          {/* Special UI: Dashboard Mode */}
          {isDashboardMode && score !== null && (
             <div className="animate-in zoom-in duration-500">
                <HealthGauge score={score} label={scoreLabel} />
             </div>
          )}

          {isDashboardMode && vitals.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8 animate-in slide-in-from-bottom duration-700">
                  {vitals.map((v, i) => (
                      <VitalCard key={i} {...v} />
                  ))}
              </div>
          )}

          {/* Main Analysis Text - Glass Card Style */}
          <div className="relative">
              {!isDashboardMode && <div className="absolute -inset-4 bg-[#CCFF00]/5 rounded-2xl -z-10 blur-xl opacity-20"></div>}
              <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
                <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#CCFF00] mb-6 pb-2 border-b border-[#CCFF00]/20" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mt-10 mb-4 flex items-center gap-2 border-l-4 border-[#CCFF00] pl-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#CCFF00] mt-6 mb-2 bg-[#CCFF00]/5 inline-block px-3 py-1 rounded-md" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-none space-y-2 my-4" {...props} />,
                    li: ({node, ...props}) => <li className="pl-4 border-l border-zinc-700 text-zinc-300 hover:border-[#CCFF00] hover:bg-white/5 transition-colors p-2 rounded-r-md text-sm md:text-base" {...props} />,
                    p: ({node, ...props}) => <p className="text-zinc-300 leading-relaxed mb-4 font-light" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="w-full text-left border-collapse rounded-xl overflow-hidden" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-zinc-800 text-white" {...props} />,
                    th: ({node, ...props}) => <th className="p-3 font-semibold border-b border-zinc-700" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border-b border-zinc-800 text-zinc-300" {...props} />,
                }}
                >
                {displayContent}
                </ReactMarkdown>
              </div>
          </div>

          {/* Grounding / Citations */}
          {groundingChunks.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#CCFF00]"></span> Sources & References
              </h4>
              <div className="grid gap-3">
                {groundingChunks.map((chunk: any, index: number) => {
                  if (chunk.web) {
                    return (
                      <a 
                        key={index} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-[#CCFF00]/40 transition-all group backdrop-blur-md"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate group-hover:text-[#CCFF00] transition-colors">
                            {chunk.web.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">
                            {chunk.web.uri}
                          </p>
                        </div>
                        <ExternalLink size={16} className="text-zinc-600 group-hover:text-[#CCFF00] transition-colors ml-4" />
                      </a>
                    );
                  }
                  if (chunk.maps && chunk.maps.placeAnswerSources && chunk.maps.placeAnswerSources.length > 0) {
                      const place = chunk.maps.placeAnswerSources[0];
                       return (
                      <div key={index} className="flex flex-col p-4 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
                         <div className="flex justify-between items-start">
                             <h5 className="text-sm font-medium text-white">{place.title || "Map Location"}</h5>
                             <MapPin size={16} className="text-[#CCFF00]" />
                         </div>
                         <p className="text-xs text-zinc-500 mt-1">{place.address}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
