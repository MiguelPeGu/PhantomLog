# PhantomLog — Guía de React para Juniors
## Parte 2: `useEffect`, `useContext` y React Router

> Prerequisito: haber leído la Parte 1 (Fundamentos y `useState`)

---

## `useEffect` — Efectos Secundarios

`useEffect` es el hook para ejecutar código que **no forma parte del renderizado** en sí mismo: llamadas a APIs, timers, suscripciones a eventos del navegador, etc.

Se llama "efecto secundario" (side effect) porque es código que afecta a algo externo al componente.

### Anatomía de `useEffect`

```javascript
useEffect(() => {
  // 1. Código del efecto (se ejecuta)
  fetchData()

  // 2. Función de limpieza (OPCIONAL, se ejecuta antes del próximo efecto o al desmontar)
  return () => {
    cleanup()
  }
}, [dep1, dep2]) // 3. Array de dependencias (controla CUÁNDO se ejecuta)
```

---

### El Array de Dependencias: La clave de todo

El array `[]` del final es lo más importante de entender.

| Sintaxis | Cuándo se ejecuta |
|---|---|
| Sin array | En CADA re-render (¡peligroso!) |
| `[]` vacío | Solo una vez, al montar el componente |
| `[dep1, dep2]` | Cada vez que `dep1` o `dep2` cambien |

---

### Caso 1: `[]` vacío — "Carga inicial"

En `AuthContext.jsx`, comprobamos si el usuario tiene sesión guardada **solo una vez** al iniciar la app:

```javascript
// src/context/AuthContext.jsx
useEffect(() => {
  if (localStorage.getItem('token')) {
    me()                              // Llamada a la API: "¿quién soy?"
      .then(res => setUser(res.data)) // Si hay token válido, guarda el usuario
      .catch(() => localStorage.removeItem('token')) // Si el token expiró, bórralo
      .finally(() => setLoading(false)) // En cualquier caso, deja de cargar
  } else {
    setLoading(false) // Sin token, no hay que esperar nada
  }
}, []) // <-- [] vacío = solo se ejecuta una vez al montar
```

**¿Qué pasaría si no pusiera `[]`?** Se ejecutaría en cada re-render, haciendo una llamada a la API infinitamente.

---

### Caso 2: Dependencias — "Reaccionar a cambios"

En `Login.jsx`, redirigimos al usuario si ya tiene sesión:

```javascript
// src/pages/Login.jsx
useEffect(() => {
  if (user) {
    navigate('/dashboard') // Si el usuario existe, mándalo al dashboard
  }
}, [user, navigate]) // <-- Se ejecuta cada vez que `user` cambie
```

**Flujo:**
1. Página carga → `user` es `null` → el efecto se ejecuta pero `if(user)` es falso, nada pasa
2. Usuario hace login → `user` pasa a tener datos → el efecto se ejecuta de nuevo → redirección

También en `ProductDetail.jsx`, recargamos el producto si cambia el `id` de la URL:

```javascript
// src/pages/ProductDetail.jsx
useEffect(() => {
  getProduct(id)
    .then(res => setProduct(res.data))
    .catch(() => setNotFound(true))
    .finally(() => setLoading(false))
}, [id]) // <-- Si el usuario navega de /products/3 a /products/7, recarga
```

---

### Caso 3: Cleanup — "Cancelar efectos anteriores"

El caso más importante del proyecto: el **debouncing** en la búsqueda de productos.

```javascript
// src/pages/Products.jsx
useEffect(() => {
  const params = {
    search: globalSearch,
    page: currentPage,
    per_page: 9,
    sort: activeFilters.sort
  }

  if (globalSearch !== '') {
    // Esperamos 400ms antes de llamar a la API
    const handler = setTimeout(() => {
      refreshProducts(params)
    }, 400)

    // CLEANUP: Si el usuario escribe otra letra antes de 400ms,
    // cancelamos el timer anterior
    return () => clearTimeout(handler)
  } else {
    // Sin búsqueda, cargamos inmediatamente
    refreshProducts(params)
  }
}, [globalSearch, currentPage, activeFilters, refreshProducts])
```

**¿Qué resuelve esto?**

Sin debouncing: el usuario escribe "fantasma" → 8 llamadas a la API (una por letra)
Con debouncing: el usuario escribe "fantasma" → 1 llamada (400ms después de la última letra)

**¿Cómo funciona el cleanup?**
1. Usuario escribe "f" → se crea timer de 400ms
2. Usuario escribe "fa" (antes de 400ms) → el cleanup cancela el timer de "f" → se crea nuevo timer para "fa"
3. Usuario termina de escribir → timer llega a 400ms → se llama a la API con "fantasma"

