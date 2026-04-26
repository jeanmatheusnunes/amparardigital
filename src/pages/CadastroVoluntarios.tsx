import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function CadastroVoluntarios() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoVoluntariado, setTipoVoluntariado] = useState('apoio');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    // Outros campos podem ser adicionados aqui e no backend posteriormente
  });

  const navigate = useNavigate();

  const steps = [
    { label: 'Dados Pessoais', number: 1 },
    { label: 'Endereço', number: 2 },
    { label: 'Atuação', number: 3 },
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      setIsLoading(true);
      try {
        // Salva na API Python (ou mock no preview)
        await api.pessoas.criar({
          nome: formData.nome || 'Nome Não Informado',
          cpf: formData.cpf || '000.000.000-00',
          telefone: formData.telefone,
          tipo: 'voluntario'
        });
        navigate('/cadastros/lista-voluntarios');
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Ocorreu um erro ao salvar o cadastro.");
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros/novo" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Voluntário</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados e a área de atuação do voluntário</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Progress Steps */}
        <div className="flex border-b border-gray-100">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className={`flex-1 p-4 flex items-center justify-center gap-2 border-b-2 ${isActive ? 'border-fuchsia-600 bg-fuchsia-50/50' : isCompleted ? 'border-fuchsia-600' : 'border-transparent'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive || isCompleted ? 'bg-fuchsia-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {isCompleted ? <span className="material-symbols-outlined text-[14px]">check</span> : step.number}
                </div>
                <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-fuchsia-700' : 'text-gray-500'}`}>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ETAPA 1: DADOS PESSOAIS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-fuchsia-600">person</span>
                  Dados Pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Digite o nome completo" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">CPF *</label>
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} required placeholder="000.000.000-00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">RG</label>
                    <input type="text" placeholder="00.000.000-0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Data de Nascimento *</label>
                    <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp *</label>
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} required placeholder="(00) 00000-0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">E-mail *</label>
                    <input type="email" placeholder="email@exemplo.com" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Profissão</label>
                    <input type="text" placeholder="Sua profissão atual" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: ENDEREÇO */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-fuchsia-600">home</span>
                  Endereço
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">CEP *</label>
                    <div className="relative">
                      <input type="text" placeholder="00000-000" className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fuchsia-600">
                        <span className="material-symbols-outlined">search</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Logradouro (Rua, Av, etc) *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Número *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Complemento</label>
                    <input type="text" placeholder="Apto, Bloco, Casa 2..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bairro *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cidade *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estado (UF) *</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
                      <option value="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="PR">Paraná</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="RS">Rio Grande do Sul</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: ATUAÇÃO */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-fuchsia-600">volunteer_activism</span>
                  Área de Atuação e Disponibilidade
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de Voluntariado *</label>
                    <select 
                      value={tipoVoluntariado}
                      onChange={(e) => setTipoVoluntariado(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="apoio">Equipe de Apoio (Eventos, Bazar, Triagem, etc.)</option>
                      <option value="profissional">Serviço Profissional (Psicologia, Jurídico, Saúde, etc.)</option>
                    </select>
                  </div>
                  
                  {tipoVoluntariado === 'profissional' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Especialidade Profissional *</label>
                      <input type="text" placeholder="Ex: Psicóloga Clínica, Advogada..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Área de Interesse *</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
                        <option value="">Selecione...</option>
                        <option value="bazar">Bazar Solidário</option>
                        <option value="eventos">Organização de Eventos</option>
                        <option value="triagem">Triagem de Doações</option>
                        <option value="administrativo">Apoio Administrativo</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Disponibilidade de Tempo *</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
                      <option value="">Selecione...</option>
                      <option value="semanal">Semanal (algumas horas por semana)</option>
                      <option value="quinzenal">Quinzenal</option>
                      <option value="mensal">Mensal</option>
                      <option value="eventual">Eventual (apenas em eventos específicos)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Dias da Semana Preferenciais</label>
                    <input type="text" placeholder="Ex: Segundas à tarde, Sábados de manhã..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Experiência Prévia com Voluntariado?</label>
                    <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Conte um pouco sobre suas experiências anteriores (opcional)"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
              {currentStep === 1 ? (
                <Link to="/cadastros/novo" className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancelar
                </Link>
              ) : (
                <button type="button" onClick={handlePrev} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  Voltar
                </button>
              )}
              
              <button type="submit" disabled={isLoading} className="px-6 py-3 bg-fuchsia-600 text-white rounded-xl text-sm font-medium hover:bg-fuchsia-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                {currentStep === 3 ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'check'}</span>
                    {isLoading ? 'Salvando...' : 'Concluir Cadastro'}
                  </>
                ) : (
                  <>
                    Próxima Etapa
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
