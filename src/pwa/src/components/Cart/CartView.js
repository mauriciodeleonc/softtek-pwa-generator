import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import Button from '../common/Button';
import Input from '../common/Input';
import { ArrowLeft, Clock, AddToBag } from '../../icons/icons';
import { useHistory } from 'react-router-dom';
import { use100vh } from 'react-div-100vh';
const { db } = require('../../firebase');

const DeleteProductModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Body>
                <h4>Eliminar producto</h4>
                <p className='non-bold'>
                    ¿Seguro que deseas eliminar el producto <b>{props.product.name}</b> de <b>{props.restaurantName}</b>?
          </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} label='Cancelar' />
                <Button variant='primary' onClick={() => props.removeProduct(props.product.id, props.restaurantName, -1)} label='Si, eliminiar' />
            </Modal.Footer>
        </Modal>
    );
}

const CartView = (props) => {
    const height = use100vh();
    const history = useHistory();
    const [cashAmount, setCashAmount] = useState(null);
    const [parkingSpot, setParkingSpot] = useState(null);
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [location, setLocation] = useState(null);
    const [payment, setPayment] = useState(null);
    const [productsLength, setProductsLength] = useState(0);
    const [products, setProducts] = useState(new Map());
    const [deleteProductModalShow, setDeleteProductModal] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [productToDelete, setProductToDelete] = useState({});
    const [cartId, setCartId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { getCart, incrementProduct, decrementProduct, createOrder } = useCart();
    const [cart, setCart] = useState();
    const [disabledButtonOrder, setDisabledButtonOrder] = useState(true);


    useEffect(async () => {
        setIsLoading(true);
        const cart = await getCart()
        setCart(cart)
        setCartId(cart.id);
        cart.restaurantes.forEach(restaurant => {
            const productsArray = [];

            restaurant.total = 0;
            let restaurantTotal = restaurant.total;

            restaurant.products.forEach(product => {
                productsArray.push({
                    id: product.id,
                    name: product.nombre,
                    addedOfProduct: product.cantidad,
                    total: product.costoTotal,
                    unitaryPrice: product.costoUnitario,
                    tiempoEntregaUnitario: product.tiempoEntregaUnitario
                })
                restaurantTotal += product.costoTotal;
            })

            products.set(restaurant.restaurantName, {
                total: restaurantTotal,
                products: productsArray
            });
        })
        setProducts(new Map(products))
        setProductsLength(cart.noProducts);
        setIsLoading(false);
    }, []);

    useEffect(() => {        
        if(!location || !payment || !name || !phone || (location === 'En cajón'  && !parkingSpot) || (payment === 'Efectivo' && !cashAmount)) {
            setDisabledButtonOrder(true);
        } else {
            setDisabledButtonOrder(false);
        }
    }, [name, phone, location, parkingSpot, payment, cashAmount]);

    const addProduct = async (productId, restaurantName, addedOfProduct) => {
        let tempProducts = new Map(products);
        let productsInRestaurant = tempProducts.get(restaurantName);
        productsInRestaurant.total = 0;

        for (let i = 0; i < productsInRestaurant.products.length; i++) {
            if (productsInRestaurant.products[i].id === productId) {
                productsInRestaurant.products[i].addedOfProduct = addedOfProduct;
                productsInRestaurant.products[i].total = productsInRestaurant.products[i].unitaryPrice * addedOfProduct;
                incrementProduct(productId, restaurantName, addedOfProduct, productsInRestaurant.products[i].unitaryPrice, productsInRestaurant.products[i].tiempoEntregaUnitario)
            }
            productsInRestaurant.total += Number(productsInRestaurant.products[i].total);
        }
        setProducts(tempProducts.set(restaurantName, productsInRestaurant));
    }

    const removeProduct = async (productId, restaurantName, addedOfProduct) => {

        let tempProducts = new Map(products);
        let productsInRestaurant = tempProducts.get(restaurantName);
        productsInRestaurant.total = 0;

        for (let i = 0; i < productsInRestaurant.products.length; i++) {
            if (productsInRestaurant.products[i].id === productId) {
                if (addedOfProduct === -1) {
                    //productsInRestaurant.products[i].addedOfProduct = 0;
                    decrementProduct(productId, restaurantName, addedOfProduct, productsInRestaurant.products[i].unitaryPrice, productsInRestaurant.products[i].tiempoEntregaUnitario)
                    productsInRestaurant.products.splice(i, 1);
                    setDeleteProductModal(false);
                } else if (productsInRestaurant.products[i].addedOfProduct === 1) {
                    setDeleteProductModal(true);
                    setProductToDelete(productsInRestaurant.products[i]);
                    setRestaurantToDelete(restaurantName);
                } else {
                    productsInRestaurant.products[i].addedOfProduct = addedOfProduct;
                    productsInRestaurant.products[i].total = productsInRestaurant.products[i].unitaryPrice * addedOfProduct;
                    decrementProduct(productId, restaurantName, addedOfProduct, productsInRestaurant.products[i].unitaryPrice, productsInRestaurant.products[i].tiempoEntregaUnitario)
                }
            }
        }


        for(let i = 0; i < productsInRestaurant.products.length; i++) {
            if (productsInRestaurant.products.length > 0) {
                productsInRestaurant.total += Number(productsInRestaurant.products[i].total);
            }
        }

        if (productsInRestaurant.products.length > 0) {
            setProducts(tempProducts.set(restaurantName, productsInRestaurant));
        } else {
            tempProducts.delete(restaurantName);
            setProducts(tempProducts);
        }
        setProductsLength(cart.noProducts);

    }

    const clickCreateOrder = async () => {
        if(payment === 'Tarjeta') {
            await createOrder(location, parkingSpot, phone, name, payment, cart.total);
        } else {
            await createOrder(location, parkingSpot, phone, name, payment, cashAmount);
        }
        history.push('/ordenes');
    }

    return (
        <>
            <Container className='mb-5 mt-3'>
                <Row>
                    <Col xs='auto' className='vertical-center' onClick={() => history.goBack()}>
                        <ArrowLeft className='header-icon mb-0' />
                    </Col>
                    <Col className='vertical-center'>
                        <h1 className='mb-0'>Carrito</h1>
                    </Col>
                </Row>

                {isLoading ?
                    <div className='text-center my-auto'>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    (productsLength > 0 ?
                        <>
                            <Row>
                                <Col xs={12}>
                                    <h2>Productos</h2>
                                </Col>
                            </Row>
                            {[...products].map(([key, value]) => (
                                <div key={key}>
                                    <Row className='justify-content-between'>
                                        <Col xs={8}>
                                            <h5 className='my-2'>{key}</h5>
                                        </Col>
                                        <Col xs={4} className='text-right'>
                                            <h5 className='my-2 non-bold'>${value.total}</h5>
                                        </Col>
                                    </Row>
                                    <>
                                        {value.products.map((product) => (
                                            <Row className='my-2' key={product.id}>
                                                <Col>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <p className='non-bold product-name'>{product.name}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <p className='non-bold gray-text'>${product.total} {product.addedOfProduct > 1 && `($${product.unitaryPrice} c/u)`}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs='auto'>
                                                    <div className='flex'>
                                                        <Button label='-' className='square-button' onClick={() => removeProduct(product.id, key, product.addedOfProduct - 1)} />
                                                        <p className='mx-3'>{product.addedOfProduct}</p>
                                                        <Button label='+' className='square-button' variant='primary' onClick={() => addProduct(product.id, key, product.addedOfProduct + 1)} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        ))}
                                    </>
                                    <hr />
                                </div>
                            ))}
                            <Row>
                                <Col xs={12}>
                                    <h2>Detalles de la orden</h2>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={12}>
                                    <h6 className='text-smaller main-text bold'>Datos de contacto</h6>
                                    <Input label='Nombre' className='my-3' handleValue={(val) => setName(val)} />
                                    <Input label='Teléfono' size='sm' type='tel' pattern='[0-9]{10}' handleValue={(val) => setPhone(val)} />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={12}>
                                    <h6 className='text-smaller main-text bold'>Ubicación</h6>
                                    <label className='radio-wrapper'>
                                        Voy En Camino
                                <input type='radio' checked={location === 'En Camino'} name='camino' value='En Camino' onChange={() => setLocation('En Camino')} />
                                        <span className='checkmark'></span>
                                    </label>
                                    <label className='radio-wrapper'>
                                        Estoy en un cajón de estacionamiento
                                    <input type='radio' checked={location === 'En cajón'} name='cajon' value='En cajón' onChange={() => setLocation('En cajón')} />
                                        <span className='checkmark'></span>
                                    </label>
                                    {location === 'En cajón' &&
                                        <Input label='Cajón' size='xs' className='mt-4 mb-3' handleValue={(val) => setParkingSpot(val)} />
                                    }
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={12}>
                                    <h6 className='text-smaller main-text bold'>Tipo de pago</h6>
                                    <label className='radio-wrapper'>
                                        Efectivo
                                        <input type='radio' checked={payment === 'Efectivo'} name='efectivo' value='Efectivo' onChange={() => setPayment('Efectivo')} />
                                        <span className='checkmark'></span>
                                    </label>
                                    {payment === 'Efectivo' && 
                                        <>
                                            <Input label='Cantidad' type='number' size='xs' className='mt-4 mb-1' handleValue={(val) => setCashAmount(val)} />
                                            <p className='text-smallest error mb-4'>*Por favor indica la cantidad de efectivo con la que vas a pagar, para que se tenga el cambio exacto.</p>
                                        </>
                                    }
                                    <label className='radio-wrapper'>
                                        Tarjeta
                                        <input type='radio' checked={payment === 'Tarjeta'} name='tarjeta' value='Tarjeta' onChange={() => setPayment('Tarjeta')} />
                                        <span className='checkmark'></span>
                                    </label>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={12}>
                                    <p className='text-smaller text-center'><Clock className='icon' /> Tiempo de entrega estimado: {cart.waitingTime > 40 ? 40 : cart.waitingTime} min.</p>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={12}>
                                    <Button
                                        variant='primary'
                                        label={`Confirmar orden ($${cart.total.toFixed(2)})`}
                                        disabled={disabledButtonOrder}
                                        onClick={clickCreateOrder}
                                        block
                                    />
                                </Col>
                            </Row>
                        </>
                        :
                        <div style={{ height: `calc(${height}px - 37px - 4rem` }} className='vertical-center text-center'>
                            <Row className='justify-content-center'>
                                <Col xs={6}>
                                    <AddToBag className='empty-space-icon' />
                                    <p className='non-bold mb-4 mt-2'>¡Oh no! Parece que aun no tienes productos.</p>
                                    <Button variant='primary' label='¡Ver restaurantes!' onClick={() => history.push('/')} />
                                </Col>
                            </Row>
                        </div>
                    )
                }
            </Container>
            <DeleteProductModal
                show={deleteProductModalShow}
                onHide={() => setDeleteProductModal(false)}
                restaurantName={restaurantToDelete}
                product={productToDelete}
                removeProduct={removeProduct}
            />
        </>
    );
}


export default CartView;