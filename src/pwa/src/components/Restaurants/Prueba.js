import React, { Component } from 'react';
import Menu from '../common/Menu';

class Prueba extends Component {
    render() {
        return(
            <>
            <Menu {...this.props} />
            <h1>Prueba</h1>
            </>
        );
    }
}

export default Prueba;