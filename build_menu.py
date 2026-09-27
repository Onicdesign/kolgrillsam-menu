import html,json,re
from pathlib import Path
DATA=json.loads(Path('menu-data.json').read_text())
BASE='https://onicdesign.github.io/kolgrillsam-menu/'

def image_markup(item,absolute=False):
    key=item['image']; name=html.escape(item['name'],quote=True)
    if key.startswith('poster-kebab'):
        col=key[-1]
        return f'<div class="ks-menu-poster ks-menu-poster-kebab ks-menu-poster-{col}" role="img" aria-label="{name}, priset visas i bilden"></div>'
    if key=='poster-sallad':
        return f'<div class="ks-menu-poster ks-menu-poster-sallad" role="img" aria-label="{name}, priset visas i bilden"></div>'
    file=f'assets/dish-{key}.png' if key.isdigit() or key=='jiz' else f'assets/{key}.jpg'
    src=(BASE if absolute else '')+file
    return f'<img src="{src}" alt="{name}, priset visas i bilden" loading="lazy">'

def markup(absolute=False):
    parts=['<main class="ks-menu-page" id="ks-menu-top">',
           '<section class="ks-menu-intro ks-menu-container" aria-labelledby="ks-menu-title"><span class="ks-menu-rule" aria-hidden="true"></span><p class="ks-menu-eyebrow">Kolgrill Sam · Sollentuna</p><h1 id="ks-menu-title">Vår meny</h1><p>Bläddra bland våra rätter. Priserna finns direkt på bilderna.</p></section>',
           '<nav class="ks-menu-nav" aria-label="Menysektioner"><div class="ks-menu-nav-inner ks-menu-container">']
    parts += [f'<a href="#ks-{cat["id"]}">{html.escape(cat["title"])}</a>' for cat in DATA]
    parts += ['</div></nav><div class="ks-menu-container">']
    for cat in DATA:
        parts.append(f'<section class="ks-menu-group" id="ks-{cat["id"]}" aria-labelledby="ks-{cat["id"]}-title">')
        parts.append(f'<div class="ks-menu-heading"><h2 id="ks-{cat["id"]}-title">{html.escape(cat["title"])}</h2><span class="ks-menu-count">{len(cat["items"])} rätter</span></div><div class="ks-menu-grid">')
        for item in cat['items']:
            parts.append('<article class="ks-menu-item"><div class="ks-menu-photo">')
            parts.append(image_markup(item,absolute))
            parts.append('</div><div class="ks-menu-caption"><div class="ks-menu-titleline">')
            parts.append(f'<span class="ks-menu-number">{item["number"]:02d}</span><h3>{html.escape(item["name"])}</h3></div>')
            parts.append(f'<p>{html.escape(item["description"])}</p></div></article>')
        parts.append('</div></section>')
    parts.append('</div></main>')
    return ''.join(parts)

css=Path('styles.css').read_text()
local='<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="description" content="Kolgrill Sams meny med beskrivningar och priser i bilderna."><title>Vår meny | Kolgrill Sam</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css"><style>body{margin:0}</style></head><body>'+markup()+'</body></html>'
Path('index.html').write_text(local)
# Breakdance imports the same scoped styles, with absolute asset URLs for its hosted page.
wp_css=css.replace("url('assets/",f"url('{BASE}assets/")
Path('wordpress-fragment.html').write_text('<style>'+wp_css+'</style>'+markup(absolute=True))
