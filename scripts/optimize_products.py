"""
Script d'optimisation des images du catalogue produits.
Redimensionne à max 1200px de large et compresse en JPEG/PNG optimisé avec sauvegarde préalable.
"""

import os
import shutil
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(PROJECT_ROOT, ".backup_products_original")
PUBLIC_PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "public", "products")
MAX_SIZE_BYTES = 500 * 1024  # Cible: < 500 Ko

def optimize_images():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    optimized_count = 0
    saved_bytes = 0

    for root, dirs, files in os.walk(PUBLIC_PRODUCTS_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                continue

            full_path = os.path.join(root, file)
            size = os.path.getsize(full_path)

            if size > MAX_SIZE_BYTES:
                rel_path = os.path.relpath(full_path, PUBLIC_PRODUCTS_DIR)
                backup_path = os.path.join(BACKUP_DIR, rel_path)

                # Sauvegarde si pas déjà présente
                if not os.path.exists(backup_path):
                    os.makedirs(os.path.dirname(backup_path), exist_ok=True)
                    shutil.copy2(full_path, backup_path)

                try:
                    with Image.open(full_path) as img:
                        w, h = img.size
                        if w > 1200:
                            new_w = 1200
                            new_h = int(h * (1200 / w))
                            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                        if ext in [".jpg", ".jpeg"]:
                            if img.mode != "RGB":
                                img = img.convert("RGB")
                            img.save(full_path, "JPEG", quality=84, optimize=True, progressive=True)
                        elif ext == ".png":
                            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                                img.save(full_path, "PNG", optimize=True)
                            else:
                                rgb = img.convert("RGB")
                                rgb.save(full_path, "JPEG", quality=84, optimize=True, progressive=True)

                    new_size = os.path.getsize(full_path)
                    saved_bytes += (size - new_size)
                    optimized_count += 1
                except Exception as e:
                    print(f"Erreur sur {file}: {e}")

    print(f"Terminé : {optimized_count} images traitées, {saved_bytes / (1024 * 1024):.2f} Mo économisés.")

if __name__ == "__main__":
    optimize_images()
