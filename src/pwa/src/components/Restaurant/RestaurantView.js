import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from './ProductList';
import SeeMore from './SeeMore';
import Searchbar from '../common/Searchbar';
import Button from '../common/Button';
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, ShoppingBag, Clock, Money, BankCards } from '../../icons/icons';
import { Modal, Spinner } from 'react-bootstrap';
import { CartContext } from '../../contexts/CartContext';

const { db } = require('../../firebase');

function DeleteProductModal(props) {
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
                <Button variant='primary' onClick={() => props.removeProduct(props.product.id, props.product.category, -1)} label='Si, eliminiar' />
            </Modal.Footer>
        </Modal>
    );
}

class RestaurantView extends Component {
    static contextType = CartContext
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filteredProducts: [],
            searchInput: '',
            menuSections: [],
            selectedSection: '',
            addedItems: 0,
            restaurant: [],
            productToSee: {},
            seeMore: false,
            productToDelete: {},
            isLoading: true
        }

        this.addProductFront = this.addProductFront.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.selectSection = this.selectSection.bind(this);
        this.seeMoreProduct = this.seeMoreProduct.bind(this);
    }

    componentDidMount() {
        if (!this.props.routerProps.history.location.state) return this.props.routerProps.history.push('/');
        let restaurant = this.props.routerProps.history.location.state.detail;
        let cartProductsContext = this.context.cart.restaurantes.find(restaurantContext => restaurantContext.restaurantId === restaurant.id);
        if (cartProductsContext) cartProductsContext = cartProductsContext.products
        const locationsRef = db.collection('locations');
        locationsRef.limit(1).get().then(snapshot => {
            snapshot.forEach(locationsDoc => {
                const restaurantsRef = locationsRef.doc(locationsDoc.id).collection("restaurants")
                restaurantsRef.where('id', '==', restaurant.id).get().then(snapshot => {
                    snapshot.forEach(restaurantsDoc => {
                        const productsRef = restaurantsRef.doc(restaurantsDoc.id).collection("products");
                        productsRef.get().then(snapshot => {
                            let products = new Map();
                            const menuSections = [];
                            let refArray = [];
                            snapshot.forEach((productsDoc, index) => {
                                const data = productsDoc.data();
                                if (data.isAvailable) {
                                    let categoryProducts = [];
                                    let category = data.category;
                                    const productInCartContext = cartProductsContext ? cartProductsContext.find(productContext => productContext.id === data.id) : undefined
                                    let product = {
                                        id: data.id,
                                        name: data.name,
                                        img: data.img ? data.img : undefined,
                                        description: data.description,
                                        price: data.price,
                                        addedOfProduct: productInCartContext ? productInCartContext.cantidad : 0,
                                        category: data.category,
                                        estimatedTime: data.estimated_time,
                                    };

                                    if (products.has(category)) {
                                        categoryProducts = products.get(category);
                                        categoryProducts.push(product);
                                        products.set(category, categoryProducts);
                                    } else {
                                        categoryProducts.push(product);
                                        products.set(category, categoryProducts);
                                    }

                                    if (menuSections.indexOf(data.category) === -1) menuSections.push(data.category);
                                }
                            })
                            this.setState({ restaurant, products, filteredProducts: products, menuSections, selectedSection: menuSections[0], isLoading: false, addedItems: this.context.cart.noProducts })
                        })
                    })
                }).catch(err => {
                    console.log("Error getting sub-collection documents", err);
                })
            })
        }).catch(err => {
            console.log(err)
        });
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    trackScrolling = () => {
        [...this.state.products].map(([key, value]) => {
            let element = document.getElementById(key);
            if (element) {
                let position = element.getBoundingClientRect().top;
                if (position <= 165) {
                    this.selectSection(key);
                }
            }
        });
    }

    selectSection(selectedSection) {
        this.setState({ selectedSection });
    }

    handleSearch(e) {
        let searchInput = e.target.value;
        let stateProducts = [...this.state.products];
        stateProducts = Array.from(stateProducts, ([category, product]) => (product));
        let products = []
        for (let i = 0; i < stateProducts.length; i++) {
            for (let j = 0; j < stateProducts[i].length; j++) {
                products.push(stateProducts[i][j]);
            }
        }

        products = products.filter(product => {
            return product.name.toLowerCase().includes(searchInput.toLowerCase())
        })

        let filteredProducts = new Map();

        for (let i in products) {
            let product = products[i];
            let categoryProducts = [];
            if (filteredProducts.has(product.category)) {
                categoryProducts = filteredProducts.get(product.category);
                categoryProducts.push(product);
                filteredProducts.set(product.category, categoryProducts);
            } else {
                categoryProducts.push(product);
                filteredProducts.set(product.category, categoryProducts);
            }
        }

        this.setState({ searchInput, filteredProducts });
    }

    addProductFront(productId, category, addedOfProduct, instructions) {
        let productsInCategory = this.state.products;

        let products = productsInCategory.get(category);

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                products[i].addedOfProduct = addedOfProduct;
                productsInCategory.set(category, products);
                this.context.addProduct(products[i], this.state.restaurant, addedOfProduct, instructions)
            }
        }

        this.setState({  products: productsInCategory, seeMore: false, addedItems: this.context.cart.noProducts });
    }

    removeProduct(productId, category, addedOfProduct) {

        let productsInCategory = this.state.products;

        let products = productsInCategory.get(category);

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                if (addedOfProduct === -1) {
                    this.context.decrementProduct(productId, this.state.restaurant.name, addedOfProduct, products[i].price)
                    products[i].addedOfProduct = 0;
                    productsInCategory.set(category, products);
                    this.setState({ deleteProductModalShow: false });
                } else if (products[i].addedOfProduct === 1) {
                    this.setState({ deleteProductModalShow: true, productToDelete: products[i] });
                } else {
                    this.context.decrementProduct(productId, this.state.restaurant.name, addedOfProduct, products[i].price, products[i].estimatedTime)
                    products[i].addedOfProduct = addedOfProduct;
                    productsInCategory.set(category, products);
                }
            }
        }

        this.setState({ products: productsInCategory, addedItems: this.context.getTotalItems() });
    }

    seeMoreProduct(productToSee) {
        this.setState({ productToSee, seeMore: true })
    }

    render() {
        let restaurant = this.state.restaurant;
        return (
            <>
                <Container className='pb-3'>
                    <Row className='py-4 header'>
                        <Col xs='auto' className='vertical-center'>
                            <Link to='/'>
                                <ArrowLeft className='header-icon mb-0' />
                            </Link>
                        </Col>
                        <Col>
                            <Searchbar placeholder='Busca un producto' onChange={this.handleSearch.bind(this)} value={this.state.searchInput} />
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
                    {this.state.isLoading ?
                        <div className='text-center my-auto'>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <>
                            <Row className='mb-2'>
                                <Col xs='auto'>
                                    <img src={restaurant.img} className='restaurant-img' loading='lazy' />
                                </Col>
                                <Col xs md={4}>
                                    <Row>
                                        <Col xs={12}>
                                            <h4 className='m-0'>{restaurant.name}</h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <p className='text-smaller'><Clock className='icon' /> {restaurant.openingTime} - {restaurant.closingTime}</p>
                                        </Col>
                                    </Row>
                                    {restaurant.phone &&
                                        <Row className='mb-2'>
                                            <Col xs={12}>
                                                <a className='text-smaller restaurant-phone' href={`tel:${restaurant.phone}`}><Phone className='icon' /> {restaurant.phone}</a>
                                            </Col>
                                        </Row>
                                    }
                                    <Row className='no-gutters mt-auto'>
                                        {restaurant.cash &&
                                            <Col xs='auto' className='pr-1'>
                                                <div className='cash-pill'>
                                                    <p className='text-smallest m-0'><Money className='icon' /> Efectivo</p>
                                                </div>
                                            </Col>
                                        }
                                        {restaurant.card &&
                                            <Col xs='auto'>
                                                <div className='card-pill'>
                                                    <p className='text-smallest m-0'><BankCards className='icon' /> Tarjeta</p>
                                                </div>
                                            </Col>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row className='restaurant-sections pb-4 pt-2'>
                                <Col xs={12}>
                                    <ul className='menu-sections-list'>
                                        {this.state.menuSections.map((section, i) => (
                                            <li
                                                key={i}
                                                className={`menu-sections-item ${this.state.selectedSection === section && 'active'}`}
                                                onClick={() => this.setState({ selectedSection: section })}
                                            >
                                                <a href={`#${section}`}>{section}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <ProductList
                                        products={this.state.filteredProducts}
                                        addProduct={this.addProductFront}
                                        removeProduct={this.removeProduct}
                                        selectSection={this.selectSection}
                                        refArray={this.state.refArray}
                                        seeMoreProduct={this.seeMoreProduct}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                    <SeeMore
                        show={this.state.seeMore}
                        product={this.state.productToSee}
                        addProductFront={this.addProductFront}
                        onClose={() => this.setState({ seeMore: false })}
                    />
                </Container>
                <DeleteProductModal
                    show={this.state.deleteProductModalShow}
                    onHide={() => this.setState({ deleteProductModalShow: false })}
                    restaurantName={restaurant.name}
                    product={this.state.productToDelete}
                    removeProduct={this.removeProduct}
                />
            </>
        );
    }
}

export default RestaurantView;
