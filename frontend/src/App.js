import React from "react";
//import axios from 'axios';

import NeuralNetwork from "./components/NeuralNetwork"

//import './scss/main.css'


export default function App() {
  return (
    <div className="container">
      <header>
        <h1>Neural Network Builder</h1>
      </header>
      <main>
        <div className="content">
        <NeuralNetwork />
        </div>
      </main>
    </div>
  )
}