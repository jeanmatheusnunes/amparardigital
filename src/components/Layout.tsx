import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'home', label: 'Início' },
    { path: '/cadastros', icon: 'group', label: 'Cadastros' },
    { path: '/estoque', icon: 'inventory_2', label: 'Estoque' },
    { path: '/patrimonio', icon: 'chair', label: 'Patrimônio' },
    { path: '/atendimentos', icon: 'support_agent', label: 'Atendimentos' },
    { path: '/financeiro', icon: 'account_balance', label: 'Financeiro' },
    { path: '/admin', icon: 'admin_panel_settings', label: 'Gestão Admin' },
    { path: '/configuracoes', icon: 'settings', label: 'Configurações' },
  ];

  return (
    <div className="flex h-screen bg-pink-50/30 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">Amparar</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Digital</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "material-symbols-outlined text-[22px] transition-colors",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors group">
            <span className="material-symbols-outlined text-[22px] text-red-400 group-hover:text-red-600">logout</span>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text" 
                placeholder="Buscar acolhidas, voluntários..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
              <img 
                src="https://i.pravatar.cc/150?img=32" 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-900 leading-none">Maria Silva</p>
                <p className="text-gray-500 text-xs mt-1">Administradora</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">expand_more</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-pink-50/10 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
