import { useState, useEffect } from 'react';
import AlumnoCard from './AlumnoCard';
import AlumnoForm from './AlumnoForm';
import Contador from './Contador';
import SkeletonGrid from './SkeletonGrid';
import { API_BASE } from '../config';

const AlumnosView = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [cargando, setCargando] = useState(true);
  const [alumnoEditando, setAlumnoEditando] = useState(null);

  const obtenerAlumnos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_BASE}/alumnos`);
      const datos = await respuesta.json();
      setAlumnos(datos.data || datos);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  const totalAlumnos = alumnos.length;
  const totalMatriculados = alumnos.filter(a => a.estado_matricula?.toLowerCase() === 'matriculado').length;
  const totalInactivos = alumnos.filter(a => a.estado_matricula?.toLowerCase() !== 'matriculado').length;

  const filteredAlumnos = alumnos.filter(alumno => {
    const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`.toLowerCase();
    const matchesSearch = nombreCompleto.includes(searchQuery.toLowerCase()) ||
                          alumno.dni?.includes(searchQuery) ||
                          alumno.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'matriculado') return matchesSearch && alumno.estado_matricula?.toLowerCase() === 'matriculado';
    return matchesSearch && alumno.estado_matricula?.toLowerCase() !== 'matriculado';
  });

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold text-white m-0" style={{fontFamily: 'Outfit', fontSize: '2rem', letterSpacing: '-0.03em'}}>Directorio de Aspirantes</h1>
        <p className="text-muted m-0 mt-1">Operaciones en tiempo real — React + Laravel + MySQL</p>
      </div>

      <Contador 
        totalAlumnos={totalAlumnos}
        totalMatriculados={totalMatriculados}
        totalPendientes={totalInactivos}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="control-bar mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="search-input-wrapper">
                  <span className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    className="form-control search-input" 
                    placeholder="Buscar por nombre, apellidos, DNI, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex gap-2 justify-content-md-end align-items-center">
                <button 
                  className={`btn filter-btn btn-light ${activeFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('All')}
                >
                  Todos
                </button>
                <button 
                  className={`btn filter-btn btn-light ${activeFilter === 'matriculado' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('matriculado')}
                >
                  Matriculados
                </button>
                <button 
                  className={`btn filter-btn btn-light ${activeFilter === 'inactivo' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('inactivo')}
                >
                  Inactivos
                </button>
              </div>
            </div>
            {!cargando && filteredAlumnos.length > 0 && (
              <div className="mt-3 pt-3 border-top border-light d-flex justify-content-between align-items-center">
                <span className="text-muted small">Mostrando {filteredAlumnos.length} de {totalAlumnos} alumnos</span>
              </div>
            )}
          </div>

          <div className="row">
            {cargando ? (
              <SkeletonGrid count={6} />
            ) : filteredAlumnos.length > 0 ? (
              filteredAlumnos.map(alumno => (
                <AlumnoCard
                  key={alumno.id_alumno || alumno.id}
                  alumno={alumno}
                  alEliminar={obtenerAlumnos}
                  alEditar={() => setAlumnoEditando(alumno)}
                />
              ))
            ) : (
              <div className="col-12">
                <div className="empty-state">
                  <div className="empty-state-icon">👨‍🎓</div>
                  <h5>No se encontraron alumnos</h5>
                  <p className="text-muted">La base de datos se encuentra vacía o la búsqueda no coincide.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '90px', zIndex: 1 }}>
            <AlumnoForm 
              recargarAlumnos={obtenerAlumnos} 
              alumnoEditando={alumnoEditando}
              cancelarEdicion={() => setAlumnoEditando(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnosView;