---

### Caso 4: `useEffect` en `ForumDetail.jsx` — Carga múltiple

```javascript
// src/pages/ForumDetail.jsx
useEffect(() => {
  fetchForum()   // Carga el foro
  fetchReports() // Carga los reportes del foro
}, [id]) // Cuando cambia el id del foro en la URL, recarga todo
```

Este es un patrón muy común: cargar todos los datos relacionados de una página cuando el componente monta o cuando el ID cambia.

---

### Errores comunes con `useEffect`

**Error 1: Bucle infinito**
```javascript
// ❌ MAL: fetchData cambia en cada render, triggering el efecto infinitamente
useEffect(() => {
  fetchData()
}, [fetchData]) // si fetchData no está en useCallback, es una nueva función cada render

// ✅ BIEN: fetchData está en useCallback, su referencia es estable
const fetchData = useCallback(async () => { ... }, [])
useEffect(() => {
  fetchData()
}, [fetchData])
```

**Error 2: Dependencia faltante**
```javascript
// ❌ MAL: usamos `id` pero no lo ponemos en las dependencias
useEffect(() => {
  getProduct(id) // si `id` cambia, este efecto NO se vuelve a ejecutar
}, [])

// ✅ BIEN
useEffect(() => {
  getProduct(id)
}, [id])
```

**Error 3: Operaciones asíncronas directas**
```javascript
// ❌ MAL: useEffect no puede ser async directamente
useEffect(async () => {
  const data = await fetchData()
}, [])

// ✅ BIEN: define la función async dentro y llámala
useEffect(() => {
  const load = async () => {
    const data = await fetchData()
  }
  load()
}, [])
```

---

## `useContext` — Estado Global

### El problema que resuelve: Prop Drilling

Imagina que `user` está en el componente raíz y lo necesitas en una tarjeta de forum profundamente anidada:

```
App
└── Layout
    └── ForumDetail
        └── ReportCard
            └── CommentBox    ← necesita saber si el usuario está logueado
```

Sin contexto, tendrías que pasar `user` como prop en cada nivel. Con contexto, cualquier componente puede acceder directamente a él.

---

### Cómo está implementado en PhantomLog

El proyecto tiene **4 contextos**:

| Contexto | Qué provee | Hook de acceso |
|---|---|---|
| `AuthContext` | `user`, `login`, `logout`, `updateUser` | `useAuth()` |
| `DataProvider` | `products`, `forums`, `expeditions`, `refresh...` | `useData()` |
| `CartContext` | `cartCount`, `fetchGlobalCart`, `setCartCount` | `useCart()` |
| `ToastContext` | `addToast` | `useToast()` |

---

### Anatomía de un Contexto: `AuthContext.jsx`

```javascript
// 1. Crear el contexto (es el "canal" de comunicación)
const AuthContext = createContext(null)

// 2. El Provider: envuelve a los hijos y les provee los datos
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al montar, comprueba si hay token guardado
  useEffect(() => {
    if (localStorage.getItem('token')) {
      me().then(res => setUser(res.data))
         .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('token', data.token) // Guarda el token en el navegador
    setUser(data.user)                        // Actualiza el estado global
  }

  const logout = async () => {
    await apiLogout()
    localStorage.removeItem('token') // Borra el token del navegador
    setUser(null)                    // Limpia el usuario del estado
  }

  return (
    // 3. Pasa los datos a través del Provider
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}

// 4. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext)
```

---

### Consumir el Contexto

Desde cualquier componente hijo del `AuthProvider`:

```javascript
// src/pages/Login.jsx
const { user, login } = useAuth()

// src/pages/Forums.jsx
const { user } = useAuth()

// src/pages/Profile.jsx
const { user, updateUser, logout } = useAuth()
```

---

### El DataProvider: Contexto de Datos Globales

`DataProvider.jsx` es el contexto más complejo. Centraliza **todos los datos de la app**:

```javascript
// src/context/DataProvider.jsx
export function DataProvider({ children }) {
  // Un estado por cada tipo de dato
  const [products, setProducts] = useState([])
  const [forums, setForums] = useState([])
  const [expeditions, setExpeditions] = useState([])
  // ...

  // Estados de carga por separado
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingForums, setLoadingForums] = useState(false)
  // ...

  // Funciones para recargar datos (con useCallback para optimizar)
  const refreshForums = useCallback(async (params = {}) => {
    const requestId = ++requestRefs.current.forums // Anti race-condition
    setLoadingForums(true)
    try {
      const res = await getForums(params)
      if (requestId !== requestRefs.current.forums) return // Descarta peticiones viejas
      const data = res.data.data || res.data
      setForums(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching forums:', error)
    } finally {
      setLoadingForums(false)
    }
  }, [])

  // Al hacer login, carga todos los datos de una vez
  const { user } = useAuth()
  useEffect(() => {
    if (user) {
      refreshAll() // Llama a todos los refresh en paralelo
    }
  }, [user, refreshAll])

  // El valor del contexto está memoizado para evitar re-renders innecesarios
  const value = useMemo(() => ({
    products, loadingProducts, productsPagination, refreshProducts,
    forums, loadingForums, forumsPagination, refreshForums,
    // ...
  }), [products, forums, /* ... */])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
```

