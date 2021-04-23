import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from '../common/Button';

class ProductList extends Component {

    render() {
        return(
            <>
                {[...this.props.products].map(([key, value]) => (
                    <div id={key} className='mb-5 product-section' key={key} >
                        <h3 className='mb-4'>{key}</h3>
                        {value.map((product) => (
                            <div key={product.id}>
                                <Row>
                                    <Col>
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
                                    </Col>
                                    {product.img &&
                                        <Col xs='auto'>
                                            <img src={product.img} className='list-img' loading='lazy' />
                                        </Col>
                                    }
                                </Row>
                                <Row className='mt-3 justify-content-between'>
                                    <Col xs='auto'>
                                        <p className='text-smaller main-text'>${product.price}</p>
                                    </Col>
                                    <Col xs='auto' className='ml-auto pr-0'>
                                        <Button label='Ver más' onClick={() => this.props.seeMoreProduct(product)} />
                                    </Col>
                                    <Col xs='auto'>
                                        {product.addedOfProduct > 0 ?
                                            <div className='flex'>
                                                <Button label='-' className='square-button' onClick={() => this.props.removeProduct(product.id, product.category, product.addedOfProduct - 1)} />
                                                <p className='mx-3'>{product.addedOfProduct}</p>
                                                <Button label='+' className='square-button' variant='primary' onClick={() => this.props.addProduct(product.id, product.category, product.addedOfProduct + 1, '')} />
                                            </div>
                                        :
                                            <Button label='¡Agregar!' variant='primary' onClick={() => this.props.addProduct(product.id, product.category, product.addedOfProduct + 1, '')} />
                                        }
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        ))}
                    </div>
                ))}
            </>
        );
    }
}

export default ProductList;