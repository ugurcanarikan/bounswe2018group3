import React from 'react';
import {Redirect, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import "jquery/dist/jquery.min.js";

import 'font-awesome/css/font-awesome.min.css';
import Cookies from 'js-cookie';
import "./index.css"

import logo from '../../../images/robin.svg';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      redirect: ""
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(){
    this.setState({isOpen: false});
  }

  render() {
    if(Cookies.get("token") === undefined){
      return this.state.isOpen && (
        <div className="wrapper">
          <nav className="nav navbar navbar-expand-md navbar-light bg-light fixed-bottom">
            <div className="mx-auto col-xs-12">
            <button type="button" className="close" aria-label="Close" onClick={this.handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
              <p className="text-center">Login or register to view much more</p>
              <Link to="/login" className="btn btn-lg btn-primary btn-block">
                Login
              </Link>
              <Link to="/register" className="btn btn-lg btn-primary btn-block">
                Register
              </Link>
            </div>
            
          </nav>
        </div>
      );
    }
    else 
      return null;
    

  }
}
