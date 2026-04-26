import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Início</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar Relatório
          </button>
          <Link to="/cadastros/novo" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Cadastro
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Acolhidas', value: '152', trend: '+12%', icon: 'group', color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Atendimentos Hoje', value: '16', trend: '+5%', icon: 'support_agent', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Voluntários Ativos', value: '22', trend: 'Estável', icon: 'volunteer_activism', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
          { label: 'Cestas Disponíveis', value: '15', trend: '-15%', icon: 'inventory_2', color: 'text-pink-700', bg: 'bg-pink-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 
                stat.trend.startsWith('-') ? 'bg-red-50 text-red-700' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Atendimentos Recentes</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Ver todos</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Maria da Silva {i}</p>
                    <p className="text-sm text-gray-500">Atendimento Psicológico • Sala 0{i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Hoje, 14:30</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Concluído
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">warning</span>
              Alertas do Sistema
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-red-500 text-[20px] mt-0.5">inventory_2</span>
                <div>
                  <p className="text-sm font-medium text-red-900">Estoque Baixo</p>
                  <p className="text-xs text-red-700 mt-0.5">Cestas básicas (Apenas 12 unid.)</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-amber-500 text-[20px] mt-0.5">event</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">Reunião de Voluntários</p>
                  <p className="text-xs text-amber-700 mt-0.5">Hoje às 18:00 - Sala Principal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-md p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Campanha de Inverno</h2>
            <p className="text-indigo-100 text-sm mb-4">Faltam 15 dias para o encerramento da arrecadação de agasalhos.</p>
            <div className="w-full bg-indigo-900/50 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-indigo-100">
              <span>75% da meta</span>
              <span>1.500 peças</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
