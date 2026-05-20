import { useState } from 'react';

// src/components/AlumnoCard.jsx
const AlumnoCard = ({ nombre, carrera, estadoInicial }) => {
    // Inicializamos el estado local usando la prop 'estadoInicial' tal como indica la guía
    const [estado, setEstado] = useState(estadoInicial);

    // Ajuste de estilos de insignias basados en el estado real de la base de datos
    const isMatriculado = estado.toLowerCase() === 'matriculado';
    const badgeClass = isMatriculado
        ? 'status-badge status-badge-matriculado'
        : 'status-badge status-badge-pendiente';

    // Función interactiva para alternar el estado local (Paso de la guía)
    const cambiarEstado = () => {
        setEstado(isMatriculado ? 'inactivo' : 'matriculado');
    };

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card student-card h-100">
                <div className="card-body student-card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 className="student-title text-dark">{nombre}</h5>
                        <h6 className="student-carrera">{carrera}</h6>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                        {/* Estado clickable con interactividad */}
                        <span 
                            className={badgeClass} 
                            onClick={cambiarEstado}
                            style={{ cursor: 'pointer' }}
                            title="Haga clic para alternar estado localmente"
                        >
                            ● {estado}
                        </span>
                        
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-sm btn-outline-warning card-action-btn"
                                title="Editar alumno (Futura característica)"
                            >
                                Editar
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger card-action-btn"
                                title="Eliminar alumno (Futura característica)"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumnoCard;