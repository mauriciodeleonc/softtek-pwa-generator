import React, { Component } from 'react';
import searchIcon from '../../assets/search.svg';

class Searchbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className='searchbar'>
                <input type='text' value={this.props.value} onChange={this.props.onChange} placeholder={this.props.placeholder} />
                <img src={searchIcon} loading='lazy' />
            </div>
        );
    }
}

export default Searchbar;