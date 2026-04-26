import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Cadastros } from './pages/Cadastros';
import { NovoCadastro } from './pages/NovoCadastro';
import { CadastroAcolhidas } from './pages/CadastroAcolhidas';
import { CadastroAmparadas } from './pages/CadastroAmparadas';
import { CadastroVoluntarios } from './pages/CadastroVoluntarios';
import { CadastroAdministradores } from './pages/CadastroAdministradores';
import { CadastroDoadores } from './pages/CadastroDoadores';
import { ListaAcolhidas } from './pages/ListaAcolhidas';
import { ListaAmparadas } from './pages/ListaAmparadas';
import { ListaVoluntarios } from './pages/ListaVoluntarios';
import { ListaAdministradores } from './pages/ListaAdministradores';
import { ListaDoadores } from './pages/ListaDoadores';
import { Estoque } from './pages/Estoque';
import { Patrimonio } from './pages/Patrimonio';
import { Atendimentos } from './pages/Atendimentos';
import { Financeiro } from './pages/Financeiro';
import { Configuracoes } from './pages/Configuracoes';
import { GestaoAdmin } from './pages/GestaoAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastros" element={<Cadastros />} />
          <Route path="cadastros/novo" element={<NovoCadastro />} />
          <Route path="cadastros/acolhidas" element={<CadastroAcolhidas />} />
          <Route path="cadastros/amparadas" element={<CadastroAmparadas />} />
          <Route path="cadastros/voluntarios" element={<CadastroVoluntarios />} />
          <Route path="cadastros/administradores" element={<CadastroAdministradores />} />
          <Route path="cadastros/doadores" element={<CadastroDoadores />} />
          <Route path="cadastros/lista-acolhidas" element={<ListaAcolhidas />} />
          <Route path="cadastros/lista-amparadas" element={<ListaAmparadas />} />
          <Route path="cadastros/lista-voluntarios" element={<ListaVoluntarios />} />
          <Route path="cadastros/lista-administradores" element={<ListaAdministradores />} />
          <Route path="cadastros/lista-doadores" element={<ListaDoadores />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="patrimonio" element={<Patrimonio />} />
          <Route path="atendimentos" element={<Atendimentos />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="admin" element={<GestaoAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
