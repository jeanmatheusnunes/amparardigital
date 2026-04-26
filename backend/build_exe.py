import os
import subprocess
import sys

def build():
    print("Iniciando o processo de build do executável...")
    
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print("\n1. Compilando o frontend React (npm run build)...")
    # Usa shell=True no Windows para encontrar o npm
    is_windows = os.name == 'nt'
    try:
        subprocess.run(["npm", "run", "build"], cwd=root_dir, shell=is_windows, check=True)
    except subprocess.CalledProcessError:
        print("Erro ao compilar o frontend. Verifique se o Node.js está instalado e se você executou 'npm install'.")
        sys.exit(1)

    print("\n2. Instalando dependências do Python...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], cwd=root_dir, check=True)
    except subprocess.CalledProcessError:
        print("Erro ao instalar dependências do Python.")
        sys.exit(1)

    print("\n3. Empacotando com PyInstaller...")
    dist_folder = os.path.join(root_dir, "dist")
    
    # A sintaxe do PyInstaller para adicionar dados depende do sistema operacional
    separator = ";" if is_windows else ":"
    add_data_arg = f"{dist_folder}{separator}dist"

    pyinstaller_cmd = [
        sys.executable, "-m", "PyInstaller",
        "--name", "SistemaGestao",
        "--windowed", # Não exibe o console/terminal ao abrir o .exe
        "--add-data", add_data_arg,
        "--hidden-import", "sqlalchemy.sql.default_comparator",
        "--noconfirm", # Sobrescreve builds anteriores sem perguntar
        "backend/main.py"
    ]
    
    try:
        subprocess.run(pyinstaller_cmd, cwd=root_dir, check=True)
    except subprocess.CalledProcessError:
        print("Erro ao gerar o executável com PyInstaller.")
        sys.exit(1)

    print("\n==================================================")
    print("Build concluído com sucesso!")
    print("O executável foi gerado na pasta 'dist/SistemaGestao' (ou 'dist/SistemaGestao.exe' no Windows).")
    print("==================================================")

if __name__ == "__main__":
    build()
