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
            background: 'var(--accent)',
            border: `2px solid var(--border-bright)`,
            color: '#fff',
            padding: '15px 30px',
            fontFamily: 'var(--mono)',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 0 20px var(--shadow-color)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            animation: 'toastGlitch 0.3s ease forwards'
          }}>
            {toast.message}
          </div>
        ))}
        <style>{`
          @keyframes toastGlitch {
            0% { opacity: 0; transform: translateX(50px) skewX(-20deg); }
            70% { transform: translateX(-5px) skewX(10deg); }
            100% { opacity: 1; transform: translateX(0) skewX(0); }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
