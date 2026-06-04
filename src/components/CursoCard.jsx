import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

const CursoCard = ({ curso, alEliminar, alEditar }) => {
    const id = curso.id_curso || curso.id;
    const nombre = curso.nombre_curso;
    const creditos = curso.creditos;
    const estadoInicial = curso.estado;
    const icono = curso.icono;

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
            const respuesta = await fetch(`${API_BASE}/cursos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre_curso: curso.nombre_curso,
                    creditos: curso.creditos,
                    horas: curso.horas,
                    estado: nuevoEstado
                })
            });
            if (respuesta.ok) {
                setEstado(nuevoEstado);
                mostrarToast('Estado actualizado', 'success');
            } else {
                mostrarToast('Error al actualizar estado', 'danger');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Error de conexión', 'danger');
        }
    };

    const manejarEliminar = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas purgar el curso ${nombre}?`)) return;
        try {
            const respuesta = await fetch(`${API_BASE}/cursos/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            if (respuesta.ok) {
                mostrarToast('Curso purgado correctamente', 'success');
                if (alEliminar) alEliminar();
            } else {
                mostrarToast('Error en la purga', 'danger');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Error de red', 'danger');
        }
    };

    const courseIcons = ['⚛️', '🐘', '🎨', '🐍', '☕', '📊'];
    const getDeterministicIcon = (str) => {
        if (!str) return courseIcons[0];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return courseIcons[Math.abs(hash) % courseIcons.length];
    };

    const displayIcon = localStorage.getItem(`avatar_curso_${curso.nombre_curso}`) || icono || getDeterministicIcon(nombre);

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
                                <h6 className="student-carrera m-0">Créditos: {creditos}</h6>
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
                                title="Editar curso"
                            >
                                <i className="fas fa-pen"></i>
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger card-action-btn"
                                onClick={manejarEliminar}
                                title="Eliminar curso"
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

export default CursoCard;
