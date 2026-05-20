import React from 'react';

// src/components/Contador.jsx
const Contador = ({ 
    totalAlumnos = 0, 
    totalMatriculados = 0, 
    totalPendientes = 0 
}) => {
    // Calculamos la tasa de matrícula activa como un indicador premium del Dashboard
    const tasaActividad = totalAlumnos > 0 
        ? Math.round((totalMatriculados / totalAlumnos) * 100) 
        : 0;

    return (
        <div className="dashboard-kpi-container mb-4">
            {/* KPI: Total de Alumnos */}
            <div className="kpi-card kpi-card-total" title="Total de alumnos en la base de datos MySQL">
                <div className="kpi-content">
                    <span className="kpi-title">Total Alumnos</span>
                    <span className="kpi-value">{totalAlumnos}</span>
                </div>
                <div className="kpi-icon-wrapper">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                    </svg>
                </div>
            </div>

            {/* KPI: Alumnos Matriculados */}
            <div className="kpi-card kpi-card-matriculados" title="Alumnos en estado matriculado">
                <div className="kpi-content">
                    <span className="kpi-title">Matriculados</span>
                    <span className="kpi-value">{totalMatriculados}</span>
                </div>
                <div className="kpi-icon-wrapper">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>
            </div>

            {/* KPI: Alumnos Inactivos */}
            <div className="kpi-card kpi-card-pendientes" title="Alumnos en estado inactivo/pendiente">
                <div className="kpi-content">
                    <span className="kpi-title">Inactivos</span>
                    <span className="kpi-value">{totalPendientes}</span>
                </div>
                <div className="kpi-icon-wrapper">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
            </div>

            {/* KPI: Tasa de Matrícula (Premium Metric) */}
            <div className="kpi-card kpi-card-seleccionados" title="Porcentaje de alumnos activos del total">
                <div className="kpi-content">
                    <span className="kpi-title">Tasa de Actividad</span>
                    <span className="kpi-value">{tasaActividad}%</span>
                </div>
                <div className="kpi-icon-wrapper">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Contador;