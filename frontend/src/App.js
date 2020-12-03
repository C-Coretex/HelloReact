import React from "react";
//import axios from 'axios';

import NeuralNetwork from "./components/NeuralNetwork"
import LandingPage from "./components/Landing"
import './scss/test.scss'


export default function App() {
  return (
    <div className="container">
      <header>
        <h1>Neural Network Builder</h1>
      </header>
      <main>
        <div className="content">
          aoaoaoo
          <LandingPage />
          {/*<NeuralNetwork />*/}
        </div>
      </main>
    </div>
  )
}