# PhantomLog — Guía de React para Juniors
## Parte 3: `useCallback`, `useMemo`, `useRef` y Patrones Avanzados

> Prerequisito: haber leído las Partes 1 y 2.

---

## Introducción a la Optimización

Cuando React renderiza un componente, ejecuta **toda la función** del componente de nuevo. Esto incluye recalcular variables, recrear funciones y recalcular objetos. La mayoría de las veces es suficientemente rápido, pero cuando:

- Pasas funciones como dependencias de `useEffect`
- Tienes cálculos costosos (filtrar miles de elementos)
- Compartes datos por Contexto con muchos consumidores

...necesitas los hooks de optimización.

---

## `useCallback` — Estabilizar Referencias de Funciones

### El Problema

En JavaScript, dos funciones con el mismo código son **objetos distintos**:

```javascript
const fn1 = () => console.log('hola')
const fn2 = () => console.log('hola')
fn1 === fn2 // false ← son objetos distintos en memoria
```

Esto causa un problema: si defines una función dentro de un componente y la usas en `useEffect`, React ve una nueva función en cada render y ejecuta el efecto infinitamente.

### La Solución: `useCallback`

`useCallback` "memoriza" una función y devuelve **siempre la misma referencia** a menos que cambien sus dependencias.

```javascript
const miFuncion = useCallback(() => {
  // código
}, [dep1, dep2]) // se recrea SOLO si dep1 o dep2 cambian
```

### En PhantomLog: `DataProvider.jsx`

```javascript
// src/context/DataProvider.jsx

// SIN useCallback: se crea una nueva función en cada render del DataProvider
// Todos los useEffect que dependan de refreshForums ejecutarían infinitamente
const refreshForums = async (params = {}) => { ... } // ❌ problema

// CON useCallback: la misma función siempre (el array [] significa "nunca recrear")
const refreshForums = useCallback(async (params = {}) => {
  setLoadingForums(true)
  try {
    const res = await getForums(params)
    setForums(res.data.data || res.data)
  } catch (error) {
    console.error('Error fetching forums:', error)
  } finally {
    setLoadingForums(false)
  }
}, []) // [] = esta función nunca necesita recrearse
```

**¿Por qué `[]` vacío aquí?** Porque `refreshForums` solo usa `setLoadingForums` y `setForums`, que son funciones estables de `useState` (React garantiza que no cambian).

### Cuando las dependencias no están vacías

Si la función usa valores externos que pueden cambiar:

```javascript
// Ejemplo hipotético: una función que filtra según un parámetro del componente
const buscarForos = useCallback((termino) => {
  return forums.filter(f => f.title.includes(termino))
}, [forums]) // se recrea cuando `forums` cambie
```

---

## `useMemo` — Memorizar Valores Calculados

### El Problema

Los cálculos costosos se repiten en cada render, incluso si los datos de entrada no cambiaron.

### La Solución: `useMemo`

`useMemo` ejecuta una función y **guarda el resultado**. Solo recalcula cuando las dependencias cambian.

```javascript
const resultado = useMemo(() => {
  return calculo_costoso(datos)
}, [datos]) // recalcula solo cuando `datos` cambie
```

### En PhantomLog: Filtrado en `Expeditions.jsx`

Sin `useMemo`, cada vez que el usuario mueve el ratón (o cualquier re-render), React recorre **toda la lista de expediciones** para filtrarlas, aunque el texto de búsqueda no haya cambiado:

```javascript
// SIN useMemo: se filtra en CADA render ❌
const filteredExpeditions = expeditions.filter(exp =>
  exp.name.toLowerCase().includes(search.toLowerCase())
)

// CON useMemo: solo se filtra cuando `expeditions` o `search` cambian ✅
const filteredExpeditions = useMemo(() => {
  return expeditions.filter(exp =>
    exp.name.toLowerCase().includes(search.toLowerCase()) ||
    exp.location.toLowerCase().includes(search.toLowerCase())
  )
}, [expeditions, search]) // <-- dependencias

// La paginación también se memoiza porque depende del resultado del filtrado
const totalPages = useMemo(
  () => Math.ceil(filteredExpeditions.length / itemsPerPage),
  [filteredExpeditions]
)

const paginatedExpeditions = useMemo(
  () => filteredExpeditions.slice(startIndex, startIndex + itemsPerPage),
  [filteredExpeditions, startIndex]
)
```

