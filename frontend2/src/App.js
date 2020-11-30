import React from "react"
import "./style.css"


import Timer from "./Resources/Timer"
import FileSelector from "./Resources/FileSelector"
import NeuralNetwork from "./Resources/NeuralNetwork"

class App {
    render() {
        return (
            <div>
                <h1 className="navbar">Image recognition</h1>
                <NeuralNetwork />
            </div>
        )
    }
}
            
export default App