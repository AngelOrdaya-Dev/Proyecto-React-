import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

const CursoForm = ({ recargarCursos, cursoEditando, cancelarEdicion }) => {
    const [formulario, setFormulario] = useState({
        nombre_curso: '',
        creditos: '',
        horas: '',
        estado: 'activo',
        icono: '⚛️'
    });

    useEffect(() => {
        if (cursoEditando) {
            setFormulario({
                nombre_curso: cursoEditando.nombre_curso || '',
                creditos: cursoEditando.creditos || '',
                horas: cursoEditando.horas || '',
                estado: cursoEditando.estado || 'activo',
                icono: cursoEditando.icono || '⚛️'
            });
        } else {
            setFormulario({
                nombre_curso: '',
                creditos: '',
                horas: '',
                estado: 'activo',
                icono: '⚛️'
            });
        }
    }, [cursoEditando]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        const id = cursoEditando ? (cursoEditando.id_curso || cursoEditando.id) : null;
        const url = id 
            ? `${API_BASE}/cursos/${id}`
            : `${API_BASE}/cursos`;
        const method = id ? 'PUT' : 'POST';

        try {
            const { icono, ...datosParaLaravel } = formulario;
            const respuesta = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosParaLaravel)
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                if (formulario.nombre_curso) {
                    localStorage.setItem(`avatar_curso_${formulario.nombre_curso}`, formulario.icono);
                }
                mostrarToast(
                    id ? 'Curso actualizado exitosamente' : 'Curso guardado exitosamente', 
                    'success'
                );
                setFormulario({
                    nombre_curso: '', creditos: '', horas: '', estado: 'activo', icono: '⚛️'
                });
                if (id && cancelarEdicion) cancelarEdicion();
                recargarCursos();
            } else {
                console.log("Errores:", datos.errors);
                mostrarToast('Error al guardar. Revisa la consola para más detalles.', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarToast('No se pudo conectar con Laravel.', 'danger');
        }
    };

    return (
        <div className="add-student-card mb-4">
            <h3 className="section-title">{cursoEditando ? 'Editar Programa' : 'Nuevo Programa'}</h3>
            <div className="mt-2">
                <form onSubmit={manejarEnvio}>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label">Nombre del Programa</label>
                            <input type="text" className="form-control form-control-custom" name="nombre_curso" value={formulario.nombre_curso} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Créditos</label>
                            <input type="number" className="form-control form-control-custom" name="creditos" value={formulario.creditos} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Horas</label>
                            <input type="number" className="form-control form-control-custom" name="horas" value={formulario.horas} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Estado</label>
                            <select className="form-select form-control-custom" name="estado" value={formulario.estado} onChange={manejarCambio}>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label mb-2">Icono del Programa</label>
                            <div className="d-flex gap-2 flex-wrap mb-1">
                                {['⛛️', '🐘', '🎨', '🐍', '☕', '📊'].map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        className="btn rounded-circle d-flex align-items-center justify-content-center p-0"
                                        style={{ 
                                            width: '44px', 
                                            height: '44px', 
                                            fontSize: '1.4rem', 
                                            backgroundColor: formulario.icono === emoji ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.04)', 
                                            border: formulario.icono === emoji ? '2px solid var(--selection-color)' : '1px solid rgba(255,255,255,0.1)', 
                                            boxShadow: formulario.icono === emoji ? '0 0 12px rgba(0, 240, 255, 0.4)' : 'none',
                                            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                        onClick={() => setFormulario({ ...formulario, icono: emoji })}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 text-end mt-4 d-flex justify-content-end gap-2">
                            {cursoEditando && (
                                <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className="btn btn-custom-primary shadow-sm">
                                <i className="fas fa-save me-2"></i>
                                {cursoEditando ? 'Actualizar Curso' : 'Guardar Curso'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CursoForm;
