// tailwind.config.js
module.exports = {
  content: [
    // This tells Tailwind to scan all React components for class names
    // In a real project, it would look at files like:
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here, e.g.,
      colors: {
        'matrix-green': '#0F0',
      },
      fontFamily: {
        mono: ['"SF Mono"', 'monospace'], // Example for a custom monospace font
      }
    },
  },
  plugins: [],
}
