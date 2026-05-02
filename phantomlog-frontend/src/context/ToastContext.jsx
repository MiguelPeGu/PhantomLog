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
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: 'var(--card-bg)',
            border: `2px solid var(--accent)`,
            borderLeftWidth: '8px',
            color: 'var(--text)',
            padding: '18px 40px',
            fontFamily: 'var(--mono)',
            fontSize: '15px',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px var(--accent-alpha)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            animation: 'toastPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            pointerEvents: 'auto',
            backdropFilter: 'blur(10px)',
            minWidth: '300px',
            textAlign: 'center'
          }}>
            {toast.message}
          </div>
        ))}
        <style>{`
          @keyframes toastPop {
            0% { opacity: 0; transform: translateY(-20px) scale(0.9); filter: blur(10px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
