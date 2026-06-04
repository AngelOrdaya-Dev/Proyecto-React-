import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

const ProfesorCard = ({ profesor, alEliminar, alEditar }) => {
    const id = profesor.id_profesor || profesor.id;
    const nombre = `${profesor.nombre} ${profesor.apellidos}`;
    const especialidad = profesor.especialidad;
    const estadoInicial = profesor.estado;
    const icono = profesor.icono;

    const [estado, setEstado] = useState(estadoInicial || 'activo');

    useEffect(() => {
        setEstado(estadoInicial || 'activo');
    }, [estadoInicial]);

    const isActivo = (estado || '').toLowerCase() === 'activo';
    const badgeClass = isActivo
        ? 'status-badge status-badge-matriculado'
        : 'status-badge status-badge-pendiente';

    const cambiarEstado = async () => {
        const nuevoEstado = isActivo ? 'inactivo' : 'activo';
        try {
            const respuesta = await fetch(`${API_BASE}/profesores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre: profesor.nombre,
                    apellidos: profesor.apellidos,
                    dni: profesor.dni,
                    especialidad: profesor.especialidad,
                    email: profesor.email,
                    estado: nuevoEstado,
                    fecha_nacimiento: '2000-01-01',
                    estado_matricula: 'matriculado'
                })
            });
            if (respuesta.ok) {
                setEstado(nuevoEstado);
                mostrarToast('Estado sincronizado', 'success');
            } else {
                mostrarToast('Error al sincronizar estado', 'danger');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Error de red', 'danger');
        }
    };

    const manejarEliminar = async () => {
        if (!window.confirm(`¿Purgar la cuenta de ${nombre}?`)) return;
        try {
            const respuesta = await fetch(`${API_BASE}/profesores/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            if (respuesta.ok) {
                mostrarToast('Instructor purgado exitosamente', 'success');
                if (alEliminar) alEliminar();
            } else {
                mostrarToast('Error en purga', 'danger');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Fallo en la red', 'danger');
        }
    };

    const teacherIcons = ['👨‍🏫', '👩‍🏫', '👨‍🎨', '👩‍🎨', '👨‍💼', '👩‍💼'];
    const getDeterministicIcon = (str) => {
        if (!str) return teacherIcons[0];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return teacherIcons[Math.abs(hash) % teacherIcons.length];
    };

    const displayIcon = localStorage.getItem(`avatar_profesor_${profesor.dni}`) || icono || getDeterministicIcon(nombre);

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card student-card h-100">
                <div className="card-body student-card-body d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="avatar-circle d-flex align-items-center justify-content-center">
                                {displayIcon}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h5 className="student-title m-0" title={nombre}>{nombre}</h5>
                                <h6 className="student-carrera m-0" title={especialidad}>{especialidad}</h6>
                            </div>
                        </div>
                    </div>
                    
                    <div className="student-card-footer">
                        <span 
                            className={badgeClass} 
                            onClick={cambiarEstado}
                            title="Haga clic para alternar estado"
                        >
                            <i className="fas fa-circle me-2" style={{fontSize: '0.6rem', opacity: 0.8}}></i> {estado}
                        </span>
                        <div className="student-card-actions">
                            <button 
                                className="btn btn-sm btn-outline-warning card-action-btn"
                                onClick={alEditar}
                                title="Editar profesor"
                            >
                                <i className="fas fa-pen"></i>
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger card-action-btn"
                                onClick={manejarEliminar}
                                title="Eliminar profesor"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesorCard;
