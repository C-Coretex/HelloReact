import React, { useState, useRef } from "react";
//import axios from 'axios';

import NeuralNetwork from "./components/NeuralNetwork"

import LandingPage from "./components/Landing"
import CreatePage from "./components/CreateNN"

import './scss/app.scss'


export default function App() {
  const uniqueKey = useRef(0);
  const NNstruct = useRef();
  
  
  const [pageEnabled, setpageEnabled] =
    useState({
      'LandingPage': true,
      'CreatePage': false,
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
  
  const uniqueKeyGenerator = () => {
    return uniqueKey.current = uniqueKey.current + 1;
  }
  
  function changeNNStruct(NNstructLocal) {
    NNstruct = NNstructLocal
  }
  
  return (
    <div className="container">
      <main>
        <div className="content">
          {pageEnabled['LandingPage'] ? <LandingPage handlePageTransition={() => changeActiveWindow('CreatePage')} /> : null}
          {pageEnabled['CreatePage'] ? <CreatePage changeNNStruct={changeNNStruct} handlePageTransition={() => changeActiveWindow('NNPage')} getKey={uniqueKeyGenerator}/> : null}
          {pageEnabled['NNPage'] ? <NeuralNetwork /> : null}
        </div>
      </main>
    </div>
  )
}