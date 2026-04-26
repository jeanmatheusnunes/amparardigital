import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function CadastroAmparadas() {
  const [currentStep, setCurrentStep] = useState(1);
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
    { label: 'Socioeconômico', number: 3 },
    { label: 'Saúde / Tratamento', number: 4 },
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 4) {
      setIsLoading(true);
      try {
        // Salva na API Python (ou mock no preview)
        await api.pessoas.criar({
          nome: formData.nome || 'Nome Não Informado',
          cpf: formData.cpf || '000.000.000-00',
          telefone: formData.telefone,
          tipo: 'amparada'
        });
        navigate('/cadastros/lista-amparadas');
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
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Amparada</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados detalhados da amparada</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Progress Steps */}
        <div className="flex border-b border-gray-100">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className={`flex-1 p-4 flex items-center justify-center gap-2 border-b-2 ${isActive ? 'border-purple-600 bg-purple-50/50' : isCompleted ? 'border-purple-600' : 'border-transparent'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive || isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {isCompleted ? <span className="material-symbols-outlined text-[14px]">check</span> : step.number}
                </div>
                <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-purple-700' : 'text-gray-500'}`}>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ETAPA 1: DADOS PESSOAIS */}
            {currentStep === 1 && (
              <>
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">person</span>
                    Dados Pessoais
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
                      <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Ex: Ana Beatriz da Costa" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nome Social</label>
                      <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">CPF *</label>
                      <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} required placeholder="987.654.321-00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Data de Nascimento *</label>
                      <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Estado Civil</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                        <option>Solteira</option>
                        <option>Casada</option>
                        <option>Divorciada</option>
                        <option>Viúva</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Escolaridade</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                        <option>Ensino Fundamental Incompleto</option>
                        <option>Ensino Fundamental Completo</option>
                        <option>Ensino Médio Incompleto</option>
                        <option>Ensino Médio Completo</option>
                        <option>Ensino Superior</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Profissão</label>
                      <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Seção: Filhos/Dependentes */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-600">child_care</span>
                      Filhos / Dependentes
                    </h2>
                    <button type="button" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Adicionar Dependente
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm">
                        <span className="material-symbols-outlined">face</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Lucas da Costa</p>
                        <p className="text-sm text-gray-500">Filho • 8 anos • Nasc: 15/04/2016</p>
                      </div>
                    </div>
                    <button type="button" className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ETAPA 2: ENDEREÇO */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">home</span>
                  Endereço
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">CEP *</label>
                    <div className="relative">
                      <input type="text" placeholder="00000-000" className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600">
                        <span className="material-symbols-outlined">search</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Logradouro (Rua, Av, etc) *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Número *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Complemento</label>
                    <input type="text" placeholder="Apto, Bloco, Casa 2..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bairro *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cidade *</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estado (UF) *</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
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
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-medium text-gray-700">Ponto de Referência</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: SOCIOECONÔMICO */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">payments</span>
                  Perfil Socioeconômico
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Renda Familiar Mensal</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                      <option>Sem renda</option>
                      <option>Até 1 salário mínimo</option>
                      <option>De 1 a 2 salários mínimos</option>
                      <option>De 2 a 3 salários mínimos</option>
                      <option>Mais de 3 salários mínimos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Situação de Moradia</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                      <option>Própria</option>
                      <option>Alugada</option>
                      <option>Cedida</option>
                      <option>Ocupação</option>
                      <option>Situação de Rua</option>
                      <option>Abrigo Institucional</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Recebe Benefício do Governo?</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                      <option>Não recebe</option>
                      <option>Bolsa Família</option>
                      <option>BPC / LOAS</option>
                      <option>Auxílio Brasil</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Valor do Benefício (R$)</label>
                    <input type="text" placeholder="0,00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Número de Pessoas na Residência</label>
                    <input type="number" min="1" defaultValue="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                    <textarea rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Detalhes sobre a situação socioeconômica, necessidades urgentes, etc."></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 4: SAÚDE / TRATAMENTO */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">health_and_safety</span>
                  Dados de Saúde e Tratamento
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de Câncer *</label>
                    <input type="text" placeholder="Ex: Câncer de Mama" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">CID da Doença</label>
                    <input type="text" placeholder="Ex: C50" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Data do Diagnóstico *</label>
                    <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Hospital de Tratamento *</label>
                    <input type="text" placeholder="Nome do Hospital/Clínica" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fase do Tratamento</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                      <option value="">Selecione...</option>
                      <option value="diagnostico">Recém Diagnosticado</option>
                      <option value="quimioterapia">Quimioterapia</option>
                      <option value="radioterapia">Radioterapia</option>
                      <option value="cirurgia">Pré/Pós Cirurgia</option>
                      <option value="remissao">Em Remissão / Acompanhamento</option>
                      <option value="cuidados_paliativos">Cuidados Paliativos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Médico Responsável</label>
                    <input type="text" placeholder="Nome do Oncologista" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Medicamentos em Uso</label>
                    <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Liste os medicamentos atuais..."></textarea>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Necessidades Específicas de Saúde</label>
                    <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Ex: Cadeira de rodas, dieta especial, fraldas, suplementos..."></textarea>
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
              
              <button type="submit" disabled={isLoading} className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                {currentStep === 4 ? (
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
