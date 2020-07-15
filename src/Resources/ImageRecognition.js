import React from "react"

class ImageRecognition extends React.Component {
    constructor() {
        super()
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <h3>Hey, I'm the image recognitor</h3>
                <h3>The file is {this.props.file.name}</h3>
            </div>
        )
    }
}

export default ImageRecognition