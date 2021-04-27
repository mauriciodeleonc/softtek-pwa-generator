import React, { Component } from 'react';

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valid: -1,
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
        switch (this.props.type) {
            case 'color':
                return(
                    <>
                        <p className='non-bold'>{this.props.label} <input type={this.props.type} value={this.state.value ? this.props.value : '#FF6961' } onChange={this.handleValue} ref={this.props.innerRef}/></p>
                    </>
                );
            case 'file':
                return(
                    <>
                        <label htmlFor={this.props.name} className='file-label'>
                            <div className={`input-wrapper ${this.props.className && this.props.className} ${this.props.size ? this.props.size : 'block'}`}>
                                <p>{this.props.value}</p>
                                <div className={`input-placeholder non-bold ${this.props.value.length > 0 && 'focused'}`}>
                                    {this.props.label}
                                </div>
                            </div>
                            <div className='button secondary'>
                                <p className='text-smaller'>{this.props.buttonLabel}</p>
                            </div>
                        </label>
                        {this.props.directory ?
                            <input
                                type={this.props.type}
                                id={this.props.name}
                                className='file-input'
                                value={this.state.value}
                                onChange={this.props.handleFiles}
                                ref={this.props.innerRef}
                                accept={this.props.accept}
                                directory=''
                                webkitdirectory=''
                                multiple=''
                            />
                        :
                            <input
                                type={this.props.type}
                                id={this.props.name}
                                className='file-input'
                                value={this.state.value}
                                onChange={this.props.handleFiles}
                                ref={this.props.innerRef}
                                accept={this.props.accept}
                                //directory=''
                                //webkitdirectory=''
                                multiple=''
                            />
                        }
                        {/*<div className={`non-bold ${this.state.value.length > 0 && 'focused'}`}>
                            {this.props.label}
                        </div>*/}
                    </>
                );
            default:
                return(
                    <>
                        <div className={`input-wrapper ${this.props.className && this.props.className} ${this.props.size ? this.props.size : 'block'} ${this.props.submitted && (this.props.valid ? 'valid' : 'invalid')}`}>
                            <input type={this.props.type} className='input' value={this.state.value} onChange={this.handleValue} ref={this.props.innerRef}/>
                            <div className={`input-placeholder non-bold ${this.state.value.length > 0 && 'focused'}`}>
                                {this.props.label}
                            </div>
                        </div>
                        {this.props.submitted && !this.props.valid &&
                            <p className='text-smallest light'>* {this.props.errorText}</p>
                        }
                    </>
                );
        }
    }
}

export default React.forwardRef((props, ref) => <Input innerRef={ref} {...props} />);