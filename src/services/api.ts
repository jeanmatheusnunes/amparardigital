// Serviço de comunicação com a API Python (FastAPI)

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Verifica se estamos rodando no ambiente de preview do AI Studio
// (onde o backend Python não está rodando)
const isPreviewEnvironment = window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost';

// Mock de dados para o ambiente de preview
let mockPessoas = [
  { id: 1, nome: 'Maria da Silva', tipo: 'acolhida', cpf: '111.111.111-11', telefone: '(11) 99999-9999', data_cadastro: new Date().toISOString() },
  { id: 2, nome: 'João Souza', tipo: 'voluntario', cpf: '222.222.222-22', telefone: '(11) 88888-8888', data_cadastro: new Date().toISOString() },
];

export interface Pessoa {
  id?: number;
  nome: string;
  tipo: string;
  cpf: string;
  telefone?: string;
  data_cadastro?: string;
}

export interface Patrimonio {
  id?: number;
  codigo: string;
  nome: string;
  categoria: string;
  status: string;
  localizacao: string;
  data_aquisicao: string;
  valor: number;
}

export interface Comodato {
  id?: number;
  patrimonio_id: number;
  beneficiario_id: number;
  data_inicio: string;
  data_devolucao_prevista: string;
  data_devolucao_real?: string;
  status: string;
}

let mockPatrimonios: Patrimonio[] = [
  { id: 1, codigo: 'PAT-001', nome: 'Cadeira de Rodas Standard', categoria: 'Equipamento Médico', status: 'Em Comodato', localizacao: 'Maria Silva', data_aquisicao: '2023-05-15T00:00:00Z', valor: 850.00 },
  { id: 2, codigo: 'PAT-002', nome: 'Cama Hospitalar Manual', categoria: 'Mobiliário', status: 'Disponível', localizacao: 'Depósito Central', data_aquisicao: '2023-08-20T00:00:00Z', valor: 2400.00 },
];

let mockComodatos: Comodato[] = [
  { id: 1, patrimonio_id: 1, beneficiario_id: 1, data_inicio: '2024-02-01T00:00:00Z', data_devolucao_prevista: '2024-05-01T00:00:00Z', status: 'Ativo' },
];

export interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  quantidade_minima: number;
  data_ultima_atualizacao?: string;
}

export interface Entrega {
  id?: number;
  beneficiario_id: number;
  tipo_auxilio: string;
  itens_inclusos: string;
  data_entrega?: string;
  status: string;
}

let mockProdutos: Produto[] = [
  { id: 1, nome: 'Cesta Básica Tipo A', categoria: 'Alimento', quantidade: 45, unidade: 'unid', quantidade_minima: 20, data_ultima_atualizacao: '2024-03-15T00:00:00Z' },
  { id: 2, nome: 'Arroz 5kg', categoria: 'Alimento', quantidade: 120, unidade: 'pct', quantidade_minima: 50, data_ultima_atualizacao: '2024-03-14T00:00:00Z' },
];

let mockEntregas: Entrega[] = [
  { id: 1, beneficiario_id: 1, tipo_auxilio: 'Cesta Básica A', itens_inclusos: '1 Cesta, 2L Leite', data_entrega: '2024-03-18T00:00:00Z', status: 'Entregue' },
];

export interface Sala {
  id?: number;
  nome: string;
  profissional_id: number;
}

export interface Atendimento {
  id?: number;
  sala_id: number;
  paciente_id: number;
  data_agendamento: string;
  status: string;
  observacoes?: string;
}

let mockSalas: Sala[] = [
  { id: 1, nome: 'Sala 1 - Psicologia', profissional_id: 2 },
  { id: 2, nome: 'Sala 2 - Assistência Social', profissional_id: 2 },
];

let mockAtendimentos: Atendimento[] = [
  { id: 1, sala_id: 1, paciente_id: 1, data_agendamento: '2024-03-20T14:00:00Z', status: 'Agendado', observacoes: 'Primeira consulta' },
];

export interface Transacao {
  id?: number;
  tipo: string;
  categoria: string;
  descricao: string;
  valor: number;
  data?: string;
  status: string;
  pessoa_id?: number;
}

export interface Configuracao {
  id?: number;
  nome_instituicao: string;
  cnpj: string;
  telefone_principal?: string;
  endereco_completo?: string;
  backup_automatico: boolean;
  auth_duas_etapas: boolean;
  notificacao_estoque: boolean;
  notificacao_comodatos: boolean;
  notificacao_atendimentos: boolean;
}

