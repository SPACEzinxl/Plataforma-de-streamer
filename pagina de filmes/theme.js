/* ============================================
   NOBRE+ THEME ENGINE (Aura Imperial)
   Aplica tema (accent + modo) salvo em localStorage
   ============================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'nobre_theme';

    var DEFAULT_THEME = {
        mode: 'dark',          // dark | light | auto
        accent: 'dourado'      // dourado | rubi | safira | esmeralda | ametista
    };

    var ACCENTS = {
        dourado: {
            primary: '#f2ca50', secondary: '#e3c36e', tertiary: '#d3ad65',
            gold: '#f2ca50', goldBright: '#ffe088', goldDark: '#d4af37', goldDeep: '#997a1e',
            goldGlow: 'rgba(242, 202, 80, 0.35)', goldGlowSubtle: 'rgba(242, 202, 80, 0.12)',
            goldGradient: 'linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #aa8520 100%)',
            goldShimmer: 'linear-gradient(90deg, transparent, rgba(242, 202, 80, 0.15), transparent)',
            borderGold: 'rgba(212, 175, 55, 0.18)', borderGoldFocus: 'rgba(242, 202, 80, 0.85)',
            accent: '#d4af37', accentContrast: '#241a00'
        },
        rubi: {
            primary: '#ef5350', secondary: '#e57373', tertiary: '#c62828',
            gold: '#ef5350', goldBright: '#ff8a80', goldDark: '#c62828', goldDeep: '#8e1f1f',
            goldGlow: 'rgba(239, 83, 80, 0.35)', goldGlowSubtle: 'rgba(239, 83, 80, 0.12)',
            goldGradient: 'linear-gradient(135deg, #ff8a80 0%, #c62828 50%, #8e1f1f 100%)',
            goldShimmer: 'linear-gradient(90deg, transparent, rgba(239, 83, 80, 0.15), transparent)',
            borderGold: 'rgba(198, 40, 40, 0.18)', borderGoldFocus: 'rgba(239, 83, 80, 0.85)',
            accent: '#c62828', accentContrast: '#2a0000'
        },
        safira: {
            primary: '#38bdf8', secondary: '#7dd3fc', tertiary: '#0284c7',
            gold: '#38bdf8', goldBright: '#7dd3fc', goldDark: '#0284c7', goldDeep: '#075985',
            goldGlow: 'rgba(56, 189, 248, 0.35)', goldGlowSubtle: 'rgba(56, 189, 248, 0.12)',
            goldGradient: 'linear-gradient(135deg, #7dd3fc 0%, #0284c7 50%, #075985 100%)',
            goldShimmer: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)',
            borderGold: 'rgba(2, 132, 199, 0.18)', borderGoldFocus: 'rgba(56, 189, 248, 0.85)',
            accent: '#0284c7', accentContrast: '#01121d'
        },
        esmeralda: {
            primary: '#34d399', secondary: '#6ee7b7', tertiary: '#059669',
            gold: '#34d399', goldBright: '#6ee7b7', goldDark: '#059669', goldDeep: '#065f46',
            goldGlow: 'rgba(52, 211, 153, 0.35)', goldGlowSubtle: 'rgba(52, 211, 153, 0.12)',
            goldGradient: 'linear-gradient(135deg, #6ee7b7 0%, #059669 50%, #065f46 100%)',
            goldShimmer: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.15), transparent)',
            borderGold: 'rgba(5, 150, 105, 0.18)', borderGoldFocus: 'rgba(52, 211, 153, 0.85)',
            accent: '#059669', accentContrast: '#00271b'
        },
        ametista: {
            primary: '#a78bfa', secondary: '#c4b5fd', tertiary: '#7c3aed',
            gold: '#a78bfa', goldBright: '#c4b5fd', goldDark: '#7c3aed', goldDeep: '#5b21b6',
            goldGlow: 'rgba(167, 139, 250, 0.35)', goldGlowSubtle: 'rgba(167, 139, 250, 0.12)',
            goldGradient: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 50%, #5b21b6 100%)',
            goldShimmer: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.15), transparent)',
            borderGold: 'rgba(124, 58, 237, 0.18)', borderGoldFocus: 'rgba(167, 139, 250, 0.85)',
            accent: '#7c3aed', accentContrast: '#1c0432'
        }
    };

    var MODES = {
        dark: {
            bgDark: '#121317', bgCanvas: '#0d0e12', bgCard: '#1f1f24',
            bgElevated: '#292a2e', bgHighlight: '#343439',
            textLight: '#e3e2e8', textMuted: '#d0c5af', textSubtle: '#99907c',
            surfaceGlass: 'rgba(18, 19, 23, 0.82)',
            error: '#ff6b6b', success: '#2fbf71'
        },
        light: {
            bgDark: '#f4f2ec', bgCanvas: '#ffffff', bgCard: '#ffffff',
            bgElevated: '#efece3', bgHighlight: '#e6e2d5',
            textLight: '#1f1d17', textMuted: '#5a5445', textSubtle: '#8a8270',
            surfaceGlass: 'rgba(255, 255, 255, 0.82)',
            error: '#c62b2f', success: '#1a7f4b'
        }
    };

    var WALLPAPER_KEY = 'nobre_wallpaper';

    var WALLPAPERS = {
        imperial: 'linear-gradient(160deg, #0d0e12 0%, #15161b 45%, #1f2026 100%)',
        nebula: 'radial-gradient(ellipse at 20% 10%, rgba(99, 77, 158, 0.45) 0%, rgba(59, 29, 94, 0) 45%), radial-gradient(ellipse at 85% 110%, rgba(58, 90, 160, 0.4) 0%, rgba(11, 16, 38, 0) 50%), linear-gradient(160deg, #0b1026 0%, #241445 55%, #0d0e12 100%)',
        cinema: 'radial-gradient(ellipse at 50% 0%, rgba(140, 34, 34, 0.4) 0%, rgba(102, 20, 20, 0) 50%), linear-gradient(160deg, #1a0b0b 0%, #4a1010 55%, #0d0e12 100%)',
        golddust: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.35) 0%, rgba(124, 92, 0, 0) 50%), linear-gradient(160deg, #1a1300 0%, #55400a 55%, #0d0e12 100%)',
        midnight: 'linear-gradient(160deg, #06070a 0%, #14161f 55%, #0d0e12 100%)',
        royaltech: 'radial-gradient(ellipse at 80% 0%, rgba(12, 74, 145, 0.5) 0%, rgba(12, 58, 92, 0) 50%), linear-gradient(160deg, #04121f 0%, #0b3050 55%, #0d0e12 100%)'
    };

    function getWallpaper() {
        var w = 'imperial';
        try {
            var saved = localStorage.getItem(WALLPAPER_KEY);
            if (saved && WALLPAPERS[saved]) { w = saved; }
        } catch (e) { /* ignore */ }
        return w;
    }

    function applyWallpaper() {
        var body = document.body;
        if (!body) { return; }
        var name = getWallpaper();
        var bg = WALLPAPERS[name] || WALLPAPERS.imperial;
        var mode = effectiveMode((getSaved() || {}).mode);
        var overlay = mode === 'light'
            ? 'rgba(244, 242, 236, 0.82)'
            : 'linear-gradient(rgba(13, 14, 18, 0.55), rgba(13, 14, 18, 0.78))';
        body.style.background = overlay + ', ' + bg;
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
    }

    function getSaved() {
        var t = DEFAULT_THEME;
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed) { t = parsed; }
            }
        } catch (e) { /* ignore */ }
        return t;
    }

    function effectiveMode(requested) {
        if (requested === 'auto') {
            return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
        }
        return requested === 'light' ? 'light' : 'dark';
    }

    function apply() {
        var theme = getSaved();
        var mode = effectiveMode(theme.mode);
        var accent = ACCENTS[theme.accent] || ACCENTS.dourado;
        var m = MODES[mode] || MODES.dark;
        var r = document.documentElement.style;

        // Modo (fundo / texto)
        r.setProperty('--bg-dark', m.bgDark);
        r.setProperty('--bg-canvas', m.bgCanvas);
        r.setProperty('--bg-card', m.bgCard);
        r.setProperty('--bg-elevated', m.bgElevated);
        r.setProperty('--bg-highlight', m.bgHighlight);
        r.setProperty('--text-light', m.textLight);
        r.setProperty('--text-muted', m.textMuted);
        r.setProperty('--text-subtle', m.textSubtle);
        r.setProperty('--surface-glass', m.surfaceGlass);
        r.setProperty('--color-error', m.error);
        r.setProperty('--color-success', m.success);

        // Cor de destaque (accent)
        r.setProperty('--color-primary', accent.primary);
        r.setProperty('--color-secondary', accent.secondary);
        r.setProperty('--color-tertiary', accent.tertiary);
        r.setProperty('--gold', accent.gold);
        r.setProperty('--gold-bright', accent.goldBright);
        r.setProperty('--gold-dark', accent.goldDark);
        r.setProperty('--gold-deep', accent.goldDeep);
        r.setProperty('--gold-glow', accent.goldGlow);
        r.setProperty('--gold-glow-subtle', accent.goldGlowSubtle);
        r.setProperty('--gold-gradient', accent.goldGradient);
        r.setProperty('--gold-shimmer', accent.goldShimmer);
        r.setProperty('--border-gold', accent.borderGold);
        r.setProperty('--border-gold-focus', accent.borderGoldFocus);
        r.setProperty('--accent', accent.accent);
        r.setProperty('--accent-contrast', accent.accentContrast);
        r.setProperty('--border-subtle', accent.borderGold);
        r.setProperty('--border-focus', accent.borderGoldFocus);

        applyWallpaper();
    }

    function save(theme) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(theme)); } catch (e) {}
        if (window.__applyThemeNow) { window.__applyThemeNow(); }
        apply();
    }

    function get() { return getSaved(); }

    // Expõe globais para as páginas de configuração
    window.NobreTheme = {
        get: get,
        save: save,
        apply: apply,
        ACCENTS: ACCENTS,
        MODES: MODES,
        ACCENT_KEYS: Object.keys(ACCENTS),
        WALLPAPER_KEY: WALLPAPER_KEY,
        WALLPAPERS: WALLPAPERS,
        getWallpaper: getWallpaper,
        applyWallpaper: applyWallpaper
    };

    // Aplica imediatamente ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }
})();
