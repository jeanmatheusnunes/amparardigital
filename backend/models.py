from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from database import Base
import datetime

class Pessoa(Base):
    __tablename__ = "pessoas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    tipo = Column(String) # 'acolhida', 'amparada', 'voluntario', 'doador', 'admin'
    cpf = Column(String, unique=True, index=True)
    telefone = Column(String)
    data_cadastro = Column(DateTime, default=datetime.datetime.utcnow)

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    categoria = Column(String) # 'Alimento', 'Higiene', 'Limpeza', 'Outros'
    quantidade = Column(Integer, default=0)
    unidade = Column(String)
    quantidade_minima = Column(Integer, default=0)
    data_ultima_atualizacao = Column(DateTime, default=datetime.datetime.utcnow)

class Entrega(Base):
    __tablename__ = "entregas"

    id = Column(Integer, primary_key=True, index=True)
    beneficiario_id = Column(Integer)
    tipo_auxilio = Column(String)
    itens_inclusos = Column(String)
    data_entrega = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String) # 'Entregue', 'Pendente', 'Cancelado'

class Sala(Base):
    __tablename__ = "salas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    profissional_id = Column(Integer) # Referência para Pessoa (Voluntário)

class Atendimento(Base):
    __tablename__ = "atendimentos"

    id = Column(Integer, primary_key=True, index=True)
    sala_id = Column(Integer)
    paciente_id = Column(Integer) # Referência para Pessoa (qualquer tipo)
    data_agendamento = Column(DateTime)
    status = Column(String) # 'Agendado', 'Em Andamento', 'Concluído', 'Cancelado'
    observacoes = Column(String, nullable=True)
class Patrimonio(Base):
    __tablename__ = "patrimonios"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True)
    nome = Column(String, index=True)
    categoria = Column(String)
    status = Column(String) # 'Disponível', 'Em Comodato', 'Manutenção', 'Baixado'
    localizacao = Column(String)
    data_aquisicao = Column(DateTime)
    valor = Column(Float)

class Comodato(Base):
    __tablename__ = "comodatos"

    id = Column(Integer, primary_key=True, index=True)
    patrimonio_id = Column(Integer) # Referência simples por enquanto
    beneficiario_id = Column(Integer) # Referência simples para Pessoa
    data_inicio = Column(DateTime)
    data_devolucao_prevista = Column(DateTime)
    data_devolucao_real = Column(DateTime, nullable=True)
    status = Column(String) # 'Ativo', 'Atrasado', 'Devolvido'

class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String) # 'Receita', 'Despesa'
    categoria = Column(String) # 'Doação', 'Evento', 'Manutenção', 'Contas', 'Outros'
    descricao = Column(String)
    valor = Column(Float)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String) # 'Concluído', 'Pendente', 'Cancelado'
    pessoa_id = Column(Integer, nullable=True) # Referência para Pessoa (Doador, etc)

class Configuracao(Base):
    __tablename__ = "configuracoes"

    id = Column(Integer, primary_key=True, index=True)
    nome_instituicao = Column(String, default="ONG Amparo e Acolhimento")
    cnpj = Column(String, default="00.000.000/0001-00")
    telefone_principal = Column(String, nullable=True)
    endereco_completo = Column(String, nullable=True)
    backup_automatico = Column(Boolean, default=True)
    auth_duas_etapas = Column(Boolean, default=False)
    notificacao_estoque = Column(Boolean, default=True)
    notificacao_comodatos = Column(Boolean, default=True)
    notificacao_atendimentos = Column(Boolean, default=True)
