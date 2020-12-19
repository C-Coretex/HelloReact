import React, { useState } from "react";
//import axios from 'axios';

import NeuralNetwork from "./components/NeuralNetwork"

import LandingPage from "./components/Landing"
import CreatePage from "./components/CreateNN"

import './scss/app.scss'


export default function App() {
  const [pageEnabled, setpageEnabled] =
    useState({
      'LandingPage': false,
      'CreatePage': true,
      'NNPage': false
    });

  function changeActiveWindow(name) {
    function getPages() {
      let tempDict = []
      Object.entries(pageEnabled).forEach(([k, v]) => {
        tempDict[k] = v
      })
      
      return tempDict
    }
    
    function reset() {
      let allPages = getPages()  
      for (let i in allPages) {
        allPages[i] = false
      }
      
      setpageEnabled(allPages)
      
      return allPages
    }

    let allPages = reset()
    allPages[name] = true
    
    setpageEnabled(allPages)
  }

  return (
    <div className="container">
      <main>
        <div className="content">
          {pageEnabled['LandingPage'] ? <LandingPage handlePageTransition={() => changeActiveWindow('CreatePage')} /> : null}
          {pageEnabled['CreatePage'] ? <CreatePage /> : null}
          {/*<NeuralNetwork />*/}
        </div>
      </main>
    </div>
  )
}