let mockConfig: Configuracao = {
  nome_instituicao: "ONG Amparo e Acolhimento",
  cnpj: "00.000.000/0001-00",
  telefone_principal: "",
  endereco_completo: "",
  backup_automatico: true,
  auth_duas_etapas: false,
  notificacao_estoque: true,
  notificacao_comodatos: true,
  notificacao_atendimentos: true
};

let mockTransacoes: Transacao[] = [
  { id: 1, tipo: 'Receita', categoria: 'Doação', descricao: 'Doação Mensal', valor: 150.00, data: '2024-03-20T10:00:00Z', status: 'Concluído', pessoa_id: 1 },
  { id: 2, tipo: 'Despesa', categoria: 'Contas', descricao: 'Conta de Luz', valor: 350.00, data: '2024-03-15T10:00:00Z', status: 'Concluído' },
];

export const api = {
  pessoas: {
    listar: async (tipo?: string): Promise<Pessoa[]> => {
      if (isPreviewEnvironment) {
        console.log('Usando dados mockados no preview');
        return tipo ? mockPessoas.filter(p => p.tipo === tipo) : mockPessoas;
      }

      try {
        const url = tipo ? `${API_BASE_URL}/pessoas?tipo=${tipo}` : `${API_BASE_URL}/pessoas`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar pessoas');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão com o backend Python:', error);
        // Fallback para mock se o backend estiver offline mesmo localmente
        return tipo ? mockPessoas.filter(p => p.tipo === tipo) : mockPessoas;
      }
    },
    
    criar: async (pessoa: Pessoa): Promise<Pessoa> => {
      if (isPreviewEnvironment) {
        const novaPessoa = { ...pessoa, id: Date.now(), data_cadastro: new Date().toISOString() };
        mockPessoas.push(novaPessoa);
        return novaPessoa;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/pessoas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pessoa),
        });
        if (!response.ok) throw new Error('Erro ao criar pessoa');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão com o backend Python:', error);
        const novaPessoa = { ...pessoa, id: Date.now(), data_cadastro: new Date().toISOString() };
        mockPessoas.push(novaPessoa);
        return novaPessoa;
      }
    },

    deletar: async (id: number): Promise<void> => {
      if (isPreviewEnvironment) {
        mockPessoas = mockPessoas.filter(p => p.id !== id);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/pessoas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar pessoa');
      } catch (error) {
        console.error('Erro de conexão com o backend Python:', error);
        mockPessoas = mockPessoas.filter(p => p.id !== id);
      }
    }
  },
  patrimonios: {
    listar: async (): Promise<Patrimonio[]> => {
      if (isPreviewEnvironment) return mockPatrimonios;
      try {
        const response = await fetch(`${API_BASE_URL}/patrimonios`);
        if (!response.ok) throw new Error('Erro ao buscar patrimônios');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockPatrimonios;
      }
    },
    criar: async (patrimonio: Patrimonio): Promise<Patrimonio> => {
      if (isPreviewEnvironment) {
        const novo = { ...patrimonio, id: Date.now() };
        mockPatrimonios.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/patrimonios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patrimonio),
        });
        if (!response.ok) throw new Error('Erro ao criar patrimônio');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...patrimonio, id: Date.now() };
        mockPatrimonios.push(novo);
        return novo;
      }
    }
  },
  comodatos: {
    listar: async (): Promise<Comodato[]> => {
      if (isPreviewEnvironment) return mockComodatos;
      try {
        const response = await fetch(`${API_BASE_URL}/comodatos`);
        if (!response.ok) throw new Error('Erro ao buscar comodatos');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockComodatos;
      }
    },
    criar: async (comodato: Comodato): Promise<Comodato> => {
      if (isPreviewEnvironment) {
        const novo = { ...comodato, id: Date.now() };
        mockComodatos.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/comodatos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comodato),
        });
        if (!response.ok) throw new Error('Erro ao criar comodato');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...comodato, id: Date.now() };
        mockComodatos.push(novo);
        return novo;
      }
    }
  },
  produtos: {
    listar: async (): Promise<Produto[]> => {
      if (isPreviewEnvironment) return mockProdutos;
      try {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockProdutos;
      }
    },
    criar: async (produto: Produto): Promise<Produto> => {
      if (isPreviewEnvironment) {
        const novo = { ...produto, id: Date.now(), data_ultima_atualizacao: new Date().toISOString() };
        mockProdutos.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/produtos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
        });
        if (!response.ok) throw new Error('Erro ao criar produto');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...produto, id: Date.now(), data_ultima_atualizacao: new Date().toISOString() };
        mockProdutos.push(novo);
        return novo;
      }
    }
  },
  entregas: {
    listar: async (): Promise<Entrega[]> => {
      if (isPreviewEnvironment) return mockEntregas;
      try {
        const response = await fetch(`${API_BASE_URL}/entregas`);
        if (!response.ok) throw new Error('Erro ao buscar entregas');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockEntregas;
      }
    },
    criar: async (entrega: Entrega): Promise<Entrega> => {
      if (isPreviewEnvironment) {
        const novo = { ...entrega, id: Date.now(), data_entrega: new Date().toISOString() };
        mockEntregas.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/entregas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entrega),
        });
        if (!response.ok) throw new Error('Erro ao criar entrega');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...entrega, id: Date.now(), data_entrega: new Date().toISOString() };
        mockEntregas.push(novo);
        return novo;
      }
    }
  },
  salas: {
    listar: async (): Promise<Sala[]> => {
      if (isPreviewEnvironment) return mockSalas;
      try {
        const response = await fetch(`${API_BASE_URL}/salas`);
        if (!response.ok) throw new Error('Erro ao buscar salas');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockSalas;
      }
    },
    criar: async (sala: Sala): Promise<Sala> => {
      if (isPreviewEnvironment) {
        const novo = { ...sala, id: Date.now() };
        mockSalas.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/salas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sala),
        });
        if (!response.ok) throw new Error('Erro ao criar sala');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...sala, id: Date.now() };
        mockSalas.push(novo);
        return novo;
      }
    }
  },
  atendimentos: {
    listar: async (): Promise<Atendimento[]> => {
      if (isPreviewEnvironment) return mockAtendimentos;
      try {
        const response = await fetch(`${API_BASE_URL}/atendimentos`);
        if (!response.ok) throw new Error('Erro ao buscar atendimentos');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockAtendimentos;
      }
    },
    criar: async (atendimento: Atendimento): Promise<Atendimento> => {
      if (isPreviewEnvironment) {
        const novo = { ...atendimento, id: Date.now() };
        mockAtendimentos.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/atendimentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(atendimento),
        });
        if (!response.ok) throw new Error('Erro ao criar atendimento');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...atendimento, id: Date.now() };
        mockAtendimentos.push(novo);
        return novo;
      }
    }
  },
  transacoes: {
    listar: async (): Promise<Transacao[]> => {
      if (isPreviewEnvironment) return mockTransacoes;
      try {
        const response = await fetch(`${API_BASE_URL}/transacoes`);
        if (!response.ok) throw new Error('Erro ao buscar transações');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockTransacoes;
      }
    },
    criar: async (transacao: Transacao): Promise<Transacao> => {
      if (isPreviewEnvironment) {
        const novo = { ...transacao, id: Date.now(), data: new Date().toISOString() };
        mockTransacoes.push(novo);
        return novo;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/transacoes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transacao),
        });
        if (!response.ok) throw new Error('Erro ao criar transação');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        const novo = { ...transacao, id: Date.now(), data: new Date().toISOString() };
        mockTransacoes.push(novo);
        return novo;
      }
    }
  },
  configuracoes: {
    obter: async (): Promise<Configuracao> => {
      if (isPreviewEnvironment) return mockConfig;
      try {
        const response = await fetch(`${API_BASE_URL}/configuracoes`);
        if (!response.ok) throw new Error('Erro ao buscar configurações');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        return mockConfig;
      }
    },
    atualizar: async (config: Configuracao): Promise<Configuracao> => {
      if (isPreviewEnvironment) {
        mockConfig = { ...mockConfig, ...config };
        return mockConfig;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/configuracoes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        if (!response.ok) throw new Error('Erro ao atualizar configurações');
        return await response.json();
      } catch (error) {
        console.error('Erro de conexão:', error);
        mockConfig = { ...mockConfig, ...config };
        return mockConfig;
      }
    }
  }
};
