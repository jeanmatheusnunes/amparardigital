import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { api, type Transacao as TransacaoType } from '../services/api';

export function Financeiro() {
  const [activeTab, setActiveTab] = useState<'fluxo' | 'relatorios'>('fluxo');
  const [transactions, setTransactions] = useState<TransacaoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const data = await api.transacoes.listar();
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  const totalEntradas = transactions.filter(t => t.tipo === 'Receita').reduce((acc, curr) => acc + curr.valor, 0);
  const totalSaidas = transactions.filter(t => t.tipo === 'Despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoAtual = totalEntradas - totalSaidas;

  const chartData = [
    { name: 'Out', entradas: 4500, saidas: 3800 },
    { name: 'Nov', entradas: 5200, saidas: 4100 },
    { name: 'Dez', entradas: 8500, saidas: 6200 },
    { name: 'Jan', entradas: 4800, saidas: 4500 },
    { name: 'Fev', entradas: 5100, saidas: 3900 },
    { name: 'Mar', entradas: totalEntradas, saidas: totalSaidas },
  ];

  const pieData = [
    { name: 'Doações PF', value: 2500, color: '#ec4899' },
    { name: 'Doações PJ', value: 5000, color: '#db2777' },
    { name: 'Eventos', value: 1500, color: '#be185d' },
    { name: 'Outros', value: 800, color: '#9d174d' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de recursos, doações e despesas</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            Recibos
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nova Transação
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Saldo Atual</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
          <p className="text-sm text-gray-500 mt-1">Disponível em caixa e bancos</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Entradas</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
          <p className="text-sm text-gray-500 mt-1">Total de entradas (Geral)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined">trending_down</span>
            </div>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Saídas</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
          <p className="text-sm text-gray-500 mt-1">Total de saídas (Geral)</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Fluxo de Caixa Mensal</h2>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-0">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="entradas" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="saidas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Origem das Doações</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{item.name}</span>
                <span className="font-bold text-gray-900">
                  {((item.value / 9800) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('fluxo')}
              className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'fluxo' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Extrato Recente
            </button>
            <button
              onClick={() => setActiveTab('relatorios')}
              className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'relatorios' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Relatórios Anuais
            </button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Buscar transação..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando dados...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                  <th className="px-6 py-4 font-semibold">Data</th>
                  <th className="px-6 py-4 font-semibold">Descrição</th>
                  <th className="px-6 py-4 font-semibold">Categoria</th>
                  <th className="px-6 py-4 font-semibold">Valor</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{new Date(t.data || '').toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          t.tipo === 'Receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {t.tipo === 'Receita' ? 'add' : 'remove'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{t.descricao}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{t.categoria}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        t.tipo === 'Receita' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {t.tipo === 'Receita' ? '+' : '-'} {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'Concluído' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">Mostrando {transactions.length} transações</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">Anterior</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
