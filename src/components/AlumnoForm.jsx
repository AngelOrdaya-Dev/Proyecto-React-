import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

// src/components/AlumnoForm.jsx
const AlumnoForm = ({ recargarAlumnos, alumnoEditando, cancelarEdicion }) => {
    // 1. El estado coincide exactamente con las columnas de la migración en Laravel
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellidos: '',
        dni: '',
        fecha_nacimiento: '',
        email: '',
        estado_matricula: 'matriculado', // Valor por defecto
        icono: '👨‍🎓'
    });

    // Cargar datos del alumno que se va a editar
    useEffect(() => {
        if (alumnoEditando) {
            setFormulario({
                nombre: alumnoEditando.nombre || '',
                apellidos: alumnoEditando.apellidos || '',
                dni: alumnoEditando.dni || '',
                fecha_nacimiento: alumnoEditando.fecha_nacimiento ? alumnoEditando.fecha_nacimiento.slice(0, 10) : '',
                email: alumnoEditando.email || '',
                estado_matricula: alumnoEditando.estado_matricula ? alumnoEditando.estado_matricula.toLowerCase() : 'matriculado',
                icono: alumnoEditando.icono || '👨‍🎓'
            });
        } else {
            setFormulario({
                nombre: '',
                apellidos: '',
                dni: '',
                fecha_nacimiento: '',
                email: '',
                estado_matricula: 'matriculado',
                icono: '👨‍🎓'
            });
        }
    }, [alumnoEditando]);

    // 2. Función universal para leer los inputs
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        if (name === 'dni') {
            const valNum = value.replace(/\D/g, '').slice(0, 8);
            setFormulario({ ...formulario, [name]: valNum });
        } else {
            setFormulario({ ...formulario, [name]: value });
        }
    };

    // 3. Función para enviar los datos a Laravel
    const manejarEnvio = async (e) => {
        e.preventDefault();
        const id = alumnoEditando ? (alumnoEditando.id_alumno || alumnoEditando.id) : null;
        const url = id 
            ? `${API_BASE}/alumnos/${id}`
            : `${API_BASE}/alumnos`;
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
                // Guardar avatar de forma persistente local
                if (formulario.dni) {
                    localStorage.setItem(`avatar_alumno_${formulario.dni}`, formulario.icono);
                }
                mostrarToast(
                    id ? 'Alumno actualizado exitosamente' : 'Alumno guardado exitosamente en la base de datos', 
                    'success'
                );
                // Limpiamos el formulario
                setFormulario({
                    nombre: '',
                    apellidos: '',
                    dni: '',
                    fecha_nacimiento: '',
                    email: '',
                    estado_matricula: 'matriculado',
                    icono: '👨‍🎓'
                });
                if (id && cancelarEdicion) cancelarEdicion();
                // Llamamos a la función del padre (App.jsx) para volver a pedir la lista actualizada
                recargarAlumnos();
            } else {
                // Si hay errores de validación en Laravel (Código 422)
                console.log("Errores de validación:", datos.errors);
                const msgError = datos.errors 
                    ? Object.values(datos.errors).flat().join(', ')
                    : (datos.message || 'Error al guardar.');
                mostrarToast(msgError, 'danger');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            mostrarToast('No se pudo conectar con el servidor de Laravel.', 'danger');
        }
    };

    return (
        <div className="add-student-card mb-4">
            <h3 className="section-title">{alumnoEditando ? 'Modificar Aspirante' : 'Nuevo Aspirante'}</h3>
            <div className="mt-2">
                <form onSubmit={manejarEnvio}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombres</label>
                            <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                name="nombre" 
                                value={formulario.nombre} 
                                onChange={manejarCambio} 
                                placeholder="Ej. Angel"
                                required 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellidos</label>
                            <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                name="apellidos" 
                                value={formulario.apellidos} 
                                onChange={manejarCambio} 
                                placeholder="Ej. Ordaya"
                                required 
                            />
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
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input 
                                type="date" 
                                className="form-control form-control-custom" 
                                name="fecha_nacimiento" 
                                value={formulario.fecha_nacimiento} 
                                onChange={manejarCambio} 
                                required 
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="form-control form-control-custom" 
                                name="email" 
                                value={formulario.email} 
                                onChange={manejarCambio} 
                                placeholder="correo@senati.pe"
                                required 
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Estado de Matrícula</label>
                            <select 
                                className="form-select form-control-custom" 
                                name="estado_matricula" 
                                value={formulario.estado_matricula} 
                                onChange={manejarCambio}
                            >
                                <option value="matriculado">Matriculado</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label mb-2">Avatar del Estudiante</label>
                            <div className="d-flex gap-2 flex-wrap mb-1">
                                {['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬'].map(emoji => (
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
                            {alumnoEditando && (
                                <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className="btn btn-custom-primary shadow-sm">
                                <i className="fas fa-save me-2"></i>
                                {alumnoEditando ? 'Actualizar en MySQL' : 'Guardar en MySQL'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlumnoForm;
