/** @type {import('tailwindcss').Config} */
module.exports = {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], //unuse css remove here
    theme: {
        extend: {
            fontFamily: {
                nunitoRegular: ['Nunito Regular'],
                nunitoMedium: ['Nunito Medium'],
                nunitoBold: ['Nunito Bold'],
                nunitoBlack: ['Nunito Black'],
                nunitoLight: ['Nunito Light'],

            },
            colors: {
                errortext: "#EF4949",
                lightRed: "rgba(239, 73, 73, 0.2)",
                darkbg: "#151929",
                border: "#404050",
                textgray: "#6A6A78",
                green: "#57CD53",
                lightGray: "#333748",
                white: "#FFFFFF",
                yellow: '#FFCD2C',
                lightBrown: "rgba(255, 205, 44, 0.4);",
                lightbg: "#262938",
                darkGray: "#151929",
                metallicSilver: "#9EA7AD",
                vividYellow: "#FEE505",
                yellowOrange: "#FE9705",
                azure: "#0085FF",
                limeGreen: "#3AC430",
                lightgreen: "rgba(58, 196, 48, 0.2)",
                carminePink: "#EF4949",
                arsenic: "#404050",
                Low: '#FEE505',
                High: '#EF4949',
                Medium: '#FE9705'
            },
        }
    },
    plugins: [],
}
