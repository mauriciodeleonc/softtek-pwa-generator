import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RestaurantList from './RestaurantList';
import Searchbar from '../common/Searchbar';
import Menu from '../common/Menu';
import { ShoppingBag } from '../../icons/icons';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
const { db } = require('../../firebase');
//import { useAuth } from '../contexts/AuthContext'

class RestaurantsView extends Component {
    static contextType = CartContext
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            filteredRestaurants: [],
            searchInput: '',
            addedItems: 0
        }
    }
    componentDidMount() {
        const collectionRef = db.collection('locations');
        collectionRef.limit(1).get().then(snapshot => {
            snapshot.forEach(doc => {
                collectionRef.doc(doc.id).collection("restaurants").get().then(snapshot => {
                    const restaurants = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        restaurants.push({
                            name: data.name,
                            img: data.imageURL,
                            openingTime: data.hours.substring(2, 8),
                            closingTime: data.hours.substring(10, 16),
                            cash: data.paymentTypes.includes("Efectivo") ? true : false,
                            card: data.paymentTypes.includes("Tarjeta") ? true : false,
                            paymentTypes: data.paymentTypes,
                            phone: data.phone,
                            id: data.id
                        })
                    })
                    this.context.getTotalItems().then(num => {
                        this.setState({ restaurants, filteredRestaurants: restaurants, addedItems: num })
                    })
                }).catch(err => {
                    console.log("Error getting sub-collection documents", err);
                })
            })
        }).catch(err => {
            console.log(err)
        });
    }

    handleSearch(e) {
        let searchInput = e.target.value;
        let restaurants = [...this.state.restaurants];
        restaurants = restaurants.filter(restaurant => {
            return restaurant.name.toLowerCase().includes(searchInput.toLowerCase())
        })
        this.setState({ searchInput, filteredRestaurants: restaurants });
    }

    render() {
        return (
            <>
                <Menu {...this.props} />
                <Container className='mb-5 mt-3'>
                    <Row className='justify-content-between'>
                        <Col xs='auto' className='vertical-center'>
                            <h1 className='mb-0'>Restaurantes</h1>
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
                    <Row className='mb-4'>
                        <Col xs={12} md={4}>
                            <Searchbar placeholder='Busca un restaurante' onChange={this.handleSearch.bind(this)} value={this.state.searchInput} />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={12}>
                            <RestaurantList restaurants={this.state.filteredRestaurants} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default RestaurantsView;
