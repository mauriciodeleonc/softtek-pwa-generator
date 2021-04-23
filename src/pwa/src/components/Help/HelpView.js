import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HelpList from './HelpList';
import Menu from '../common/Menu';
import { Link } from 'react-router-dom';
import { ShoppingBag } from '../../icons/icons';
import { CartContext } from '../../contexts/CartContext';
const { db } = require('../../firebase');

class HelpView extends Component {
    static contextType = CartContext
    constructor(props) {
        super(props);
        this.state = {
            faq: [],
            addedItems: 0
        }
    }

    componentDidMount() {
        db.collection('faq').orderBy('position').get().then((snapshot) => {
            const faq = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                faq.push({
                    question: data.questions,
                    answer: data.answer
                })
            })
            this.setState({ faq, addedItems: this.context.cart.noProducts })
        });
    }

    render() {
        return (
            <>
                <Menu {...this.props} />
                <Container className='mb-5 mt-3'>
                    <Row className='justify-content-between'>
                        <Col xs='auto' className='vertical-center'>
                            <h1 className='mb-0'>Ayuda</h1>
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
                            <HelpList faq={this.state.faq} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default HelpView;
