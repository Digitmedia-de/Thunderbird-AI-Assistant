#!/usr/bin/env python3
"""
Build script for Thunderbird Email AI Assistant Extension
Creates a distributable ZIP file containing only the necessary extension files.
"""

import json
import os
import zipfile
from pathlib import Path

def get_extension_name_and_version():
    """Read the extension name and version from manifest.json"""
    try:
        with open('manifest.json', 'r', encoding='utf-8') as f:
            manifest = json.load(f)
            name = manifest.get('name', 'Unknown Extension')
            version = manifest.get('version', '0.0.0')
            return name, version
    except FileNotFoundError:
        print("Error: manifest.json not found. Make sure you're in the extension directory.")
        return None, None
    except json.JSONDecodeError:
        print("Error: Invalid JSON in manifest.json")
        return None, None

def should_include_file(file_path):
    """Determine if a file should be included in the extension package"""
    path = Path(file_path)
    
    # Skip hidden files and directories
    if any(part.startswith('.') for part in path.parts):
        return False
    
    # Skip specific files that shouldn't be in the extension
    excluded_files = {
        'README.md',
        'CLAUDE.md',
        'build_extension.py',
        '.gitignore',
        '.DS_Store',
        'Thumbs.db'
    }
    
    if path.name in excluded_files:
        return False
    
    # Skip backup files and temporary files
    if path.name.endswith(('.bak', '.tmp', '.temp', '~')):
        return False
    
    # Skip common development directories
    excluded_dirs = {
        '__pycache__',
        'node_modules',
        '.git',
        '.vscode',
        '.idea',
        'dist',
        'build'
    }
    
    if any(part in excluded_dirs for part in path.parts):
        return False
    
    return True

def create_extension_zip():
    """Create a ZIP file with all necessary extension files"""
    name, version = get_extension_name_and_version()
    if not name or not version:
        return False
    
    # Create a clean filename from the extension name
    clean_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()
    clean_name = clean_name.replace(' ', '-')
    
    zip_filename = f"{clean_name}-v{version}.zip"
    
    print(f"Building {name} v{version}")
    print(f"Creating ZIP file: {zip_filename}")
    
    files_added = 0
    
    try:
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Walk through all files in the current directory
            for root, dirs, files in os.walk('.'):
                # Filter out excluded directories
                dirs[:] = [d for d in dirs if not d.startswith('.') and d not in {
                    '__pycache__', 'node_modules', '.git', '.vscode', '.idea', 'dist', 'build'
                }]
                
                for file in files:
                    file_path = os.path.join(root, file)
                    
                    # Check if this file should be included
                    if should_include_file(file_path):
                        # Create the archive path (remove leading './')
                        archive_path = file_path[2:] if file_path.startswith('./') else file_path
                        
                        zipf.write(file_path, archive_path)
                        files_added += 1
                        print(f"  Added: {archive_path}")
        
        print(f"\n✅ Successfully created {zip_filename}")
        print(f"📁 Total files included: {files_added}")
        
        # Show file size
        file_size = os.path.getsize(zip_filename)
        if file_size < 1024:
            size_str = f"{file_size} bytes"
        elif file_size < 1024 * 1024:
            size_str = f"{file_size / 1024:.1f} KB"
        else:
            size_str = f"{file_size / (1024 * 1024):.1f} MB"
        
        print(f"📊 ZIP file size: {size_str}")
        return True
        
    except Exception as e:
        print(f"❌ Error creating ZIP file: {e}")
        return False

def main():
    """Main function"""
    print("🔧 Thunderbird Extension Builder")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('manifest.json'):
        print("❌ Error: manifest.json not found in current directory.")
        print("Please run this script from the extension root directory.")
        return 1
    
    # Create the extension ZIP
    if create_extension_zip():
        print("\n🎉 Build completed successfully!")
        print("The ZIP file is ready for distribution or installation in Thunderbird.")
        return 0
    else:
        print("\n💥 Build failed!")
        return 1

if __name__ == "__main__":
    exit(main())