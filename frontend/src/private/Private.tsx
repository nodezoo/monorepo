

import { BasicAdmin } from '@voxgig/model-react'
import '@voxgig/model-react/style.css'

import { getMain } from '../setup'
import { ThemeProvider, createTheme } from '@mui/material'
import { orange, green, blue, red, purple, cyan } from '@mui/material/colors'

const main = getMain()

const lightTheme = createTheme({
  components: {
    MuiDrawer: {
      defaultProps: {
        variant: 'persistent'
      },
      styleOverrides: {
        root: {
          // persistent sidebar
          width: '16rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '16rem',
            boxSizing: 'border-box'
          },
          anchor: 'left'
        },
        // permanent sidebar
        paper: {
          width: '16rem',
          boxSizing: 'border-box'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '& .MuiToolbar-root': {
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          color: 'red',
          backgroundColor: 'white',
          '& .MuiTableRow-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          },
          '& .MuiToolbar-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: true
      },
      styleOverrides: {
        root: {
          marginLeft: '1em',
          width: '20rem'
        }
      }
    }
  },
  palette: {
    mode: 'light',
    background: {
      default: '#eee',
      paper: '#ffffff'
    }
  },
  typography: {
    h6: {
      color: 'black'
    }
  }
})

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca,
  store: main.store,
  theme: lightTheme,
  cmp: {
  },
  custom: {
    BasicLed: {
      query: (view: any, cmpstate: any) => {}
    }
  }
})

const spec = {
  frame: main.model.app.web.frame.private
}

function Private (props: any) {
  return (
    <ThemeProvider theme={ctx().theme}>
      <div className='Private'>
        <BasicAdmin ctx={ctx} spec={spec} />
      </div>
    </ThemeProvider>
  )
}

export default Private
