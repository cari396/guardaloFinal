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
    brandGreen: '#3c7948',
    brandGray: '#c8d5d9',
    separator: 'rgba(162, 212, 227, 0.5)',
    white: '#ffffff',
    navBG: 'rgba(238, 251, 255, 0.98)',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
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
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? '#CBD5E1' : '#626584',
      }),
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? '#F8FAFC' : '#1E3264',
      }),
    },
  },
  styles: {
    global: (props: any) => ({
      'html, body': {
        width: '100%',
        bg: props.colorMode === 'dark' ? '#0B1120' : '#F6FCFE',
        color: props.colorMode === 'dark' ? '#F1F5F9' : '#1E293B',
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
        color: props.colorMode === 'dark' ? '#60A5FA' : 'primary',
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
      '.DayPicker-Weekday': { color: props.colorMode === 'dark' ? '#94A3B8' : 'text', opacity: 0.9 },
      '.DayPicker-Caption': { color: props.colorMode === 'dark' ? '#F1F5F9' : 'text' },
      '.chakra-ui-dark .chakra-table': {
        color: '#F1F5F9 !important',
      },
      '.chakra-ui-dark .chakra-table th': {
        color: '#94A3B8 !important',
        borderColor: '#334155 !important',
        bg: '#0F172A !important',
      },
      '.chakra-ui-dark .chakra-table td': {
        borderColor: '#334155 !important',
        color: '#F1F5F9 !important',
      },
      '.chakra-ui-dark .chakra-table tr:hover td': {
        bg: 'rgba(255, 255, 255, 0.03)',
      },
      '.chakra-ui-dark .chakra-modal__content': {
        bg: '#1E293B !important',
        color: '#F1F5F9 !important',
        borderColor: '#334155 !important',
      },
      '.chakra-ui-dark .chakra-modal__header': {
        color: '#F8FAFC !important',
      },
      '.chakra-ui-dark .chakra-modal__close-btn': {
        color: '#94A3B8 !important',
      },
      '.chakra-ui-dark .chakra-input, .chakra-ui-dark .chakra-select, .chakra-ui-dark .chakra-textarea': {
        bg: '#0F172A !important',
        borderColor: '#334155 !important',
        color: '#F1F5F9 !important',
      },
      '.chakra-ui-dark .chakra-input:focus, .chakra-ui-dark .chakra-select:focus': {
        borderColor: '#3B82F6 !important',
        boxShadow: '0 0 0 1px #3B82F6 !important',
      },
    }),
  },
})

export default theme
