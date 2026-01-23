/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0B0F19', // Deep space blue
                    card: '#151B2B', // Lighter panel
                    accent: '#3B82F6', // Neon Blue
                    success: '#10B981', // Neon Green
                    warning: '#F59E0B',
                    purple: '#8B5CF6'
                }
            },
            boxShadow: {
                'neon': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
