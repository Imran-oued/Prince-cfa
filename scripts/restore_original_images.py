"""
Script de restauration des images originales depuis .backup_products_original/
Permet de restaurer l'état initial des images avant optimisation.
"""

import os
import shutil

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(PROJECT_ROOT, ".backup_products_original")
PUBLIC_PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "public", "products")

def restore_originals():
    if not os.path.exists(BACKUP_DIR):
        print(f"❌ Dossier de sauvegarde introuvable: {BACKUP_DIR}")
        return False

    restored_count = 0
    total_bytes = 0

    for root, dirs, files in os.walk(BACKUP_DIR):
        for file in files:
            src_path = os.path.join(root, file)
            rel_path = os.path.relpath(src_path, BACKUP_DIR)
            dest_path = os.path.join(PUBLIC_PRODUCTS_DIR, rel_path)

            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(src_path, dest_path)
            restored_count += 1
            total_bytes += os.path.getsize(dest_path)

    print(f"✅ Restauration terminée avec succès :")
    print(f"   - Fichiers restaurés : {restored_count}")
    print(f"   - Volume restauré : {total_bytes / (1024 * 1024):.2f} Mo")
    return True

if __name__ == "__main__":
    restore_originals()
