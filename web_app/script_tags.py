import csv
import json

multiplas = []
seen = set()

with open('data/relatorio_completo_010126-a-150326.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        tags_str = row.get('Tags', '')
        tags = [t.strip() for t in tags_str.split(',') if t.strip()]
        
        if len(tags) > 1:
            id_ = row.get('ID')
            if id_ not in seen:
                multiplas.append({
                    'id': id_,
                    'titulo': row.get('Título', ''),
                    'tags': tags_str
                })
                seen.add(id_)

print(json.dumps(multiplas, indent=2, ensure_ascii=False))
