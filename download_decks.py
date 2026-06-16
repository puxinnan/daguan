import urllib.request
import json
import os

decks = {
    "cet4": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/word/2021%E5%9B%9B%E7%BA%A7%E8%AF%8D%E6%B1%87%E4%B9%B1%E5%BA%8F%E7%89%88.txt",
    "cet6": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/word/2019%E5%85%AD%E7%BA%A7%E8%AF%8D%E6%B1%87%E9%97%AA%E8%BF%87%E4%B9%B1%E5%BA%8F%E7%89%88.txt",
    "ielts": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/word/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C7000%E4%B8%AA%E9%9B%85%E6%80%9D%E5%8D%95%E8%AF%8D.txt",
    "toefl": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/word/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C7000%E4%B8%AA%E6%89%98%E7%A6%8F%E5%8D%95%E8%AF%8D.txt",
    "kaoyan": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/word/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C5500%E4%B8%AA%E8%80%83%E7%A0%94%E5%8D%95%E8%AF%8D%EF%BC%882025%EF%BC%89.txt"
}

output_dir = r"c:\Users\Administrator\Desktop\resource-hub\public\decks"
os.makedirs(output_dir, exist_ok=True)

for name, url in decks.items():
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            words = [line.strip() for line in content.split('\n') if line.strip()]
            
            output_path = os.path.join(output_dir, f"{name}.json")
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(words, f, ensure_ascii=False, indent=2)
            print(f"Saved {len(words)} words to {output_path}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("Done!")
