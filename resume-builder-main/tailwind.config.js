module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use RGB colors instead of OKLCH
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
        },
        secondary: {
          DEFAULT: '#1F2937', // gray-800
          light: '#374151',   // gray-700
        }
      },
    },
  },
  plugins: [],
}