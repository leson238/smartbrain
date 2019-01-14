import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from "./Components/Navigation/Navigation";
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Signin from './Components/Signin/Signin';
// import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';
import Register from './Components/Register/Register';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800 
      }
    }
  }
}
const app = new Clarifai.App({
  apiKey: '9540b164976d4fdd8080425026344332'
 });
 
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box : {},
      route : 'signin',
      isSignedin: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    };
  }
  loadUser = (data) => {
    this.setState( {user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - clarifaiFace.right_col * width,
      bottomRow : height - clarifaiFace.bottom_row * height
    }
  }

  displayBox = (box) => {
    this.setState({box: box});
  }

  onRouteChange = (route) => {
    if (route === 'sign_out') {
      this.setState({isSignedin: true});
    } else {
      this.setState({isSignedin: false});
    }
    this.setState({route : route})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageURL:this.state.input})
    app.models
      .predict( Clarifai.FACE_DETECT_MODEL, 
                this.state.input)
      .then(response => this.displayBox(this.calculateFaceLocation(response)))
      .catch(err => console.log('Error'))
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedin = {this.state.isSignedin} onRouteChange= {this.onRouteChange}/>
        {this.state.route === 'sign_out' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <FaceRecognition imageURL = {this.state.imageURL} box = {this.state.box}/>
          </div>
          : (
            this.state.route === 'signin' ?
            <Signin onRouteChange = {this.onRouteChange} loadUser={this.loadUser}/>
            :<Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
          )}
      </div>
    );
  }
}

export default App;
