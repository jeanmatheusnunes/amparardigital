import { useState, useEffect } from 'react';
import { api, type Pessoa, type Configuracao } from '../services/api';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
}

export function GestaoAdmin() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'logs' | 'config'>('usuarios');
  const [admins, setAdmins] = useState<Pessoa[]>([]);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const [adminsData, configData] = await Promise.all([
          api.pessoas.listar('admin'),
          api.configuracoes.obter()
        ]);
        setAdmins(adminsData);
        setConfig(configData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSaveConfig = async () => {
    if (!config) return;
    setIsSavingConfig(true);
    try {
      await api.configuracoes.atualizar(config);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar config:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const logs: AuditLog[] = [
    { id: '1', user: 'Jean Matheus', action: 'Alterou status de beneficiário', module: 'Acolhidas', timestamp: '2024-03-18 10:30' },
    { id: '2', user: 'Ana Clara', action: 'Registrou nova doação', module: 'Financeiro', timestamp: '2024-03-18 09:15' },
    { id: '3', user: 'Jean Matheus', action: 'Atualizou estoque de cestas', module: 'Estoque', timestamp: '2024-03-17 16:45' },
    { id: '4', user: 'Sistema', action: 'Backup automático concluído', module: 'Sistema', timestamp: '2024-03-17 00:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Administrativa</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de acessos, auditoria e configurações do sistema</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">security</span>
            Políticas de Segurança
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Novo Administrador
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', value: admins.length.toString(), icon: 'group', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Sessões Ativas', value: '3', icon: 'login', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Logs (24h)', value: '156', icon: 'list_alt', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Alertas Sistema', value: '0', icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'usuarios' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Usuários e Acessos
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'logs' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Logs de Auditoria
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'config' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Configurações
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'usuarios' && (
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Carregando dados...</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                      <th className="pb-3 font-semibold">Nome / CPF</th>
                      <th className="pb-3 font-semibold">Nível de Acesso</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Último Acesso</th>
                      <th className="pb-3 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{admin.nome}</span>
                            <span className="text-xs text-gray-500">{admin.cpf}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700`}>
                            Administrador
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-green-500`}></span>
                            Ativo
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-500">{new Date(admin.data_cadastro || '').toLocaleDateString('pt-BR')}</span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Editar Permissões">
                              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Redefinir Senha">
                              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">Atividades Recentes</h3>
                <button className="text-xs text-pink-600 font-bold hover:underline">Exportar Logs (.csv)</button>
              </div>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-gray-400">history</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-bold">{log.user}</span> {log.action}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-pink-600">{log.module}</span>
                        <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Configurações do Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Backup Automático</p>
                        <p className="text-xs text-gray-500">Diário às 00:00</p>
                      </div>
                      <button 
                        onClick={() => config && setConfig({...config, backup_automatico: !config.backup_automatico})}
                        className={`w-10 h-5 rounded-full relative transition-colors ${config?.backup_automatico ? 'bg-pink-600' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config?.backup_automatico ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Autenticação em Duas Etapas</p>
                        <p className="text-xs text-gray-500">Obrigatório para Admins</p>
                      </div>
                      <button 
                        onClick={() => config && setConfig({...config, auth_duas_etapas: !config.auth_duas_etapas})}
                        className={`w-10 h-5 rounded-full relative transition-colors ${config?.auth_duas_etapas ? 'bg-pink-600' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config?.auth_duas_etapas ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Informações da ONG</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Nome da Instituição</label>
                      <input 
                        type="text" 
                        value={config?.nome_instituicao || ''} 
                        onChange={(e) => config && setConfig({...config, nome_instituicao: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
                      <input 
                        type="text" 
                        value={config?.cnpj || ''} 
                        onChange={(e) => config && setConfig({...config, cnpj: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <button 
                      onClick={handleSaveConfig}
                      disabled={isSavingConfig}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isSavingConfig ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
