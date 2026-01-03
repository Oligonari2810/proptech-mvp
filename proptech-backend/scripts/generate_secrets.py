#!/usr/bin/env python3
"""
Script para generar secrets seguros para HabitatPro
Ejecutar: python scripts/generate_secrets.py
"""

import secrets
import string
import os

def generate_secret(length=64):
    """Generar secret aleatorio seguro"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    # Remover caracteres problemáticos
    alphabet = alphabet.replace('"', '').replace("'", '').replace('\\', '')
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def main():
    """Generar todos los secrets necesarios"""
    print("🔐 Generando secrets seguros para HabitatPro\n")
    
    secrets_dict = {
        'JWT_SECRET_KEY': generate_secret(64),
        'SECRET_KEY': generate_secret(64),
        'NEXTAUTH_SECRET': generate_secret(64),
    }
    
    print("Secrets generados:")
    print("=" * 80)
    
    # Mostrar para .env
    print("\n# Backend .env:")
    for key, value in secrets_dict.items():
        if key != 'NEXTAUTH_SECRET':
            print(f"{key}={value}")
    
    # Mostrar para frontend .env.local
    print("\n# Frontend .env.local:")
    print(f"NEXTAUTH_SECRET={secrets_dict['NEXTAUTH_SECRET']}")
    
    print("\n" + "=" * 80)
    print("⚠️  IMPORTANTE: Copia estos valores a tus archivos .env y .env.local")
    print("⚠️  NUNCA subas estos valores al repositorio!")
    
    # Opcional: escribir a archivo temporal (NO subir a git)
    env_file = '.env.secrets'
    if os.path.exists('.gitignore'):
        with open('.env.secrets', 'w') as f:
            f.write("# Secrets generados - NO SUBIR A GIT\n")
            f.write("# Backend\n")
            for key, value in secrets_dict.items():
                if key != 'NEXTAUTH_SECRET':
                    f.write(f"{key}={value}\n")
            f.write("\n# Frontend\n")
            f.write(f"NEXTAUTH_SECRET={secrets_dict['NEXTAUTH_SECRET']}\n")
        print(f"\n✅ Secrets guardados en {env_file} (ya en .gitignore)")
    
if __name__ == '__main__':
    main()

