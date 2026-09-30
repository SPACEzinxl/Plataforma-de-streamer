document.addEventListener('DOMContentLoaded', () => {
    // Verificar login
    if (!DB.requireLogin()) return;

    const session = DB.getSession();
    const detailAvatar = document.getElementById('detailAvatar');
    if (session && detailAvatar) {
        detailAvatar.src = session.avatar;
    }

    const DEFAULT_MOVIE_KEY = 'vingadores-doutor-destino';

    // ==========================================
    // 1. RESOLVER O FILME A PARTIR DA URL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    let movieId = urlParams.get('id') || DEFAULT_MOVIE_KEY;

    let movie = moviesDatabase[movieId];
    if (!movie) {
        // Tenta achar por busca parcial
        const matchedKey = Object.keys(moviesDatabase).find(k => k.includes(movieId) || movieId.includes(k));
        movie = matchedKey ? moviesDatabase[matchedKey] : moviesDatabase[DEFAULT_MOVIE_KEY];
        movieId = matchedKey || DEFAULT_MOVIE_KEY;
    }

    // ==========================================
    // 2. REFERÊNCIAS AOS ELEMENTOS DA PÁGINA
    // ==========================================
    const getEl = id => document.getElementById(id);

    const detailHeroImg = getEl('detailHeroImg');
    const detailMovieLogo = getEl('detailMovieLogo');
    const detailMovieTitle = getEl('detailMovieTitle');
    const detailTagline = getEl('detailTagline');
    const detailAgeBadge = getEl('detailAgeBadge');
    const detailResBadge = getEl('detailResBadge');
    const detailGenre = getEl('detailGenre');
    const detailDescription = getEl('detailDescription');
    const detailSuggestionsGrid = getEl('detailSuggestionsGrid');

    const detailDuration = getEl('detailDuration');
    const detailRelease = getEl('detailRelease');
    const detailGenreFull = getEl('detailGenreFull');
    const detailDirector = getEl('detailDirector');
    const detailCast = getEl('detailCast');
    const detailRating = getEl('detailRating');

    const playTrailerBtn = getEl('detailPlayTrailerBtn');
    const trailerModal = getEl('trailerModal');
    const trailerCloseBtn = getEl('trailerCloseBtn');
    const trailerVideoWrapper = getEl('trailerVideoWrapper');

    const setText = (el, value, fallback = '') => {
        if (el) el.textContent = value || fallback;
    };

    // ==========================================
    // 3. POPULAR OS DADOS DO FILME NA PÁGINA
    // ==========================================
    document.title = `Nobre+ | ${movie.title}`;

    if (detailHeroImg) {
        detailHeroImg.src = movie.heroImg;
        detailHeroImg.alt = movie.title;
    }

    // ==========================================
    // LOGO DO FILME (imagem real ou gerada)
    // ==========================================
    function escapeXmlLogo(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function buildTextLogo(title, fontSize = 76) {
        const words = String(title || '').trim().split(/\s+/).filter(Boolean);
        const lineLength = 16;
        const lines = [];
        let current = '';
        words.forEach(w => {
            const candidate = current ? current + ' ' + w : w;
            if (candidate.length <= lineLength) {
                current = candidate;
            } else {
                if (current) lines.push(current);
                current = w;
            }
        });
        if (current) lines.push(current);

        const maxChars = Math.max(...lines.map(l => l.length), 1);
        const width = Math.ceil(maxChars * fontSize * 0.66) + 60;
        const height = Math.ceil(lines.length * fontSize * 1.25) + 20;

        const textEls = lines.map((line, i) => {
            const y = ((i + 1) * fontSize * 1.25).toFixed(1);
            return `<text x="30" y="${y}" fill="#ffffff" font-family="'Montserrat', Arial, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="4">${escapeXmlLogo(line)}</text>`;
        }).join('');

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="180%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.95"/>
    </filter>
  </defs>
  <g filter="url(#s)">${textEls}</g>
</svg>`;
        return 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg);
    }

    if (detailMovieLogo) {
        const showLogo = (src, onError) => {
            detailMovieLogo.onerror = onError || null;
            detailMovieLogo.src = src;
            detailMovieLogo.alt = movie.title;
            detailMovieLogo.style.display = 'block';
            if (detailMovieTitle) detailMovieTitle.style.display = 'none';
        };
        if (movie.logoImg) {
            showLogo(movie.logoImg, () => showLogo(buildTextLogo(movie.title), null));
        } else {
            showLogo(buildTextLogo(movie.title), null);
        }
    }

    setText(detailTagline, movie.tagline, 'Disponível no Nobre+');
    setText(detailGenre, movie.genre);
    setText(detailDescription, movie.description);
    setText(detailDuration, movie.duration, '2h 10min');
    setText(detailRelease, movie.release, '2024');
    setText(detailGenreFull, movie.genre);
    setText(detailDirector, movie.director, 'Direção');
    setText(detailCast, movie.cast, 'Elenco Principal');
    setText(detailRating, movie.rating, `${movie.age} anos`);

    if (detailAgeBadge) {
        detailAgeBadge.textContent = movie.age || '12+';
        detailAgeBadge.className = `badge-age ${movie.ageClass || 'r12'}`;
    }

    if (detailResBadge) {
        detailResBadge.textContent = movie.res || '4K HDR';
    }

    // ==========================================
    // 4. RENDERIZAR SUGESTÕES RECOMENDADAS
    // ==========================================
    if (detailSuggestionsGrid) {
        detailSuggestionsGrid.innerHTML = '';
        const suggestions = catalogSuggestions
            .filter(s => s.key !== movieId)
            .slice(0, 6);

        suggestions.forEach(item => {
            const card = document.createElement('a');
            card.href = `detalhes.html?id=${item.key}`;
            card.className = 'suggestion-item-card';
            card.innerHTML = `<img src="${item.img}" alt="${item.title}">`;
            detailSuggestionsGrid.appendChild(card);
        });
    }

    // ==========================================
    // 5. SISTEMA DE ABAS (SUGESTÕES, EXTRAS, DETALHES)
    // ==========================================
    const tabButtons = document.querySelectorAll('.detail-tab-btn');
    const tabPanes = document.querySelectorAll('.detail-tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const activePane = document.getElementById(`tab-${targetTab}`);
            if (activePane) activePane.classList.add('active');
        });
    });

    // ==========================================
    // 6. MODAL DO TRAILER
    // ==========================================
    function openTrailer() {
        const trailerId = movie.trailerId || 'X1aFkAkFASk';
        const embedSrc = buildEmbedUrl(
            trailerId,
            'autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1'
        );
        trailerVideoWrapper.innerHTML = `
            <iframe 
                src="${embedSrc}"
                title="Trailer ${movie.title}"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
        `;
        trailerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTrailer() {
        if (trailerModal) {
            trailerModal.classList.remove('active');
            trailerVideoWrapper.innerHTML = '';
            document.body.style.overflow = '';
        }
    }

    if (playTrailerBtn) playTrailerBtn.addEventListener('click', openTrailer);
    if (trailerCloseBtn) trailerCloseBtn.addEventListener('click', closeTrailer);

    if (trailerModal) {
        trailerModal.addEventListener('click', (e) => {
            if (e.target === trailerModal) closeTrailer();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeTrailer();
    });
});