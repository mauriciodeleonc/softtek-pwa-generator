import React, { Component } from 'react';

class Input extends Component {
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
            <div className={`input-wrapper ${this.props.className ? this.props.className : 'mt-2 mb-3'} ${this.props.size ? this.props.size : 'block'} `}>
                <input type={this.props.type} className='input' value={this.props.value ? this.props.value : this.state.value} onChange={this.handleValue} ref={this.props.innerRef}/>
                <div className={`input-placeholder non-bold ${this.props.value ? (this.props.value.length > 0 && 'focused') : (this.state.value.length > 0 && 'focused')}`}>
                    {this.props.label}
                </div>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => <Input innerRef={ref} {...props} />);