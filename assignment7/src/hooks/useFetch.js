import { useEffect, useReducer } from 'react'

const initialState = { loading: true, error: null, data: null }

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, error: null, data: null }
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { loading: false, error: action.error, data: null }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const controller = new AbortController()

    dispatch({ type: 'FETCH_START' })

    fetcher(controller.signal)
      .then((data) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      })
      .catch((error) => {
        // An aborted request is not a real error, so we ignore it
        if (error.name === 'AbortError') return
        dispatch({ type: 'FETCH_ERROR', error })
      })

    // Cleanup: cancel the request when deps change or the component unmounts
    return () => controller.abort()
    // The caller decides which inputs the fetch depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}