import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function NovoCadastro() {
  const [tipo, setTipo] = useState('acolhida');
  const navigate = useNavigate();

  const handleContinuar = (e: MouseEvent) => {
    e.preventDefault();
    if (tipo === 'acolhida') navigate('/cadastros/acolhidas');
    else if (tipo === 'amparada') navigate('/cadastros/amparadas');
    else if (tipo === 'voluntario') navigate('/cadastros/voluntarios');
    else if (tipo === 'administrador') navigate('/cadastros/administradores');
    else if (tipo === 'doador') navigate('/cadastros/doadores');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cadastro</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados iniciais</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Cadastro</label>
              <select 
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              >
                <option value="acolhida">Acolhida</option>
                <option value="amparada">Amparada</option>
                <option value="voluntario">Voluntário</option>
                <option value="doador">Doador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">CPF / CNPJ</label>
              <input type="text" placeholder="000.000.000-00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
              <input type="text" placeholder="Digite o nome completo" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Data de Nascimento / Fundação</label>
              <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input type="tel" placeholder="(00) 00000-0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link to="/cadastros" className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button 
              onClick={handleContinuar}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
