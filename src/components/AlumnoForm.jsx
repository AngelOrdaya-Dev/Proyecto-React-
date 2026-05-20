import { useState } from 'react';

// src/components/AlumnoForm.jsx
const AlumnoForm = ({ recargarAlumnos }) => {
    // 1. El estado coincide exactamente con las columnas de la migración en Laravel
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellidos: '',
        dni: '',
        fecha_nacimiento: '',
        email: '',
        estado_matricula: 'matriculado' // Valor por defecto
    });

    // 2. Función universal para leer los inputs
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    // 3. Función para enviar los datos a Laravel
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            // Hacemos la petición POST a nuestra API de Laravel
            const respuesta = await fetch('http://127.0.0.1:8000/api/alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Fundamental para que Laravel devuelva errores en JSON
                },
                body: JSON.stringify(formulario)
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                // Si Laravel responde con código 201 (Created)
                alert('Alumno guardado exitosamente en la base de datos');
                // Limpiamos el formulario
                setFormulario({
                    nombre: '',
                    apellidos: '',
                    dni: '',
                    fecha_nacimiento: '',
                    email: '',
                    estado_matricula: 'matriculado'
                });
                // Llamamos a la función del padre (App.jsx) para volver a pedir la lista actualizada
                recargarAlumnos();
            } else {
                // Si hay errores de validación en Laravel (Código 422)
                console.log("Errores de validación:", datos.errors);
                alert('Error al guardar. Revisa la consola para más detalles.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor de Laravel.');
        }
    };

    return (
        <div className="card add-student-card mb-4">
            <h3 className="section-title">Registrar Nuevo Alumno</h3>
            <div className="card-body p-0 mt-2">
                <form onSubmit={manejarEnvio}>
                    <div className="row g-3">
                        {/* Se construyen los inputs asegurando que el atributo 'name' coincida con el estado */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark small mb-1">Nombres</label>
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
                            <label className="form-label fw-bold text-dark small mb-1">Apellidos</label>
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
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-dark small mb-1">DNI</label>
                            <input 
                                type="text" 
                                className="form-control form-control-custom" 
                                name="dni" 
                                value={formulario.dni} 
                                onChange={manejarCambio} 
                                placeholder="8 dígitos"
                                required 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-dark small mb-1">F. Nacimiento</label>
                            <input 
                                type="date" 
                                className="form-control form-control-custom" 
                                name="fecha_nacimiento" 
                                value={formulario.fecha_nacimiento} 
                                onChange={manejarCambio} 
                                required 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-dark small mb-1">Email</label>
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
                            <label className="form-label fw-bold text-dark small mb-1">Estado de Matrícula</label>
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
                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-custom-primary shadow-sm">
                                <i className="fas fa-save me-2"></i>Guardar en MySQL
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlumnoForm;
