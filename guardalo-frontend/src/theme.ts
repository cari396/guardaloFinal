import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: 'Cabin, sans-serif',
    heading: 'Cabin, sans-serif',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
  },
  lineHeights: {
    body: 'auto',
    heading: 'auto',
  },
  shadows: {
    inner: 'inset 0 0 20px rgba(0, 0, 0, 0.4)',
  },
  bgFilters: {
    header: 'blur(4px)',
  },
  borders: {
    separator: '1px solid ',
  },
  colors: {
    text: '#626584',
    bg: '#F6FCFE',
    primary: '#1E3264',
    green: '#3c7948',
    gray: '#c8d5d9',
    separator: 'rgba(162, 212, 227, 0.5)',
    white: '#ffffff',
    navBG: 'rgba(238, 251, 255, 0.98)',
  },
  layerStyles: {
    cta: {
      color: 'white',
      bg: 'primary',
      p: '1rem 1.5rem',
      w: 'fit-content',
      boxShadow: 'md',
    },
    innerPrimaryBG: {
      boxShadow: 'inner',
      bg: 'primary',
      color: 'white',
      py: '1.5rem',
      w: '100%',
      m: 0,
    },
  },
  textStyles: {
    cta: {
      whiteSpace: 'nowrap',
      fontSize: ['2xl', 'xl', '4xl'],
      textTransform: 'uppercase',
      fontWeight: 'semiBold',
    },
    sectionTitle: {
      textAlign: 'center',
      textTransform: 'uppercase',
      p: '2rem',
      color: 'primary',
    },
  },
  components: {
    Text: {
      baseStyle: {
        color: 'text',
      },
    },
    Heading: {
      baseStyle: {
        color: 'primary',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        width: '100%',
        bg: 'bg',
        zIndex: '-1',
        scrollBehavior: 'smooth',
      },
      '.info-link': {
        pt: 'calc(var(--headerHeight) + 3rem)',
        mt: 'calc((var(--headerHeight) + 1rem) * -1)',
      },
      '.lock-scroll': {
        overflow: 'hidden',
      },
      '.leaflet-div-icon': {
        bg: 'rgba(0, 0, 0, 0)',
        border: 'none',
      },
      '.DayPicker-Day': {
        color: 'primary',
        '&--disabled': {
          opacity: 0.3,
        },
        '&:hover:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
          bg: 'separator',
          opacity: 0.9,
        },
      },
      '.DayPicker-Day--selected': {
        bg: 'primary',
        color: 'white',
      },
      '.DayPicker-Weekday': { color: 'text', opacity: 0.9 },
      '.DayPicker-Caption': { color: 'text' },
    },
  },
})

export default theme
