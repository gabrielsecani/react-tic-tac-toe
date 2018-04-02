import React, { Component } from 'react';

class MyInput extends Component {
  constructor(props) {
    super(props);
    this.timer=null;
    this.properties = {
      delay: 2000,
    };
    this.onValueChange = props.onChange;
    this.state = { typed: '' };
    Object.assign(this.properties, props);
    
    if (this.properties.onBlur) this.properties.onBlur=null;
    if (this.properties.onChange) this.properties.onChange=null;
    if (props.onChange) this.onValueChange = props.onChange;
    if (props.value !== this.state.typed)
      this.setState({typed: props.value})
  }

  handleOnBlur(event, value) {
    this.clearTimer();
    if (this.onValueChange)
      this.onValueChange(event, this.state.typed)
    this.setState({typed: value, event: null});
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  handleOnChange(event) {
    this.clearTimer();
    event.persist();
    const value = event.target.value;
    this.setState({typed: value, event});
    this.timer = setTimeout( ()=> this.handleOnBlur(event, value), this.properties.delay);
  }

  render() {
    if ( !this.state.event && this.state.typed !== this.props.value ){
      setTimeout( ()=> this.setState({typed: this.props.value}), 100);
    }
    return (<input {...this.properties} value={this.state.typed} value={this.state.typed} onChange={this.handleOnChange.bind(this)} onBlur={this.handleOnBlur.bind(this)} />);
  }
}

export default MyInput;