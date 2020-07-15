import React from "react"

import ImageRecognition from "./ImageRecognition"

function getFileSize(file) {
    var size = file.size
    size = (size / 1048576).toFixed(4) //Convert byte to Megabyte (2^20)
    return size
}

class FileSelector extends React.Component {
    constructor() {
        super()
        this.state = {
            file: ""
        }
    }
    
    render() { 
        return(
            <div>
                <input type = "file"
                onChange = {
                    (event) => {
                        this.setState({
                            file: event.target.files[0]
                        })
                        console.log(this.state.file)
                    }
                }/>
                <h5>{this.state.file ?
                    <p> Your file is {this.state.file.name} with the size of {getFileSize(this.state.file)} Mb </p> :
                    <p> You haven 't chosen any file</p>}</h5>
                
                <ImageRecognition file={this.state.file} />
            </div>
        )
    }
}

export default FileSelector