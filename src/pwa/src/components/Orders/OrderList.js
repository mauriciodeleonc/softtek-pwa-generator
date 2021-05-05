import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { BankCards, Car, Clock, Money, Restaurants } from '../../icons/icons';
import Button from '../common/Button';

const OrderList = (props) => {

    const renderStatusBlock = (order) => {
        let status = order.status;
        switch (status) {
            case 'Recibida':
                return(
                    <div className='received-pill'>
                        <p className='text-smallest m-0'>Recibida</p>
                    </div>
                );
            case 'En Proceso':
                return(
                    <div className='in-process-pill'>
                        <p className='text-smallest m-0'>En Proceso</p>
                    </div>
                );
            case 'Por Entregar':
                return(
                    <div className='to-be-delivered-pill'>
                        <p className='text-smallest m-0'>Por entregar</p>
                    </div>
                );
            case 'Entregada':
                return(
                    <div className='delivered-pill'>
                        <p className='text-smallest m-0'>Entregada</p>
                    </div>
                );
            case 'Cancelada':
                return(
                    <div className='cancelled-pill'>
                        <p className='text-smallest m-0'>Cancelada</p>
                    </div>
                );
            default:
                break;
        }
    }

    const renderCardButtons = (order) => {
        if(order.status === 'Recibida' || order.status === 'En Proceso' || order.status === 'Por Entregar') {
            return(
                <>
                    <Col>
                        <Button
                            label={order.seeProducts ? 'Esconder productos' : 'Ver productos'}
                            onClick={() => props.setSeeProduct(order.id)}
                            block />
                    </Col>
                    <Col>
                        <Button
                            variant='primary'
                            label='Cambiar cajón'
                            onClick={() => props.showParkingSpotModal(order)}
                            block
                        />
                    </Col>
                </>
            );
        } else {
            return(
                <Col>
                    <Button
                        label={order.seeProducts ? 'Esconder productos' : 'Ver productos'}
                        onClick={() => props.setSeeProduct(order.id)}
                        block />
                </Col>
            );
        }
    }

    return(
        <>
            {props.orders.map(order => (
                <Row key={order.id}>
                    <Col xs={12}>
                        <Card className='my-2 order-card'>
                            <Card.Body>
                                <Row className='justify-content-between'>
                                    <Col className='vertical-center'>
                                        <p className='text-smallest gray-text'>{order.date}</p>
                                    </Col>
                                    <Col xs='auto'>
                                        {renderStatusBlock(order)}
                                    </Col>
                                </Row>
                                <Row className='justify-content-between mt-2'>
                                    <Col xs='auto'>
                                        <p>{order.restaurantName}</p>
                                    </Col>
                                    <Col xs='auto'>
                                        <p className='non-bold'>${order.total}</p>
                                    </Col>
                                </Row>
                                {order.status !== 'Cancelada' &&
                                    <>
                                        <Row>
                                            <Col>
                                                <p className='text-smallest gray-text'><Clock className='icon' /> {order.status === 'Entregada' ? 'Entregada'  : `Entrega estimada: ${order.estimatedDeliveryTime > 40 ? 40 : order.estimatedDeliveryTime} min.`}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p className='text-smallest gray-text'><Car className='icon' /> {order.parkingSpot != 'En Camino' ? `Cajón ${order.parkingSpot}`  : `En Camino`}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {order.paymentType === 'Efectivo' && 
                                                <Col>
                                                    <p className='text-smallest gray-text'><Money className='icon' /> Efectivo</p>
                                                </Col>
                                            }
                                            
                                            {order.paymentType === 'Tarjeta' && 
                                                <Col>
                                                    <p className='text-smallest gray-text'><BankCards className='icon' /> Tarjeta</p>
                                                </Col>
                                            }
                                        </Row>
                                    </>
                                }
                                <Row>
                                    <Col>
                                        <p className='text-smallest gray-text'><Restaurants className='icon' /> {order.products.length} productos</p>
                                    </Col>
                                </Row>
                                {order.seeProducts &&
                                    <>
                                        <hr />
                                        {order.products.map(product => (
                                            <Row key={product.id}>
                                                <Col>
                                                    <p className='text-smallest gray-text'>{product.addedOfProduct} - {product.name}</p>
                                                </Col>
                                            </Row>
                                        ))}
                                    </>
                                }
                                <Row className='mt-2'>
                                    {renderCardButtons(order)}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ))}
        </>
    );
}

export default OrderList;