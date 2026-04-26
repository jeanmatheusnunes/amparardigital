import { Link } from 'react-router-dom';

export function Cadastros() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Cadastros</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie todos os perfis da instituição</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Amparadas', desc: 'Famílias assistidas pelo programa', icon: 'face_3', color: 'bg-pink-50 text-pink-600', count: '856', link: '/cadastros/lista-amparadas' },
          { title: 'Acolhidas', desc: 'Mulheres em situação de vulnerabilidade', icon: 'woman', color: 'bg-pink-50 text-pink-600', count: '1,248', link: '/cadastros/lista-acolhidas' },
          { title: 'Voluntários', desc: 'Equipe de apoio e profissionais', icon: 'volunteer_activism', color: 'bg-pink-50 text-pink-600', count: '156', link: '/cadastros/lista-voluntarios' },
          { title: 'Doadores', desc: 'Parceiros e contribuintes', icon: 'favorite', color: 'bg-pink-50 text-pink-600', count: '342', link: '/cadastros/lista-doadores' },
          { title: 'Administradores', desc: 'Gestores do sistema', icon: 'admin_panel_settings', color: 'bg-pink-50 text-pink-600', count: '12', link: '/cadastros/lista-administradores' },
        ].map((card, i) => (
          <Link key={i} to={card.link} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group block">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{card.count}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-700">
              Acessar lista
              <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
