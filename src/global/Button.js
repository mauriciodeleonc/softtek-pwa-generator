import React, { Component } from 'react';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }

        this.handleValue = this.handleValue.bind(this);
    }

    handleValue(e) {
        let value = e.target.value;
        this.setState({value});
        if(this.props.handleValue)
            this.props.handleValue(value);
    }

    render(){
        return(
            <button 
                type={this.props.type ? this.props.type : 'button'}
                className={`button ${this.props.block && 'block'} ${this.props.variant === 'primary' ? 'primary' : 'secondary'} ${this.props.className && this.props.className}`}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <p className='text-smaller'><b>{this.props.label}</b></p>
            </button>
        );
    }
}

export default Button;