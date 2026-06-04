import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

const ProfesorForm = ({ recargarProfesores, profesorEditando, cancelarEdicion }) => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellidos: '',
        dni: '',
        especialidad: '',
        email: '',
        estado: 'Activo',
        icono: '👨‍🏫'
    });

    useEffect(() => {
        if (profesorEditando) {
            setFormulario({
                nombre: profesorEditando.nombre || '',
                apellidos: profesorEditando.apellidos || '',
                dni: profesorEditando.dni || '',
                especialidad: profesorEditando.especialidad || '',
                email: profesorEditando.email || '',
                estado: profesorEditando.estado || 'Activo',
                icono: profesorEditando.icono || '👨‍🏫'
            });
        } else {
            setFormulario({
                nombre: '',
                apellidos: '',
                dni: '',
                especialidad: '',
                email: '',
                estado: 'Activo',
                icono: '👨‍🏫'
            });
        }
    }, [profesorEditando]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        if (name === 'dni') {
            const valNum = value.replace(/\D/g, '').slice(0, 8);
            setFormulario({ ...formulario, [name]: valNum });
        } else {
            setFormulario({ ...formulario, [name]: value });
        }
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        const id = profesorEditando ? (profesorEditando.id_profesor || profesorEditando.id) : null;
        const url = id 
            ? `${API_BASE}/profesores/${id}`
            : `${API_BASE}/profesores`;
        const method = id ? 'PUT' : 'POST';

        try {
            const { icono, ...datosParaLaravel } = formulario;
            const datosEnviados = {
                ...datosParaLaravel,
                fecha_nacimiento: '2000-01-01',
                estado_matricula: 'matriculado'
            };
            const respuesta = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosEnviados)
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                if (formulario.dni) {
                    localStorage.setItem(`avatar_profesor_${formulario.dni}`, formulario.icono);
                }
                mostrarToast(
                    id ? 'Profesor actualizado exitosamente' : 'Profesor guardado exitosamente', 
                    'success'
                );
                setFormulario({
                    nombre: '', apellidos: '', dni: '', especialidad: '', email: '', estado: 'Activo', icono: '👨‍🏫'
                });
                if (id && cancelarEdicion) cancelarEdicion();
                recargarProfesores();
            } else {
                console.log("Errores:", datos.errors);
                const msgError = datos.errors 
                    ? Object.values(datos.errors).flat().join(', ')
                    : (datos.message || 'Error al guardar.');
                mostrarToast(msgError, 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarToast('No se pudo conectar con Laravel.', 'danger');
        }
    };

    return (
        <div className="add-student-card mb-4">
            <h3 className="section-title">{profesorEditando ? 'Editar Mentor' : 'Registrar Mentor'}</h3>
            <div className="mt-2">
                <form onSubmit={manejarEnvio}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombres</label>
                            <input type="text" className="form-control form-control-custom" name="nombre" value={formulario.nombre} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellidos</label>
                            <input type="text" className="form-control form-control-custom" name="apellidos" value={formulario.apellidos} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">DNI / Documento</label>
                            <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                name="dni" 
                                value={formulario.dni} 
                                onChange={manejarCambio} 
                                placeholder="8 dígitos"
                                maxLength="8"
                                required 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Especialidad</label>
                            <input type="text" className="form-control form-control-custom" name="especialidad" value={formulario.especialidad} onChange={manejarCambio} required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Correo Electrónico</label>
                            <input type="email" className="form-control form-control-custom" name="email" value={formulario.email} onChange={manejarCambio} placeholder="correo@senati.pe" required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Estado</label>
                            <select className="form-select form-control-custom" name="estado" value={formulario.estado} onChange={manejarCambio}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label mb-2">Avatar del Mentor</label>
                            <div className="d-flex gap-2 flex-wrap mb-1">
                                {['👨‍🏫', '👩‍🏫', '👨‍🎨', '👩‍🎨', '👨‍💼', '👩‍💼'].map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        className="btn rounded-circle d-flex align-items-center justify-content-center p-0"
                                        style={{ 
                                            width: '44px', 
                                            height: '44px', 
                                            fontSize: '1.4rem', 
                                            backgroundColor: formulario.icono === emoji ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.04)', 
                                            border: formulario.icono === emoji ? '2px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)', 
                                            boxShadow: formulario.icono === emoji ? '0 0 12px rgba(139, 92, 246, 0.5)' : 'none',
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
                            {profesorEditando && (
                                <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className="btn btn-custom-primary shadow-sm">
                                <i className="fas fa-save me-2"></i>
                                {profesorEditando ? 'Actualizar Profesor' : 'Guardar Profesor'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfesorForm;
