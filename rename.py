import os
import re

directories = [
    r'c:\Users\Administrator\Desktop\resource-hub\src\lingoflow',
    r'c:\Users\Administrator\Desktop\resource-hub\src\lingoflow\components',
    r'c:\Users\Administrator\Desktop\resource-hub\src\pages'
]

replacements = {
    'app-container': 'lf-app-container',
    'sidebar': 'lf-sidebar',
    'main-content': 'lf-main-content',
    'nav-item': 'lf-nav-item',
    'card': 'lf-card',
    'btn-primary': 'lf-btn-primary',
    'btn-secondary': 'lf-btn-secondary',
    'btn': 'lf-btn'
}

for d in directories:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if not (f.endswith('.jsx') or f.endswith('.css')):
            continue
            
        # specifically only LingoFlowApp.jsx in pages
        if d.endswith('pages') and f != 'LingoFlowApp.jsx':
            continue
            
        filepath = os.path.join(d, f)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        original = content
        for old, new in replacements.items():
            # For CSS: .old { -> .new { or .old: -> .new: or .old, -> .new,
            content = re.sub(r'\.' + old + r'(?=[ \.\{:,])', '.' + new, content)
            
            # For JSX className="old" or className={old ...}
            content = re.sub(r'([\'"\s])' + old + r'([\'"\s])', r'\1' + new + r'\2', content)
            
        if original != content:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")

