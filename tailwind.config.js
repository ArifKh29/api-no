/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./app/views/**/*.{html,js,ejs}", "./public/**/*.{html,js,ejs}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: [
        'Inter var',
        {
          fontFeatureSettings: '"cv02","cv03","cv04","cv11"',
          fontVariationSettings: 'normal'
        },
      ],
    },
    extend: {
      colors: {
        'primary': colors.indigo,
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        bouncein: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.1)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '70%': {
            transform: 'scale(0.97)'
          },
          '100%': {
            transform: 'scale(1)',
          }
        },
        bounceout: {
          '0%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '30%': {
            transform: 'scale(0.98)'
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(1)'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.5)',
          }
        },
        'fade-in-left-bounce': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)'
          },
          '60%': {
            opacity: '1',
            transform: 'translateX(2px)'
          },
          '80%': {
            transform: 'translateX(-1px)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'fade-in-right-bounce': {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)'
          },
          '60%': {
            opacity: '1',
            transform: 'translateX(-2px)'
          },
          '80%': {
            transform: 'translateX(1px)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'fade-in-top-bounce': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)'
          },
          '60%': {
            opacity: '1',
            transform: 'translateY(2px)'
          },
          '80%': {
            transform: 'translateY(-1px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        'fade-in-bottom-bounce': {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '60%': {
            opacity: '1',
            transform: 'translateY(-2px)'
          },
          '80%': {
            transform: 'translateY(1px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        idleY: {
          '0%': {
            transform: 'translateY(-2%)'
          },
          '50%': {
            transform: 'translateY(2%)'
          },
          '100%': {
            transform: 'translateY(-2%)'
          }
        },
        idleX: {
          '0%': {
            transform: 'translateX(-2%)'
          },
          '50%': {
            transform: 'translateX(2%)'
          },
          '100%': {
            transform: 'translateX(-2%)'
          }
        },
        footerproduct: {
          '0%': {
            transform: 'translateY(100%)'
          },
          '100%': {
            transform: 'translateY(0%)'
          }
        },
        popupin: {
            '0%': {
              opacity: '0',
              transform: 'scale(0.5)'
            },
            '50%': {
              opacity: '1',
              transform: 'scale(1)'
            },
            '70%': {
                transform: 'scale(0.98)'
            },
            '100%': {
              transform: 'scale(1)',
            }
          },
      },
      animation: {
        "fade-in": 'fadeIn 0.2s ease-in-out',

        'fade-in-left-bounce': 'fade-in-left-bounce 0.7s ease-in-out',
        'fade-out-left-bounce': 'fade-in-left-bounce 0.7s ease-in-out reverse',
        'fade-in-left-bounce-2': 'fade-in-left-bounce 0.7s ease-in-out 0.1s',
        'fade-in-left-bounce-3': 'fade-in-left-bounce 1s ease-in-out 0.1s',
        'fade-in-left-bounce-4': 'fade-in-left-bounce 1.4s ease-in-out 0.1s',

        'fade-in-right-bounce': 'fade-in-right-bounce 0.7s ease-in-out',

        'fade-in-top-bounce': 'fade-in-top-bounce 0.7s ease-in-out',
        'fade-in-bottom-bounce': 'fade-in-bottom-bounce 0.7s ease-in-out',

        "bounce-in": 'bouncein 0.5s ease-in-out',
        "bounce-out": 'bounceout 0.5s ease-in-out',

        "popup-in": "popupin 0.5s ease-in-out",

        "idleX": 'idleX 3s linear infinite',
        "idleY": 'idleY 3s linear infinite',

        "footer-product": 'footerproduct 1s ease-in-out'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    colors,
  ],
}

