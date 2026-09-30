document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // VERIFICAÇÃO DE LOGIN
    // ==========================================
    if (!DB.requireLogin()) return;

    const session = DB.getSession();

    // Preenche o perfil do usuário na navbar
    const navAvatar = document.getElementById('navAvatar');
    const navUsername = document.getElementById('navUsername');
    if (session) {
        if (navAvatar) navAvatar.src = session.avatar;
        if (navUsername) navUsername.textContent = session.username;
    }

    // Botão de logout
    const logoutBtn = document.getElementById('navLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            DB.logout();
            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // MENU MOBILE (HAMBÚRGUER)
    // ==========================================
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');

    function toggleMobileMenu(open) {
        if (!mobileMenu || !menuBackdrop) return;
        const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', isOpen);
        menuBackdrop.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => toggleMobileMenu());
    }
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    // ==========================================
    // SISTEMA DE BUSCA
    // ==========================================
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchHistory = document.getElementById('searchHistory');
    const searchHistoryTags = document.getElementById('searchHistoryTags');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    function openSearch() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
        renderSearchHistory();
    }

    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchEmpty.style.display = 'none';
        searchHistory.style.display = 'block';
    }

    function renderSearchHistory() {
        const history = DB.getSearchHistory();
        searchHistoryTags.innerHTML = '';
        if (history.length === 0) {
            searchHistory.style.display = 'none';
            return;
        }
        searchHistory.style.display = 'block';
        history.forEach(item => {
            const tag = document.createElement('div');
            tag.className = 'search-history-tag';
            tag.innerHTML = `
                <span class="search-history-text" data-query="${item.query}">${item.query}</span>
                <button class="search-history-remove" data-query="${item.query}" title="Remover"><i class="fa-solid fa-xmark"></i></button>
            `;
            searchHistoryTags.appendChild(tag);
        });

        searchHistoryTags.querySelectorAll('.search-history-text').forEach(el => {
            el.addEventListener('click', () => {
                searchInput.value = el.dataset.query;
                performSearch(el.dataset.query);
            });
        });

        searchHistoryTags.querySelectorAll('.search-history-remove').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                DB.removeSearch(el.dataset.query);
                renderSearchHistory();
                if (!searchInput.value.trim()) {
                    searchResults.style.display = 'none';
                    searchEmpty.style.display = 'none';
                }
            });
        });
    }

    function performSearch(query) {
        if (!query || query.trim().length === 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            searchEmpty.style.display = 'none';
            searchHistory.style.display = 'block';
            return;
        }

        searchHistory.style.display = 'none';
        const results = DB.searchMovies(query);

        if (results.length === 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            searchEmpty.style.display = 'flex';
            return;
        }

        searchEmpty.style.display = 'none';
        searchResults.style.display = 'grid';

        searchResults.innerHTML = results.map(movie => {
            const thumb = movie.thumb || movie.heroImg;
            const ageClass = movie.ageClass || 'r12';
            return `
                <a href="detalhes.html?id=${movie.key}" class="search-result-card">
                    <img src="${thumb}" alt="${movie.title}" class="search-result-img">
                    <div class="search-result-info">
                        <h4>${movie.title}</h4>
                        <div class="card-meta">
                            <span class="badge-age ${ageClass}">${movie.age || 'L'}</span>
                            <span class="badge-res">${movie.res || 'HD'}</span>
                            <span class="search-result-genre">${movie.genre || ''}</span>
                        </div>
                    </div>
                </a>`;
        }).join('');

        DB.addSearch(query);
        renderSearchHistory();
    }

    let searchDebounce;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => performSearch(searchInput.value.trim()), 250);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value.trim());
            }
        });
    }

    if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            searchEmpty.style.display = 'none';
            searchHistory.style.display = 'block';
            searchInput.focus();
        });
    }
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            DB.clearSearchHistory();
            renderSearchHistory();
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });

    // ==========================================
    // CONSTRUÇÃO DINÂMICA DO CONTEÚDO (HOME)
    // ==========================================

    // Fileiras de filmes exibidas na página inicial
    const homeMovieRows = [
        {
            title: "Novidades no Nobre+",
            keys: ["vingadores-doutor-destino", "homem-aranha", "moana-2", "capitao-america-guerra-civil", "mufasa-o-rei-leao"]
        },
        {
            title: "Recomendados para Você",
            keys: ["vingadores-ultimato", "vingadores-guerra-infinita", "vingadores-era-de-ultron", "one-piece-film-red", "demon-slayer-castelo-infinito"]
        }
    ];

    // Gera um card de filme a partir da chave no moviesDatabase
    function createMovieCard(key) {
        const movie = moviesDatabase[key];
        if (!movie) return '';
        const ageClass = movie.ageClass || 'r12';
        const thumb = movie.thumb || movie.heroImg;
        return `
            <div class="movie-card" data-movie-key="${key}" data-trailer="${movie.trailerId || ''}" data-title="${movie.title}">
                <img src="${thumb}" alt="${movie.title}" class="card-thumb">
                <div class="video-container"></div>
                <div class="card-overlay">
                    <div class="card-info">
                        <h4>${movie.title}</h4>
                        <div class="card-meta">
                            <span class="badge-age ${ageClass}">${movie.age || 'L'}</span>
                            <span class="badge-res">${movie.res || 'HD'}</span>
                            <span class="card-genre">${movie.genre || ''}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // Gera a estrutura de uma fileira de filmes (título + wrapper com botões)
    function buildMovieRowSection({ title, keys }) {
        const section = document.createElement('section');
        section.className = 'movie-row-section';
        section.innerHTML = `
            <h2>${title}</h2>
            <div class="movie-row-wrapper">
                <button class="row-nav-btn prev-btn" aria-label="Voltar"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="movie-row">${keys.map(createMovieCard).join('')}</div>
                <button class="row-nav-btn next-btn" aria-label="Avançar"><i class="fa-solid fa-chevron-right"></i></button>
            </div>`;
        return section;
    }

    // Gera a fileira de pôsteres (posters verticais estilo Disney+)
    function buildPosterRowSection() {
        const section = document.createElement('section');
        section.className = 'poster-row-section';
        section.innerHTML = `
            <h2>Recomendado para Você</h2>
            <div class="poster-row-wrapper">
                <button class="row-nav-btn prev-btn" aria-label="Voltar"><i class="fa-solid fa-chevron-left"></i></button>
                <div class="poster-row">
                    ${posterRow.map(p => {
                        const movie = moviesDatabase[p.key] || {};
                        const genreShort = (movie.genre || '').split('•')[0].split(',')[0].trim();
                        return `
                        <div class="poster-card" data-movie-key="${p.key}">
                            <img src="${p.img}" alt="${movie.title || ''}" class="poster-img">
                            <div class="poster-overlay">
                                <h4 class="poster-title">${movie.title || ''}</h4>
                                <div class="poster-meta">
                                    <span class="badge-age ${movie.ageClass || 'r12'}">${movie.age || 'L'}</span>
                                    <span class="poster-subtext">${movie.release || '2024'} • ${genreShort}</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
                <button class="row-nav-btn next-btn" aria-label="Avançar"><i class="fa-solid fa-chevron-right"></i></button>
            </div>`;
        return section;
    }

    // ==========================================
    // CARROSSEL GENÉRICO (REUTILIZÁVEL)
    // ==========================================
    let homeCarousel = null;
    let disneyCarousel = null;

    function buildCarousel(slidesData, containerId, dotsId) {
        const container = document.getElementById(containerId);
        const dotsContainer = document.getElementById(dotsId);
        if (!container || !dotsContainer) return null;

        container.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Botões de navegação lateral (< e >)
        const prevArrow = document.createElement('button');
        prevArrow.className = 'carousel-nav-arrow prev';
        prevArrow.setAttribute('aria-label', 'Slide anterior');
        prevArrow.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

        const nextArrow = document.createElement('button');
        nextArrow.className = 'carousel-nav-arrow next';
        nextArrow.setAttribute('aria-label', 'Próximo slide');
        nextArrow.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        container.appendChild(prevArrow);
        container.appendChild(nextArrow);

        slidesData.forEach((slide) => {
            const slideEl = document.createElement('div');
            slideEl.className = 'carousel-slide';
            slideEl.dataset.movieKey = slide.key;

            const badgeHtml = slide.badge ? `<span class="hero-badge">${slide.badge}</span>` : '';
            const brandLogoHtml = slide.brandLogo ? `<img src="${slide.brandLogo}" class="hero-brand-logo" alt="Brand">` : '';
            const brandTextHtml = slide.brand ? `<span class="hero-brand-text">${slide.brand}</span>` : '';
            const subtitleHtml = slide.subtitle ? `<h3 class="hero-subtitle">${slide.subtitle}</h3>` : '';
            const metaHtml = `
                <div class="hero-meta">
                    ${slide.age ? `<span class="hero-age ${slide.ageClass || 'r12'}">${slide.age}</span>` : ''}
                    ${slide.year ? `<span class="hero-year">${slide.year}</span>` : ''}
                    ${slide.genre ? `<span>•</span> <span class="hero-genre">${slide.genre}</span>` : ''}
                </div>`;
            const descHtml = slide.description ? `<p class="hero-desc">${slide.description}</p>` : '';

            slideEl.innerHTML = `
                <img src="${slide.img}" alt="${slide.title}" class="slide-bg">
                <div class="slide-content">
                    ${badgeHtml}
                    ${brandLogoHtml || brandTextHtml}
                    <h1 class="movie-title">${slide.title}</h1>
                    ${subtitleHtml}
                    ${metaHtml}
                    ${descHtml}
                    <button class="hero-btn-details">DETALHES</button>
                </div>`;
            container.appendChild(slideEl);
        });

        slidesData.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        const slides = container.querySelectorAll('.carousel-slide');
        const dots = dotsContainer.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoPlayInterval;
        const AUTO_PLAY_INTERVAL = 6000;

        function updateCarousel() {
            slides.forEach((slide, i) => {
                if (i === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToNextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function goToPrevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(goToNextSlide, AUTO_PLAY_INTERVAL);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            goToPrevSlide();
            resetAutoPlay();
        });

        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            goToNextSlide();
            resetAutoPlay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                resetAutoPlay();
            });
        });

        slides.forEach((slide) => {
            const btn = slide.querySelector('.hero-btn-details');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMovieDetails(slide);
                });
            }
            slide.addEventListener('click', () => {
                openMovieDetails(slide);
            });
        });

        updateCarousel();
        startAutoPlay();

        return { stopAutoPlay, startAutoPlay, resetAutoPlay };
    }

    // ==========================================
    // CONSTRUÇÃO DA ABA "PARA VOCÊ" (HOME)
    // ==========================================
    homeCarousel = buildCarousel(featuredSlides, 'carouselContainer', 'carouselDots');

    homeMovieRows.forEach(row => {
        document.getElementById('dynamicSections').appendChild(buildMovieRowSection(row));
    });
    document.getElementById('dynamicSections').appendChild(buildPosterRowSection());

    // ==========================================
    // CONSTRUÇÃO DA ABA "DISNEY+"
    // ==========================================
    let disneyBuilt = false;

    function buildDisneyTab() {
        if (disneyBuilt) return;
        disneyBuilt = true;

        const container = document.getElementById('disneyDynamicSections');
        if (!container) return;

        disneyPlusMovieRows.forEach(row => {
            container.appendChild(buildMovieRowSection(row));
        });

        // Setup hover/trailer e scroll para os novos cards
        setupAllMovieCardInteractions(container);
        container.querySelectorAll('.movie-row-wrapper, .poster-row-wrapper').forEach(setupHorizontalScroll);
        container.querySelectorAll('.poster-card').forEach(card => {
            card.addEventListener('click', () => openMovieDetails(card));
        });
    }

    // ==========================================
    // CONSTRUÇÃO DA ABA "POKÉMON"
    // ==========================================
    let pokemonBuilt = false;

    function buildPokemonTab() {
        if (pokemonBuilt) return;
        pokemonBuilt = true;

        const grid = document.getElementById('pokemonTabGrid');
        if (!grid) return;

        pokemonTabKeys.forEach(key => {
            const movie = moviesDatabase[key];
            if (!movie) return;
            const thumb = movie.thumb || movie.heroImg;
            grid.innerHTML += `
                <a href="detalhes.html?id=${key}" class="pokemon-movie-card">
                    <img src="${thumb}" alt="${movie.title}">
                    <div class="pokemon-card-overlay">
                        <h4>${movie.title}</h4>
                        <div class="card-meta">
                            <span class="badge-age ${movie.ageClass || 'r12'}">${movie.age || 'L'}</span>
                            <span class="badge-res">${movie.res || 'HD'}</span>
                        </div>
                    </div>
                </a>`;
        });
    }

    // ==========================================
    // CONSTRUÇÃO DA ABA "SHOWS"
    // ==========================================
    let showsBuilt = false;

    function buildShowsTab() {
        if (showsBuilt) return;
        showsBuilt = true;

        const container = document.getElementById('showsTabGrid');
        if (!container) return;

        // Agrupa os shows por artista
        const byArtist = {};
        showTabKeys.forEach(key => {
            const movie = moviesDatabase[key];
            if (!movie) return;
            const name = movie.artist || movie.title;
            (byArtist[name] = byArtist[name] || []).push(key);
        });

        // Seções na ordem definida em showSections (ou ordem de inserção)
        const order = showSections.length
            ? showSections.map(s => s.artist)
            : Object.keys(byArtist);

        order.forEach(artistName => {
            const keys = byArtist[artistName] || [];
            if (!keys.length) return;

            const section = document.createElement('div');
            section.className = 'shows-artist-section';

            const heading = document.createElement('h3');
            heading.className = 'shows-artist-title';
            heading.textContent = artistName;
            section.appendChild(heading);

            const grid = document.createElement('div');
            grid.className = 'shows-artist-grid';

            keys.forEach(key => {
                const movie = moviesDatabase[key];
                const thumb = movie.thumb || movie.heroImg;
                const a = document.createElement('a');
                a.href = `detalhes.html?id=${key}`;
                a.className = 'pokemon-movie-card';
                a.innerHTML = `
                    <img src="${thumb}" alt="${movie.title}">
                    <div class="pokemon-card-overlay">
                        <h4>${movie.title}</h4>
                        <div class="card-meta">
                            <span class="badge-age ${movie.ageClass || 'r12'}">${movie.age || 'L'}</span>
                            <span class="badge-res">${movie.res || 'HD'}</span>
                        </div>
                    </div>`;
                grid.appendChild(a);
            });

            section.appendChild(grid);
            container.appendChild(section);
        });
    }

    // ==========================================
    // LÓGICA DE ABAS (TAB SWITCHING)
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-bar .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Atualiza botões
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Atualiza conteúdo
            tabContents.forEach(tc => tc.classList.remove('active'));
            const targetContent = document.getElementById('tab-' + targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                // Re-trigger animation
                targetContent.style.animation = 'none';
                targetContent.offsetHeight; // force reflow
                targetContent.style.animation = '';
            }

            // Parar todos os carrosséis
            if (homeCarousel) homeCarousel.stopAutoPlay();
            if (disneyCarousel) disneyCarousel.stopAutoPlay();

            // Gerenciar carrosséis por aba
            if (targetTab === 'paravoce') {
                if (homeCarousel) homeCarousel.startAutoPlay();
            } else if (targetTab === 'disneyplus') {
                buildDisneyTab();
                if (!disneyCarousel) {
                    disneyCarousel = buildCarousel(disneyPlusSlides, 'disneyCarouselContainer', 'disneyCarouselDots');
                } else {
                    disneyCarousel.startAutoPlay();
                }
            } else if (targetTab === 'pokemon') {
                buildPokemonTab();
            } else if (targetTab === 'shows') {
                buildShowsTab();
            }

            // Scroll ao topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    // Navega para a página de detalhes do filme
    function openMovieDetails(element) {
        const key = findMovieKey(element);
        window.location.href = `detalhes.html?id=${key}`;
    }

    // Exibe um aviso temporário (toast)
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        requestAnimationFrame(() => toast.classList.add('show'));
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    // ==========================================
    // PRÉVIA / TRAILER AO PASSAR O MOUSE (HOVER)
    // ==========================================
    function setupAllMovieCardInteractions(container) {
        const movieCards = container.querySelectorAll('.movie-card');

        movieCards.forEach(card => {
            let hoverTimeout;
            const videoContainer = card.querySelector('.video-container');
            const trailerId = card.getAttribute('data-trailer');

            card.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    if (trailerId && videoContainer) {
                        const embedSrc = buildEmbedUrl(
                            trailerId,
                            `autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`
                        );
                        videoContainer.innerHTML = `
                            <iframe 
                                src="${embedSrc}"
                                title="Trailer"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen>
                            </iframe>
                        `;
                        videoContainer.classList.add('active');
                    }
                }, 400);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                if (videoContainer) {
                    videoContainer.classList.remove('active');
                    videoContainer.innerHTML = '';
                }
            });

            // Clique no card de filme -> Navega para a página de detalhes separada
            card.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() === 'iframe') return;
                openMovieDetails(card);
            });
        });
    }

    // Setup inicial para os cards da home
    setupAllMovieCardInteractions(document.getElementById('tab-paravoce'));

    // ==========================================
    // CLIQUE NOS POSTERS DA FILEIRA VERTICAL
    // ==========================================
    document.querySelectorAll('.poster-card').forEach(card => {
        card.addEventListener('click', () => openMovieDetails(card));
    });

    // ==========================================
    // SCROLL HORIZONTAL COM RODINHA, BOTÕES E ARRASTAR
    // ==========================================

    // Configura uma fileira para rolar horizontalmente:
    //  - rodinha do mouse
    //  - botões prev/next
    //  - arrastar com o mouse (drag to scroll)
    function setupHorizontalScroll(wrapper) {
        const row = wrapper.querySelector('.movie-row') || wrapper.querySelector('.poster-row');
        if (!row) return;

        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        // 1. Rolar horizontalmente usando a rodinha do mouse
        row.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                row.scrollLeft += e.deltaY * 1.5;
            }
        }, { passive: false });

        // 2. Botões de navegação lateral
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                row.scrollBy({ left: -600, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                row.scrollBy({ left: 600, behavior: 'smooth' });
            });
        }

        // 3. Arrastar com o mouse (Drag to Scroll)
        let isDown = false;
        let startX;
        let scrollLeft;

        row.addEventListener('mousedown', (e) => {
            if (e.target.tagName.toLowerCase() === 'iframe') return;
            isDown = true;
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
        });

        row.addEventListener('mouseleave', () => { isDown = false; });
        row.addEventListener('mouseup', () => { isDown = false; });

        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 1.5;
            row.scrollLeft = scrollLeft - walk;
        });
    }

    // Aplica o scroll horizontal nas fileiras de filmes e pôsteres
    document.querySelectorAll('.movie-row-wrapper, .poster-row-wrapper').forEach(setupHorizontalScroll);

    // ==========================================
    // NAVEGAÇÃO (LINKS DO MENU)
    // ==========================================
    const navActions = {
        'HOME': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        'FILMES': () => {
            const section = document.querySelector('.movie-row-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            else showToast('Filmes em breve');
        },
        'PESQUISA': () => openSearch(),
        'MINHA LISTA': () => showToast('Minha Lista em breve'),
        'SÉRIES': () => showToast('Séries em breve'),
        'ORIGINAIS': () => showToast('Originais em breve'),
        'CONFIGURAÇÕES': () => showToast('Configurações em breve')
    };

    document.querySelectorAll('.nav-links a').forEach(link => {
        const label = link.textContent.trim().toUpperCase();
        const action = navActions[label];
        if (!action) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            action();
        });
    });

    // Links do menu mobile
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        const label = link.textContent.trim().toUpperCase();
        const action = navActions[label];
        if (!action) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.mobile-menu a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            toggleMobileMenu(false);
            action();
        });
    });

    // Cards de marca
    document.querySelectorAll('.brand-card').forEach(card => {
        card.addEventListener('click', () => {
            const brand = (card.dataset.brand || card.textContent.trim().toUpperCase());
            const routes = {
                'MARVEL': 'marvel.html',
                'POKÉMON': 'pokemon.html',
                'POKEMON': 'pokemon.html',
                'DISNEY': 'disney.html',
                'PIXAR': 'pixar.html',
                'STARWARS': 'starwars.html',
                'STAR WARS': 'starwars.html',
                'STAR': 'star.html'
            };
            const target = routes[brand] || routes[brand.toUpperCase()];
            if (target) {
                window.location.href = target;
            } else {
                showToast('Disponível em breve');
            }
        });
    });
});