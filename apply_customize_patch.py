import os
import sys
import shutil

def copy_customize_directory(source_customize, destination_webview):
    """
    カスタマイズディレクトリを完全に上書きでコピー
    """
    try:
        # customizeディレクトリを作成（存在する場合は削除して再作成）
        customize_destination = os.path.join(destination_webview, 'customize')
        if os.path.exists(customize_destination):
            shutil.rmtree(customize_destination)
        
        # ディレクトリをコピー
        shutil.copytree(source_customize, customize_destination)
        
        print(f"Copied {source_customize} to {customize_destination}")
        return True
    except Exception as e:
        print(f"Error copying directory: {e}")
        return False

def ensure_script_tag(html_path, script_filename):
    """
    index.htmlにscriptタグが存在することを確認し、
    存在しない場合は追加する
    """
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # scriptタグ
        script_tag = f'<script src="customize/{script_filename}" type="module"></script>'
        
        # scriptタグが存在しない場合に追加
        if script_tag not in html_content:
            modified_html = html_content.replace('</head>', f'{script_tag}\n</head>')
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(modified_html)
            
            print(f"Added script tag for {script_filename}")
            return True
        
        print(f"Script tag for {script_filename} already exists.")
        return False
    
    except Exception as e:
        print(f"Error ensuring script tag: {e}")
        return False

def main():
    # パスの定義
    script_dir = os.path.dirname(os.path.abspath(__file__))
    customize_dir = os.path.join(script_dir, 'customize')
    webview_dir = os.path.join(script_dir, 'bin', 'webview')
    
    # パッチファイル名
    patch_filename = 'customize-patch.js'
    
    # インデックスHTMLのパス
    index_html_path = os.path.join(webview_dir, 'index.html')
    
    # カスタマイズディレクトリを毎回上書きでコピー
    if copy_customize_directory(customize_dir, webview_dir):
        # scriptタグを確認・追加（index.htmlが存在する場合）
        if os.path.exists(index_html_path):
            if not ensure_script_tag(index_html_path, patch_filename):
                print("Failed to ensure script tag.")
                sys.exit(1)
        else:
            print("index.html not found. Skipping script tag injection.")
    else:
        print("Failed to copy customize directory.")
        sys.exit(1)

    print("Customize update process completed.")

if __name__ == '__main__':
    main()