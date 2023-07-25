import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#e91e63',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomDarkTheme',
    themes: {
        myCustomDarkTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
