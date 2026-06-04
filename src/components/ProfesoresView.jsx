import { useState, useEffect } from 'react';
import ProfesorCard from './ProfesorCard';
import ProfesorForm from './ProfesorForm';
import Contador from './Contador';
import SkeletonGrid from './SkeletonGrid';
import { API_BASE } from '../config';

const ProfesoresView = () => {
  const [profesores, setProfesores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [cargando, setCargando] = useState(false);
  const [profesorEditando, setProfesorEditando] = useState(null);

  const obtenerProfesores = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_BASE}/profesores`);
      const datos = await respuesta.json();
      setProfesores(datos.data || datos);
    } catch (error) {
      console.error('Error al obtener los profesores:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProfesores();
  }, []);

  const totalProfesores = profesores.length;
  const totalActivos = profesores.filter(p => p.estado?.toLowerCase() === 'activo').length;
  const totalInactivos = profesores.filter(p => p.estado?.toLowerCase() !== 'activo').length;

  const filteredProfesores = profesores.filter(profesor => {
    const nombreCompleto = `${profesor.nombre} ${profesor.apellidos}`.toLowerCase();
    const matchesSearch = nombreCompleto.includes(searchQuery.toLowerCase()) ||
                          profesor.especialidad?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'activo') return matchesSearch && profesor.estado?.toLowerCase() === 'activo';
    return matchesSearch && profesor.estado?.toLowerCase() !== 'activo';
  });

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold text-white m-0" style={{fontFamily: 'Outfit', fontSize: '2rem', letterSpacing: '-0.03em'}}>Directorio de Mentores</h1>
        <p className="text-muted m-0 mt-1">Operaciones en tiempo real — React + Laravel + MySQL</p>
      </div>

      <Contador 
        totalAlumnos={totalProfesores}
        totalMatriculados={totalActivos}
        totalPendientes={totalInactivos}
        labelTotal="Total Profesores"
        labelActivos="Activos"
        labelInactivos="Inactivos"
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
                    placeholder="Buscar por nombre, especialidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex gap-2 justify-content-md-end align-items-center">
                <button 
                  className={`btn filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('All')}
                >
                  Todos
                </button>
                <button 
                  className={`btn filter-btn ${activeFilter === 'activo' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('activo')}
                >
                  Activos
                </button>
                <button 
                  className={`btn filter-btn ${activeFilter === 'inactivo' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('inactivo')}
                >
                  Inactivos
                </button>
              </div>
            </div>
          </div>

           {cargando ? (
             <SkeletonGrid count={6} />
           ) : (
             <div className="row">
                {filteredProfesores.length > 0 ? (
                  filteredProfesores.map(profesor => (
                    <ProfesorCard
                      key={profesor.id_profesor || profesor.id}
                      profesor={profesor}
                      alEliminar={obtenerProfesores}
                      alEditar={() => setProfesorEditando(profesor)}
                    />
                  ))
                ) : (
                  <div className="col-12">
                    <div className="empty-state">
                      <div className="empty-state-icon">👨‍🏫</div>
                      <h5>No se encontraron profesores</h5>
                    </div>
                  </div>
                )}
             </div>
           )}

        </div>

        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '90px', zIndex: 1 }}>
            <ProfesorForm 
              recargarProfesores={obtenerProfesores} 
              profesorEditando={profesorEditando}
              cancelarEdicion={() => setProfesorEditando(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesoresView;
