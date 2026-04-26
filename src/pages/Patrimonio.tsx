import { useState, useEffect } from 'react';
import { api, type Patrimonio as PatrimonioType, type Comodato as ComodatoType } from '../services/api';

export function Patrimonio() {
  const [activeTab, setActiveTab] = useState<'patrimonio' | 'comodatos'>('patrimonio');
  const [assets, setAssets] = useState<PatrimonioType[]>([]);
  const [loans, setLoans] = useState<ComodatoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const [patrimoniosData, comodatosData] = await Promise.all([
          api.patrimonios.listar(),
          api.comodatos.listar()
        ]);
        setAssets(patrimoniosData);
        setLoans(comodatosData);
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
          <h1 className="text-2xl font-bold text-gray-900">Patrimônio e Comodato</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de bens e empréstimos de equipamentos</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Itens', value: assets.length.toString(), icon: 'inventory_2', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Em Comodato', value: assets.filter(a => a.status === 'Em Comodato').length.toString(), icon: 'handshake', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Disponíveis', value: assets.filter(a => a.status === 'Disponível').length.toString(), icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Manutenção', value: assets.filter(a => a.status === 'Manutenção').length.toString(), icon: 'build', color: 'text-red-600', bg: 'bg-red-50' },
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
              onClick={() => setActiveTab('patrimonio')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'patrimonio' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lista de Patrimônio
            </button>
            <button
              onClick={() => setActiveTab('comodatos')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comodatos' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Comodatos Ativos
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
                placeholder="Buscar por nome, código ou localização..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                <option value="">Todas Categorias</option>
                <option value="medico">Equipamento Médico</option>
                <option value="mobiliario">Mobiliário</option>
                <option value="eletro">Eletromédico</option>
              </select>
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                <option value="">Todos Status</option>
                <option value="disponivel">Disponível</option>
                <option value="comodato">Em Comodato</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Carregando dados...</div>
            ) : activeTab === 'patrimonio' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                    <th className="pb-3 font-semibold">Código / Nome</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Localização Atual</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-gray-400">{asset.codigo}</span>
                          <span className="text-sm font-medium text-gray-900">{asset.nome}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{asset.categoria}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          asset.status === 'Disponível' ? 'bg-green-100 text-green-700' :
                          asset.status === 'Em Comodato' ? 'bg-orange-100 text-orange-700' :
                          asset.status === 'Manutenção' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="material-symbols-outlined text-[18px] text-gray-400">location_on</span>
                          {asset.localizacao}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {asset.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Editar">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Histórico">
                            <span className="material-symbols-outlined text-[20px]">history</span>
                          </button>
                          {asset.status === 'Disponível' && (
                            <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Iniciar Comodato">
                              <span className="material-symbols-outlined text-[20px]">handshake</span>
                            </button>
                          )}
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
                    <th className="pb-3 font-semibold">Equipamento</th>
                    <th className="pb-3 font-semibold">Beneficiário</th>
                    <th className="pb-3 font-semibold">Data Início</th>
                    <th className="pb-3 font-semibold">Previsão Devolução</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-gray-400">ID: {loan.patrimonio_id}</span>
                          <span className="text-sm font-medium text-gray-900">Equipamento</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-900 font-medium">Beneficiário ID: {loan.beneficiario_id}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{new Date(loan.data_inicio).toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{new Date(loan.data_devolucao_prevista).toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          loan.status === 'Ativo' ? 'bg-blue-100 text-blue-700' :
                          loan.status === 'Atrasado' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-3 py-1 text-xs font-medium text-pink-600 border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors">
                            Registrar Devolução
                          </button>
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
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
