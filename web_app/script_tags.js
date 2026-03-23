const fs = require('fs');
const content = fs.readFileSync('g:/Meu Drive/01 - Empresas/Muntz/Dashboard Operacional/web_app/data/relatorio_completo_010126-a-150326.csv', 'utf8');
const lines = content.split('\n');
const header = lines[0].split(';');
const tagsIdx = header.findIndex(h => h.includes('Tags'));
const idIdx = header.findIndex(h => h.includes('ID'));
const titleIdx = header.findIndex(h => h.includes('Título'));

const seen = new Set();
const multiplasTags = [];

for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const row = lines[i].split(';');
    const tagsStr = row[tagsIdx] ? row[tagsIdx].replace(/"/g, '') : '';
    const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);

    const id = row[idIdx];
    const titulo = row[titleIdx];
    if (tags.length > 1) {
        if (!seen.has(id)) {
            multiplasTags.push({ id, titulo, tags: tagsStr });
            seen.add(id);
        }
    }
}

console.log(JSON.stringify(multiplasTags, null, 2));
