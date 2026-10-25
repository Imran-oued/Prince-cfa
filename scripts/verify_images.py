import re
import os
from PIL import Image

def verify():
    with open('src/data/products.js', 'r', encoding='utf-8') as f:
        code = f.read()

    paths = re.findall(r'/products/[^\'\",\s]+', code)
    unique_paths = sorted(list(set(paths)))
    print(f"Total unique product image paths in products.js: {len(unique_paths)}")

    missing = []
    corrupted = []
    valid = 0

    for p in unique_paths:
        local_path = os.path.join('public', p.lstrip('/'))
        if not os.path.exists(local_path):
            missing.append(p)
        else:
            try:
                with Image.open(local_path) as img:
                    img.verify()
                valid += 1
            except Exception as e:
                corrupted.append((p, str(e)))

    print(f"Valid images: {valid}/{len(unique_paths)}")
    print(f"Missing images: {len(missing)}")
    for m in missing:
        print(f"  Missing: {m}")
    print(f"Corrupted images: {len(corrupted)}")
    for c in corrupted:
        print(f"  Corrupted: {c}")

if __name__ == '__main__':
    verify()
