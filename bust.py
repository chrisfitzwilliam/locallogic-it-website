import os, glob
for file in ['index.html', 'business.html', 'residential.html']:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('href="css/brand.css"', 'href="css/brand.css?v=20260501_2"')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
