import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  MessageSquare, 
  Database, 
  Utensils, 
  Activity, 
  Settings, 
  Plus,
  ChevronRight,
  Info,
  Zap,
  Leaf,
  Droplets,
  Flame,
  Heart,
  TrendingUp,
  History,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Types
type Tab = 'home' | 'calc' | 'ai' | 'strains' | 'recipes' | 'health';

// Mock Data
const MOCK_LOGS = [
  { time: '08:00', dose: 5, type: 'CBD' },
  { time: '12:00', dose: 2, type: 'THC' },
  { time: '18:00', dose: 10, type: 'CBD' },
  { time: '21:00', dose: 5, type: 'THC' },
];

const MOCK_STRAINS = [
  { id: 1, name: 'Blue Dream', type: 'Hybrid', thc: 18, cbd: 0.1, effects: ['Creative', 'Energetic'] },
  { id: 2, name: 'OG Kush', type: 'Indica', thc: 22, cbd: 0.5, effects: ['Relaxed', 'Euphoric'] },
  { id: 3, name: 'Sour Diesel', type: 'Sativa', thc: 20, cbd: 0.2, effects: ['Happy', 'Uplifted'] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [userLevel, setUserLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-brand-600 flex flex-col items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-3xl shadow-2xl mb-4"
        >
          <Leaf className="w-16 h-16 text-brand-600" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-3xl font-display font-bold tracking-tight"
        >
          Erva na Medida
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className="text-white/80 mt-2 font-medium"
        >
          Dosagem Inteligente & Bem-estar
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-stone-50 flex flex-col overflow-hidden relative shadow-2xl border-x border-stone-200">
      {/* Header */}
      <header className="p-6 flex items-center justify-between bg-white border-b border-stone-100 shrink-0">
        <div>
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Erva na Medida</h2>
          <h1 className="text-xl font-display font-bold text-stone-900">
            {activeTab === 'home' && 'Olá, Usuário'}
            {activeTab === 'calc' && 'Calculadora'}
            {activeTab === 'ai' && 'Dose na Medida'}
            {activeTab === 'strains' && 'Genéticas'}
            {activeTab === 'recipes' && 'Culinária'}
            {activeTab === 'health' && 'Bem-estar'}
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" />}
          {activeTab === 'calc' && <CalcView key="calc" userLevel={userLevel} />}
          {activeTab === 'ai' && <AIView key="ai" />}
          {activeTab === 'strains' && <StrainsView key="strains" />}
          {activeTab === 'recipes' && <RecipesView key="recipes" />}
          {activeTab === 'health' && <HealthView key="health" />}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-100 px-4 py-3 flex justify-between items-center safe-area-bottom">
        <NavButton icon={<Leaf />} label="Início" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton icon={<Calculator />} label="Calc" active={activeTab === 'calc'} onClick={() => setActiveTab('calc')} />
        <NavButton icon={<MessageSquare />} label="IA" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        <NavButton icon={<Utensils />} label="Receitas" active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} />
        <NavButton icon={<Database />} label="Strains" active={activeTab === 'strains'} onClick={() => setActiveTab('strains')} />
        <NavButton icon={<Activity />} label="Saúde" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-brand-600' : 'text-stone-400'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-brand-100' : ''}`}>
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

// --- Views ---

function HomeView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(setLogs);
    fetch('/api/recipes').then(res => res.json()).then(setRecipes);
  }, []);

  useEffect(() => {
    if (logs.length > 0 && recipes.length > 0 && !suggestion && !loadingSuggestion) {
      generateSuggestion();
    }
  }, [logs, recipes]);

  const generateSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const recentLogs = logs.slice(0, 10);
      const availableRecipes = recipes.map(r => ({ id: r.id, name: r.name, description: r.description }));
      
      const context = `
        Histórico recente do usuário: ${JSON.stringify(recentLogs.map(l => ({ strain: l.strain_name, method: l.method, rating: l.effect_rating })))}
        Receitas disponíveis: ${JSON.stringify(availableRecipes)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é o assistente "Dose na Medida". 
        Com base no histórico do usuário e nas receitas disponíveis, sugira UMA receita ideal para ele agora.
        Explique brevemente por que essa receita combina com as strains ou métodos que ele costuma usar.
        Seja motivador e use emojis. Retorne apenas o texto da sugestão em formato Markdown curto.`,
      });
      setSuggestion(response.text || null);
    } catch (err) {
      console.error("Erro ao gerar sugestão:", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Status Card */}
      <div className="bg-brand-600 rounded-3xl p-6 text-white shadow-lg shadow-brand-200 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-brand-100 text-sm font-medium">Consumo hoje</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-4xl font-display font-bold">
              {logs.filter(l => l.timestamp && new Date(l.timestamp).toDateString() === new Date().toDateString())
                .reduce((acc, l) => acc + (Number(l.amount || 0) * (Number(l.thc || 0) / 100) * 1000), 0).toFixed(1)}
            </h3>
            <span className="text-brand-100 font-medium">mg THC</span>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Seguro
            </div>
            <button 
              onClick={() => setShowLogForm(true)}
              className="bg-white text-brand-600 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-auto"
            >
              <Plus className="w-3 h-3" /> Registrar
            </button>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Leaf className="w-32 h-32" />
        </div>
      </div>

      {showLogForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display font-bold">Registrar Sessão</h3>
              <button onClick={() => setShowLogForm(false)} className="text-stone-400"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            <LogForm onComplete={() => { setShowLogForm(false); fetch('/api/logs').then(res => res.json()).then(setLogs); }} />
          </motion.div>
        </div>
      )}

      {/* AI Suggestion */}
      {(suggestion || loadingSuggestion) && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-stone-800">Sugestão Dose na Medida</h4>
          </div>
          {loadingSuggestion ? (
            <div className="flex gap-1 py-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            <div className="text-sm text-stone-600 leading-relaxed">
              <Markdown>{suggestion}</Markdown>
            </div>
          )}
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <MessageSquare className="w-24 h-24" />
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-bold text-stone-800">Atividade Semanal</h4>
          <button className="text-brand-600 text-xs font-bold">Ver tudo</button>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs.slice(0, 7).reverse()}>
              <defs>
                <linearGradient id="colorDose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="amount" stroke="#22c55e" fillOpacity={1} fill="url(#colorDose)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h4 className="font-display font-bold text-stone-800 mb-3 px-2">Histórico Recente</h4>
        <div className="space-y-3">
          {logs.slice(0, 3).map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">{log.strain_name || 'Variedade Desconhecida'}</p>
                  <p className="text-[10px] text-stone-400 font-medium">
                    {new Date(log.timestamp).toLocaleDateString()} • {log.method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-600">{(log.amount * (log.thc / 100) * 1000).toFixed(1)}mg</p>
                <p className="text-[10px] text-stone-400 font-medium">THC</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LogForm({ onComplete }: { onComplete: () => void }) {
  const [strains, setStrains] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    strain_id: null as number | null,
    strain_name: '',
    amount: 0.5,
    thc: 15,
    method: 'Vaporizador',
    effect_rating: 5,
    notes: '',
    effects_felt: [] as string[]
  });

  useEffect(() => {
    fetch('/api/strains').then(res => res.json()).then(setStrains);
  }, []);

  const handleStrainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "") {
      setFormData({ ...formData, strain_id: null, strain_name: '', thc: 15 });
      return;
    }
    const selected = strains.find(s => s.id === Number(val));
    if (selected) {
      setFormData({ 
        ...formData, 
        strain_id: selected.id, 
        strain_name: selected.name, 
        thc: selected.thc || 15 
      });
    }
  };

  const handleSubmit = async () => {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    onComplete();
  };

  return (
    <div className="space-y-4">
      <select 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100 text-sm font-medium"
        value={formData.strain_id || ""}
        onChange={handleStrainChange}
      >
        <option value="">Selecionar Strain...</option>
        {strains.map(s => (
          <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
        ))}
        {strains.length === 0 && <option disabled>Nenhuma strain cadastrada</option>}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input 
          type="number" 
          placeholder="Qtd (g)" 
          className="p-3 rounded-xl bg-stone-50 border-stone-100"
          value={formData.amount}
          onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
        />
        <input 
          type="number" 
          placeholder="THC %" 
          className="p-3 rounded-xl bg-stone-50 border-stone-100"
          value={formData.thc}
          onChange={e => setFormData({...formData, thc: Number(e.target.value)})}
        />
      </div>
      <select 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100"
        value={formData.method}
        onChange={e => setFormData({...formData, method: e.target.value})}
      >
        <option>Vaporizador</option>
        <option>Culinária</option>
        <option>Óleo/Tintura</option>
        <option>Fumo</option>
      </select>
      <div className="space-y-2">
        <p className="text-xs font-bold text-stone-400 uppercase">Avaliação: {formData.effect_rating}/10</p>
        <input 
          type="range" min="1" max="10" 
          className="w-full accent-brand-600"
          value={formData.effect_rating}
          onChange={e => setFormData({...formData, effect_rating: Number(e.target.value)})}
        />
      </div>
      <textarea 
        placeholder="Notas sobre a experiência..." 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100 h-24"
        value={formData.notes}
        onChange={e => setFormData({...formData, notes: e.target.value})}
      />
      <button 
        onClick={handleSubmit}
        className="w-full bg-brand-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-brand-200"
      >
        Salvar Sessão
      </button>
    </div>
  );
}

function CalcView({ userLevel }: { userLevel: string }) {
  const [amount, setAmount] = useState(1);
  const [potency, setPotency] = useState(15);
  const [servings, setServings] = useState(1);
  const [efficiency, setEfficiency] = useState(80);

  const totalThc = (amount * 1000 * (potency / 100) * (efficiency / 100));
  const perServing = totalThc / servings;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Quantidade (gramas)</span>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-2xl border-stone-100 bg-stone-50 p-4 text-lg font-bold focus:ring-brand-500 focus:border-brand-500"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Potência (%)</span>
            <input 
              type="number" 
              value={potency} 
              onChange={e => setPotency(Number(e.target.value))}
              className="mt-1 block w-full rounded-2xl border-stone-100 bg-stone-50 p-4 text-lg font-bold focus:ring-brand-500 focus:border-brand-500"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Porções</span>
            <input 
              type="number" 
              value={servings} 
              onChange={e => setServings(Number(e.target.value))}
              className="mt-1 block w-full rounded-2xl border-stone-100 bg-stone-50 p-4 text-lg font-bold focus:ring-brand-500 focus:border-brand-500"
            />
          </label>
          <div className="pt-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Eficiência: {efficiency}%</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={efficiency} 
              onChange={e => setEfficiency(Number(e.target.value))}
              className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-brand-500 mt-2"
            />
          </div>
        </div>

        <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 text-center">
          <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">Dose por porção</p>
          <h3 className="text-4xl font-display font-bold text-brand-900">{perServing.toFixed(1)} <span className="text-xl">mg</span></h3>
          <p className="text-xs text-brand-600 mt-2 font-medium">
            {perServing < 5 ? 'Dose baixa (Iniciante)' : perServing < 15 ? 'Dose média' : 'Dose alta (Avançado)'}
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-brand-400" />
          <h4 className="font-display font-bold">Dica de Redução de Danos</h4>
        </div>
        <p className="text-sm text-stone-400 leading-relaxed">
          Comestíveis podem levar de 30 min a 2 horas para fazer efeito. Comece com pouco e espere o tempo necessário antes de redosar.
        </p>
      </div>
    </motion.div>
  );
}

function AIView() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Olá! Sou seu assistente Dose na Medida. Como posso ajudar com sua experiência hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/logs').then(res => res.json()).then(setLogs);
    fetch('/api/recipes').then(res => res.json()).then(setRecipes);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const recentLogs = logs.slice(0, 10);
      const avgRating = recentLogs.length > 0 
        ? recentLogs.reduce((acc, l) => acc + l.effect_rating, 0) / recentLogs.length 
        : 5;
      const totalThcToday = logs
        .filter(l => l.timestamp && new Date(l.timestamp).toDateString() === new Date().toDateString())
        .reduce((acc, l) => acc + (Number(l.amount || 0) * (Number(l.thc || 0) / 100) * 1000), 0);

      const context = `
        Histórico recente: ${JSON.stringify(recentLogs.map(l => ({ strain: l.strain_name, dose: l.amount, rating: l.effect_rating })))}
        Consumo de THC hoje: ${totalThcToday.toFixed(1)}mg
        Avaliação média recente: ${avgRating.toFixed(1)}/10
        Receitas disponíveis no app: ${recipes.map(r => r.name).join(', ')}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é o assistente "Dose na Medida" do app Erva na Medida. 
        Contexto do usuário: ${context}
        O usuário pergunta: ${userMsg}
        Forneça orientações personalizadas sobre dosagem, tolerância e redução de danos. 
        Você conhece todas as receitas do app e pode sugerir uma delas se fizer sentido.
        Analise se o consumo atual parece seguro com base no histórico.
        Seja conciso, profissional e use emojis.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Desculpe, tive um problema ao processar." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Erro ao conectar com a IA." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
              m.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none shadow-sm'
            }`}>
              <Markdown>{m.text}</Markdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 bg-stone-50 pt-2">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre strains, doses..."
            className="w-full bg-white border border-stone-100 rounded-2xl p-4 pr-12 text-sm focus:ring-brand-500 focus:border-brand-500 shadow-sm"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StrainsView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between px-2">
        <h4 className="font-display font-bold text-stone-800">Minha Biblioteca</h4>
        <button className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_STRAINS.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  s.type === 'Sativa' ? 'bg-orange-100 text-orange-600' : 
                  s.type === 'Indica' ? 'bg-purple-100 text-purple-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  {s.type}
                </span>
                <h5 className="text-lg font-display font-bold text-stone-900 mt-1">{s.name}</h5>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-800">{s.thc}% THC</p>
                <p className="text-[10px] text-stone-400 font-medium">{s.cbd}% CBD</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.effects.map(e => (
                <span key={e} className="text-[10px] font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                  {e}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecipesView() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [infusionFilter, setInfusionFilter] = useState('');
  const [ingredientFilter, setIngredientFilter] = useState('');

  const fetchRecipes = () => fetch('/api/recipes').then(res => res.json()).then(setRecipes);
  useEffect(() => { fetchRecipes(); }, []);

  const filteredRecipes = recipes.filter(r => {
    const name = r.name || '';
    const description = r.description || '';
    const ingredients = r.ingredients || [];

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesInfusion = infusionFilter === '' || 
                           name.toLowerCase().includes(infusionFilter.toLowerCase()) ||
                           description.toLowerCase().includes(infusionFilter.toLowerCase());

    const matchesIngredient = ingredientFilter === '' || 
                             ingredients.some((ing: any) => (ing.name || '').toLowerCase().includes(ingredientFilter.toLowerCase()));

    return matchesSearch && matchesInfusion && matchesIngredient;
  });

  const infusionTypes = ["Manteiga", "Azeite", "Óleo", "Mel", "Xarope", "Glicerina"];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between px-2">
        <h4 className="font-display font-bold text-stone-800">Receitas Colaborativas</h4>
        <button 
          onClick={() => setShowForm(true)}
          className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 px-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text"
            placeholder="Buscar receitas..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-100 text-sm focus:ring-brand-500 focus:border-brand-500 shadow-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setInfusionFilter('')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              infusionFilter === '' ? 'bg-brand-600 text-white' : 'bg-white text-stone-500 border border-stone-100'
            }`}
          >
            Todos
          </button>
          {infusionTypes.map(type => (
            <button 
              key={type}
              onClick={() => setInfusionFilter(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                infusionFilter === type ? 'bg-brand-600 text-white' : 'bg-white text-stone-500 border border-stone-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
          <input 
            type="text"
            placeholder="Filtrar por ingrediente (ex: Chocolate)"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-100 text-xs focus:ring-brand-500 focus:border-brand-500"
            value={ingredientFilter}
            onChange={e => setIngredientFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRecipes.map(r => (
          <motion.div 
            layout
            key={r.id} 
            onClick={() => setSelectedRecipe(r)}
            className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden">
              {r.image_url ? (
                <img 
                  src={r.image_url} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-stone-200" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter">
                    {r.thc_per_serving?.toFixed(1)}mg THC
                  </span>
                </div>
                {r.servings && (
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                      {r.servings} Porções
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-1">Por: {r.author || 'Anônimo'}</p>
                <h5 className="text-xl font-display font-bold text-white leading-tight">{r.name}</h5>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-4">
                {r.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                <div className="flex gap-2">
                  {(r.ingredients || []).slice(0, 2).map((ing: any, idx: number) => (
                    <span key={idx} className="text-[10px] bg-stone-50 text-stone-400 px-2 py-1 rounded-md border border-stone-100">
                      {ing.name}
                    </span>
                  ))}
                  {(r.ingredients || []).length > 2 && (
                    <span className="text-[10px] text-stone-300 py-1">
                      +{(r.ingredients || []).length - 2} mais
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-brand-600 font-bold text-xs">
                  Ver Receita <Plus className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-stone-200">
            <Utensils className="w-16 h-16 text-stone-100 mx-auto mb-4" />
            <h5 className="font-display font-bold text-stone-400">Nenhuma receita encontrada</h5>
            <p className="text-stone-300 text-xs mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold">Nova Receita</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            <RecipeForm onComplete={() => { setShowForm(false); fetchRecipes(); }} />
          </motion.div>
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-[2.5rem] overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Modal Header with Image */}
            <div className="relative h-64 shrink-0">
              {selectedRecipe.image_url ? (
                <img 
                  src={selectedRecipe.image_url} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-stone-200" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button 
                onClick={() => setSelectedRecipe(null)} 
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em] mb-2">Receita por {selectedRecipe.author || 'Anônimo'}</p>
                <h3 className="text-3xl font-display font-bold text-white leading-tight">{selectedRecipe.name}</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-50/50 p-4 rounded-3xl border border-brand-100/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-brand-600" />
                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-wider">Potência</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-brand-900">{selectedRecipe.thc_per_serving?.toFixed(1)}<span className="text-sm ml-1">mg</span></p>
                  <p className="text-[10px] text-brand-600/60 font-medium">THC por porção</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Utensils className="w-3 h-3 text-stone-400" />
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Rendimento</p>
                  </div>
                  <p className="text-2xl font-display font-bold text-stone-900">{selectedRecipe.servings}</p>
                  <p className="text-[10px] text-stone-400 font-medium">Porções totais</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-stone-600 leading-relaxed text-sm italic">
                  "{selectedRecipe.description}"
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-500 rounded-full" />
                  <h4 className="font-display font-bold text-stone-900 uppercase tracking-widest text-xs">Ingredientes</h4>
                </div>
                <div className="bg-stone-50/50 rounded-3xl p-6 border border-stone-100/50">
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ing: any, i: number) => (
                      <li key={i} className="text-sm text-stone-700 flex justify-between items-center group">
                        <span className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-200 group-hover:bg-brand-400 transition-colors" />
                          {ing.name}
                        </span>
                        <span className="font-mono font-bold text-stone-400 bg-white px-2 py-1 rounded-lg border border-stone-100 text-[10px]">
                          {ing.amount} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-500 rounded-full" />
                  <h4 className="font-display font-bold text-stone-900 uppercase tracking-widest text-xs">Modo de Preparo</h4>
                </div>
                <div className="relative pl-4 space-y-6">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-stone-100" />
                  {selectedRecipe.instructions.split('\n').filter((line: string) => line.trim()).map((step: string, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-brand-500" />
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {step.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactions */}
              <div className="pt-8 border-t border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-display font-bold text-stone-900 uppercase tracking-widest text-xs">Comunidade</h4>
                  <div className="flex items-center gap-1 text-brand-600">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">Avaliações</span>
                  </div>
                </div>
                <RecipeInteractions recipeId={selectedRecipe.id} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function RecipeForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: '',
    cannabis_amount: 1,
    cannabis_thc: 15,
    servings: 10,
    author: '',
    image_url: ''
  });

  const thcPerServing = (formData.cannabis_amount * 1000 * (formData.cannabis_thc / 100) * 0.8) / formData.servings;

  const handleSubmit = async () => {
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        thc_per_serving: thcPerServing,
        cbd_per_serving: 0
      })
    });
    onComplete();
  };

  return (
    <div className="space-y-4">
      <input 
        placeholder="Nome da Receita" 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <textarea 
        placeholder="Breve descrição..." 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100 h-20"
        value={formData.description}
        onChange={e => setFormData({...formData, description: e.target.value})}
      />
      <div className="space-y-2">
        <p className="text-xs font-bold text-stone-400 uppercase">Ingredientes</p>
        {formData.ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2">
            <input 
              placeholder="Nome" 
              className="flex-1 p-2 rounded-lg bg-stone-50 text-xs"
              value={ing.name}
              onChange={e => {
                const newIngs = [...formData.ingredients];
                newIngs[i].name = e.target.value;
                setFormData({...formData, ingredients: newIngs});
              }}
            />
            <input 
              placeholder="Qtd" 
              className="w-16 p-2 rounded-lg bg-stone-50 text-xs"
              value={ing.amount}
              onChange={e => {
                const newIngs = [...formData.ingredients];
                newIngs[i].amount = e.target.value;
                setFormData({...formData, ingredients: newIngs});
              }}
            />
            <input 
              placeholder="Unid" 
              className="w-16 p-2 rounded-lg bg-stone-50 text-xs"
              value={ing.unit}
              onChange={e => {
                const newIngs = [...formData.ingredients];
                newIngs[i].unit = e.target.value;
                setFormData({...formData, ingredients: newIngs});
              }}
            />
          </div>
        ))}
        <button 
          onClick={() => setFormData({...formData, ingredients: [...formData.ingredients, { name: '', amount: '', unit: '' }]})}
          className="text-xs font-bold text-brand-600 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Adicionar Ingrediente
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-bold text-stone-400 uppercase">Cálculo de Dosagem</p>
        <div className="grid grid-cols-3 gap-2">
          <input 
            type="number" placeholder="Erva (g)" 
            className="p-3 rounded-xl bg-stone-50 text-xs"
            value={formData.cannabis_amount}
            onChange={e => setFormData({...formData, cannabis_amount: Number(e.target.value)})}
          />
          <input 
            type="number" placeholder="THC %" 
            className="p-3 rounded-xl bg-stone-50 text-xs"
            value={formData.cannabis_thc}
            onChange={e => setFormData({...formData, cannabis_thc: Number(e.target.value)})}
          />
          <input 
            type="number" placeholder="Porções" 
            className="p-3 rounded-xl bg-stone-50 text-xs"
            value={formData.servings}
            onChange={e => setFormData({...formData, servings: Number(e.target.value)})}
          />
        </div>
        <div className="bg-brand-50 p-2 rounded-lg text-center">
          <p className="text-[10px] font-bold text-brand-600">Resultado: {thcPerServing.toFixed(1)}mg THC / porção</p>
        </div>
      </div>

      <textarea 
        placeholder="Instruções passo a passo..." 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100 h-32"
        value={formData.instructions}
        onChange={e => setFormData({...formData, instructions: e.target.value})}
      />

      <input 
        placeholder="Seu nome (autor)" 
        className="w-full p-3 rounded-xl bg-stone-50 border-stone-100"
        value={formData.author}
        onChange={e => setFormData({...formData, author: e.target.value})}
      />

      <button 
        onClick={handleSubmit}
        className="w-full bg-brand-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-brand-200"
      >
        Publicar Receita
      </button>
    </div>
  );
}

function RecipeInteractions({ recipeId }: { recipeId: number }) {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const fetchInteractions = () => {
    fetch(`/api/recipes/${recipeId}`).then(res => res.json()).then(data => setInteractions(data.interactions || []));
  };

  useEffect(() => { fetchInteractions(); }, [recipeId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await fetch(`/api/recipes/${recipeId}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: 'Usuário', rating: newRating, comment: newComment })
    });
    setNewComment('');
    fetchInteractions();
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-50/50 p-6 rounded-[2rem] border border-stone-100/50 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sua Avaliação</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setNewRating(star)}
                className="transition-transform active:scale-90"
              >
                <Heart 
                  className={`w-5 h-5 ${star <= newRating ? 'text-red-500 fill-red-500' : 'text-stone-200'}`} 
                />
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <input 
            placeholder="O que achou desta receita?" 
            className="w-full p-4 pr-14 rounded-2xl bg-white border border-stone-100 text-sm focus:ring-2 focus:ring-brand-500 transition-all"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button 
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="absolute right-2 top-2 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-stone-300 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {interactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-stone-300 italic">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          interactions.map(inter => (
            <div key={inter.id} className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 shrink-0 flex items-center justify-center text-stone-400 font-bold text-xs">
                {inter.user_name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-stone-800">{inter.user_name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className={`w-2.5 h-2.5 ${i < inter.rating ? 'text-red-500 fill-red-500' : 'text-stone-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{inter.comment}</p>
                <p className="text-[8px] text-stone-300 mt-2 uppercase font-bold tracking-widest">
                  {new Date(inter.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function HealthView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Wearable Sync */}
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-stone-900">Wearable Conectado</h4>
            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">Sincronizado há 5 min</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse" />
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
          <Heart className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-display font-bold text-stone-900">72</p>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">BPM Médio</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
          <Zap className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-display font-bold text-stone-900">85%</p>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Recuperação</p>
        </div>
      </div>

      {/* Workout Integration */}
      <div className="bg-stone-900 rounded-3xl p-6 text-white">
        <h4 className="font-display font-bold mb-4">Treino & Cannabis</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Pré-treino (Foco)</p>
              <p className="text-xs text-stone-400">Sugestão: 2mg THC + 10mg CBD (Sativa)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Pós-treino (Recuperação)</p>
              <p className="text-xs text-stone-400">Sugestão: 20mg CBD (Indica)</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
