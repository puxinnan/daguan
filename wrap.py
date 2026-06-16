import os
import re

directories = [
    r'c:\Users\Administrator\Desktop\resource-hub\src\lingoflow',
    r'c:\Users\Administrator\Desktop\resource-hub\src\lingoflow\components'
]

for d in directories:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if not f.endswith('.css'):
            continue
            
        filepath = os.path.join(d, f)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Already wrapped?
        if '/* LINGOFLOW SCOPED */' in content:
            continue
            
        # Extract imports
        imports = re.findall(r'@import[^;]+;', content)
        for imp in imports:
            content = content.replace(imp, '')
            
        # Wrap
        new_content = "\n".join(imports) + "\n\n/* LINGOFLOW SCOPED */\n.lingoflow-scope {\n" + content + "\n}\n"
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Wrapped {f}")

