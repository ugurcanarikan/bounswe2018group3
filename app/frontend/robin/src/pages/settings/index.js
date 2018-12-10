import Navbar from "../components/navbar/index"
import React from 'react';
import "./index.css";
import Cookies from 'js-cookie';

import { Link, Redirect } from "react-router-dom";

import axios from 'axios';
import { push } from 'react-router-redux';

import { EVENT_URL } from "../constants/backend-urls";
export default class CreateEvent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        redirect: "",
        private: false,
        submitClicked: false,
      };
  
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleCreate = this.handleCreate.bind(this);
      this.handleErrorMessage = this.handleErrorMessage.bind(this);
      //this.handleSubmit = this.handleSubmit.bind(this);
      this.checkError = this.checkError.bind(this);
    }
  
    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }

    handleCheckboxChange(){
      this.setState({private: !this.state.private})
    }

    handleNameChange(event) {
        const target = event.target;
        const value = target.type === 'text' ? target.value : "";
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    // TODO : I'm getting bad request 400 over here.
    handleCreate(e){
      if(this.checkError()){
        Cookies.set("eventName", this.state.eventName);
        Cookies.set("eventInfo", this.state.eventInfo);
        Cookies.set("eventDate", this.state.eventDate);
        Cookies.set("eventTime", this.state.eventTime);
        Cookies.set("eventPrice", this.state.eventPrice);
        Cookies.set("numberOfGuests", this.state.numberOfGuests);
      }
      else
        return;
      var data = {
       name : this.state.eventName,
       info : this.state.eventInfo,
       artist : this.state.artistName,
       date : this.state.eventDate,
       time : this.state.eventTime,
       price : this.state.eventPrice,
       country : this.state.imageLink
      };
      var headers= {
        "Content-Type": "application/json",
        "Authorization" : "JWT " + Cookies.get("token")
      };
      var options = {
        method: "POST",
        url: EVENT_URL,
        data: data,
        headers: headers,
      };
      axios(options).then(response => {
        if(response.status === 201){
          console.log(response);
          console.log("Im here")
          this.setState({redirect: "/createEventSuccess"});
          //window.location.reload();
        }
      }).catch(error => {
        console.error(error);
        this.setState({error: true});
      })
    }

    checkError(){
      if(this.state.eventName === "" || this.state.eventDate === "" || this.state.eventTime === ""){
        return false;
      }
      else return true;
    }

    handleErrorMessage(){
      if(this.state.submitClicked){
        if(this.state.eventName === ""){
          return(
            <div className="text-danger text-center ">
              Event name cannot be empty
            </div>
          );
        }
        else if(this.state.eventDate === ""){
          return(
            <div className="text-danger text-center ">
              Event date cannot be empty
            </div>
          );
        }
        else if(this.state.eventTime === ""){
          return(
            <div className="text-danger text-center ">
              Event time cannot be empty
            </div>
          );
        }
      }
      return;
    }
  
    render() {
      if(this.state.redirect === "/createEventSuccess"){
        return (<Redirect to={this.state.redirect}/>)
      }
      return (
        <React.Fragment>
          <div>
            <Navbar currentPath={this.props.location.pathname}/>
          </div>
          <div className="container-event col-xs-12 col-sm-10 col-md-6">
            <h2 className="text-center">Settings</h2>
            <form className="form-event">
            <div className="row">
              <h5>Privacy Settings</h5><br/>
            </div>
            <div className="row">
              <p>
                <input type="checkbox" onChange={this.handleCheckboxChange} onClick={() => {this.checked = !this.checked}}/> Private Profile
              </p>
            </div>
              
              <select>
                <option></option>
                <option value="one">one</option>
                <option value="two">two</option>
                <option value="three">three</option>
              </select>
              {this.handleErrorMessage()}
              <div className="row">
                <div className="col-xs-2 mx-auto">
                  <button type="button" onClick={e => this.handleCreate(e)} className="btn btn-success mx-auto">Create</button>
                </div>
              </div>
            </form>
          </div>
        </React.Fragment>
      );
    }
  }