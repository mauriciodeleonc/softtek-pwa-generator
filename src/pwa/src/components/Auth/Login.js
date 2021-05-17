import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Input from '../common/Input';
import Button from '../common/Button';
import googleLogo from '../../assets/google-logo.png';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, loginWithGoogle, getNotificationsToken } = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/')
        } catch (err) {
            console.log(err)
            setError('Error iniciando sesion')
        }
        setLoading(false);
    }

    async function handleGoogleLogIn(e) {
        e.preventDefault();
        let token = '';
        try {
            setTimeout(() => {return setError('Favor de permitir notificaciones')}, 10000);
            token = await getNotificationsToken();
        } catch (err) {
            return setError('Favor de permitir notificaciones')
        }
        try {
            console.log(token)
            await loginWithGoogle(emailRef.current.value, passwordRef.current.value, token);
            history.push('/')
        } catch (err) {
            return setError('Error iniciando sesión')
        }        
    }

    return (
        <Container className='vertical-center full-height'>
            <Row className='justify-content-center'>
                <Col xs={12} md={5} className='text-center'>
                    <h1>{process.env.REACT_APP_APP_NAME ? process.env.REACT_APP_APP_NAME : 'Order To Go'}</h1>
                    <h2>Iniciar sesión</h2>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col xs={12} md={3}>
                    {error && <p>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <Input type='email' label='Correo' ref={emailRef} />
                        <Input type='password' label='Contraseña' ref={passwordRef} />
                        <Button type='submit' disabled={loading} label='Iniciar sesión' variant='primary'/>
                    </form>
                    <p className='text-smallest text-center my-3'>o</p>
                    <button onClick={handleGoogleLogIn} className='google-button' ><img src={googleLogo} loading='lazy' height='20px' /><p className='text-smaller'>Inicia sesión con google</p></button>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col xs={12} md={3} className='text-center'>
                    <hr />
                    <p className='text-smallest'>¿Aún no tienes cuenta? <Link to="/signup">Registrate</Link></p>
                </Col>
            </Row>
        </Container>
    )
}
