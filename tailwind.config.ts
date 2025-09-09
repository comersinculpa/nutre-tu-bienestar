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
			padding: '1rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'poppins': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				"background-subpage": "hsl(var(--background-subpage))",
				"background-submenu": "hsl(var(--background-submenu))",
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					hover: 'hsl(var(--primary-hover))',
					light: 'hsl(var(--primary-light))',
					glow: 'hsl(var(--primary-glow))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					dark: 'hsl(var(--secondary-dark))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				crisis: {
					DEFAULT: 'hsl(var(--crisis))',
					foreground: 'hsl(var(--crisis-foreground))',
				},
				// Zen color extensions
				sage: {
					50: "hsl(128 20% 95%)",
					100: "hsl(128 20% 92%)",
					200: "hsl(128 20% 85%)",
					300: "hsl(157 33% 75%)",  
					400: "hsl(157 33% 55%)",
					500: "hsl(157 33% 35%)",
					600: "hsl(157 33% 27%)",
					700: "hsl(158 35% 22%)",
					800: "hsl(144 21% 15%)",
					900: "hsl(144 21% 10%)",
				},
				sand: {
					50: "hsl(37 37% 97%)",
					100: "hsl(37 37% 95%)",
					200: "hsl(37 37% 93%)",
					300: "hsl(37 37% 88%)",
					400: "hsl(37 37% 75%)",
					500: "hsl(37 37% 60%)",
					600: "hsl(37 37% 45%)",
					700: "hsl(37 37% 30%)",
					800: "hsl(37 37% 20%)",
					900: "hsl(37 37% 10%)",
				},
				// Colores especiales para bienestar
				serenity: 'hsl(var(--serenity))',
				warmth: 'hsl(var(--warmth))',
				growth: 'hsl(var(--growth))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-warm': 'var(--gradient-warm)',
				'gradient-serene': 'var(--gradient-serene)',
				'gradient-card': 'var(--gradient-card)',
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'strong': 'var(--shadow-strong)',
				'glow': 'var(--shadow-glow)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '1rem',
				'2xl': '1.2rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			backdropBlur: {
				xs: '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'heart-beat': {
					'0%, 100%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.05)' },
					'50%': { transform: 'scale(1.1)' },
					'75%': { transform: 'scale(1.05)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'from': { boxShadow: '0 0 20px hsl(var(--primary) / 0.2)' },
					'to': { boxShadow: '0 0 30px hsl(var(--primary) / 0.4)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'bounce-gentle': {
					'0%, 20%, 53%, 80%, 100%': {
						animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
						transform: 'translate3d(0, 0, 0)'
					},
					'40%, 43%': {
						animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
						transform: 'translate3d(0, -8px, 0)'
					},
					'70%': {
						animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
						transform: 'translate3d(0, -4px, 0)'
					},
					'90%': { transform: 'translate3d(0, -2px, 0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'heart-beat': 'heart-beat 1.2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 1s infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
