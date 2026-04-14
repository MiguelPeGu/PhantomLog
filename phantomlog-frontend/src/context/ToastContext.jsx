import { createContext, useContext, useState, useCallback } from 'react'

//crea los mensajes en toda la página
const ToastContext = createContext(null)

//lo hacemos como un array de mensajes porque pueden haber varios a la vez
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  //usamos un useCallback para que no se re-renderice innecesariamente, es decir, no se vuelva a crear inneceraiamente la función
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    //consercamos los mensajes anteriores
    setToasts((prev) => [...prev, { id, message, type }])
    //después de 4 segundos se elimina el mensaje
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? 'rgba(180, 50, 40, 0.9)' : 'rgba(8, 4, 10, 0.9)',
            border: `1px solid ${toast.type === 'error' ? '#ff6b5a' : '#c8a96e'}`,
            color: toast.type === 'error' ? '#fff' : '#c8a96e',
            padding: '12px 24px',
            fontFamily: "'IM Fell English', serif",
            fontSize: '18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.3s ease forwards'
          }}>
            {toast.message}
          </div>
        ))}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
