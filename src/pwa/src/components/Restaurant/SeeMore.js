import React, { useState, useEffect, useRef } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from '../../icons/icons';
import { useCart } from '../../contexts/CartContext';

const SeeMore = ({show, product, onClose, addProductFront}) => {
    const [addedOfProduct, setAddedOfProduct] = useState(0);
    const [instructions, setInstructions] = useState('');
    const { cart } = useCart();

    useEffect(() => {
        for(let rest of cart.restaurantes) {
            for(let prod of rest.products) {
                if(prod.id === product.id) {
                    setInstructions(prod.comentario)
                    return
                } 
            }
        }
        setInstructions('');
    }, [product]);

    useEffect(() => {
        setAddedOfProduct(product.addedOfProduct);
    }, [product.addedOfProduct]);

    return(
        <div className={`see-more-card ${show ? 'animating-in' : 'animating-out'}`}>
            <Container>
                <Row className='my-4'>
                    <Col xs='auto' className='vertical-center' onClick={onClose}>
                        <ArrowLeft className='header-icon mb-0' />
                    </Col>
                </Row>
            </Container>
            {product.img &&
                <Row className='see-more-product-img'>
                    <Col xs={12}>
                        <img src={product.img} loading='lazy' />
                    </Col>
                </Row>
            }
            <Container className='see-more-product-content'>
                <Row>
                    <Col xs={12}>
                        <p>{product.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <p className='text-smaller'>{product.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <p className='text-smaller main-text'>${product.price}</p>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col xs={12}>
                        <Input type='text' label='Instrucciones de preparación' handleValue={(val) => setInstructions(val)} value={instructions}/>
                        <p className='text-smallest error'>
                            *Agregar instrucciones de preparación podría generar algún costo
                            extra en el producto, recomendamos contactar al comercio para confirmar
                            el costo total.
                        </p>
                    </Col>
                </Row>
                <Row className='justify-content-between no-gutters'>
                    <Col xs='auto'>
                        <div className='flex'>
                            <Button label='-' onClick={() => setAddedOfProduct(addedOfProduct - 1)} disabled={addedOfProduct === 0}/>
                            <p className='mx-3'>{addedOfProduct}</p>
                            <Button label='+' onClick={() => setAddedOfProduct(addedOfProduct + 1)} />
                        </div>
                    </Col>
                    <Col xs='auto'>
                        <Button
                            label={`¡Agregar! ($${product.price * addedOfProduct})`}
                            variant='primary'
                            onClick={() => addProductFront(product.id, product.category, addedOfProduct, instructions)} 
                            disabled={addedOfProduct === 0} 
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SeeMore;