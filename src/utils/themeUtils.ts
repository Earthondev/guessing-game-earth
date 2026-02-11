
export type SeasonalTheme = 'default' | 'halloween' | 'christmas' | 'songkran' | 'valentines';

interface ThemeConfig {
    name: SeasonalTheme;
    className: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    elements: {
        confettiColors: string[];
    };
}

const THEMES: Record<SeasonalTheme, ThemeConfig> = {
    default: {
        name: 'default',
        className: 'theme-default',
        colors: {
            primary: '#8B0000', // Luxury Red
            secondary: '#2A2A2A',
            accent: '#D4AF37', // Gold
            background: 'linear-gradient(to bottom, #0A0A0A 0%, #1A1110 100%)',
        },
        elements: {
            confettiColors: ['#FFD700', '#FFA500', '#FF4500'],
        },
    },
    halloween: {
        name: 'halloween',
        className: 'theme-halloween',
        colors: {
            primary: '#FF7518', // Pumpkin Orange
            secondary: '#2E0854', // Deep Purple
            accent: '#72B043', // Slime Green
            background: 'linear-gradient(to bottom, #000000 0%, #2E0854 100%)',
        },
        elements: {
            confettiColors: ['#FF7518', '#000000', '#72B043'],
        },
    },
    christmas: {
        name: 'christmas',
        className: 'theme-christmas',
        colors: {
            primary: '#D42426', // Santa Red
            secondary: '#165B33', // Pine Green
            accent: '#F8B229', // Star Gold
            background: 'linear-gradient(to bottom, #165B33 0%, #0F3A22 100%)',
        },
        elements: {
            confettiColors: ['#D42426', '#FFFFFF', '#165B33'],
        },
    },
    songkran: {
        name: 'songkran',
        className: 'theme-songkran',
        colors: {
            primary: '#00BFFF', // Water Blue
            secondary: '#FF69B4', // Hot Pink (Floral Shirt)
            accent: '#FFFF00', // Yellow
            background: 'linear-gradient(to bottom, #E0FFFF 0%, #87CEEB 100%)',
        },
        elements: {
            confettiColors: ['#00BFFF', '#FF69B4', '#FFFF00'],
        },
    },
    valentines: {
        name: 'valentines',
        className: 'theme-valentines',
        colors: {
            primary: '#FF1493', // Deep Pink
            secondary: '#FFC0CB', // Pink
            accent: '#FFFFFF', // White
            background: 'linear-gradient(to bottom, #FFC0CB 0%, #FF69B4 100%)',
        },
        elements: {
            confettiColors: ['#FF1493', '#FFC0CB', '#FFFFFF'],
        },
    },
};

export const getSeasonalTheme = (): ThemeConfig => {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    // Valentines: Feb 1-15
    if (month === 2 && day <= 15) return THEMES.valentines;

    // Songkran: Apr 1-16
    if (month === 4 && day <= 16) return THEMES.songkran;

    // Halloween: Oct 20-31
    if (month === 10 && day >= 20) return THEMES.halloween;

    // Christmas: Dec 15-31
    if (month === 12 && day >= 15) return THEMES.christmas;

    // Default
    return THEMES.default;
};

export const applyTheme = (theme: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--accent', theme.colors.accent);
    // Add more CSS variables as needed
    document.body.className = theme.className;

    // For background, we might need a specific class or style on body
    // This is a simplified approach
};
