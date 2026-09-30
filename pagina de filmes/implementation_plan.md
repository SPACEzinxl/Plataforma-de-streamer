# Plano: Preview de Trailers no Hover dos Banners

## O que vai acontecer:
- Cada banner da fileira de filmes vai ter um trailer do YouTube
- Ao passar o mouse (hover), após ~600ms de delay, o trailer aparece com autoplay + muted
- Ao tirar o mouse, o vídeo some e a imagem volta
- Efeito suave com fade + scale, igual ao Disney+/Netflix

## Mudanças:
### index.html
- Cada `<img>` vira um `.movie-card` com imagem + iframe do YouTube

### style.css
- Estilos para `.movie-card`, `.movie-trailer-overlay`, fade e animações

### script.js
- Lógica de hover com delay (evita carregar vídeo ao passar rápido)
- Carrega/descarrega o src do iframe dinamicamente
