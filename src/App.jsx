import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AlumnoCard from './components/AlumnoCard';
import AlumnoForm from './components/AlumnoForm';
import Contador from './components/Contador';

function App() {
  // 1. Iniciamos el estado como un arreglo vacío (esperando los datos del servidor)
  const [alumnos, setAlumnos] = useState([]);
  
  // Estados para búsqueda y filtrado premium
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // 2. Función para obtener los alumnos desde la API de Laravel
  const obtenerAlumnos = async () => {
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/alumnos');
      const datos = await respuesta.json();
      // Asumimos que Laravel devuelve un objeto con la llave 'data' o directamente el arreglo
      setAlumnos(datos.data || datos);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
    }
  };

  // 3. El hook useEffect ejecuta obtenerAlumnos() automáticamente la primera vez que la página carga
  useEffect(() => {
    obtenerAlumnos();
  }, []); // El arreglo vacío [] significa "ejecutar solo una vez al montar el componente"

  // Métricas dinámicas calculadas en base a la API real de Laravel
  const totalAlumnos = alumnos.length;
  const totalMatriculados = alumnos.filter(a => a.estado_matricula?.toLowerCase() === 'matriculado').length;
  const totalPendientes = alumnos.filter(a => a.estado_matricula?.toLowerCase() !== 'matriculado').length;

  // Filtrado y búsqueda local para mejorar la experiencia de usuario
  const filteredAlumnos = alumnos.filter(alumno => {
    const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`.toLowerCase();
    const matchesSearch = nombreCompleto.includes(searchQuery.toLowerCase()) ||
                          alumno.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'matriculado') return matchesSearch && alumno.estado_matricula?.toLowerCase() === 'matriculado';
    return matchesSearch && alumno.estado_matricula?.toLowerCase() !== 'matriculado'; // 'inactivo' u otros
  });

  return (
    <>
      {/* Componente Navbar del Paso 6 */}
      <Navbar />
      
      <div className="container py-4">
        {/* Título de la Sección */}
        <div className="mb-4">
          <h1 className="fw-extrabold text-dark m-0">Directorio de Alumnos</h1>
          <p className="text-muted m-0">Operaciones en tiempo real: React conectado con la API de Laravel y MySQL</p>
        </div>

        {/* Panel General de Contadores/Estadísticas */}
        <Contador 
          totalAlumnos={totalAlumnos}
          totalMatriculados={totalMatriculados}
          totalPendientes={totalPendientes}
          totalSeleccionados={0} // No usamos la selección en la vista del Lab 5 para simplificar
        />

        <div className="row g-4">
          {/* Columna Izquierda: Buscador, Filtros y Lista de Alumnos */}
          <div className="col-lg-8">
            <div className="control-bar mb-4">
              <div className="row g-3">
                {/* Campo de Búsqueda */}
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
                      placeholder="Buscar por nombre, apellidos o email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtros Rápidos por Estado */}
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

              {filteredAlumnos.length > 0 && (
                <div className="mt-3 pt-3 border-top border-light d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Mostrando {filteredAlumnos.length} de {totalAlumnos} alumnos encontrados en MySQL</span>
                </div>
              )}
            </div>

            {/* Listado Grid de Alumno Cards según el Paso 6 */}
            <div className="row">
              {filteredAlumnos.length > 0 ? (
                filteredAlumnos.map(alumno => (
                  <AlumnoCard
                    key={alumno.id_alumno} // Usamos la llave primaria de la base de datos
                    nombre={`${alumno.nombre} ${alumno.apellidos}`}
                    carrera={alumno.email} // Temporal: Mostramos el email como indica la guía
                    estadoInicial={alumno.estado_matricula}
                  />
                ))
              ) : (
                <div className="col-12">
                  <div className="empty-state">
                    <div className="empty-state-icon">👨‍🎓</div>
                    <h5>No se encontraron alumnos registrados</h5>
                    <p className="text-muted">La base de datos MySQL de Laravel se encuentra vacía o el término de búsqueda no coincide.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Formulario de Registro Rápido */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '90px', zIndex: 1 }}>
              {/* Pasamos la función obtenerAlumnos al formulario */}
              <AlumnoForm recargarAlumnos={obtenerAlumnos} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;