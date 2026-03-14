import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, TrendingUp, TrendingDown, Wallet, FileText, Users, LogOut, Plus, Search, Download, Edit2, Trash2, Menu, X, ArrowUpRight, ArrowDownRight, Shield, Bell, Lock, Mail, BarChart2, Activity, CheckCircle, AlertCircle } from 'lucide-react';

const GHS = n => `GH₵${Number(n).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '';
const uid = () => `TXN${Date.now()}${Math.floor(Math.random()*1000)}`;
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];

const INCOME_CATS  = ['IGF','Donations','Welfare Contributions','Fundraising','Event Income','Special Offering'];
const EXPENSE_CATS = ['Event','Welfare','Transport','Media','Equipment','Miscellaneous'];
const IGF_SOURCES  = ['Weekly Dues','Product Sales','Catering Services','Photography','Event Tickets','Raffle Draw','Merchandise'];

const ROLE_COLORS = {
  Admin:'bg-purple-100 text-purple-700 border-purple-200',
  'Financial Secretary':'bg-blue-100 text-blue-700 border-blue-200',
  President:'bg-emerald-100 text-emerald-700 border-emerald-200',
  Auditor:'bg-amber-100 text-amber-700 border-amber-200',
  Viewer:'bg-gray-100 text-gray-500 border-gray-200',
};

const PERMS = {
  Admin:['view','add','edit','delete','approve','users','reports'],
  'Financial Secretary':['view','add','edit','reports'],
  President:['view','approve','reports'],
  Auditor:['view','reports'],
  Viewer:['view'],
};
const can = (role,action) => PERMS[role]?.includes(action);

const USERS_DB = [
  {id:1,name:'Kwame Asante',     email:'admin@goodshepherd.org',     role:'Admin',               password:'admin123',  joined:'2024-01-01',active:true},
  {id:2,name:'John Mensah',      email:'finsec@goodshepherd.org',    role:'Financial Secretary', password:'finsec123', joined:'2024-01-05',active:true},
  {id:3,name:'Mary Boateng',     email:'president@goodshepherd.org', role:'President',           password:'pres123',   joined:'2024-01-03',active:true},
  {id:4,name:'Peter Owusu',      email:'auditor@goodshepherd.org',   role:'Auditor',             password:'audit123',  joined:'2024-01-10',active:true},
  {id:5,name:'Grace Adjei',      email:'viewer@goodshepherd.org',    role:'Viewer',              password:'view123',   joined:'2024-02-01',active:true},
];

const SEED = (()=>{
  const txns = [];
  const inc = [
    ['2025-01-05','Donations',1500,'Parish Members','January donations','John Mensah'],
    ['2025-01-14','IGF',800,'Weekly Dues','January weekly dues','John Mensah'],
    ['2025-01-27','Welfare Contributions',300,'Members','January welfare','John Mensah'],
    ['2025-02-08','Fundraising',3200,'Valentine Dinner','Valentine fundraiser event','John Mensah'],
    ['2025-02-16','IGF',750,'Product Sales','Merchandise sales Feb','John Mensah'],
    ['2025-02-24','Donations',500,'Anonymous','Anonymous donation','Mary Boateng'],
    ['2025-03-09','Special Offering',2100,'Easter Collection','Easter special offering','Mary Boateng'],
    ['2025-03-19','IGF',1200,'Catering Services','Parish event catering','John Mensah'],
    ['2025-03-29','Event Income',900,'Youth Night','Youth night proceeds','John Mensah'],
    ['2025-04-06','Event Income',1800,'Youth Concert','Annual youth concert','John Mensah'],
    ['2025-04-21','Welfare Contributions',600,'Members','Q2 welfare contribution','John Mensah'],
    ['2025-05-04','Donations',900,'Anonymous','Anonymous donation May','Mary Boateng'],
    ['2025-05-15','IGF',980,'Photography','Event photography income','John Mensah'],
    ['2025-05-29','Fundraising',1500,'Bake Sale','Bake sale proceeds','John Mensah'],
    ['2025-06-07','Fundraising',4500,'Charity Walk','Annual walkathon','John Mensah'],
    ['2025-06-21','Event Income',1200,'Youth Dinner','Mid-year dinner proceeds','John Mensah'],
    ['2025-06-29','IGF',650,'Event Tickets','Concert ticket sales','John Mensah'],
    ['2025-07-05','Special Offering',800,'Special Collection','July special offering','Mary Boateng'],
    ['2025-07-20','IGF',720,'Weekly Dues','July weekly dues','John Mensah'],
    ['2025-08-03','Donations',1100,'Parish Members','August donations','John Mensah'],
    ['2025-08-18','IGF',540,'Raffle Draw','August raffle proceeds','John Mensah'],
    ['2025-09-02','Fundraising',2800,'Harvest Dinner','Harvest celebration dinner','John Mensah'],
    ['2025-09-17','IGF',880,'Merchandise','Youth merch sales','John Mensah'],
    ['2025-10-05','Special Offering',1600,'Anniversary Collection','Anniversary offering','Mary Boateng'],
  ];
  const exp = [
    ['2025-01-11','Transport',350,'Retreat transportation','Mary Boateng','John Mensah'],
    ['2025-01-22','Miscellaneous',200,'Office supplies','Mary Boateng','John Mensah'],
    ['2025-02-11','Event',1500,'Valentine dinner expenses','Mary Boateng','John Mensah'],
    ['2025-02-19','Media',600,'Flyers and banners','Mary Boateng','John Mensah'],
    ['2025-03-06','Welfare',800,'Member hospital support','Mary Boateng','John Mensah'],
    ['2025-03-16','Equipment',1200,'Sound equipment rental','Mary Boateng','John Mensah'],
    ['2025-04-09','Event',900,'Concert setup costs','Mary Boateng','John Mensah'],
    ['2025-04-23','Transport',250,'Members transport support','Mary Boateng','John Mensah'],
    ['2025-05-09','Miscellaneous',150,'Stationery items','Mary Boateng','John Mensah'],
    ['2025-05-21','Welfare',500,'Bereaved member support','Mary Boateng','John Mensah'],
    ['2025-06-11','Event',2000,'Mid-year dinner costs','Mary Boateng','John Mensah'],
    ['2025-06-26','Media',800,'Social media promotion','Mary Boateng','John Mensah'],
    ['2025-07-14','Equipment',450,'Projector rental','Mary Boateng','John Mensah'],
    ['2025-07-30','Transport',180,'Funeral support transport','Mary Boateng','John Mensah'],
    ['2025-08-06','Welfare',650,'Medical support - member','Mary Boateng','John Mensah'],
    ['2025-08-22','Event',1100,'Back-to-school party','Mary Boateng','John Mensah'],
    ['2025-09-10','Media',550,'Harvest dinner promotion','Mary Boateng','John Mensah'],
    ['2025-09-25','Equipment',780,'Stage setup rental','Mary Boateng','John Mensah'],
    ['2025-10-08','Event',1300,'Anniversary event costs','Mary Boateng','John Mensah'],
    ['2025-10-19','Welfare',420,'Emergency welfare fund','Mary Boateng','John Mensah'],
  ];
  inc.forEach(([date,cat,amount,source,desc,by],i)=>txns.push({
    id:`TXN${String(i+1).padStart(5,'0')}`,type:'income',category:cat,amount,source,
    description:desc,receivedBy:by,date,timestamp:new Date(date).toISOString(),editHistory:[],
  }));
  exp.forEach(([date,cat,amount,desc,approvedBy,paidBy],i)=>txns.push({
    id:`TXN${String(inc.length+i+1).padStart(5,'0')}`,type:'expense',category:cat,amount,
    description:desc,approvedBy,paidBy,date,timestamp:new Date(date).toISOString(),receipt:null,editHistory:[],
  }));
  return txns.sort((a,b)=>new Date(a.date)-new Date(b.date));
})();

const Card = ({children,className=''})=>(
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);
const Badge = ({label,className=''})=>(
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>{label}</span>
);
const Btn = ({children,variant='primary',size='md',className='',...p})=>{
  const v={primary:'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',secondary:'bg-gray-100 hover:bg-gray-200 text-gray-700',danger:'bg-red-50 hover:bg-red-100 text-red-600',outline:'border border-gray-200 hover:bg-gray-50 text-gray-700',success:'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'};
  const s={sm:'px-3 py-1.5 text-xs',md:'px-4 py-2 text-sm',lg:'px-6 py-2.5 text-base'};
  return <button className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>;
};
const FInput = ({label,...p})=>(
  <div className="space-y-1.5">
    {label&&<label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors" {...p}/>
  </div>
);
const FSelect = ({label,children,...p})=>(
  <div className="space-y-1.5">
    {label&&<label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors" {...p}>{children}</select>
  </div>
);

const Modal = ({isOpen,onClose,title,children,size='md'})=>{
  const w={sm:'max-w-sm',md:'max-w-lg',lg:'max-w-2xl',xl:'max-w-4xl'};
  return(
    <AnimatePresence>
      {isOpen&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
            transition={{type:'spring',damping:25,stiffness:300}}
            className={`bg-white rounded-2xl shadow-2xl w-full ${w[size]} max-h-screen overflow-y-auto`} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"><X size={16} className="text-gray-500"/></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatCard = ({title,value,sub,icon:Icon,iconBg,trend})=>(
  <motion.div whileHover={{y:-2}} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-xl font-bold text-gray-900 mt-1.5 leading-tight">{value}</p>
        {sub&&<p className={`text-xs mt-1 ${trend==='up'?'text-emerald-600':trend==='down'?'text-red-500':'text-gray-400'}`}>{sub}</p>}
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}><Icon size={18}/></div>
    </div>
  </motion.div>
);

const exportCSV = (rows,filename) => {
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=filename; a.click();
};

const LoginPage = ({onLogin})=>{
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);

  const submit = e=>{
    e.preventDefault(); setLoading(true); setErr('');
    setTimeout(()=>{
      const u=USERS_DB.find(u=>u.email===email&&u.password===pass);
      u ? onLogin(u) : (setErr('Invalid credentials. Please try again.'), setLoading(false));
    },700);
  };

  return(
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div initial={{y:24,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.5}} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Good Shepherd</h1>
          <p className="text-indigo-300 text-sm mt-1">Parish Youth Council · Finance System</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-white font-semibold mb-6">Sign in to continue</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-indigo-300"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required
                  className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-indigo-300"/>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required
                  className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
              </div>
            </div>
            {err&&(
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} className="text-red-300 shrink-0"/><p className="text-red-300 text-xs">{err}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-all mt-1 disabled:opacity-60 text-sm">
              {loading?'Signing in…':'Sign In →'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-indigo-300 text-xs text-center font-medium mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {USERS_DB.map(u=>(
                <button key={u.id} onClick={()=>{setEmail(u.email);setPass(u.password);}}
                  className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 transition-all">
                  <p className="text-white text-xs font-semibold truncate">{u.name.split(' ')[0]}</p>
                  <p className="text-indigo-300 text-xs truncate">{u.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({transactions,user})=>{
  const income   = transactions.filter(t=>t.type==='income');
  const expenses = transactions.filter(t=>t.type==='expense');
  const igf      = income.filter(t=>t.category==='IGF');
  const totalIncome  = income.reduce((s,t)=>s+t.amount,0);
  const totalExpense = expenses.reduce((s,t)=>s+t.amount,0);
  const totalIGF     = igf.reduce((s,t)=>s+t.amount,0);
  const balance      = totalIncome-totalExpense;
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = months.map((m,i)=>{
    const mo=String(i+1).padStart(2,'0');
    const inc=income.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0);
    const exp=expenses.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0);
    const ig=igf.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0);
    return{month:m,income:inc,expenses:exp,igf:ig,net:inc-exp};
  });
  const expByCat = EXPENSE_CATS.map(c=>({name:c,value:expenses.filter(t=>t.category===c).reduce((s,t)=>s+t.amount,0)})).filter(c=>c.value>0);
  const recent   = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7);
  const largeExp = expenses.filter(t=>t.amount>=1000).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
  return(
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Financial overview — Good Shepherd Parish Youth Council</p>
      </div>
      {largeExp.length>0&&(
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Bell size={16} className="text-amber-600 mt-0.5 shrink-0"/>
          <div>
            <p className="text-sm font-semibold text-amber-800">Large Expense Alert</p>
            <p className="text-xs text-amber-600 mt-0.5">{largeExp.map(t=>`${t.description} (${GHS(t.amount)})`).join(' · ')}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Balance" value={GHS(balance)} sub={balance>=0?'Healthy surplus':'Action needed'} icon={Wallet} iconBg="bg-indigo-50 text-indigo-600" trend={balance>=0?'up':'down'}/>
        <StatCard title="Total Income"    value={GHS(totalIncome)}  sub={`${income.length} entries`}   icon={TrendingUp}   iconBg="bg-emerald-50 text-emerald-600" trend="up"/>
        <StatCard title="Total Expenses"  value={GHS(totalExpense)} sub={`${expenses.length} entries`} icon={TrendingDown}  iconBg="bg-red-50 text-red-500"         trend="down"/>
        <StatCard title="Total IGF"       value={GHS(totalIGF)}     sub={`${igf.length} entries`}      icon={BarChart2}    iconBg="bg-purple-50 text-purple-600"    trend="up"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Income vs Expenses — 2025</h3>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthly} barSize={14} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₵${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>GHS(v)} contentStyle={{borderRadius:12,border:'1px solid #e5e7eb',fontSize:12}}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="income" fill="#6366f1" radius={[4,4,0,0]} name="Income"/>
              <Bar dataKey="expenses" fill="#f87171" radius={[4,4,0,0]} name="Expenses"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={expByCat} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {expByCat.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={v=>GHS(v)} contentStyle={{borderRadius:12,border:'1px solid #e5e7eb',fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {expByCat.map((item,i)=>(
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:COLORS[i%COLORS.length]}}/>
                  <span className="text-xs text-gray-500">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{GHS(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">IGF Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="igfG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₵${v}`}/>
              <Tooltip formatter={v=>GHS(v)} contentStyle={{borderRadius:12,border:'1px solid #e5e7eb',fontSize:12}}/>
              <Area type="monotone" dataKey="igf" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#igfG)" name="IGF"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <span className="text-xs text-gray-400">{recent.length} records</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto max-h-44">
            {recent.map(t=>(
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.type==='income'?'bg-emerald-50':'bg-red-50'}`}>
                    {t.type==='income'?<ArrowUpRight size={13} className="text-emerald-600"/>:<ArrowDownRight size={13} className="text-red-500"/>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.category} · {fmtDate(t.date)}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold shrink-0 ${t.type==='income'?'text-emerald-600':'text-red-500'}`}>
                  {t.type==='income'?'+':'-'}{GHS(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const IncomePage = ({transactions,onAdd,onEdit,onDelete,user})=>{
  const [modal,setModal]=useState(false);
  const [editRec,setEditRec]=useState(null);
  const [search,setSearch]=useState('');
  const [cat,setCat]=useState('');
  const blank={amount:'',category:'Donations',source:'',description:'',receivedBy:user.name,date:new Date().toISOString().slice(0,10)};
  const [form,setForm]=useState(blank);
  const income=transactions.filter(t=>t.type==='income');
  const filtered=income.filter(t=>{
    const s=search.toLowerCase();
    return(!s||[t.description,t.source,t.category].some(v=>v?.toLowerCase().includes(s)))&&(!cat||t.category===cat);
  });
  const total=income.reduce((s,t)=>s+t.amount,0);
  const submit=e=>{
    e.preventDefault();
    if(editRec){onEdit({...editRec,...form,amount:parseFloat(form.amount)});}
    else{onAdd({id:uid(),type:'income',...form,amount:parseFloat(form.amount),timestamp:new Date().toISOString(),editHistory:[]});}
    setModal(false);setEditRec(null);setForm(blank);
  };
  const openEdit=t=>{setEditRec(t);setForm({amount:t.amount,category:t.category,source:t.source,description:t.description,receivedBy:t.receivedBy,date:t.date});setModal(true);};
  return(
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Records</h1>
          <p className="text-gray-400 text-sm">Total: <span className="text-emerald-600 font-semibold">{GHS(total)}</span> · {income.length} records</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm" onClick={()=>exportCSV([['ID','Date','Category','Source','Description','Amount','Received By'],...filtered.map(t=>[t.id,t.date,t.category,t.source,t.description,t.amount,t.receivedBy])],'income.csv')}><Download size={14}/>CSV</Btn>
          {can(user.role,'add')&&<Btn onClick={()=>{setEditRec(null);setForm(blank);setModal(true);}}><Plus size={15}/>Record Income</Btn>}
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-3 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search income records…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"/>
          </div>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {INCOME_CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['ID','Date','Category','Source','Description','Amount','Received By',''].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length===0?(<tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">No income records found</td></tr>)
              :filtered.map(t=>(
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(t.date)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">{t.category}</span></td>
                  <td className="px-4 py-3 text-gray-700">{t.source}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap">{GHS(t.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{t.receivedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {can(user.role,'edit')&&<button onClick={()=>openEdit(t)} className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={13} className="text-indigo-400"/></button>}
                      {can(user.role,'delete')&&<button onClick={()=>onDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} className="text-red-400"/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={modal} onClose={()=>setModal(false)} title={editRec?'Edit Income Record':'Record New Income'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FInput label="Amount (GH₵)" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/>
            <FSelect label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {INCOME_CATS.map(c=><option key={c}>{c}</option>)}
            </FSelect>
          </div>
          <FInput label="Source" value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="e.g. Parish Members" required/>
          <FInput label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Brief description" required/>
          <div className="grid grid-cols-2 gap-4">
            <FInput label="Received By" value={form.receivedBy} onChange={e=>setForm({...form,receivedBy:e.target.value})} required/>
            <FInput label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/>
          </div>
          <div className="flex gap-3 pt-1">
            <Btn type="submit" className="flex-1 justify-center">{editRec?'Update Record':'Save Income'}</Btn>
            <Btn type="button" variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const ExpensePage = ({transactions,onAdd,onEdit,onDelete,user})=>{
  const [modal,setModal]=useState(false);
  const [editRec,setEditRec]=useState(null);
  const [search,setSearch]=useState('');
  const [cat,setCat]=useState('');
  const blank={amount:'',category:'Event',description:'',approvedBy:'',paidBy:user.name,date:new Date().toISOString().slice(0,10)};
  const [form,setForm]=useState(blank);
  const expenses=transactions.filter(t=>t.type==='expense');
  const filtered=expenses.filter(t=>{
    const s=search.toLowerCase();
    return(!s||[t.description,t.category,t.approvedBy].some(v=>v?.toLowerCase().includes(s)))&&(!cat||t.category===cat);
  });
  const total=expenses.reduce((s,t)=>s+t.amount,0);
  const submit=e=>{
    e.preventDefault();
    if(editRec){onEdit({...editRec,...form,amount:parseFloat(form.amount)});}
    else{onAdd({id:uid(),type:'expense',...form,amount:parseFloat(form.amount),timestamp:new Date().toISOString(),receipt:null,editHistory:[]});}
    setModal(false);setEditRec(null);setForm(blank);
  };
  const openEdit=t=>{setEditRec(t);setForm({amount:t.amount,category:t.category,description:t.description,approvedBy:t.approvedBy,paidBy:t.paidBy,date:t.date});setModal(true);};
  return(
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Records</h1>
          <p className="text-gray-400 text-sm">Total: <span className="text-red-500 font-semibold">{GHS(total)}</span> · {expenses.length} records</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm" onClick={()=>exportCSV([['ID','Date','Category','Description','Amount','Approved By','Paid By'],...filtered.map(t=>[t.id,t.date,t.category,t.description,t.amount,t.approvedBy,t.paidBy])],'expenses.csv')}><Download size={14}/>CSV</Btn>
          {can(user.role,'add')&&<Btn onClick={()=>{setEditRec(null);setForm(blank);setModal(true);}}><Plus size={15}/>Record Expense</Btn>}
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-3 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expense records…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"/>
          </div>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['ID','Date','Category','Description','Amount','Approved By','Paid By',''].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length===0?(<tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No expense records found</td></tr>)
              :filtered.map(t=>(
                <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${t.amount>=1000?'bg-amber-50/30':''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(t.date)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium">{t.category}</span></td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description}</td>
                  <td className="px-4 py-3 font-semibold text-red-500 whitespace-nowrap">
                    {t.amount>=1000&&<AlertCircle size={11} className="inline mr-1 text-amber-500"/>}{GHS(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.approvedBy}</td>
                  <td className="px-4 py-3 text-gray-500">{t.paidBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {can(user.role,'edit')&&<button onClick={()=>openEdit(t)} className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={13} className="text-indigo-400"/></button>}
                      {can(user.role,'delete')&&<button onClick={()=>onDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} className="text-red-400"/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={modal} onClose={()=>setModal(false)} title={editRec?'Edit Expense Record':'Record New Expense'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FInput label="Amount (GH₵)" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/>
            <FSelect label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
            </FSelect>
          </div>
          <FInput label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What was this for?" required/>
          <div className="grid grid-cols-2 gap-4">
            <FInput label="Approved By" value={form.approvedBy} onChange={e=>setForm({...form,approvedBy:e.target.value})} required/>
            <FInput label="Paid By" value={form.paidBy} onChange={e=>setForm({...form,paidBy:e.target.value})} required/>
          </div>
          <FInput label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/>
          <div className="flex gap-3 pt-1">
            <Btn type="submit" className="flex-1 justify-center">{editRec?'Update Record':'Save Expense'}</Btn>
            <Btn type="button" variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const IGFPage = ({transactions,onAdd,onDelete,user})=>{
  const [modal,setModal]=useState(false);
  const blank={amount:'',source:'Weekly Dues',eventName:'',description:'',date:new Date().toISOString().slice(0,10)};
  const [form,setForm]=useState(blank);
  const igf=transactions.filter(t=>t.type==='income'&&t.category==='IGF');
  const total=igf.reduce((s,t)=>s+t.amount,0);
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly=months.map((m,i)=>{const mo=String(i+1).padStart(2,'0');return{month:m,amount:igf.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0)};});
  const bySrc=IGF_SOURCES.map(s=>({name:s,value:igf.filter(t=>t.source===s).reduce((sum,t)=>sum+t.amount,0)})).filter(s=>s.value>0).sort((a,b)=>b.value-a.value);
  const submit=e=>{
    e.preventDefault();
    onAdd({id:uid(),type:'income',category:'IGF',amount:parseFloat(form.amount),source:form.source,description:form.description||form.eventName||form.source,receivedBy:user.name,date:form.date,timestamp:new Date().toISOString(),editHistory:[]});
    setModal(false);setForm(blank);
  };
  return(
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IGF Tracker</h1>
          <p className="text-gray-400 text-sm">Total: <span className="text-purple-600 font-semibold">{GHS(total)}</span> · {igf.length} records</p>
        </div>
        {can(user.role,'add')&&<Btn onClick={()=>setModal(true)}><Plus size={15}/>Record IGF</Btn>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly IGF Collections</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₵${v}`}/>
              <Tooltip formatter={v=>GHS(v)} contentStyle={{borderRadius:12,border:'1px solid #e5e7eb',fontSize:12}}/>
              <Bar dataKey="amount" fill="#8b5cf6" radius={[4,4,0,0]} name="IGF Amount"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top IGF Sources</h3>
          {bySrc.length===0?<p className="text-gray-400 text-sm text-center py-10">No IGF data yet</p>:(
            <div className="space-y-4">
              {bySrc.slice(0,5).map((s,i)=>(
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{s.name}</span>
                    <span className="text-purple-600 font-semibold">{GHS(s.value)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${(s.value/bySrc[0].value)*100}%`}}
                      transition={{delay:i*0.08,duration:.6,ease:'easeOut'}}
                      className="h-full rounded-full" style={{background:COLORS[i%COLORS.length]}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['ID','Date','Source','Description','Amount','Recorded By',''].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {igf.length===0?(<tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No IGF records yet</td></tr>)
              :igf.map(t=>(
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(t.date)}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{t.source}</span></td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description}</td>
                  <td className="px-4 py-3 font-semibold text-purple-600">{GHS(t.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{t.receivedBy}</td>
                  <td className="px-4 py-3">
                    {can(user.role,'delete')&&<button onClick={()=>onDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} className="text-red-400"/></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={modal} onClose={()=>setModal(false)} title="Record IGF">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FInput label="Amount (GH₵)" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/>
            <FSelect label="IGF Source" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
              {IGF_SOURCES.map(s=><option key={s}>{s}</option>)}
            </FSelect>
          </div>
          <FInput label="Event Name (optional)" value={form.eventName} onChange={e=>setForm({...form,eventName:e.target.value})} placeholder="e.g. Youth Concert 2025"/>
          <FInput label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Additional notes"/>
          <FInput label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/>
          <div className="flex gap-3 pt-1">
            <Btn type="submit" className="flex-1 justify-center">Save IGF Record</Btn>
            <Btn type="button" variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const TransactionsPage = ({transactions})=>{
  const [search,setSearch]=useState('');
  const [type,setType]=useState('');
  const [cat,setCat]=useState('');
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');
  const filtered=[...transactions].filter(t=>{
    const s=search.toLowerCase();
    return(!s||[t.id,t.description,t.category].some(v=>v?.toLowerCase().includes(s)))
      &&(!type||t.type===type)&&(!cat||t.category===cat)
      &&(!from||t.date>=from)&&(!to||t.date<=to);
  }).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const totalInc=filtered.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExp=filtered.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  return(
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
          <p className="text-gray-400 text-sm">{filtered.length} of {transactions.length} records shown</p>
        </div>
        <Btn variant="outline" size="sm" onClick={()=>exportCSV([['Transaction ID','Type','Category','Description','Amount','Date','Entered By'],...filtered.map(t=>[t.id,t.type,t.category,t.description,t.amount,t.date,t.receivedBy||t.paidBy||''])],'ledger.csv')}>
          <Download size={14}/>Export CSV
        </Btn>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-xs text-gray-400 uppercase tracking-wide">Filtered Income</p><p className="text-lg font-bold text-emerald-600 mt-1">{GHS(totalInc)}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-400 uppercase tracking-wide">Filtered Expenses</p><p className="text-lg font-bold text-red-500 mt-1">{GHS(totalExp)}</p></Card>
        <Card className="p-4 col-span-2 lg:col-span-1"><p className="text-xs text-gray-400 uppercase tracking-wide">Net</p><p className={`text-lg font-bold mt-1 ${totalInc-totalExp>=0?'text-indigo-600':'text-red-500'}`}>{GHS(totalInc-totalExp)}</p></Card>
      </div>
      <Card className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="col-span-2 lg:col-span-1 relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"/>
          </div>
          <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {[...INCOME_CATS,...EXPENSE_CATS].map(c=><option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="flex-1 px-2 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="flex-1 px-2 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['Transaction ID','Date','Type','Category','Description','Amount','Entered By'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length===0?(<tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No transactions match your filters</td></tr>)
              :filtered.map(t=>(
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${t.type==='income'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-600'}`}>
                      {t.type==='income'?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}{t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.category}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description}</td>
                  <td className={`px-4 py-3 font-semibold whitespace-nowrap ${t.type==='income'?'text-emerald-600':'text-red-500'}`}>
                    {t.type==='income'?'+':'-'}{GHS(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.receivedBy||t.paidBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const ReportsPage = ({transactions})=>{
  const income   = transactions.filter(t=>t.type==='income');
  const expenses = transactions.filter(t=>t.type==='expense');
  const totalInc = income.reduce((s,t)=>s+t.amount,0);
  const totalExp = expenses.reduce((s,t)=>s+t.amount,0);
  const totalIGF = income.filter(t=>t.category==='IGF').reduce((s,t)=>s+t.amount,0);
  const bal      = totalInc-totalExp;
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly=months.map((m,i)=>{
    const mo=String(i+1).padStart(2,'0');
    const inc=income.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0);
    const exp=expenses.filter(t=>t.date?.startsWith(`2025-${mo}`)).reduce((s,t)=>s+t.amount,0);
    return{month:m,income:inc,expenses:exp,net:inc-exp};
  });
  const incByCat=INCOME_CATS.map(c=>({name:c,value:income.filter(t=>t.category===c).reduce((s,t)=>s+t.amount,0),count:income.filter(t=>t.category===c).length})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
  const expByCat=EXPENSE_CATS.map(c=>({name:c,value:expenses.filter(t=>t.category===c).reduce((s,t)=>s+t.amount,0),count:expenses.filter(t=>t.category===c).length})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
  return(
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-400 text-sm">2025 Annual Summary — Good Shepherd Parish Youth Council</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Total Income',  val:GHS(totalInc), color:'text-emerald-600', bg:'bg-emerald-50'},
          {label:'Total Expenses', val:GHS(totalExp), color:'text-red-500',    bg:'bg-red-50'},
          {label:'Net Balance',   val:GHS(bal),       color:bal>=0?'text-indigo-600':'text-red-500', bg:'bg-indigo-50'},
          {label:'Total IGF',     val:GHS(totalIGF),  color:'text-purple-600', bg:'bg-purple-50'},
        ].map(s=>(
          <Card key={s.label} className={`p-5 ${s.bg}`}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Monthly Financial Summary 2025</h3>
          <Btn variant="outline" size="sm" onClick={()=>exportCSV([['Month','Income','Expenses','Net'],...monthly.map(m=>[m.month,m.income,m.expenses,m.net])],'monthly-report.csv')}>
            <Download size={14}/>Export
          </Btn>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthly} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₵${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={v=>GHS(v)} contentStyle={{borderRadius:12,border:'1px solid #e5e7eb',fontSize:12}}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12}}/>
            <Bar dataKey="income"   fill="#10b981" radius={[4,4,0,0]} name="Income"/>
            <Bar dataKey="expenses" fill="#f87171" radius={[4,4,0,0]} name="Expenses"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Income by Category</h3>
            <Btn variant="outline" size="sm" onClick={()=>exportCSV([['Category','Total','Transactions'],...incByCat.map(i=>[i.name,i.value,i.count])],'income-breakdown.csv')}>
              <Download size={14}/>Export
            </Btn>
          </div>
          <div className="space-y-2.5">
            {incByCat.map((item,i)=>(
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-gray-700"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:COLORS[i%COLORS.length]}}/>{item.name} <span className="text-gray-400 text-xs">({item.count})</span></span>
                  <span className="font-semibold text-emerald-600">{GHS(item.value)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full rounded-full" style={{width:`${(item.value/incByCat[0].value)*100}%`,background:COLORS[i%COLORS.length]}}/></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Expenses by Category</h3>
            <Btn variant="outline" size="sm" onClick={()=>exportCSV([['Category','Total','Transactions'],...expByCat.map(i=>[i.name,i.value,i.count])],'expense-breakdown.csv')}>
              <Download size={14}/>Export
            </Btn>
          </div>
          <div className="space-y-2.5">
            {expByCat.map((item,i)=>(
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-gray-700"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:COLORS[i%COLORS.length]}}/>{item.name} <span className="text-gray-400 text-xs">({item.count})</span></span>
                  <span className="font-semibold text-red-500">{GHS(item.value)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full rounded-full" style={{width:`${(item.value/expByCat[0].value)*100}%`,background:COLORS[i%COLORS.length]}}/></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const UsersPage = ({users,currentUser,onAddUser,onToggleUser})=>{
  const [modal,setModal]=useState(false);
  const blank={name:'',email:'',role:'Viewer',password:''};
  const [form,setForm]=useState(blank);
  if(!can(currentUser.role,'users')) return(
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center"><Shield size={28} className="text-gray-400"/></div>
      <h3 className="font-semibold text-gray-700">Access Restricted</h3>
      <p className="text-sm text-gray-400 text-center max-w-sm">You need Admin privileges to manage users.</p>
    </div>
  );
  const submit=e=>{
    e.preventDefault();
    onAddUser({id:Date.now(),...form,joined:new Date().toISOString().slice(0,10),active:true});
    setModal(false);setForm(blank);
  };
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-400 text-sm">{users.length} registered users</p>
        </div>
        <Btn onClick={()=>setModal(true)}><Plus size={15}/>Add User</Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u=>(
          <motion.div key={u.id} whileHover={{y:-2}}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{u.email}</p>
                  </div>
                </div>
                {currentUser.id!==u.id&&(
                  <button onClick={()=>onToggleUser(u.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${u.active?'bg-emerald-50 text-emerald-600 hover:bg-emerald-100':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {u.active?'Active':'Inactive'}
                  </button>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <Badge label={u.role} className={ROLE_COLORS[u.role]||'bg-gray-100 text-gray-500 border-gray-200'}/>
                <span className="text-xs text-gray-400">Since {fmtDate(u.joined)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              {['Role','View','Add/Edit','Delete','Approve','Users','Reports'].map(h=>(
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {Object.entries(PERMS).map(([role,perms])=>(
                <tr key={role} className="border-b border-gray-50">
                  <td className="px-3 py-2.5"><Badge label={role} className={ROLE_COLORS[role]||'bg-gray-100 text-gray-500 border-gray-200'}/></td>
                  {['view','add','delete','approve','users','reports'].map(p=>(
                    <td key={p} className="px-3 py-2.5">
                      {perms.includes(p)||perms.includes('edit')&&p==='add'
                        ?<CheckCircle size={15} className="text-emerald-500"/>
                        :<X size={15} className="text-gray-300"/>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={modal} onClose={()=>setModal(false)} title="Add New User">
        <form onSubmit={submit} className="space-y-4">
          <FInput label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" required/>
          <FInput label="Email Address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com" required/>
          <FSelect label="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            {Object.keys(ROLE_COLORS).map(r=><option key={r}>{r}</option>)}
          </FSelect>
          <FInput label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Set a secure password" required/>
          <div className="flex gap-3 pt-1">
            <Btn type="submit" className="flex-1 justify-center">Create User</Btn>
            <Btn type="button" variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const NAV = [
  {id:'dashboard',   label:'Dashboard',    icon:LayoutDashboard},
  {id:'income',      label:'Income',       icon:TrendingUp},
  {id:'expenses',    label:'Expenses',     icon:TrendingDown},
  {id:'igf',         label:'IGF Tracker',  icon:BarChart2},
  {id:'transactions',label:'Transactions', icon:FileText},
  {id:'reports',     label:'Reports',      icon:Activity},
  {id:'users',       label:'Users',        icon:Users},
];

export default function App(){
  const [user,    setUser]    = useState(null);
  const [page,    setPage]    = useState('dashboard');
  const [txns,    setTxns]    = useState(SEED);
  const [users,   setUsers]   = useState(USERS_DB);
  const [sidebar, setSidebar] = useState(false);

  if(!user) return <LoginPage onLogin={u=>{ setUser(u); setPage('dashboard'); }}/>;

  const add  = t => setTxns(p=>[...p,t]);
  const edit = t => setTxns(p=>p.map(x=>x.id===t.id?t:x));
  const del  = id => setTxns(p=>p.filter(t=>t.id!==id));
  const props = {transactions:txns,user,onAdd:add,onEdit:edit,onDelete:del};

  const pages = {
    dashboard:    <Dashboard    {...props}/>,
    income:       <IncomePage   {...props}/>,
    expenses:     <ExpensePage  {...props}/>,
    igf:          <IGFPage      {...props}/>,
    transactions: <TransactionsPage transactions={txns} user={user}/>,
    reports:      <ReportsPage  transactions={txns}/>,
    users:        <UsersPage    users={users} currentUser={user}
                    onAddUser={u=>setUsers(p=>[...p,u])}
                    onToggleUser={id=>setUsers(p=>p.map(u=>u.id===id?{...u,active:!u.active}:u))}/>,
  };

  return(
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebar&&<div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={()=>setSidebar(false)}/>}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none transform transition-transform duration-300 ${sidebar?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={17} className="text-white"/>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">Good Shepherd</p>
              <p className="text-xs text-gray-400">Youth Finance System</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>{setPage(id);setSidebar(false);}}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${page===id?'bg-indigo-600 text-white shadow-sm':'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <Icon size={17}/>{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
              <Badge label={user.role} className={`${ROLE_COLORS[user.role]} text-xs`}/>
            </div>
          </div>
          <button onClick={()=>{setUser(null);setPage('dashboard');}}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors font-medium">
            <LogOut size={14}/>Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={()=>setSidebar(true)} className="p-1.5 hover:bg-gray-100 rounded-xl"><Menu size={20} className="text-gray-600"/></button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center"><Shield size={13} className="text-white"/></div>
            <span className="font-semibold text-gray-900 text-sm">{NAV.find(n=>n.id===page)?.label}</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.18}}>
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
