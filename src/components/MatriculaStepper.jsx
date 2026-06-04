import { useState } from 'react';

const MatriculaStepper = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        dni: '',
        nombres: '',
        apellidos: '',
        curso: '',
        horario: ''
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Componentes de cada paso
    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <div className="fade-in glass-panel p-4">
                        <h4 className="text-white mb-3">Paso 1: Identidad</h4>
                        <p className="text-muted small mb-4">Ingresa tu DNI, nuestros sistemas validarán tu identidad automáticamente.</p>
                        <div className="mb-3">
                            <label className="form-label">DNI</label>
                            <input type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} placeholder="Ej. 70123456" />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombres</label>
                                <input type="text" className="form-control" name="nombres" value={formData.nombres} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="fade-in glass-panel p-4">
                        <h4 className="text-white mb-3">Paso 2: Selección Académica</h4>
                        <p className="text-muted small mb-4">Elige el curso al que deseas matricularte.</p>
                        <div className="row g-3">
                            {['Desarrollo Web React', 'Backend Laravel', 'Diseño UX/UI'].map((curso) => (
                                <div className="col-md-4" key={curso}>
                                    <div 
                                        className={`card p-3 cursor-pointer text-center ${formData.curso === curso ? 'border-primary shadow-lg' : ''}`}
                                        style={{ backgroundColor: formData.curso === curso ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)', cursor: 'pointer', border: formData.curso === curso ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                        onClick={() => setFormData({...formData, curso})}
                                    >
                                        <h6 className="text-white m-0">{curso}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="fade-in glass-panel p-4">
                        <h4 className="text-white mb-3">Paso 3: Horario (Drag & Drop visual)</h4>
                        <p className="text-muted small mb-4">Selecciona el bloque horario preferido para tus clases.</p>
                        <div className="row g-3">
                            {['Mañana (8am - 12pm)', 'Tarde (2pm - 6pm)', 'Noche (7pm - 10pm)'].map((horario) => (
                                <div className="col-md-12" key={horario}>
                                    <div 
                                        className={`card p-3 cursor-pointer d-flex flex-row align-items-center justify-content-between ${formData.horario === horario ? 'border-primary' : ''}`}
                                        style={{ backgroundColor: formData.horario === horario ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)', cursor: 'pointer', border: formData.horario === horario ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                        onClick={() => setFormData({...formData, horario})}
                                    >
                                        <span className="text-white">{horario}</span>
                                        {formData.horario === horario && <i className="fas fa-check-circle text-primary"></i>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="fade-in glass-panel p-4 text-center">
                        <h4 className="text-white mb-3">Paso 4: ¡Todo Listo!</h4>
                        <div className="p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', borderRadius: '16px' }}>
                            <h2 className="text-white mb-2">{formData.nombres} {formData.apellidos}</h2>
                            <p className="text-muted">DNI: {formData.dni}</p>
                            <hr style={{borderColor: 'rgba(255,255,255,0.1)'}} />
                            <h5 className="text-primary">{formData.curso}</h5>
                            <p className="text-muted">{formData.horario}</p>
                        </div>
                        <p className="mt-4 text-muted small">Al confirmar, tus datos serán procesados automáticamente por la pasarela de pagos.</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Stepper Header */}
                    <div className="d-flex justify-content-between mb-5 position-relative">
                        <div className="progress position-absolute" style={{ top: '50%', left: '0', right: '0', height: '2px', zIndex: '0', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                        </div>
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: '1' }}>
                                <div className={`d-flex align-items-center justify-content-center rounded-circle ${step >= s ? 'bg-primary text-white shadow' : 'bg-dark text-muted'}`} style={{ width: '40px', height: '40px', border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                                    {step > s ? '✓' : s}
                                </div>
                                <span className="small mt-2" style={{ color: step >= s ? '#F8FAFC' : '#94A3B8' }}>
                                    {s === 1 ? 'Identidad' : s === 2 ? 'Programa' : s === 3 ? 'Horarios' : 'Confirmación'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div style={{ minHeight: '300px' }}>
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <button 
                            className="btn btn-outline-light px-4 py-2" 
                            style={{ borderRadius: '10px', display: step === 1 ? 'none' : 'block' }} 
                            onClick={handlePrev}
                        >
                            Atrás
                        </button>
                        <div className="ms-auto">
                            {step < 4 ? (
                                <button className="btn btn-custom-primary px-4 py-2" onClick={handleNext}>
                                    Siguiente Paso <i className="fas fa-arrow-right ms-2"></i>
                                </button>
                            ) : (
                                <button className="btn btn-custom-primary px-4 py-2 bg-success border-success" onClick={() => alert('¡Matrícula exitosa!')}>
                                    Confirmar Matrícula <i className="fas fa-check ms-2"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatriculaStepper;
