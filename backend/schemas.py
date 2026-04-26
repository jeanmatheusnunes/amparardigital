from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PessoaBase(BaseModel):
    nome: str
    tipo: str
    cpf: str
    telefone: Optional[str] = None

class PessoaCreate(PessoaBase):
    pass

class Pessoa(PessoaBase):
    id: int
    data_cadastro: datetime

class ProdutoBase(BaseModel):
    nome: str
    categoria: str
    quantidade: int
    unidade: str
    quantidade_minima: int

class ProdutoCreate(ProdutoBase):
    pass

class Produto(ProdutoBase):
    id: int
    data_ultima_atualizacao: datetime

    class Config:
        orm_mode = True

class EntregaBase(BaseModel):
    beneficiario_id: int
    tipo_auxilio: str
    itens_inclusos: str
    status: str

class EntregaCreate(EntregaBase):
    pass

class Entrega(EntregaBase):
    id: int
    data_entrega: datetime

    class Config:
        orm_mode = True

class SalaBase(BaseModel):
    nome: str
    profissional_id: int

class SalaCreate(SalaBase):
    pass

class Sala(SalaBase):
    id: int

    class Config:
        orm_mode = True

class AtendimentoBase(BaseModel):
    sala_id: int
    paciente_id: int
    status: str
    observacoes: Optional[str] = None

class AtendimentoCreate(AtendimentoBase):
    data_agendamento: datetime

class Atendimento(AtendimentoBase):
    id: int
    data_agendamento: datetime

    class Config:
        orm_mode = True

class PatrimonioBase(BaseModel):
    codigo: str
    nome: str
    categoria: str
    status: str
    localizacao: str
    data_aquisicao: datetime
    valor: float

class PatrimonioCreate(PatrimonioBase):
    pass

class Patrimonio(PatrimonioBase):
    id: int

    class Config:
        orm_mode = True

class ComodatoBase(BaseModel):
    patrimonio_id: int
    beneficiario_id: int
    data_inicio: datetime
    data_devolucao_prevista: datetime
    status: str

class ComodatoCreate(ComodatoBase):
    pass

class Comodato(ComodatoBase):
    id: int
    data_devolucao_real: Optional[datetime] = None

    class Config:
        orm_mode = True

class TransacaoBase(BaseModel):
    tipo: str
    categoria: str
    descricao: str
    valor: float
    status: str
    pessoa_id: Optional[int] = None

class TransacaoCreate(TransacaoBase):
    data: Optional[datetime] = None

class Transacao(TransacaoBase):
    id: int
    data: datetime

    class Config:
        orm_mode = True

class ConfiguracaoBase(BaseModel):
    nome_instituicao: str
    cnpj: str
    telefone_principal: Optional[str] = None
    endereco_completo: Optional[str] = None
    backup_automatico: bool
    auth_duas_etapas: bool
    notificacao_estoque: bool = True
    notificacao_comodatos: bool = True
    notificacao_atendimentos: bool = True

class ConfiguracaoCreate(ConfiguracaoBase):
    pass

class Configuracao(ConfiguracaoBase):
    id: int

    class Config:
        orm_mode = True
