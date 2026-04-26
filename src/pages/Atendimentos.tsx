import { useState, useEffect } from 'react';
import { api, type Sala as SalaType, type Atendimento as AtendimentoType, type Pessoa } from '../services/api';

export function Atendimentos() {
  const [activeTab, setActiveTab] = useState<'salas' | 'lista'>('salas');
  const [salas, setSalas] = useState<SalaType[]>([]);
  const [atendimentos, setAtendimentos] = useState<AtendimentoType[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const [salasData, atendimentosData, pessoasData] = await Promise.all([
          api.salas.listar(),
          api.atendimentos.listar(),
          api.pessoas.listar()
        ]);
        setSalas(salasData);
        setAtendimentos(atendimentosData);
        setPessoas(pessoasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  const getPessoaNome = (id: number) => {
    return pessoas.find(p => p.id === id)?.nome || `ID: ${id}`;
  };

  const getPessoaTipo = (id: number) => {
    return pessoas.find(p => p.id === id)?.tipo || 'Desconhecido';
  };

  const getSalaNome = (id: number) => {
    return salas.find(s => s.id === id)?.nome || `ID: ${id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atendimentos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de salas e consultas profissionais</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Agenda Completa
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Atendimento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Atendimentos Hoje', value: atendimentos.filter(a => new Date(a.data_agendamento).toDateString() === new Date().toDateString()).length.toString(), icon: 'event_available', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Em Andamento', value: atendimentos.filter(a => a.status === 'Em Andamento').length.toString(), icon: 'play_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Aguardando', value: atendimentos.filter(a => a.status === 'Agendado').length.toString(), icon: 'pending', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Salas Ativas', value: salas.length.toString(), icon: 'meeting_room', color: 'text-purple-600', bg: 'bg-purple-50' },
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
              onClick={() => setActiveTab('salas')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'salas' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão por Salas
            </button>
            <button
              onClick={() => setActiveTab('lista')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'lista' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lista de Atendimentos
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando dados...</div>
          ) : activeTab === 'salas' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salas.map((room) => (
                <div key={room.id} className={`p-5 rounded-2xl border transition-all border-emerald-100 bg-emerald-50/20`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{room.nome}</h3>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700`}>
                        Disponível
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">more_vert</span>
                  </div>

                  {room.profissional_id ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-500">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{getPessoaNome(room.profissional_id)}</p>
                          <p className="text-xs text-gray-500">Profissional</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-pink-600 text-white rounded-lg text-xs font-bold hover:bg-pink-700 transition-colors">
                          Ver Detalhes
                        </button>
                        <button className="px-3 py-2 border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[108px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-500 mb-2">Sem profissional alocado</p>
                      <button className="text-xs font-bold text-pink-600 hover:underline">
                        Alocar Profissional
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-50">
                    <th className="pb-3 font-semibold">Horário / Sala</th>
                    <th className="pb-3 font-semibold">Profissional Responsável</th>
                    <th className="pb-3 font-semibold">Paciente / Beneficiário</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {atendimentos.map((apt) => {
                    const sala = salas.find(s => s.id === apt.sala_id);
                    return (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{new Date(apt.data_agendamento).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="text-xs text-gray-500">{getSalaNome(apt.sala_id)}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-500 text-sm">person</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{sala ? getPessoaNome(sala.profissional_id) : 'N/A'}</p>
                            <p className="text-xs text-gray-500">Profissional</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-gray-900">{getPessoaNome(apt.paciente_id)}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          getPessoaTipo(apt.paciente_id) === 'acolhida' ? 'bg-pink-100 text-pink-700' :
                          getPessoaTipo(apt.paciente_id) === 'amparada' ? 'bg-rose-100 text-rose-700' :
                          getPessoaTipo(apt.paciente_id) === 'voluntario' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {getPessoaTipo(apt.paciente_id)}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apt.status === 'Em Andamento' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'Agendado' ? 'bg-amber-100 text-amber-700' :
                          apt.status === 'Concluído' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            apt.status === 'Em Andamento' ? 'bg-emerald-500' :
                            apt.status === 'Agendado' ? 'bg-amber-500' :
                            apt.status === 'Concluído' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></span>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
