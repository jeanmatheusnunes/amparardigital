import os
import sys
import threading
import uvicorn
import webview
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas

# Cria as tabelas no banco de dados local
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração de CORS para desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rotas da API Backend ---
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend Python rodando perfeitamente!"}

@app.post("/api/pessoas", response_model=schemas.Pessoa)
def create_pessoa(pessoa: schemas.PessoaCreate, db: Session = Depends(get_db)):
    db_pessoa = db.query(models.Pessoa).filter(models.Pessoa.cpf == pessoa.cpf).first()
    if db_pessoa:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    
    nova_pessoa = models.Pessoa(**pessoa.dict())
    db.add(nova_pessoa)
    db.commit()
    db.refresh(nova_pessoa)
    return nova_pessoa

@app.get("/api/pessoas", response_model=list[schemas.Pessoa])
def get_pessoas(skip: int = 0, limit: int = 100, tipo: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Pessoa)
    if tipo:
        query = query.filter(models.Pessoa.tipo == tipo)
    return query.offset(skip).limit(limit).all()

@app.get("/api/pessoas/{pessoa_id}", response_model=schemas.Pessoa)
def get_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    pessoa = db.query(models.Pessoa).filter(models.Pessoa.id == pessoa_id).first()
    if pessoa is None:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return pessoa

@app.delete("/api/pessoas/{pessoa_id}")
def delete_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    pessoa = db.query(models.Pessoa).filter(models.Pessoa.id == pessoa_id).first()
    if pessoa is None:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    db.delete(pessoa)
    db.commit()
    return {"message": "Pessoa deletada com sucesso"}

@app.get("/api/produtos", response_model=list[schemas.Produto])
def get_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Produto).offset(skip).limit(limit).all()

@app.post("/api/produtos", response_model=schemas.Produto)
def create_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    db_produto = models.Produto(**produto.dict())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

@app.get("/api/entregas", response_model=list[schemas.Entrega])
def get_entregas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Entrega).offset(skip).limit(limit).all()

@app.post("/api/entregas", response_model=schemas.Entrega)
def create_entrega(entrega: schemas.EntregaCreate, db: Session = Depends(get_db)):
    db_entrega = models.Entrega(**entrega.dict())
    db.add(db_entrega)
    db.commit()
    db.refresh(db_entrega)
    return db_entrega

@app.get("/api/salas", response_model=list[schemas.Sala])
def get_salas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Sala).offset(skip).limit(limit).all()

@app.post("/api/salas", response_model=schemas.Sala)
def create_sala(sala: schemas.SalaCreate, db: Session = Depends(get_db)):
    db_sala = models.Sala(**sala.dict())
    db.add(db_sala)
    db.commit()
    db.refresh(db_sala)
    return db_sala

@app.get("/api/atendimentos", response_model=list[schemas.Atendimento])
def get_atendimentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Atendimento).offset(skip).limit(limit).all()

@app.post("/api/atendimentos", response_model=schemas.Atendimento)
def create_atendimento(atendimento: schemas.AtendimentoCreate, db: Session = Depends(get_db)):
    db_atendimento = models.Atendimento(**atendimento.dict())
    db.add(db_atendimento)
    db.commit()
    db.refresh(db_atendimento)
    return db_atendimento

@app.get("/api/patrimonios", response_model=list[schemas.Patrimonio])
def get_patrimonios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Patrimonio).offset(skip).limit(limit).all()

@app.post("/api/patrimonios", response_model=schemas.Patrimonio)
def create_patrimonio(patrimonio: schemas.PatrimonioCreate, db: Session = Depends(get_db)):
    db_patrimonio = models.Patrimonio(**patrimonio.dict())
    db.add(db_patrimonio)
    db.commit()
    db.refresh(db_patrimonio)
    return db_patrimonio

@app.get("/api/comodatos", response_model=list[schemas.Comodato])
def get_comodatos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Comodato).offset(skip).limit(limit).all()

@app.post("/api/comodatos", response_model=schemas.Comodato)
def create_comodato(comodato: schemas.ComodatoCreate, db: Session = Depends(get_db)):
    db_comodato = models.Comodato(**comodato.dict())
    db.add(db_comodato)
    db.commit()
    db.refresh(db_comodato)
    return db_comodato

@app.get("/api/transacoes", response_model=list[schemas.Transacao])
def get_transacoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Transacao).offset(skip).limit(limit).all()

@app.post("/api/transacoes", response_model=schemas.Transacao)
def create_transacao(transacao: schemas.TransacaoCreate, db: Session = Depends(get_db)):
    db_transacao = models.Transacao(**transacao.dict())
    db.add(db_transacao)
    db.commit()
    db.refresh(db_transacao)
    return db_transacao

@app.get("/api/configuracoes", response_model=schemas.Configuracao)
def get_configuracoes(db: Session = Depends(get_db)):
    config = db.query(models.Configuracao).first()
    if not config:
        config = models.Configuracao()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@app.put("/api/configuracoes", response_model=schemas.Configuracao)
def update_configuracoes(config_update: schemas.ConfiguracaoCreate, db: Session = Depends(get_db)):
    config = db.query(models.Configuracao).first()
    if not config:
        config = models.Configuracao(**config_update.dict())
        db.add(config)
    else:
        for key, value in config_update.dict().items():
            setattr(config, key, value)
    db.commit()
    db.refresh(config)
    return config

# --- Servir o Frontend React (Arquivos Estáticos) ---
# Verifica se está rodando como executável compilado pelo PyInstaller
if getattr(sys, 'frozen', False):
    base_dir = sys._MEIPASS
else:
    # Rodando como script python normal
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

dist_path = os.path.join(base_dir, "dist")

if os.path.exists(dist_path):
    # Serve a pasta assets gerada pelo Vite
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    # Rota catch-all para o React Router funcionar (Single Page Application)
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Se for uma requisição de API que não existe, retorna 404
        if catchall.startswith("api/"):
            return {"error": "API route not found"}
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    def no_frontend():
        return {"message": "Build do frontend não encontrado. Execute 'npm run build' primeiro."}

def run_server():
    # Inicia o servidor FastAPI na porta 8000
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

if __name__ == "__main__":
    # Inicia o servidor em uma thread separada para não bloquear a interface gráfica
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    # Cria e exibe a janela nativa do Windows usando pywebview
    webview.create_window(
        "Sistema de Gestão", 
        "http://127.0.0.1:8000", 
        width=1280, 
        height=800,
        min_size=(800, 600)
    )
    webview.start()
