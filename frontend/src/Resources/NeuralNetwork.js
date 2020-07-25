import React from "react"

import DenseTable from "./TableNN"


const urlStartNN = "http://localhost:7071/api/StartNN"
const urlStopNN = "http://localhost:7071/api/StopNN"
const urlContinueNN = "http://localhost:7071/api/ContinueNN"
const urlGetNNState = "http://localhost:7071/api/GetNNState"
const urlTestNN = "http://localhost:7071/api/TestNN"
const urlDeleteNN = "http://localhost:7071/api/DeleteNN"

class NeuralNetwork extends React.Component
{
	constructor(){
		super();
		
		this.Moment = React.createRef();
		this.LeraningRate = React.createRef();
		this.Struct = React.createRef();
		this.TerminatingError = React.createRef();
		
		this.state = {
			startDisabled: false,
			stopDisabled: true,
			continueDisabled: true,
			deleteDisabled: true,
			NNstate: null
		}
	}
	
	componentDidMount() {
        this.IntervalID = setInterval(
            () => this.getNNState(),
            5000
        )
    }
	
	async startNN()
	{
		//console.log(this.Struct.current.value)
		let NNStruct = {
			MomentTemp: this.Moment.current.value===""? 0 : this.Moment.current.value,
			LearningRateTemp: this.LeraningRate.current.value===""? 0 : this.LeraningRate.current.value,
			NeuronsAndLayers: this.Struct.current.value===""? "" : "784 " + this.Struct.current.value + " 10",
			TerminatingErrorProcents: this.TerminatingError.current.value===""? 0 : this.TerminatingError.current.value
		}
		console.log(NNStruct)
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(NNStruct)
		}
		
		const response = await fetch(urlStartNN, requestOptions)
		const data = await response.json();
		this.setState({ NNId: data, startDisabled: true, stopDisabled: false, deleteDisabled: false })
		
		console.log(this.state.NNId)
	}
	
	async stopNN()
	{
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(this.state.NNId)
		}
		
		const response = await fetch(urlStopNN, requestOptions)
		this.setState({stopDisabled: true, continueDisabled: false })
		
		console.log(this.state.NNId)
	}
	
	async continueNN()
	{
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(this.state.NNId)
		}
		
		const response = await fetch(urlContinueNN, requestOptions)
		const data = await response.json();
		this.setState({ continueDisabled: true, stopDisabled: false })
		
		console.log(data)
	}
	async deleteNN()
	{
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(this.state.NNId)
		}
		
		const response = await fetch(urlDeleteNN, requestOptions)
		const data = await response.json();
		
		const state = {trainingSets:0, iteration:0, errorSum:0, sw:""}
		this.setState({ stopDisabled: true, deleteDisabled: true, startDisabled: false, continueDisabled: true, NNState: state })
		
		
		console.log(data)
	}
	async getNNState()
	{
		if (this.state.deleteDisabled || this.state.stopDisabled)
			return;
		
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(this.state.NNId)
		}
		
		const response = await fetch(urlGetNNState, requestOptions)
		const data = await response.json();
		
		this.setState({ NNstate: data })
		
		console.log(data)
	}
	
	render(){
		return (
			<div>
				<p>
					<label>Moment: <input type="number" ref={this.Moment} placeholder="e.g. 0.5"/></label>
				</p>
				<p>
					<label>Learning rate: <input type="number" ref={this.LeraningRate} placeholder="e.g. 0.1"/></label>
				</p>
				<p>
					<label>Neural Network struct: 784 <input type="text" ref={this.Struct} placeholder="e.g. 26+ 16"/> 10</label>
				</p>
				<p>
					<label>Terminating error: <input type="number" ref={this.TerminatingError} placeholder="e.g. 0.00011"/></label>
				</p>
				
				<button onClick={this.startNN.bind(this)} disabled={this.state.startDisabled}>Start NeuralNetwork teaching</button>
				<button onClick={this.stopNN.bind(this)} disabled={this.state.stopDisabled}>Stop NeuralNetwork teaching</button>
				<button onClick={this.continueNN.bind(this)} disabled={this.state.continueDisabled}>Continue NeuralNetwork teaching</button>
				<button onClick={this.deleteNN.bind(this)} disabled={this.state.deleteDisabled}>Delete NeuralNetwork</button>
				
				<p />
				{this.state.NNstate? <DenseTable id={this.state.NNId} NNstate={this.state.NNstate} /> : null}
			</div>
		)
	}
}

export default NeuralNetwork