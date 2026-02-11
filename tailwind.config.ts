
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
				'sans': ['Poppins', 'sans-serif'],
				'heading': ['Montserrat', 'sans-serif'],
			},
			colors: {
				background: '#0A0A0A', // rich-black
				foreground: '#FFFFFF',
				border: '#2A2A2A',
				input: '#2A2A2A',
				ring: '#D4AF37', // gold
				primary: {
					DEFAULT: '#8B0000', // luxury-red
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#2A2A2A',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#2A2A2A',
					foreground: '#A3A3A3'
				},
				accent: {
					DEFAULT: '#D4AF37', // gold
					foreground: '#0A0A0A'
				},
				popover: {
					DEFAULT: '#1A1A1A',
					foreground: '#FFFFFF'
				},
				card: {
					DEFAULT: '#1A1A1A',
					foreground: '#FFFFFF'
				},
				gold: {
					DEFAULT: '#D4AF37', // Metallic Gold
					light: '#F4C430',
					dark: '#AA8C2C',
					shimmer: '#FFD700'
				},
				silver: {
					DEFAULT: '#C0C0C0',
					light: '#E8E8E8',
					dark: '#A9A9A9'
				},
				'luxury-red': {
					DEFAULT: '#8B0000', // Dark Red
					light: '#A52A2A',
					dark: '#580000',
					vivid: '#C41E3A'
				},
				'rich-black': {
					DEFAULT: '#0A0A0A',
					light: '#1A1A1A',
					lighter: '#2A2A2A'
				},
				// Modern neutral colors
				neutral: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#E5E5E5',
					300: '#D4D4D4',
					400: '#A3A3A3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px',
				xl: '16px'
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
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(15px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
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
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
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
