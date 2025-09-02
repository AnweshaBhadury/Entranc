/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#24341D', 'm-primary': '#5C7D4F', s1: '#709BCA', s2: '#FFBE0D', s3: '#F88967', 'm-s2': '#765600', 'm-s3': '#DB2222', 'dark-gray': '#404040', 'light-gray': '#8F8F8F', 'bg-white': '#FFFFFF', 'bg-offwhite': '#FFFAF4', 'bg-lightyellow': '#FFF1C9',
            },
            fontFamily: { sans: ['DM Sans', 'sans-serif'], },
            fontSize: {
                'h1-desktop': '92px', 'h2-desktop': '64px', 'h1-tab': '64px', 'h2-tab': '48px', 'h1-phone': '40px', 'h2-phone': '36px', 'h-marquee-phone': '60px',
                'h-marquee-tab': '90px',
                'h-marquee': '120px',
            },
            padding: { 'desktop': '48px', 'tab': '32px', 'phone': '16px', },
            animation: { marquee: 'marquee 25s linear infinite', 'marquee-fast': 'marquee 15s linear infinite',},
            keyframes: { marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' }, }, },
            backgroundImage: {
                'grid-pattern': `linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)`,
            },
            backgroundSize: {
                'grid-size': '40px 40px',
            },

        },
    },
    plugins: [],
}