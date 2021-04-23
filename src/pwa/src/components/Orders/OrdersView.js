import React, { Component, useRef, useState } from 'react';
import { Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShoppingBag } from '../../icons/icons';
import OrderList from './OrderList';
import Menu from '../common/Menu';
import Button from '../common/Button';
import Input from '../common/Input';
import { AuthContext } from '../../contexts/AuthContext';
import Moment from 'moment';
const { db } = require('../../firebase');

const ChangeParkingSpotModal = (props) => {
    const [parkingSpot, setParkingSpot] = useState('');
    const [allOrders, setAllOrders] = useState(false);
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4>Cambiar cajón de estacionamiento</h4>
                <Input label='Cajón' size='sm' className='mt-4 mb-3' handleValue={(value) => setParkingSpot(value)} />
                <label className='checkbox-wrapper'>
                    Aplicar para todas las órdenes en progreso
                    <input type='checkbox' checked={allOrders} name='camino' value='En Camino' onChange={() => setAllOrders(!allOrders)} />
                    <span className='checkmark'></span>
                </label>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} label='Cancelar' />
                <Button variant='primary' onClick={() => props.changeParkingSpot(parkingSpot, props.order, allOrders)} label='Cambiar' disabled={parkingSpot?.length === 0} />
            </Modal.Footer>
        </Modal>
    );
}

class OrdersView extends Component {
    static contextType = AuthContext
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            changeParkingSpotModalShow: false,
            order: null,
            addedItems: 0,
            isLoading: true
        }

        this.setSeeProduct = this.setSeeProduct.bind(this);
        this.showParkingSpotModal = this.showParkingSpotModal.bind(this);
        this.changeParkingSpot = this.changeParkingSpot.bind(this);
    }

    componentDidMount() {
        if (!this.context.currentUser) return;
        const enumStatus = {
            "1": "Recibida",
            "2": "En Proceso",
            "3": "Por Entregar",
            "4": "Entregada",
            "5": "Cancelada"
        };
        let ordersData = [];
        //get user's orders
        db.collection('orders').where('userId', '==', this.context.currentUser.uid).get().then(snapshot => {
            snapshot.forEach(orderFb => {
                const order = orderFb.data();
                ordersData.push({
                    id: order.id,
                    restaurantName: order.storeName,
                    status: enumStatus[order.statusId],
                    date: Moment(order.creationDate.toDate()).format('DD/MM/YYYY'),
                    fullDate: order.creationDate.toDate(),
                    total: order.total,
                    estimatedDeliveryTime: order.waitingTime,
                    parkingSpot: order.parkingPlace,
                    isInParkingSpot: true,
                    paymentType: order.paymentType,
                    seeProducts: false,
                    products: order.products.map(product => {
                        return {
                            id: product.id,
                            addedOfProduct: product.cantidad,
                            name: product.nombre
                        }
                    })
                });
            })
            ordersData = ordersData.sort((a, b) => Date.parse(b.fullDate) - Date.parse(a.fullDate))

            //get number of items in cart for icon
            let cartData;
            db.collection('carts').where('userId', '==', this.context.currentUser.uid).get().then(snapshot => {
                snapshot.forEach(cart => {
                    cartData = cart.data();
                    cartData.cartId = cart.id
                })
                this.setState({ orders: ordersData, addedItems: cartData.noProducts, isLoading: false });
            })
        })
    }

    setSeeProduct(idOrder) {
        let orders = this.state.orders;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === idOrder) {
                orders[i].seeProducts = !orders[i].seeProducts;
            }
        }

        this.setState({ orders });
    }

    showParkingSpotModal(order) {
        this.setState({ changeParkingSpotModalShow: true, order });
    }

    async changeParkingSpot(parkingSpot, order, allOrders) {
        let orders = this.state.orders;

        if (allOrders) {
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].status === 'Recibida' && orders[i].date === order.date) {
                    orders[i].isInParkingSpot = true;
                    orders[i].parkingSpot = parkingSpot;
                }
            }
            const snapshot = await db.collection('orders').where('userId', '==', this.context.currentUser.uid).get();
            snapshot.forEach(async orderFb => {
                const orderData = orderFb.data();
                if (orderData.statusId == 1) {
                    await db.collection('orders').doc(orderData.id).update({
                        "parkingPlace": parkingSpot
                    });
                }
            })
        } else {
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].id === order.id) {
                    orders[i].isInParkingSpot = true;
                    orders[i].parkingSpot = parkingSpot;
                }
            }
            await db.collection('orders').doc(order.id).update({
                "parkingPlace": parkingSpot
            });
        }
        this.setState({ orders, changeParkingSpotModalShow: false });
    }

    render() {
        return (
            <>
                <Menu {...this.props} />
                <Container className='mb-5 mt-3'>
                    <Row className='justify-content-between'>
                        <Col xs='auto' className='vertical-center'>
                            <h1 className='mb-0'>Órdenes</h1>
                        </Col>
                        <Col xs='auto' className='vertical-center'>
                            <Link to='/carrito' className='shopping-link'>
                                <ShoppingBag className='header-icon mb-0' />
                                {this.state.addedItems > 0 &&
                                    <div className='added-items'><p className='text-smallest'>{this.state.addedItems}</p></div>
                                }
                            </Link>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={12}>
                            {this.state.isLoading ?
                                <div className='text-center my-auto'>
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                :
                                <OrderList
                                    orders={this.state.orders}
                                    setSeeProduct={this.setSeeProduct}
                                    showParkingSpotModal={this.showParkingSpotModal}
                                />
                            }
                        </Col>
                    </Row>
                </Container>
                <ChangeParkingSpotModal
                    show={this.state.changeParkingSpotModalShow}
                    onHide={() => this.setState({ changeParkingSpotModalShow: false })}
                    order={this.state.order}
                    changeParkingSpot={this.changeParkingSpot}
                />
            </>
        );
    }
}

export default OrdersView;
