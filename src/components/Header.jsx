import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/blue_logo.png';

const Header = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm mb-4" collapseOnSelect>
            <Container>
                <Navbar.Brand href="#inicio" className="d-flex align-items-center">
                    <img src={logo} alt="Logo SENATI" width="40" height="40" className="me-2 rounded" />
                    <span className="mb-0 h1">Sistema de Matrícula - SENATI</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="#inicio">Inicio</Nav.Link>
                        <Nav.Link href="#cursos">Cursos</Nav.Link>
                        <Nav.Link href="#especializaciones">Especializaciones</Nav.Link>
                        <Nav.Link href="#contactos">Contactos</Nav.Link>
                        <Nav.Link href="#login">Login</Nav.Link>
                    </Nav>
                    <button className="btn btn-outline-light btn-sm">
                        Cerrar Sesión
                    </button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
