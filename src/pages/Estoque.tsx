import { useState, useEffect } from 'react';
import { api, type Produto as ProdutoType, type Entrega as EntregaType } from '../services/api';

export function Estoque() {
  const [activeTab, setActiveTab] = useState<'estoque' | 'entregas'>('estoque');
  const [stockItems, setStockItems] = useState<ProdutoType[]>([]);
  const [distributions, setDistributions] = useState<EntregaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const [produtosData, entregasData] = await Promise.all([
          api.produtos.listar(),
          api.entregas.listar()
        ]);
        setStockItems(produtosData);
        setDistributions(entregasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque e Cestas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de donativos e distribuição de auxílio</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">history</span>
            Movimentações
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            {activeTab === 'estoque' ? 'Nova Entrada' : 'Nova Entrega'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Cestas Disponíveis', value: stockItems.filter(i => i.nome.toLowerCase().includes('cesta')).reduce((acc, curr) => acc + curr.quantidade, 0).toString(), icon: 'shopping_basket', color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Alertas de Estoque', value: stockItems.filter(i => i.quantidade <= i.quantidade_minima).length.toString(), icon: 'warning', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Entregas (Mês)', value: distributions.length.toString(), icon: 'local_shipping', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Famílias na Fila', value: '12', icon: 'hourglass_empty', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('estoque')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'estoque' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inventário Geral
            </button>
            <button
              onClick={() => setActiveTab('entregas')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'entregas' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Entregas de Cestas
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder={activeTab === 'estoque' ? "Buscar item no estoque..." : "Buscar por beneficiário..."}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtros
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Carregando dados...</div>
            ) : activeTab === 'estoque' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                    <th className="pb-3 font-semibold">Item</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold text-center">Qtd Atual</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Última Atualização</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="text-sm font-medium text-gray-900">{item.nome}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{item.categoria}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`text-sm font-bold ${item.quantidade <= item.quantidade_minima ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantidade} {item.unidade}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.quantidade <= item.quantidade_minima ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.quantidade <= item.quantidade_minima ? 'Estoque Baixo' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-500">{new Date(item.data_ultima_atualizacao || '').toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Adicionar Entrada">
                            <span className="material-symbols-outlined text-[20px]">add_box</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Registrar Saída">
                            <span className="material-symbols-outlined text-[20px]">indeterminate_check_box</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                    <th className="pb-3 font-semibold">Beneficiário</th>
                    <th className="pb-3 font-semibold">Tipo de Auxílio</th>
                    <th className="pb-3 font-semibold">Itens Inclusos</th>
                    <th className="pb-3 font-semibold">Data</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {distributions.map((dist) => (
                    <tr key={dist.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="text-sm font-medium text-gray-900">ID: {dist.beneficiario_id}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{dist.tipo_auxilio}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-500 italic">{dist.itens_inclusos}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{new Date(dist.data_entrega || '').toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dist.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                          dist.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {dist.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {dist.status === 'Pendente' && (
                            <button className="px-3 py-1 text-xs font-medium text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors">
                              Confirmar Entrega
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">print</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