**¿Por qué `useMemo` en el valor del contexto?**

Sin `useMemo`, cada vez que cualquier estado del `DataProvider` cambia (por ejemplo, `loadingProducts`), se crea un nuevo objeto para el `value`. React interpretaría que el contexto cambió y **re-renderizaría todos los componentes** que lo consumen. Con `useMemo`, el objeto solo se recrea cuando las dependencias reales cambian.

---

## React Router — Navegación entre Páginas

React Router te permite mostrar distintos componentes según la URL del navegador, sin recargar la página.

### Hooks de React Router usados en PhantomLog

#### `useNavigate` — Navegar por código

```javascript
const navigate = useNavigate()

// Ir a una página
navigate('/dashboard')
navigate('/forums')

// Ir atrás
navigate(-1)

// Navegar con un ID dinámico
navigate(`/forums/${forum.id}`)
navigate(`/success/${resp.data.id}`)
```

**Ejemplo real en `Login.jsx`:**
```javascript
// Si el usuario ya está logueado, mándalo al dashboard automáticamente
useEffect(() => {
  if (user) {
    navigate('/dashboard')
  }
}, [user, navigate])
```

**Ejemplo real en `Checkout.jsx`:**
```javascript
// Tras completar el pago, espera 3 segundos y redirige
setTimeout(() => navigate(`/success/${resp.data.id}`), 3000)
```

---

#### `useParams` — Leer parámetros de la URL

Cuando la ruta tiene un parámetro dinámico como `/forums/:id`, `useParams` te da acceso a ese valor.

```javascript
// src/pages/ForumDetail.jsx
const { id } = useParams()
// Si la URL es /forums/12, entonces id = "12"

// src/pages/ReportDetail.jsx
const { id: forumId, reportId } = useParams()
// Renombramos 'id' a 'forumId' para más claridad
// URL: /forums/3/reports/7 → forumId = "3", reportId = "7"
```

Fíjate que el `id` viene siempre como **string**, por eso en el proyecto a veces verás `String(user.id) === String(f.user_id)` para comparar IDs sin problemas de tipo.

---

#### `Link` — Navegación declarativa

`Link` de React Router es como un `<a>` pero sin recargar la página.

```jsx
// En lugar de <a href="/register">, usamos:
<Link to="/register" className="fs-12 opacity-07">
  ¿SIN CREDENCIALES? REGISTRAR NUEVA ALMA
</Link>

// En Expeditions.jsx, cada tarjeta es un Link
<Link to={`/expeditions/${exp.id}`} className="horror-card column gap-15">
  <h3>{exp.name.toUpperCase()}</h3>
  {/* ... */}
</Link>
```

**¿Cuándo usar `Link` vs `useNavigate`?**
- `Link`: Para navegación declarativa visible en el HTML (como un enlace de menú o una tarjeta clickable)
- `useNavigate`: Para navegación programática (tras un submit de formulario, tras un temporizador, en respuesta a un evento)

---

### Protección de Rutas

En `App.jsx` (o donde se definen las rutas), hay componentes que protegen ciertas páginas. Si el usuario no está logueado, lo redirigen al login:

```jsx
// Ejemplo de patrón de ruta protegida
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

// Uso
<Route path="/cart" element={
  <PrivateRoute>
    <Cart />
  </PrivateRoute>
} />
```

---

## Resumen del Capítulo

| Hook / Concepto | Cuándo usarlo |
|---|---|
| `useEffect(fn, [])` | Una vez al montar el componente |
| `useEffect(fn, [dep])` | Cuando `dep` cambia |
| `return () => cleanup()` | Para cancelar timers o suscripciones |
| `createContext` + `Provider` | Para compartir datos globalmente |
| `useContext(MyContext)` | Para consumir ese contexto |
| `useNavigate` | Para redirigir por código |
| `useParams` | Para leer parámetros de la URL |
| `<Link to="">` | Para enlaces en el HTML |

---

**→ Continúa en la Parte 3: `useCallback`, `useMemo`, `useRef` y Patrones Avanzados**
