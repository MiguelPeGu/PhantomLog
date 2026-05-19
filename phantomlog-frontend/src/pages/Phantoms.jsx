import { Link } from 'react-router-dom'
import { useData } from '../context/DataProvider'

const PhantomSkeleton = () => (
  <div className="horror-card relative">
    <div className="flex-center justify-between mb-15">
      <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
      <div className="skeleton" style={{ width: '80px', height: '14px' }}></div>
    </div>
    <div className="fs-11 border-top mt-10 pt-10">
      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
    </div>
  </div>
)

export default function Phantoms() {
  const { phantoms, loadingPhantoms } = useData()

  return (
    <div className="page-container">
      <div className="border-bottom pb-20 mb-40 text-center">
        <h1 className="fs-42 ls-8">EL BESTIARIO</h1>
        <p className="text-dim fs-14 mt-5">BASE DE DATOS DE ENTIDADES CLASIFICADAS</p>
      </div>

      <div className="max-1200">
        <div className="grid-3">
          {loadingPhantoms && phantoms.length === 0 ? (
            [...Array(9)].map((_, i) => <PhantomSkeleton key={i} />)
          ) : phantoms.length === 0 ? (
            <div className="text-center text-dim p-100 border-dashed" style={{gridColumn: '1/-1'}}>NO SE HAN DETECTADO ENTIDADES CON ESE PATRÓN.</div>
          ) : (
            phantoms.map(phantom => (
                <Link 
                  key={phantom.id} 
                  to={`/phantoms/${phantom.id}`} 
                  className="horror-card relative"
                >
                  <div className="flex-center justify-between mb-15">
                    <h2 className="m-0 fs-28 ls-2">{phantom.name.toUpperCase()}</h2>
                    <span className="text-muted fs-12 nowrap">TYPE: {phantom.type.toUpperCase()}</span>
                  </div>
                  
                  <div className="fs-11 border-top mt-10 pt-10">
                    <strong className="text-muted">EVIDENCIA:</strong><br />
                    {phantom.evidence}
                  </div>
      
                  <div className="absolute-br opacity-02 fs-24 bold">
                    ?
                  </div>
                </Link>
              ))
            )}
          </div>
      </div>
    </div>
  )
}
