import { useState, useEffect } from 'react';
import { mostrarToast } from '../App';
import { API_BASE } from '../config';

const MatriculaDashboard = () => {
    const [formData, setFormData] = useState({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        fecha_nacimiento: '',
        curso: '',
        horario: ''
    });

    const [activeTab, setActiveTab] = useState('inscripcion');
    const [showModal, setShowModal] = useState(false);
    const [analytics, setAnalytics] = useState({ alumnos: 0, profesores: 0, cursos: 0 });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dni') {
            const valNum = value.replace(/\D/g, '').slice(0, 8);
            setFormData({ ...formData, [name]: valNum });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${API_BASE}/alumnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombres,
                    apellidos: formData.apellidos,
                    dni: formData.dni,
                    email: formData.email,
                    fecha_nacimiento: formData.fecha_nacimiento,
                    estado_matricula: 'matriculado'
                })
            });
            const data = await resp.json();
            if (resp.ok) {
                mostrarToast('Matrícula procesada exitosamente', 'success');
                setShowModal(true);
            } else {
                const msgError = data.errors 
                    ? Object.values(data.errors).flat().join(', ')
                    : (data.message || 'Error al procesar matrícula');
                mostrarToast(msgError, 'danger');
                console.error(data);
            }
        } catch (err) {
            console.error(err);
            mostrarToast('Fallo de conexión con el servidor', 'danger');
        }
    };

    const loadAnalytics = async () => {
        try {
            const [aRes, pRes, cRes] = await Promise.all([
                fetch(`${API_BASE}/alumnos`),
                fetch(`${API_BASE}/profesores`),
                fetch(`${API_BASE}/cursos`)
            ]);
            const [aData, pData, cData] = await Promise.all([aRes.json(), pRes.json(), cRes.json()]);
            setAnalytics({
                alumnos: (aData.data || aData).filter(a => (a.estado_matricula || a.estado || '').toLowerCase() === 'matriculado').length,
                profesores: (pData.data || pData).length,
                cursos: (cData.data || cData).length
            });
        } catch (e) {
            console.error('Error cargando analíticas', e);
        }
    };

    useEffect(() => {
        if (activeTab === 'analiticas') loadAnalytics();
    }, [activeTab]);

    return (
        <div className="container py-5">
            {/* Tabs selector */}
            <div className="dashboard-tabs">
                <button 
                    className={`dashboard-tab-btn ${activeTab === 'inscripcion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inscripcion')}
                >
                    <i className="fas fa-user-plus me-2"></i> Inscripción VIP
                </button>
                <button 
                    className={`dashboard-tab-btn ${activeTab === 'analiticas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analiticas')}
                >
                    <i className="fas fa-chart-pie me-2"></i> Analíticas
                </button>
            </div>

            {activeTab === 'inscripcion' ? (
                <div className="row g-4">
                    {/* Lado Izquierdo: Formulario en una sola vista con secciones visuales */}
                    <div className="col-lg-8">
                        <div className="glass-panel p-4 p-md-5 mb-4 fade-in">
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-glow" style={{width: '45px', height: '45px', fontWeight: '900', background: 'var(--primary-gradient)', color: '#fff', fontSize: '1.2rem'}}>1</div>
                                <h3 className="m-0 text-white font-weight-bold" style={{fontFamily: 'Outfit'}}>Identidad Premium</h3>
                            </div>
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <label className="form-label text-gradient">DNI / Pasaporte</label>
                                    <input type="text" className="form-control form-control-lg" name="dni" value={formData.dni} onChange={handleChange} placeholder="Ej. 70123456" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-gradient">Nombres</label>
                                    <input type="text" className="form-control form-control-lg" name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Tus nombres" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-gradient">Apellidos</label>
                                    <input type="text" className="form-control form-control-lg" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Tus apellidos" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-accent-gradient">Correo Electrónico</label>
                                    <input type="email" className="form-control form-control-lg" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-accent-gradient">Fecha de Nacimiento</label>
                                    <input type="date" className="form-control form-control-lg" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-4 p-md-5 mb-4 fade-in" style={{animationDelay: '0.1s'}}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-glow" style={{width: '45px', height: '45px', fontWeight: '900', background: 'var(--primary-gradient)', color: '#fff', fontSize: '1.2rem'}}>2</div>
                                <h3 className="m-0 text-white font-weight-bold" style={{fontFamily: 'Outfit'}}>Programa de Élite</h3>
                            </div>
                            <div className="row g-3">
                                {['Desarrollo Web React', 'Backend Laravel', 'Diseño UX/UI Premium'].map((curso) => (
                                    <div className="col-md-4" key={curso}>
                                        <div 
                                            className="card h-100 p-4 selection-card"
                                            style={{ 
                                                backgroundColor: formData.curso === curso ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.02)', 
                                                cursor: 'pointer', 
                                                border: formData.curso === curso ? '2px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.05)', 
                                                boxShadow: formData.curso === curso ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                                            }}
                                            onClick={() => setFormData({...formData, curso})}
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="icon-box" style={{fontSize: '2rem'}}>
                                                    {curso.includes('React') ? '⚛️' : curso.includes('Laravel') ? '🐘' : '🎨'}
                                                </div>
                                                {formData.curso === curso && <i className="fas fa-check-circle text-primary fs-4" style={{color: 'var(--primary-color)'}}></i>}
                                            </div>
                                            <h5 className="text-white mt-2 fw-bold" style={{fontFamily: 'Outfit'}}>{curso}</h5>
                                            <p className="text-muted small mb-0">Modalidad 100% Online</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-4 p-md-5 mb-4 fade-in" style={{animationDelay: '0.2s'}}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-glow" style={{width: '45px', height: '45px', fontWeight: '900', background: 'var(--primary-gradient)', color: '#fff', fontSize: '1.2rem'}}>3</div>
                                <h3 className="m-0 text-white font-weight-bold" style={{fontFamily: 'Outfit'}}>Disponibilidad</h3>
                            </div>
                            <div className="d-flex flex-wrap gap-3">
                                {['Mañana (8am - 12pm)', 'Tarde (2pm - 6pm)', 'Noche (7pm - 10pm)'].map((horario) => (
                                    <div 
                                        key={horario}
                                        className="px-4 py-3 selection-card"
                                        style={{ 
                                            background: formData.horario === horario ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.02)', 
                                            color: formData.horario === horario ? '#000' : 'var(--text-muted)',
                                            cursor: 'pointer', 
                                            border: formData.horario === horario ? 'none' : '1px solid rgba(255,255,255,0.05)', 
                                            borderRadius: '16px',
                                            flex: '1 1 auto',
                                            textAlign: 'center',
                                            fontWeight: '800',
                                            boxShadow: formData.horario === horario ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none'
                                        }}
                                        onClick={() => setFormData({...formData, horario})}
                                    >
                                        {horario}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lado Derecho: Resumen interactivo */}
                    <div className="col-lg-4">
                        <div className="glass-panel p-4 p-md-5 sticky-top" style={{ top: '100px', zIndex: 10, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <h3 className="text-white mb-4 text-gradient font-weight-bold" style={{fontFamily: 'Outfit'}}>Resumen VIP</h3>
                            <div className="mb-4 pb-3 border-bottom" style={{borderColor: 'rgba(255,255,255,0.1) !important'}}>
                                <small className="text-muted d-block text-uppercase" style={{letterSpacing: '0.1em'}}>Aspirante</small>
                                <span className="fw-bold fs-5 text-white">{formData.nombres || formData.apellidos ? `${formData.nombres} ${formData.apellidos}` : 'No Registrado'}</span>
                            </div>
                            <div className="mb-4 pb-3 border-bottom" style={{borderColor: 'rgba(255,255,255,0.1) !important'}}>
                                <small className="text-muted d-block text-uppercase" style={{letterSpacing: '0.1em'}}>DNI</small>
                                <span className="fw-bold text-white fs-5">{formData.dni || '---'}</span>
                            </div>
                            <div className="mb-4 pb-3 border-bottom" style={{borderColor: 'rgba(255,255,255,0.1) !important'}}>
                                <small className="text-muted d-block text-uppercase" style={{letterSpacing: '0.1em'}}>Especialización</small>
                                <span className="fw-bold fs-5 text-accent-gradient">{formData.curso || 'Seleccione Programa'}</span>
                            </div>
                            <div className="mb-5">
                                <small className="text-muted d-block text-uppercase" style={{letterSpacing: '0.1em'}}>Horario</small>
                                <span className="fw-bold fs-5" style={{color: 'var(--success-color)'}}>{formData.horario || 'Seleccione Horario'}</span>
                            </div>
                            <button 
                                className="btn btn-custom-primary w-100 py-3 d-flex justify-content-center align-items-center gap-2 fs-5" 
                                onClick={handleSubmit} 
                                disabled={!formData.nombres || !formData.apellidos || !formData.dni || !formData.email || !formData.fecha_nacimiento || !formData.curso || !formData.horario}
                                style={{opacity: (!formData.nombres || !formData.apellidos || !formData.dni || !formData.email || !formData.fecha_nacimiento || !formData.curso || !formData.horario) ? 0.5 : 1}}
                            >
                                <i className="fas fa-fingerprint"></i> Procesar Matrícula
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="analytics-tab p-4 glass-panel fade-in">
                    <h3 className="mb-5 text-gradient font-weight-bold" style={{fontFamily: 'Outfit'}}>Estadísticas en Tiempo Real</h3>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card text-center p-5 selection-card" style={{border: '1px solid rgba(139, 92, 246, 0.4)'}}>
                                <h5 className="text-muted text-uppercase" style={{letterSpacing: '0.1em'}}>Alumnos Activos</h5>
                                <p className="display-3 font-weight-bold text-white m-0" style={{fontFamily: 'Outfit'}}>{analytics.alumnos}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center p-5 selection-card" style={{border: '1px solid rgba(0, 240, 255, 0.4)'}}>
                                <h5 className="text-muted text-uppercase" style={{letterSpacing: '0.1em'}}>Profesores</h5>
                                <p className="display-3 font-weight-bold text-white m-0" style={{fontFamily: 'Outfit'}}>{analytics.profesores}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center p-5 selection-card" style={{border: '1px solid rgba(0, 255, 135, 0.4)'}}>
                                <h5 className="text-muted text-uppercase" style={{letterSpacing: '0.1em'}}>Cursos Impartidos</h5>
                                <p className="display-3 font-weight-bold text-white m-0" style={{fontFamily: 'Outfit'}}>{analytics.cursos}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Voucher */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="voucher-modal voucher-print-zone" onClick={e => e.stopPropagation()}>
                        <div className="voucher-header">
                            <h3 className="m-0">PASE VIP</h3>
                            <p className="m-0 text-white opacity-75 mt-2" style={{letterSpacing: '0.2em', textTransform: 'uppercase'}}>Acceso a la Élite Tecnológica</p>
                        </div>
                        <div className="voucher-body">
                            <div className="voucher-row">
                                <span className="voucher-label">Aspirante</span>
                                <span className="voucher-value">{formData.nombres} {formData.apellidos}</span>
                            </div>
                            <div className="voucher-row">
                                <span className="voucher-label">DNI</span>
                                <span className="voucher-value">{formData.dni}</span>
                            </div>
                            <div className="voucher-row">
                                <span className="voucher-label">ID Único</span>
                                <span className="voucher-value" style={{color: 'var(--selection-color)'}}>{formData.email}</span>
                            </div>
                            
                            <div style={{height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0'}}></div>
                            
                            <div className="voucher-row">
                                <span className="voucher-label">Especialidad</span>
                                <span className="voucher-value fw-bold text-gradient">{formData.curso}</span>
                            </div>
                            <div className="voucher-row">
                                <span className="voucher-label">Ciclo Operativo</span>
                                <span className="voucher-value fw-bold" style={{color: 'var(--success-color)'}}>{formData.horario}</span>
                            </div>
                            
                            <div className="voucher-qr-wrapper">
                                <svg width="100" height="100" viewBox="0 0 120 120">
                                    <rect width="120" height="120" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                                    {[...Array(12)].map((_, i) => (
                                        <rect key={i} x={(i * 15) % 100 + 10} y={(i * 25) % 100 + 10} width="8" height="8" fill={i % 2 === 0 ? 'var(--primary-color)' : 'var(--selection-color)'} />
                                    ))}
                                    <rect x="20" y="20" width="30" height="30" fill="none" stroke="var(--primary-color)" strokeWidth="4" />
                                    <rect x="70" y="20" width="30" height="30" fill="none" stroke="var(--selection-color)" strokeWidth="4" />
                                    <rect x="20" y="70" width="30" height="30" fill="none" stroke="var(--success-color)" strokeWidth="4" />
                                </svg>
                            </div>
                            
                            <div className="text-center mb-4" style={{fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.1em'}}>
                                HASH: MD5-{(formData.dni + formData.curso).toUpperCase().replace(/\s/g, '')}
                            </div>
                            
                            <div className="d-flex gap-3 justify-content-center">
                                <button className="btn btn-outline-light" style={{borderRadius: '100px', padding: '1rem 2rem', fontWeight: 'bold'}} onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                                <button className="btn-print" onClick={() => window.print()}>
                                    <i className="fas fa-print me-2"></i> Emitir Credencial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatriculaDashboard;
