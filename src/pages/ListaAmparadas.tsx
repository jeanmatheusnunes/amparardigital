import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type Pessoa } from '../services/api';

export function ListaAmparadas() {
  const [amparadas, setAmparadas] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAmparadas = async () => {
      try {
        const data = await api.pessoas.listar('amparada');
        setAmparadas(data);
      } catch (error) {
        console.error("Erro ao buscar amparadas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmparadas();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cadastro?')) {
      try {
        await api.pessoas.deletar(id);
        setAmparadas(amparadas.filter(a => a.id !== id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar o cadastro.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Amparadas</h1>
          <p className="text-sm text-gray-500 mt-1">Gerenciamento de famílias assistidas pelo programa</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filtros
            </button>
            <Link to="/cadastros/novo" className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Nova Amparada
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando dados...</div>
          ) : amparadas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhuma amparada cadastrada.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">CPF</th>
                  <th className="p-4 font-medium">Telefone</th>
                  <th className="p-4 font-medium">Data de Cadastro</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {amparadas.map((pessoa) => (
                  <tr key={pessoa.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
                          {pessoa.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{pessoa.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{pessoa.cpf}</td>
                    <td className="p-4 text-gray-600">{pessoa.telefone || '-'}</td>
                    <td className="p-4 text-gray-600">
                      {pessoa.data_cadastro ? new Date(pessoa.data_cadastro).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalhes">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => pessoa.id && handleDelete(pessoa.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
        
        {!isLoading && amparadas.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Mostrando {amparadas.length} registros</span>
            <div className="flex gap-1">
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="px-3 py-1 border border-pink-600 bg-pink-50 text-pink-600 rounded font-medium">1</button>
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
