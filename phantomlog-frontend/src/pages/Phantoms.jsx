import { Link } from 'react-router-dom'
import { useData } from '../context/DataProvider'

export default function Phantoms() {
  const { phantoms } = useData()

  return (
    <div className="page-container">
      <div className="border-bottom pb-20 mb-40 text-center">
        <h1 className="fs-42 ls-8">EL BESTIARIO</h1>
        <p className="text-dim fs-14 mt-5">BASE DE DATOS DE ENTIDADES CLASIFICADAS // ACCESO NIVEL 4</p>
      </div>

      <div className="max-1200">
        <div className="grid-3">
          {phantoms.map(p => (
            <Link 
              key={p.id} 
              to={`/phantoms/${p.id}`} 
              className="horror-card relative"
            >
              <div className="flex-center justify-between mb-15">
                <h2 className="m-0 fs-28 ls-2">{p.name.toUpperCase()}</h2>
                <span className="text-muted fs-12 nowrap">TYPE: {p.type.toUpperCase()}</span>
              </div>
              
              <div className="fs-11 border-top mt-10 pt-10">
                <strong className="text-muted">EVIDENCIA:</strong><br />
                {p.evidence}
              </div>
  
              <div className="absolute-br opacity-02 fs-24 bold">
                ?
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
