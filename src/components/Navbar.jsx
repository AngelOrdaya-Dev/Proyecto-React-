import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="#inicio">Inicio</Nav.Link>
                        <Nav.Link href="#cursos">Cursos</Nav.Link>
                        <Nav.Link href="#especializaciones">Especializaciones</Nav.Link>
                        <Nav.Link href="#contactos">Contactos</Nav.Link>
                        <Nav.Link href="#login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
