
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'orbitron': ['Orbitron', 'monospace'],
				'roboto': ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced Masked Rider theme colors
				rider: {
					red: '#DC2626',
					'red-dark': '#B91C1C',
					'red-darker': '#991B1B',
					black: '#1F2937',
					'black-light': '#374151',
					'black-dark': '#111827',
					metal: '#6B7280',
					'metal-light': '#9CA3AF',
					'metal-dark': '#4B5563',
					gold: '#F59E0B',
					'gold-light': '#FBBF24',
					'gold-dark': '#D97706',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'tile-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'tile-reveal': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'50%': { transform: 'scale(1.1)', opacity: '0.7' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #DC2626, 0 0 10px #DC2626',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 20px #DC2626, 0 0 30px #DC2626, 0 0 40px #DC2626',
						transform: 'scale(1.02)'
					}
				},
				'shine': {
					'0%': { transform: 'translateX(-100%) skewX(-15deg)' },
					'100%': { transform: 'translateX(200%) skewX(-15deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'text-glow': {
					'0%, 100%': { textShadow: '0 0 5px #F59E0B, 0 0 10px #F59E0B' },
					'50%': { textShadow: '0 0 20px #F59E0B, 0 0 30px #F59E0B, 0 0 40px #F59E0B' }
				},
				'particle-float': {
					'0%': { transform: 'translateY(0px) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' }
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'tile-flip': 'tile-flip 0.3s ease-in-out',
				'tile-reveal': 'tile-reveal 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shine': 'shine 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'text-glow': 'text-glow 2s ease-in-out infinite',
				'particle-float': 'particle-float 3s ease-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
