/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif']
      },
      colors: {
        ink: '#322c27',
        roseSoft: '#f8e6df',
        lilacSoft: '#e6efe7',
        mintSoft: '#dfeee5',
        sunSoft: '#f7ead2',
        coralSoft: '#f8e6df',
        arcillaBg: '#fbf6f0',
        arcillaSurface: '#ffffff',
        arcillaLine: '#ece1d6',
        arcillaSub: '#6f655c',
        arcillaMuted: '#9c9087',
        period: '#ce6b54',
        fertile: '#6e9277',
        ovulation: '#e0a23a'
      },
      boxShadow: {
        soft: '0 18px 44px rgba(50, 44, 39, 0.08)'
      }
    },
  },
  plugins: [],
};
