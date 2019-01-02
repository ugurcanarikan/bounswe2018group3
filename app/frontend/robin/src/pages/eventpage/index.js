import Comment from "./comment"
import Navbar from "../components/navbar/index"
import GuestBar from "../components/guestBar/index"
import React from 'react';
import Location from "../components/map/LocationPicker"

import Cookies from 'js-cookie';
import axios from 'axios';
import Annotation from 'react-image-annotation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./eventpage.css";
import StarRatingComponent from 'react-star-rating-component';
import { Link, Redirect } from "react-router-dom";
import { ANNOTATION_URL,EVENT_IMAGES_URL,EVENT_ATTEND_URL, EVENT_INTEREST_URL,USERS_URL, EVENT_IMAGE_URL, EVENT_URL, USERS_URL, RATING_URL, DELETE_URL, EVENT_COMMENTS_URL } from "../constants/backend-urls";

import {
  PointSelector,
  RectangleSelector,
  OvalSelector
} from 'react-image-annotation/lib/selectors';

import "./eventpage.css"

export default class EventPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.location.pathname.substring(7),
      redirect : "",
      event: {},
      creator : [],
      rating : "",
      joined: false,
      interested: false,
      comments: [],
      annotationArr: [],
      images: [],
      shownImage: "",
      error: false,
      token: Cookies.get("token"),
      user: {},
      tags: [],
    }
    this.onStarClick = this.onStarClick.bind(this);
    this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleInterested = this.handleInterested.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.handleInterestedClick = this.handleInterestedClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAddCommentClick = this.handleAddCommentClick.bind(this);
    this.handleRedirectToCreatorProfile = this.handleRedirectToCreatorProfile.bind(this);
    //this.getAnnotations = this.getAnnotations.bind(this);
  }

  async componentDidMount(e){
    //console.log(this.state);
    var data = {
      // TODO: Change here according to API
      id: this.state.id
    };
    var headers= {
      "Content-Type": "application/json",
      //"Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "GET",
      // TODO: Update search url page.
      url: EVENT_URL + this.state.id,
      data: data,
      headers: headers,
    };
    //console.log(options);
    await axios(options).then(async response => {
      //console.log(response);
      if(response.status === 200){
        var eventList = response.data;
        this.setState({event: eventList, error: false});
        this.setState({creator: {id: this.state.event.creator[0], firstName: this.state.event.creator[1], lastName: this.state.event.creator[2]}});
        if(this.state.event.images.length > 0){
          var data = {
            // TODO: Change here according to API
            id: this.state.id
          };
          var headers= {
            "Content-Type": "application/json",
            //"Authorization" : "JWT " + Cookies.get("token")
          };
          var options = {
            method: "GET",
            // TODO: Update search url page.
            url: EVENT_IMAGES_URL + this.state.event.images[0],
            data: data,
            headers: headers,
          };
          await axios(options).then(async response => {
            console.log(response);
            var headers= {
              "Content-Type": "application/json",
              //"Authorization" : "JWT " + Cookies.get("token")
            };
            var options = {
              method: "GET",
              // TODO: Update search url page.
              url: response.data.content,
              //data: data,
              headers: headers,
            };
            this.setState({shownImage: response.data.content})
            
        })
        }
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
    if(this.state.token !== undefined){
      console.log("logged in")
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
        console.log(response);
        if(response.status === 200){
          this.setState({
            ...this.state, 
            user: {           
              pastEvents: response.data.pastEvents.map((event, key) => {return event[0]}),
              createdEvents: response.data.createdEvents.map((event, key) => {return event[0]}),
              futureEvents: response.data.futureEvents.map((event, key) => {return event[0]}),
              interestedEvents: response.data.interestedEvents.map((event, key) => {return event[0]}),
            }
          });
        } 
      }).then(() => {
        if(this.state.user.futureEvents.includes(parseInt(this.state.id))){
          this.setState({joined: true, interested: true});
        }
        /*if(this.state.user.createdEvents.includes(parseInt(this.state.id))){
          this.setState({joined: true, interested: true});
        }
        if(this.state.user.pastEvents.includes(parseInt(this.state.id))){
          this.setState({joined: true, interested: true});
        }*/
        if(this.state.user.interestedEvents.includes(parseInt(this.state.id))){
          this.setState({interested: true});
        }
      }).catch(error => {
        console.error(error);
      })
    this.state.event.images.forEach(element =>{
      var data = {
        // TODO: Change here according to API
        id: element
      };
      var headers= {
        "Content-Type": "application/json",
        //"Authorization" : "JWT " + Cookies.get("token")
      };
      var options = {
        method: "GET",
        // TODO: Update search url page.
        url: EVENT_IMAGE_URL + element,
        data: data,
        headers: headers,
      };
      //console.log(options);
      axios(options).then(response => {
        //console.log(response);
        if(response.status === 200){
          var resp = response.data;
          var ann = { 
            id: element,
            imageLink: resp.content,
            annotation: {},
            annotations: []
            }
          //console.log(ann.imageLink);
           if(resp.annotations.length == 0){
             var newArray = [];    
             newArray.push(ann); 
             this.setState({annotationArr:newArray, error: false});
             this.annotationArr = newArray;
             return;
           }
          resp.annotations.forEach(function(elem){
            var a = elem.target.selector;
            var ell = {data:{id:a.image_id, text:elem.body.value},
                      geometry:{
                        height:a.height, 
                        type: a.type,
                        width: a.width, 
                        x:a.x,
                        y:a.y
                      }};
            ann.annotations.push(ell);
          });
          var newArray = [];    
          newArray.push(ann); 
          this.setState({annotationArr:newArray, error: false});
          this.annotationArr = newArray;
        }
      }).catch(error => {
        console.error(error);
        this.setState({error: true});
      })
    });
    //this.getUser(this.state.event.creator)

  } 

  onChange = (annotation ,id) => {
    //console.log(this.annotationArr[id].annotation);
    this.annotationArr[id].annotation = annotation;
    this.setState({ annotation });
  }


  onSubmit = (annotation ,id, img_id) => {
    const { geometry, data } = annotation;
    var gg = {
      geometry,
      data: {
        ...data,
        id: Math.random()
      }
    };
    console.log(gg);
    this.annotationArr[id].annotations.push(gg);
    this.setState({ annotation : {}, annotationArr: this.annotationArr });

    var d = {
      // TODO: Change here according to API
      body: {
        value: data.text,
      },
      target: {
        source: img_id,
        selector: {
          sel_type: "ImagePositionSelector",
          type: geometry.type,
          image_id: gg.data.id,
          width: geometry.width,
          height: geometry.height,
          x: geometry.x,
          y: geometry.y,
        }
      }
    };
    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "POST",
      // TODO: Update search url page.
      url: ANNOTATION_URL,
      data: d,
      headers: headers,
    };
    //console.log(options);
    axios(options).then(response => {
      //console.log(response);
      if(response.status === 200){
        var event_ = response.data;
        this.setState({event: event_, error: false});
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })

  }



handleDeleteEvent(e){
  var data = {
    // TODO: Change here according to API
    //id: Cookies.get("clickedEvent")
  };
  var headers= {
    "Content-Type": "application/json",
    "Authorization" : "JWT " + Cookies.get("token")
  };
  var options = {
    method: "DELETE",
    // TODO: Update search url page.
    url: DELETE_URL + this.state.event.id,
    data: data,
    headers: headers,
  };
  axios(options).then(response => {
    if(response.status === 200){
      var resp = response.data;
      this.setState({redirect: "/home"});
      
    }
  }).catch(error => {
    console.error(error);
    this.setState({error: true});
  })
}
async handleJoinClick(){
  await this.setState({joined: !this.state.joined})
  if(this.state.joined){
    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "GET",
      url: EVENT_ATTEND_URL + this.state.event.id,
      headers: headers,
    };
    axios(options).then(response => {
      if(response.status === 200){
        console.log(response);      
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
      url: EVENT_ATTEND_URL + this.state.event.id,
      headers: headers,
    };
    axios(options).then(response => {
      if(response.status === 200){
        console.log(response);      
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
  }
}

async handleInterestedClick(){
  await this.setState({interested: !this.state.interested})
  if(this.state.interested){
    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "GET",
      url: EVENT_INTEREST_URL + this.state.event.id,
      headers: headers,
    };
    axios(options).then(response => {
      if(response.status === 200){
        console.log(response);      
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
      url: EVENT_INTEREST_URL + this.state.event.id,
      headers: headers,
    };
    axios(options).then(response => {
      if(response.status === 200){
        console.log(response);      
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
  }
  
}

handleJoin(){
  if(this.state.token !== undefined){
    if(!this.state.joined ){
      return(
        <button href="#" className="btn btn-primary" style={{marginLeft:'30px', marginTop:'30px'}} onClick={this.handleJoinClick}>Join Event</button>
      )
    }
    else{
      return(
        <button href="#" className="btn btn-success" style={{marginLeft:'30px', marginTop:'30px'}} onClick={this.handleJoinClick}>Going</button>

      )
    }
  }
}

handleInterested(){
  if(this.state.token !== undefined){
    if(!this.state.interested){
      return(
        <button href="#" class="btn btn-primary" style={{marginLeft:'30px', marginTop:'30px'}} onClick={this.handleInterestedClick}>Mark as Interested</button>
      )
    }
    else{
      return(
        <button href="#" class="btn btn-success" style={{marginLeft:'30px', marginTop:'30px'}} onClick={this.handleInterestedClick}>Interested</button>

      )
    }
  }
}

handleDelete(){
  if(this.state.token !== undefined){
    //console.log(Cookies.get("userid") == this.state.creator.id)
    if(Cookies.get("userid") == this.state.creator.id && Cookies.get("token") !== undefined && Cookies.get("token") !== ""){
      return(
        <a href="#" class="btn btn-danger"  onClick={e => this.handleDeleteEvent(e)} style={{marginLeft:'30px', marginTop:'30px'}}>Delete</a>
      )
    }
    else 
      return;
  }
}

handleEdit(){
  if(this.state.token !== undefined){
    if(Cookies.get("userid") == this.state.creator.id && Cookies.get("token") !== undefined && Cookies.get("token") !== ""){
      return(
        <a href="#" class="btn btn-info" style={{marginLeft:'30px', marginTop:'30px'}}>Edit</a>
      )
    }
    else 
      return;
  }
}

  onStarClick(nextValue, prevValue, name) {     
    var data = {
      // TODO: Change here according to API
      //id: Cookies.get("clickedEvent")
    };
    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "GET",
      // TODO: Update search url page.
      url: RATING_URL + this.state.event.id + "/" + nextValue,
      data: data,
      headers: headers,
    };
    axios(options).then(response => {
      if(response.status === 200){
        var resp = response.data;
        this.setState({rating: resp});
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })

  }

  handleAddCommentClick(e){
    e.preventDefault();
    var data = {
      // TODO: Change here according to API
      //id: Cookies.get("clickedEvent")
      title: this.state.event.name,
      content: this.state.commentValue,
      id: this.state.id,
    };
    var headers= {
      "Content-Type": "application/json",
      "Authorization" : "JWT " + Cookies.get("token")
    };
    var options = {
      method: "POST",
      // TODO: Update search url page.
      url: EVENT_COMMENTS_URL + this.state.id,
      body: data,
      headers: headers,
    };
    //console.log(options)
    axios(options).then(response => {
      if(response.status === 200){
        window.location.reload();
      }
    }).catch(error => {
      console.error(error);
      this.setState({error: true});
    })
    this.setState({commentValue: ""});

    
    //console.log(this.state.commentValue);
  }

  handleAddcommentBox(){
    if(Cookies.get("token") === undefined || Cookies.get("token") === ""){
      return(
        <form className="addCommentContainer" action="" onSubmit={e => e.preventDefault()}>
          <h4 className="text-center">You must be logged in to comment</h4>
        </form>
      );
    }
    else{
      return(
        <form className="addCommentContainer" action="" onSubmit={e => e.preventDefault()}>
          <input className="addComment" type="text" value={this.state.commentValue} onChange={e => this.setState({ commentValue: e.target.value })} placeholder="Type..."/>
          <button onClick={e => this.handleAddCommentClick(e)}>Comment</button>
        </form>
      )
    }
  }

  handleRedirectToCreatorProfile(e){
    e.preventDefault();
    this.setState({redirect: "/profile/" + this.state.creator.id});
  }

  render(){
    console.log("state in the render");
    console.log(this.state);
    const { rating } = this.state;
    if(this.state.redirect !== ""){
      return (<Redirect to={this.state.redirect}/>)
    }
    else if(this.state.id === "" || this.state.id === undefined){
      return (
        <div>
          <h2>
            Event not found!
          </h2>
        </div>
      )
    }
    /*else if(this.state.error){
      return(
        <div>
          <h2>
            Event not found!
          </h2>
        </div>
      )
    }*/
    return (
      <React.Fragment>
      <div className="mb-70">
        <Navbar currentPath={this.props.location.pathname}/>
      </div>
      <div className="wrapper position-absolute">
        <GuestBar/>
      </div>
      <div class="card">
          <h3 class="card-title" style={{marginTop:'30px', marginBottom:'30px', marginLeft:'30px'}}>{this.state.event.name}</h3>
          <div class="row">
            <div class="col-sm-6">
              <img class="card-img-top img-fluid shadow-lg bg-white" src={this.state.shownImage} alt="Card image cap" style={{marginBottom:'20px', maxWidth:'100%',height:'auto'}}/>
            </div>
            <div class="col-sm-6">
            <div class="card-body">
                <div class="row" style={{marginLeft:'15px'}}>
                <div class="col-sm-9">
                    Created by: <a href={"/profile/" + this.state.creator.id}>{this.state.creator.firstName + " " + this.state.creator.lastName}</a>
                  </div>
                  <div class="col-sm-9">
                    Price: {this.state.event.price} $
                  </div>
                  <div class="col-sm-3">
                  <StarRatingComponent 
                  name="rate1" 
                  starCount={5}
                  value={this.state.rating}
                  onStarClick={this.onStarClick.bind(this)}
                  />  
                  </div>
                </div>
                <div class="row" style={{marginLeft:'15px'}}>
                  <div class="col-sm-9">
                  Date-Time : {this.state.event.date} {this.state.event.time}
                  </div>
                  <div class="col-sm-3">
                 
                  </div>
                </div>
                <div class="row" style={{marginLeft:'15px'}}>
                  <div class="col-sm-9">
                  Artist : {this.state.event.artist ? this.state.event.artist : "Anonymous" } 
                  </div>
                  <div class="col-sm-3">
                 
                  </div>
                </div>
                <div class="row" style={{marginLeft:'15px'}}>
                  <div class="col-sm-9">
                  Tags : {this.state.event.tags ? this.state.event.tags.map((tag, key) => {return tag[1] + ", "}) : "no tags were given" } 

                  </div>
                  <div class="col-sm-3">
                 
                  </div>
                </div>

                <div class="row" style={{marginTop: '15px'}}>
                <div class="col-sm-12">
                <p class="card-text shadow-sm bg-white rounded" style={{marginLeft:'30px', marginRight:'30px', marginTop:'20px'}}>{this.state.event.info}</p>
                </div>
                </div>
                {this.handleJoin()}
                {this.handleInterested()}
                {this.handleEdit()}
                {this.handleDelete()}
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12">
        {this.state.annotationArr.map(annot => {
              return<Annotation
                  src={annot.imageLink}
                  alt=''
                  annotations={annot.annotations}
                  type={RectangleSelector.TYPE}
                  value={annot.annotation}
                  onChange={e => this.onChange(e,this.state.annotationArr.indexOf(annot))}
                  onSubmit={e => this.onSubmit(e,this.state.annotationArr.indexOf(annot), annot.id)}
        />})}
        </div>
        <h2 style={{margin:'22px'}}>
        Comments:
        </h2>
        
        {this.handleAddcommentBox()}
        {this.state.comments.map(comment => {
          return <Comment userName={comment.userName} text={comment.text} date={Date.now()}/>
        })}
      </React.Fragment>
    );
  }
};