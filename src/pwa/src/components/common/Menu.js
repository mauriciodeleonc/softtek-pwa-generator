import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { Restaurants, Orders, Question, Logout } from '../../icons/icons';
import { useAuth } from '../../contexts/AuthContext'
import Button from './Button';

const LogoutConfirmationModal = (props) => {
    return(
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4>Cerrar sesión</h4>
                <p className='non-bold'>
                    ¿Seguro que deseas cerrar sesión?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} label='Cancelar' />
                <Button variant='primary' onClick={props.logout} label='Cerrar sesión' />
            </Modal.Footer>
        </Modal>
    );
}

const Menu = (props) => {
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return(
        <Navbar>
            <Container className='px-2 justify-content-center justify-content-md-start'>
                <Nav>
                    <Nav.Item>
                        <Nav.Link 
                            eventKey="restaurantes"
                            as={Link}
                            to='/'
                            active={props.location?.pathname === '/'}
                        >
                            <Restaurants className='icon' /> Restaurantes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="ordenes"
                            as={Link}
                            to='/ordenes'
                            active={(props.location?.pathname === '/ordenes')}    
                        >
                            <Orders className='icon' /> Órdenes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="ayuda"
                            as={Link}
                            to='/ayuda'
                            active={(props.location?.pathname === '/ayuda')}
                        >
                            <Question className='icon' /> Ayuda
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='ml-auto'>
                        <Nav.Link
                            eventKey="sesion"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            <Logout className='icon ml-2' /> Salir
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            <LogoutConfirmationModal
                show={showLogoutModal}
                onHide={() => setShowLogoutModal(false)}
                logout={logout}
            />
        </Navbar>
    );
}

export default Menu;