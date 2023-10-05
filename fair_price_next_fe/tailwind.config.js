/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    theme: {
      colors: {
        transparent: 'transparent',
        black: '#000',
        white: '#fff',
        gray: {
          100: '#f7fafc',
          500: '#3f4d67',
          // f4f7fa
          900: '#1a202c',
        },
        customgray: '#3f4d67',
        // ...
      }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // colors : {
      //   gray: {
      //     100: '#f7fafc',
      //     500: '#3f4d67',
      //     // f4f7fa
      //     900: '#1a202c',
      //   },
      // },
    },
  },
  plugins: [],
}

