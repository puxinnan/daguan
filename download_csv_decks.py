import urllib.request
import csv
import json
import os
import io

decks = {
    "cet4": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/2021%E5%9B%9B%E7%BA%A7%E8%AF%8D%E6%B1%87%E4%B9%B1%E5%BA%8F%E7%89%88.csv",
    "cet6": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/2019%E5%85%AD%E7%BA%A7%E8%AF%8D%E6%B1%87%E9%97%AA%E8%BF%87%E4%B9%B1%E5%BA%8F%E7%89%88.csv",
    "ielts": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C7000%E4%B8%AA%E9%9B%85%E6%80%9D%E5%8D%95%E8%AF%8D.csv",
    "toefl": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C7000%E4%B8%AA%E6%89%98%E7%A6%8F%E5%8D%95%E8%AF%8D.csv",
    "kaoyan": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/100%E4%B8%AA%E5%8F%A5%E5%AD%90%E8%AE%B0%E5%AE%8C5500%E4%B8%AA%E8%80%83%E7%A0%94%E5%8D%95%E8%AF%8D%EF%BC%882025%EF%BC%89.csv",
    "college_upgrade": "https://raw.githubusercontent.com/busiyiworld/maimemo-export/main/exported/translation/%E6%98%9F%E7%81%AB%E4%B8%93%E5%8D%87%E6%9C%AC%E8%8B%B1%E8%AF%AD%E8%AF%8D%E6%B1%87%E5%BF%85%E8%83%8C.csv"
}

output_dir = r"c:\Users\Administrator\Desktop\resource-hub\public\decks"
os.makedirs(output_dir, exist_ok=True)

for name, url in decks.items():
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            f = io.StringIO(content)
            reader = csv.reader(f)
            
            # The CSV format is just two columns: word, translation
            # We want to output a list of objects: [{"english": "word", "chinese": "translation"}]
            words_data = []
            for row in reader:
                if len(row) >= 2:
                    words_data.append({
                        "english": row[0].strip(),
                        "chinese": row[1].strip()
                    })
            
            output_path = os.path.join(output_dir, f"{name}.json")
            with open(output_path, 'w', encoding='utf-8') as outfile:
                json.dump(words_data, outfile, ensure_ascii=False, indent=2)
            print(f"Saved {len(words_data)} words with translations to {output_path}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("All done!")