### En PhantomLog: El Valor del Contexto en `DataProvider.jsx`

Este es el uso más importante de `useMemo` en el proyecto:

```javascript
// SIN useMemo: cada vez que loading cambia, se crea un nuevo objeto
// React lo interpreta como un nuevo contexto → re-renderiza TODA la app ❌
return (
  <DataContext.Provider value={{
    products, forums, expeditions, refreshAll, ...
  }}>
```

```javascript
// CON useMemo: el objeto solo cambia cuando algo dentro realmente cambió ✅
const value = useMemo(() => ({
  products, loadingProducts, productsPagination, refreshProducts,
  forums, loadingForums, forumsPagination, refreshForums,
  invoices, loadingInvoices, invoicesPagination, refreshInvoices,
  phantoms, loadingPhantoms, refreshPhantoms,
  expeditions, loadingExpeditions, refreshExpeditions,
  globalSearch, setGlobalSearch,
  refreshAll
}), [
  products, loadingProducts, /* todas las dependencias */
])

return (
  <DataContext.Provider value={value}>
    {children}
  </DataContext.Provider>
)
```

**Impacto real:** Sin `useMemo`, al cargar los productos, se re-renderizarían también todos los foros, expediciones y el carrito. Con `useMemo`, solo se re-renderizan los componentes que realmente usan `products`.

### `useMemo` vs `useCallback`

| Hook | Para | Devuelve |
|---|---|---|
| `useMemo` | Memorizar un **valor** calculado | El resultado de la función |
| `useCallback` | Memorizar una **función** | La función misma |

```javascript
// useMemo: memoriza el RESULTADO
const total = useMemo(() => items.reduce((acc, i) => acc + i.price, 0), [items])

// useCallback: memoriza la FUNCIÓN en sí
const calcularTotal = useCallback(() => {
  return items.reduce((acc, i) => acc + i.price, 0)
}, [items])
```

---

## `useRef` — La Memoria Silenciosa

`useRef` crea una referencia mutable que **no provoca re-renders** cuando cambia.

```javascript
const miRef = useRef(valorInicial)
// Accedes/cambias el valor así:
miRef.current = nuevoValor
console.log(miRef.current) // lee el valor
```

### ¿Cuándo usar `useRef` en lugar de `useState`?

- **`useState`**: Cuando cambiar el valor debe **actualizar la pantalla**
- **`useRef`**: Cuando el valor es interno/técnico y **no necesita afectar la UI**

### En PhantomLog: Anti Race Conditions en `DataProvider.jsx`

**¿Qué es una Race Condition?**

Imagina que el usuario escribe "f", luego rápidamente "fa". Se lanzan 2 peticiones a la API. La segunda ("fa") puede llegar antes que la primera ("f"). Si no hay protección, los datos de "f" sobreescriben a los de "fa" y la pantalla muestra resultados incorrectos.

```javascript
// PROBLEMA SIN PROTECCIÓN:
// Petición 1: search="f" → tarda 500ms
// Petición 2: search="fa" → tarda 100ms
// Resultado: "fa" llega primero, luego llega "f" y sobreescribe... ❌

// SOLUCIÓN CON useRef:
const requestRefs = useRef({ products: 0, forums: 0, invoices: 0 })

const refreshForums = useCallback(async (params = {}) => {
  // Incrementa el contador de esta categoría y guarda ESTE número
  const requestId = ++requestRefs.current.forums

  setLoadingForums(true)
  try {
    const res = await getForums(params)

    // Comprueba si ESTA petición sigue siendo la más reciente
    if (requestId !== requestRefs.current.forums) {
      return // Descartamos este resultado, ya hay uno más nuevo ✅
    }

    setForums(res.data.data || res.data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoadingForums(false)
  }
}, [])
```

**¿Por qué `useRef` y no `useState`?** Porque cambiar el contador de peticiones no debe re-renderizar el componente. Solo es un número interno de control. Con `useState`, actualizarlo causaría re-renders innecesarios.

### `useRef` para Referencias al DOM

`useRef` también se usa para acceder directamente a elementos HTML:

```javascript
// En ShimmerImage.jsx
const imgRef = useRef(null)

useEffect(() => {
  // Comprueba si la imagen ya estaba cargada antes de que el componente montara
  if (imgRef.current && imgRef.current.complete) {
    setLoaded(true)
  }
}, [src])

return (
  <img ref={imgRef} src={src} onLoad={() => setLoaded(true)} />
)
```

`imgRef.current` apunta directamente al elemento `<img>` del DOM. Puedes leer `.complete` (si ya estaba cargada), `.width`, `.height`, etc.

---

## Patrones Avanzados en PhantomLog

### Patrón 1: Actualizaciones Optimistas

Usadas en `Cart.jsx` para una experiencia sin latencia. La idea es: actualiza la UI inmediatamente y luego confirma con el servidor.

```javascript
const handleUpdate = async (productId, intent) => {
  // 0. Si es borrado, pide confirmación ANTES de tocar la UI
  if (intent === 'rem') {
    if (!window.confirm("¿CONFIRMAS QUE DESEAS PURGAR ESTA OFRENDA?")) {
      return // Usuario canceló → no hacemos nada
    }
  }

  // 1. Bloquea el botón de ese producto
  setUpdatingState(prev => ({ ...prev, [productId]: intent }))

  // 2. ACTUALIZACIÓN OPTIMISTA: cambia la UI inmediatamente
  setCartData(prev => {
    const newItems = prev.items.map(item => {
      if (item.product.id === productId) {
        if (intent === 'add') return { ...item, quantity: item.quantity + 1 }
        if (intent === 'sub') return { ...item, quantity: Math.max(0, item.quantity - 1) }
      }
      return item
    }).filter(item => item.quantity > 0)

    if (intent === 'rem') {
      return { ...prev, items: prev.items.filter(i => i.product.id !== productId) }
    }
    return { ...prev, items: newItems }
  })

  try {
    // 3. Llama a la API (en segundo plano)
    let res
    if (intent === 'add') res = await addToCart(productId, 1)
    if (intent === 'sub') res = await subtractCart(productId)
    if (intent === 'rem') res = await removeCart(productId)

    // 4. Confirma con los datos reales del servidor
    setCartData(res.data)
  } catch (e) {
    // 5. Si falló, restaura los datos reales (rollback)
    await fetchCart(true)
    addToast("Error en la sincronización.", "error")
  } finally {
    // 6. Siempre desbloquea el botón
    setUpdatingState(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }
}
```

**Ventaja:** El usuario ve el cambio en milisegundos, sin esperar la respuesta del servidor.
**Riesgo:** Si el servidor falla, hay que revertir. Por eso el `catch` hace un `fetchCart(true)` (carga silenciosa que restaura los datos reales).

---

### Patrón 2: Hooks Personalizados (Custom Hooks)

En el proyecto, los contextos se exponen como hooks personalizados:

```javascript
// En AuthContext.jsx
export const useAuth = () => useContext(AuthContext)

// En DataProvider.jsx
export const useData = () => useContext(DataContext)

// En CartContext.jsx
export function useCart() {
  return useContext(CartContext)
}
```

Un hook personalizado es simplemente **una función que empieza por `use`** y puede llamar a otros hooks dentro.

Podrías crear tus propios hooks para extraer lógica repetida:

```javascript
// Hook personalizado hipotético para manejar un formulario
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  return { values, loading, setLoading, handleChange }
}
```

---

### Patrón 3: Skeleton Loading con ShimmerImage

El componente `ShimmerImage` implementa una transición suave entre el estado de carga y el contenido real:

```jsx
// src/components/ShimmerImage.jsx
const ShimmerImage = ({ src, alt, objectFit = "cover" }) => {
  const [loaded, setLoaded] = useState(false) // ¿está cargada?
  const [error, setError] = useState(false)   // ¿falló la carga?
  const imgRef = useRef(null)

  useEffect(() => {
    // Caso especial: si la imagen ya estaba en caché del navegador,
    // `onLoad` no se dispara. Comprobamos manualmente.
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className="shimmer-container">
      {/* Shimmer: visible SOLO mientras carga */}
      {!loaded && !error && (
        <div className="shimmer-box" style={{ position: 'absolute', inset: 0 }} />
      )}

      {/* Error: visible si la imagen no se pudo cargar */}
      {error && (
        <div style={{ /* estilos de error */ }}>
          Imagen no disponible
        </div>
      )}

      {/* Imagen: siempre en el DOM pero invisible hasta que carga */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}   // Al cargar, hace fade in
        onError={() => setError(true)}   // Al fallar, muestra mensaje de error
        style={{
          opacity: loaded ? 1 : 0,             // Invisible hasta que cargue
          transition: 'opacity 0.5s ease-in-out' // Fade in suave
        }}
      />
    </div>
  )
}
```

