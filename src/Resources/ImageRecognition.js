import React from "react"


class ImageRecognition extends React.Component {
    constructor() {
        super()
        this.state = {
            file: ""
        }
    }
    
    componentDidMount() {
        console.log("bbbbbbbb");
        console.log(this.props.file)
        
        const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

        deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K');

        var resp = deepai.callStandardApi("neuraltalk", {
            image: this.props.file,
        })
        console.log(resp)
    }
    
    render() {
        return (
            <div>
                {console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa")}
                <h3>Hey, I'm the image recognitor</h3>
                <h3>The file is {this.props.file.name}</h3>
            </div>
        )
    }
}

export default ImageRecognition