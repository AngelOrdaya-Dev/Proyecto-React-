import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import { API_BASE } from '../config';

const NavigationBar = ({ setVistaActual, vistaActual }) => {
    const [apiStatus, setApiStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

    useEffect(() => {
        const checkApi = async () => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3000);
                await fetch(`${API_BASE}/alumnos`, { signal: controller.signal });
                clearTimeout(timeout);
                setApiStatus('online');
            } catch {
                setApiStatus('offline');
            }
        };

        checkApi(); // check immediately on mount
        const interval = setInterval(checkApi, 15000); // re-check every 15s
        return () => clearInterval(interval);
    }, []);

    const statusLabel = {
        online: 'NETWORK: SECURE',
        offline: 'NETWORK: DISCONNECTED',
        checking: 'NETWORK: SCANNING'
    };

    return (
        <Navbar expand="lg" collapseOnSelect className="navbar-premium sticky-top">
            <Container>
                <Navbar.Brand href="#inicio" onClick={() => setVistaActual('matricula')} className="d-flex align-items-center gap-2">
                    <div className="avatar-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', fontSize: '1.2rem', background: 'var(--primary-gradient)'}}>
                        <i className="fas fa-bolt text-white"></i>
                    </div>
                    <span>NEXUS EDU</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto gap-2">
                        <Nav.Link
                            href="#matricula"
                            active={vistaActual === 'matricula'}
                            onClick={() => setVistaActual('matricula')}
                            className={vistaActual === 'matricula' ? 'active' : ''}
                        >
                            <i className="fas fa-id-card me-2"></i>Dashboard VIP
                        </Nav.Link>
                        <Nav.Link
                            href="#alumnos"
                            active={vistaActual === 'alumnos'}
                            onClick={() => setVistaActual('alumnos')}
                        >
                            <i className="fas fa-users me-2"></i>Aspirantes
                        </Nav.Link>
                        <Nav.Link
                            href="#profesores"
                            active={vistaActual === 'profesores'}
                            onClick={() => setVistaActual('profesores')}
                        >
                            <i className="fas fa-user-tie me-2"></i>Mentores
                        </Nav.Link>
                        <Nav.Link
                            href="#cursos"
                            active={vistaActual === 'cursos'}
                            onClick={() => setVistaActual('cursos')}
                        >
                            <i className="fas fa-laptop-code me-2"></i>Programas
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex align-items-center gap-3">
                        <span className={`api-status-badge ${apiStatus}`} title={apiStatus === 'offline' ? 'Ejecuta: php artisan serve' : ''}>
                            <span className="api-dot"></span>
                            <span style={{fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: '0.7rem', fontWeight: 'bold'}}>{statusLabel[apiStatus]}</span>
                        </span>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