---

### Patrón 4: Estado de Carga con `finally`

Un patrón consistente en todo el proyecto para garantizar que `loading` siempre se desactiva:

```javascript
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true) // Activa siempre

  try {
    await operacionAsync()
    // Éxito
  } catch (error) {
    // Error
    addToast('Error', 'error')
  } finally {
    setLoading(false) // Se ejecuta SIEMPRE, tanto si hubo éxito como error
  }
}
```

El bloque `finally` garantiza que aunque haya un error inesperado, el botón no se quede bloqueado para siempre.

---

## Árbol de Dependencias de PhantomLog

Entender el árbol del proyecto ayuda a saber qué componente puede acceder a qué contexto:

```
<AuthProvider>              → provee useAuth()
  <DataProvider>            → provee useData() (necesita user de AuthContext)
    <CartProvider>          → provee useCart()
      <ToastProvider>       → provee useToast()
        <Router>
          <Header />        → usa useAuth(), useCart(), useData()
          <Routes>
            <Login />       → usa useAuth(), useToast()
            <Forums />      → usa useData(), useAuth(), useToast()
            <Cart />        → usa useCart(), useToast()
            <Profile />     → usa useAuth(), useToast()
          </Routes>
          <Footer />
        </Router>
      </ToastProvider>
    </CartProvider>
  </DataProvider>
</AuthProvider>
```

---

## Resumen General de Hooks

| Hook | Propósito | Re-render al cambiar |
|---|---|---|
| `useState` | Guardar estado local | ✅ Sí |
| `useEffect` | Efectos secundarios (APIs, timers) | No directamente |
| `useContext` | Consumir contexto global | ✅ Sí (si el contexto cambia) |
| `useRef` | Referencia mutable sin re-render | ❌ No |
| `useCallback` | Estabilizar referencia de función | ❌ No (por sí solo) |
| `useMemo` | Memorizar valor calculado | ❌ No (por sí solo) |
| `useNavigate` | Navegar entre rutas | ❌ No |
| `useParams` | Leer parámetros de la URL | ❌ No |

---

## Reglas de los Hooks (Obligatorias)

1. **Solo llama hooks en el nivel superior del componente**. Nunca dentro de `if`, `for` o funciones anidadas.
2. **Solo llama hooks desde componentes de React o hooks personalizados**. No desde funciones JS normales.
3. **Los hooks personalizados deben empezar por `use`** (convenio de React para identificarlos).

```javascript
// ❌ MAL: hook dentro de condicional
if (condition) {
  const [state, setState] = useState(0) // Error!
}

// ✅ BIEN: hook siempre al nivel superior
const [state, setState] = useState(0)
if (condition) {
  setState(1) // Esto sí está bien
}
```

---

## Guía de Referencia Rápida

### ¿Qué hook necesito?

```
¿Necesito guardar un dato que cambia y actualiza la pantalla?
→ useState

¿Necesito ejecutar código cuando el componente carga o cambia un dato?
→ useEffect

¿Necesito acceder a datos globales (usuario, productos, carrito)?
→ useAuth() / useData() / useCart() / useToast()

¿Necesito navegar a otra página por código?
→ useNavigate

¿Necesito leer el ID o parámetro de la URL?
→ useParams

¿Necesito estabilizar una función para usarla en useEffect o pasar a hijo?
→ useCallback

¿Necesito memorizar un cálculo costoso?
→ useMemo

¿Necesito un valor interno que no deba provocar re-renders?
→ useRef
```

---

*Documentación generada para PhantomLog — Horror Minimalist Interface*
*Versión del proyecto: Mayo 2026*
