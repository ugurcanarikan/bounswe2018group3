import React from "react";

import {Redirect, Link} from "react-router-dom";

import GuestBar from "../components/guestBar/index";
import Navbar from "../components/navbar/index";

import Cookies from 'js-cookie';
import axios from 'axios';

import "./index.css";

import { USERS_URL, GET_USER_PIC_URL, FOLLOW_URL } from "../constants/backend-urls"

export default class PrivateProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      bio: "",
      profile_pic: "",
    }

    this.follow = this.follow.bind(this);
    this.handleFollowButton = this.handleFollowButton.bind(this);
  }

  async componentDidMount(){
    if(this.props.location.pathname.substring(16) === undefined || this.props.location.pathname.substring(16) === "")
      return;

    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "GET",
      url: USERS_URL + this.props.location.pathname.substring(16),
      headers: headers,
    };
    await axios(options).then(async response => {
      console.log(response);
      if(response.status === 200){
        this.setState({
          ...this.state,
          id: response.data.id,
          bio: response.data.bio,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          profile_pic: response.data.profile_pic,
          followedUsers: response.data.followedUsers,
          followers: response.data.followers,
          private: response.data.private,
        });        
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
    options = {
      method: "GET",
      url: GET_USER_PIC_URL + this.props.location.pathname.substring(16),
      headers: headers,
    }
    await axios(options).then(response => {
      console.log("*************" + response);
      if(response.status === 200){
        this.setState({profile_pic: response.data.profile_pic})
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
    if(this.state.token !== undefined){
      var headers= {
        "Content-Type": "application/json",
        "Authorization" : "JWT " + Cookies.get("token")
      };
      var options = {
        method: "GET",
        url: USERS_URL + Cookies.get("userid"),
        headers: headers,
      };
      //console.log(options)
      await axios(options).then(async response => {
        console.log("did mount");
        //console.log(response);
        if(response.status === 200){
          //console.log(response)
          this.setState({
            userFollowing: response.data.followedUsers.map((person, key) => {return person[0]}),
          });
        }
      }).catch(error => {
        console.error(error);
      }) 
    }

  }

  async follow(){ 
    if(this.state.token !== undefined){
      if(!this.state.userFollowing.includes(this.state.id)){
        var headers= {
          "Content-Type": "application/json",
          "Authorization" : "JWT " + Cookies.get("token")
        };
        var options = {
          method: "GET",
          url: FOLLOW_URL + this.props.location.pathname.substring(16),
          headers: headers,
        }
        await axios(options).then(response => {
          //console.log(response);
          if(response.status === 200){
          }
        }).catch(error => {
          console.error(error);
          this.setState({error: true});
        })
      }
      else{
        var headers= {
          "Content-Type": "application/json",
          "Authorization" : "JWT " + Cookies.get("token")
        };
        var options = {
          method: "DELETE",
          url: FOLLOW_URL + this.props.location.pathname.substring(16),
          headers: headers,
        }
        await axios(options).then(response => {
          //console.log(response);
          if(response.status === 200){
          }
        }).catch(error => {
          console.error(error);
          this.setState({error: true});
        })
      }
    }
  } 
  handleFollowButton(){
    if(this.state.token !== undefined){
      if(!this.state.userFollowing.includes(this.state.id)){
        return(
          <button href="" className="btn btn-md btn-primary btn-block col-4 " onClick={this.follow}>
            <i className="fa fa-user-plus add-friend-image" aria-hidden="true"></i>
            Follow
          </button>
        )
      }
      else{
        return(
          <button href="" className="btn btn-md btn-success btn-block col-4 " onClick={this.follow}>
            <i className="fa fa-user-plus add-friend-image" aria-hidden="true"></i>
            Following
          </button>
        )
      }
    }
  }

  render(){
    if(this.props.location.pathname.substring(16) === undefined || this.props.location.pathname.substring(16) === ""){
      return(
        <div>
          <h2>
            User not found!
          </h2>
        </div>
      )
    }
    return (
      <div>
        <div className="wrapper position-absolute">
          <GuestBar/>
        </div>
        <div className="mb-70">
          <Navbar currentPath={this.props.location.pathname}/>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
        <div className="card " >
          <img className="mt-20 card-img-top w-100" src={this.state.profile_pic} alt="Card image"  />
          <div className="card-body">
            <h4 className="card-title">{this.state.first_name + " " + this.state.last_name}</h4>
            {/*<p className="card-text">{this.state.bio}</p>*/}
            <div className="address">								
              <p className="text-center"><i className="fa fa-lock" aria-hidden="true"></i></p>
              <p className="text-center">This user's profile is private</p>
              {this.handleFollowButton()}
              <button href="" className="btn btn-md btn-primary btn-block w-10 mx-auto">
                <i className="fa fa-envelope add-friend-image" aria-hidden="true"></i>
                Message
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

}