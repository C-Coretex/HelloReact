import React, {Component} from "react"

import Timer from "./Resources/Timer"

class App extends Component {
    constructor() {
        super()
        this.state = {
            fileName: ""
        }
    }    

    render() {
        return (
            <div>
                <h1 className="navbar">Image recognition</h1>
                <br />
                <h2>Hey {this.props.name}!</h2>
                <Timer />
                <br />
                < input type="file"
                    onChange={
                        (event) => {
                            this.setState({
                                fileName: event.target.files[0].name
                            })
                            console.log(this.state.fileName)
                        }
                    }
                />
                <h5>{this.state.fileName ?
                    <p>Your file is {this.state.fileName}</p> :
                    <p>You haven't chosen any file</p>}</h5>
            </div>
        )
    }
}
            
export default App