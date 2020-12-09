import React from "react";
//import axios from 'axios';

import NeuralNetwork from "./components/NeuralNetwork"
import LandingPage from "./components/Landing"
import styles from './scss/app.scss'


export default function App() {
  return (
    <div className="container">
      <main>
        <div className="content">
          <LandingPage />
          {/*<NeuralNetwork />*/}
        </div>
      </main>
    </div>
  )
}