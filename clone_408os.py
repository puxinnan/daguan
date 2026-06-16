import os
import re
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import codecs

def main():
    base_dir = r"C:\Users\Administrator\Desktop\resource-hub\public\408os"
    assets_dir = os.path.join(base_dir, "assets")
    
    os.makedirs(assets_dir, exist_ok=True)
    
    # Read the fetched HTML
    html_file_path = r"C:\Users\Administrator\Desktop\resource-hub\test_utf8.html"
    with codecs.open(html_file_path, 'r', 'utf-8') as f:
        html_content = f.read()
        
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Assets to download and replace
    # Format: (tag, attribute)
    asset_tags = [
        ('script', 'src'),
        ('img', 'src'),
        ('link', 'href')
    ]
    
    base_url = "https://www.408os.cn/"
    
    for tag_name, attr in asset_tags:
        for tag in soup.find_all(tag_name):
            url = tag.get(attr)
            if not url:
                continue
            
            # Skip empty, anchor links, and data uris
            if url.startswith('#') or url.startswith('data:') or url.startswith('mailto:'):
                continue
                
            # Filter external non-asset links (like bilibili or beian)
            if tag_name == 'link' and tag.get('rel') != ['stylesheet'] and tag.get('rel') != ['icon']:
                continue
                
            if url.startswith('http') and 'oss.408os.cn' not in url and 'tailwind' not in url:
                if tag_name == 'img':
                    pass # We want all images
                else:
                    continue # Skip external links that are not tailwind or oss images
            
            # Absolute URL resolution
            full_url = urllib.parse.urljoin(base_url, url)
            
            # Determine filename
            filename = os.path.basename(urllib.parse.urlparse(full_url).path)
            if not filename:
                continue
                
            # Special case for tailwind
            if 'tailwind' in filename:
                filename = 'tailwind.min.js'
                
            # Download asset
            asset_path = os.path.join(assets_dir, filename)
            if not os.path.exists(asset_path):
                print(f"Downloading {full_url} -> {filename}")
                try:
                    # Fake user agent to avoid blocks
                    req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req) as response, open(asset_path, 'wb') as out_file:
                        out_file.write(response.read())
                except Exception as e:
                    print(f"Failed to download {full_url}: {e}")
                    continue
            
            # Replace URL in HTML
            tag[attr] = f"./assets/{filename}"
            
    # Inject Back Button
    back_button_html = """
    <div style="position: fixed; top: 20px; left: 20px; z-index: 999999;">
        <a href="javascript:history.back()" style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 20px; text-decoration: none; color: #111827; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); font-family: sans-serif; transition: all 0.2s; backdrop-filter: blur(10px);">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回大观园
        </a>
    </div>
    <style>
    body.dark-mode div > a[href="javascript:history.back()"] {
        background: rgba(31,41,55,0.9) !important;
        color: #f9fafb !important;
        border-color: rgba(255,255,255,0.1) !important;
    }
    div > a[href="javascript:history.back()"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }
    </style>
    """
    
    # Prepend back button to body
    if soup.body:
        soup.body.insert(0, BeautifulSoup(back_button_html, 'html.parser'))
        
    # Write updated HTML
    out_html_path = os.path.join(base_dir, "index.html")
    with codecs.open(out_html_path, 'w', 'utf-8') as f:
        f.write(str(soup))
        
    print(f"Successfully created {out_html_path} and downloaded assets.")

if __name__ == "__main__":
    main()
