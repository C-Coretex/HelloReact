import React, {Component} from "react"
import "./style.css"


import Timer from "./Resources/Timer"
import FileSelector from "./Resources/FileSelector"

class App extends Component {
    render() {
        return (
            <div>
                <h1 className="navbar">Image recognition</h1>
                <br />
                <h2>Hey {this.props.name}!</h2>
                <Timer />
                <br />
                <FileSelector />
            </div>
        )
    }
}
            
export default App