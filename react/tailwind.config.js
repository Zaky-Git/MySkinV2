/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                whiteTW: "#FFFFFF",
                primaryTW: "#2AA8FF",
                secondaryTW: "#102851",
                primaryAlternativeTW: "#EBF7FF",
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [],
};
