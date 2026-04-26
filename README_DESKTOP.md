# Transformando a Aplicação Web em Executável Windows (.exe)

Este projeto foi configurado para ser empacotado como um aplicativo desktop nativo para Windows. Ele utiliza **FastAPI** (Python) como backend, **SQLite** como banco de dados local, e **PyWebView** para exibir a interface React em uma janela nativa.

## Pré-requisitos (No seu computador Windows)

1. **Python 3.9+**: [Baixar e instalar o Python](https://www.python.org/downloads/).
   - *Importante*: Durante a instalação, marque a caixa **"Add Python to PATH"**.
2. **Node.js**: [Baixar e instalar o Node.js](https://nodejs.org/).

## Passo a Passo para Gerar o `.exe`

1. **Baixe o código-fonte**:
   - Exporte este projeto do AI Studio (baixando o arquivo .zip) e extraia em uma pasta no seu computador.

2. **Abra o Terminal (Prompt de Comando ou PowerShell)**:
   - Navegue até a pasta onde você extraiu o projeto.

3. **Instale as dependências do Frontend (Node.js)**:
   ```bash
   npm install
   ```

4. **Instale as dependências do Backend (Python)**:
   ```bash
   pip install -r backend/requirements.txt
   ```

5. **Execute o script de Build**:
   - Este script irá compilar o React e usar o PyInstaller para gerar o `.exe`.
   ```bash
   python backend/build_exe.py
   ```

6. **Pronto!**
   - Após o término do script, acesse a pasta `dist` gerada na raiz do projeto.
   - Lá dentro haverá uma pasta chamada `SistemaGestao` (ou o arquivo `SistemaGestao.exe`).
   - Basta dar um duplo clique para abrir o seu sistema como um aplicativo desktop! O banco de dados `banco_dados_local.db` será criado automaticamente na mesma pasta na primeira vez que você abrir.

## Como funciona a arquitetura?

- **Frontend**: O React é compilado para arquivos estáticos (HTML, CSS, JS) na pasta `dist`.
- **Backend**: O arquivo `backend/main.py` inicia um servidor FastAPI que serve esses arquivos estáticos e também expõe rotas de API (ex: `/api/pessoas`).
- **Banco de Dados**: O SQLAlchemy (`backend/database.py`) gerencia a conexão com um arquivo SQLite local, garantindo que os dados fiquem salvos no computador do usuário.
- **Desktop**: O PyWebView abre uma janela do sistema operacional e carrega o servidor FastAPI dentro dela, dando a aparência de um aplicativo nativo.
