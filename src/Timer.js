import React from "react"

class Timer extends React.Component {
    constructor() {
        super()
        this.state = {
            date: new Date()
        }
    }
    
    tick() {
        this.setState({
          date: new Date()  
        })
    }
    
    componentDidMount() {
        this.IntervalID = setInterval(
            () => this.tick(),
            1000
        )
    }
    
    componentWillUnmount() {
        clearInterval(this.IntervalID)
    }
    
    render() {
        return (
            <div>
                <h2>Hey {this.props.name}!</h2>
                <h4>It's {this.state.date.toTimeString().split(' ')[0]} here</h4>
            </div>
        )
    }
}

export default Timer