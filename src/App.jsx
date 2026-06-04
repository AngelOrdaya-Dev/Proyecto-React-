import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AlumnosView from './components/AlumnosView';
import ProfesoresView from './components/ProfesoresView';
import CursosView from './components/CursosView';
import MatriculaDashboard from './components/MatriculaDashboard';

// ============================================
// HELPER GLOBAL: Dispara Toasts desde cualquier componente
// Uso: mostrarToast('Mensaje exitoso', 'success');
// Tipos: 'success' | 'danger' | 'warning' | 'info'
// ============================================
export const mostrarToast = (mensaje, tipo = 'info', titulo = null) => {
  const titulos = { success: '¡Éxito!', danger: 'Error', warning: 'Advertencia', info: 'Información' };
  window.dispatchEvent(new CustomEvent('mostrar-toast', {
    detail: { mensaje, tipo, titulo: titulo || titulos[tipo] || 'Notificación' }
  }));
};

// ============================================
// Componente Interno: Toast Container
// ============================================
const TOAST_DURATION = 4500; // ms

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 350); // match CSS exit animation
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { mensaje, tipo, titulo } = e.detail;
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, mensaje, tipo, titulo, exiting: false }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    };
    window.addEventListener('mostrar-toast', handler);
    return () => window.removeEventListener('mostrar-toast', handler);
  }, [removeToast]);

  const iconMap = {
    success: 'fa-check',
    danger: 'fa-xmark',
    warning: 'fa-exclamation',
    info: 'fa-info'
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item toast-${toast.tipo} ${toast.exiting ? 'toast-exit' : ''}`}>
          <div className="toast-icon">
            <i className={`fas ${iconMap[toast.tipo]}`}></i>
          </div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{toast.titulo}</div>
            <div className="toast-msg">{toast.mensaje}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <i className="fas fa-times"></i>
          </button>
          <div
            className="toast-progress"
            style={{ animationDuration: `${TOAST_DURATION}ms` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// App Principal
// ============================================
function App() {
  const [vistaActual, setVistaActual] = useState('matricula');

  const renderizarVista = () => {
    switch(vistaActual) {
      case 'matricula':
        return <MatriculaDashboard />;
      case 'alumnos':
        return <AlumnosView />;
      case 'profesores':
        return <ProfesoresView />;
      case 'cursos':
        return <CursosView />;
      default:
        return <MatriculaDashboard />;
    }
  };

  return (
    <>
      <Navbar setVistaActual={setVistaActual} vistaActual={vistaActual} />
      {renderizarVista()}
      <ToastContainer />
    </>
  );
}

export default App;