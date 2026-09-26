import { createContext, useContext } from 'react'

type GlobalState = {
  pdfUrl: string | null
  setPdfUrl: React.Dispatch<React.SetStateAction<null>>
}

export const GlobalStateContext = createContext<GlobalState>({
  pdfUrl: null,
  setPdfUrl: () => null,
})

const useGlobalState = (): GlobalState => useContext(GlobalStateContext)

export default useGlobalState
