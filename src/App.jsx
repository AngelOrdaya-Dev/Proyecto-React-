
import Header from './components/Header';
import AlumnoCard from './components/AlumnoCard';

const alumnosData = [
  { id: 1, nombre: "Angel Ordaya", carrera: "Ingeniería de Software", estado: "Matriculado" },
  { id: 2, nombre: "Ariana Fernández", carrera: "Medicina Humana", estado: "Pendiente" },
  { id: 3, nombre: "Jheisson Sanchez", carrera: "Ingeniería de Sistemas", estado: "Matriculado" },
  { id: 4, nombre: "Rodrigo Ormeño", carrera: "Ingeniería de IA", estado: "Pendiente" },
  { id: 5, nombre: "Andre Zapata", carrera: "Ingeniería de Ciberseguridad", estado: "Matriculado" },
  { id: 6, nombre: "James Rojas", carrera: "Mecatrónica de Buses y Camiones", estado: "Pendiente" },
  { id: 7, nombre: "Fabian Chavez", carrera: "Ingeniería de Software", estado: "Matriculado" },
  { id: 8, nombre: "Aileen Chavez", carrera: "Diseño Gráfico", estado: "Pendiente" },
  { id: 9, nombre: "Andree Vega", carrera: "Ingeniería de Informática", estado: "Matriculado" },
];

function App() {
  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">Lista de Alumnos</h2>
        <div className="row">
          {alumnosData.map(alumno => (
            <AlumnoCard
              key={alumno.id}
              nombre={alumno.nombre}
              carrera={alumno.carrera}
              estado={alumno.estado}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default App;