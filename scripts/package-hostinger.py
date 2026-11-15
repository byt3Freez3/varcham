"""
Varcham India - Hostinger Deployment & Public Folder Packager
This script:
1. Copies all production build artifacts from /dist into /public (index.html, .htaccess, assets/, images/, sounds/, etc.)
2. Packages the build into varcham-hostinger-build.zip
3. Prepares both the /public folder and the ZIP archive for 1-click drop/upload into Hostinger File Manager (public_html).
"""

import os
import shutil
import sys
import zipfile

DIST_DIR = os.path.abspath('dist')
PUBLIC_DIR = os.path.abspath('public')
OUTPUT_ZIP = os.path.abspath('varcham-hostinger-build.zip')

def sync_dist_to_public():
    if not os.path.isdir(DIST_DIR):
        print(f"Error: Directory '{DIST_DIR}' not found. Please run build first.")
        sys.exit(1)

    print(f"Syncing production build from '{DIST_DIR}' into '{PUBLIC_DIR}'...")
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    for item in os.listdir(DIST_DIR):
        src_path = os.path.join(DIST_DIR, item)
        dst_path = os.path.join(PUBLIC_DIR, item)
        if os.path.isdir(src_path):
            shutil.copytree(src_path, dst_path, dirs_exist_ok=True)
        else:
            shutil.copy2(src_path, dst_path)

    print("✓ Public folder is now 100% standalone and ready for Hostinger drop/upload.")

def build_zip():
    print(f"Packaging {PUBLIC_DIR} into {OUTPUT_ZIP}...")
    total_files = 0
    with zipfile.ZipFile(OUTPUT_ZIP, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, _, files in os.walk(PUBLIC_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PUBLIC_DIR)
                # Store paths with forward slashes for Linux web servers
                rel_path = rel_path.replace(os.path.sep, '/')
                zipf.write(full_path, rel_path)
                total_files += 1

    size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"✓ Successfully packaged {total_files} files into {os.path.basename(OUTPUT_ZIP)} ({size_mb:.2f} MB).")

def main():
    sync_dist_to_public()
    build_zip()
    print("\nHostinger Deployment Options:")
    print("Option A (Drag & Drop files):")
    print("  Drag all files and folders directly from your local 'public' folder into Hostinger File Manager -> 'public_html'.")
    print("\nOption B (1-Click Zip Upload):")
    print("  1. Upload 'varcham-hostinger-build.zip' into 'public_html'.")
    print("  2. Right-click and choose 'Extract' into the current directory.")

if __name__ == '__main__':
    main()
