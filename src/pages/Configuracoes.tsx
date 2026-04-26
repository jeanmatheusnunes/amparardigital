import { useState, useEffect } from 'react';
import { api, type Configuracao } from '../services/api';

export function Configuracoes() {
  const [activeTab, setActiveTab] = useState<'geral' | 'sistema' | 'notificacoes'>('geral');
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const carregarConfig = async () => {
      setIsLoading(true);
      try {
        const data = await api.configuracoes.obter();
        setConfig(data);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      await api.configuracoes.atualizar(config);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar config:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as preferências da instituição e do sistema</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('geral')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'geral' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">apartment</span>
            Dados da Instituição
          </button>
          <button
            onClick={() => setActiveTab('sistema')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'sistema' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings_system_daydream</span>
            Sistema e Backup
          </button>
          <button
            onClick={() => setActiveTab('notificacoes')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'notificacoes' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            Notificações
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          
          {activeTab === 'geral' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Dados da Instituição</h2>
                <p className="text-sm text-gray-500 mt-1">Informações básicas que aparecerão em relatórios e recibos.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Nome da Instituição</label>
                  <input 
                    type="text" 
                    value={config?.nome_instituicao || ''}
                    onChange={(e) => config && setConfig({...config, nome_instituicao: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">CNPJ</label>
                    <input 
                      type="text" 
                      value={config?.cnpj || ''}
                      onChange={(e) => config && setConfig({...config, cnpj: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Telefone Principal</label>
                    <input 
                      type="text" 
                      value={config?.telefone_principal || ''}
                      onChange={(e) => config && setConfig({...config, telefone_principal: e.target.value})}
                      placeholder="(00) 0000-0000"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Endereço Completo</label>
                  <input 
                    type="text" 
                    value={config?.endereco_completo || ''}
                    onChange={(e) => config && setConfig({...config, endereco_completo: e.target.value})}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sistema' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sistema e Segurança</h2>
                <p className="text-sm text-gray-500 mt-1">Configure o comportamento do sistema local e rotinas de segurança.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-gray-900">Backup Automático Local</p>
                    <p className="text-sm text-gray-500 mt-1">Realiza uma cópia de segurança do banco de dados SQLite todos os dias à meia-noite.</p>
                  </div>
                  <button 
                    onClick={() => config && setConfig({...config, backup_automatico: !config.backup_automatico})}
                    className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${config?.backup_automatico ? 'bg-pink-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config?.backup_automatico ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-gray-900">Autenticação em Duas Etapas (Admins)</p>
                    <p className="text-sm text-gray-500 mt-1">Exige um código extra para administradores ao fazer login no sistema.</p>
                  </div>
                  <button 
                    onClick={() => config && setConfig({...config, auth_duas_etapas: !config.auth_duas_etapas})}
                    className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${config?.auth_duas_etapas ? 'bg-pink-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config?.auth_duas_etapas ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Ações Manuais</h3>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                      Fazer Backup Agora
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">restore</span>
                      Restaurar Backup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Preferências de Notificação</h2>
                <p className="text-sm text-gray-500 mt-1">Escolha quais alertas o sistema deve exibir.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'notificacao_estoque', title: 'Estoque Baixo', desc: 'Avisar quando itens atingirem a quantidade mínima.' },
                  { id: 'notificacao_comodatos', title: 'Comodatos Atrasados', desc: 'Alerta sobre equipamentos não devolvidos no prazo.' },
                  { id: 'notificacao_atendimentos', title: 'Atendimentos do Dia', desc: 'Resumo diário de agendamentos nas salas.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => config && setConfig({...config, [item.id]: !config[item.id as keyof Configuracao]})}
                      className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${config?.[item.id as keyof Configuracao] ? 'bg-pink-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config?.[item.id as keyof Configuracao] ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
