import React, { useState, useRef, useEffect } from "react";
	
import * as NNApi from "./NeuralNetworkFunctions"
	
	
export default function NeuralNetwork() {

	const NNId = useRef('');
	const interval = useRef('');

	const moment = useRef('');
	const learningRate = useRef('');
	const struct = useRef('');
	const terminatingError = useRef('');

	const [startDisabled, setStartDisabled] = useState(false);
	const [stopDisabled, setStopDisabled] = useState(true);
	const [continueDisabled, setContinueDisabled] = useState(true);
	const [deleteDisabled, setDeleteDisabled] = useState(true);
	const [NNstate, setNNstate] = useState(null);
	
	
	
	async function startNN() {
		try {
			const data = await NNApi.startNN({ moment: moment.current.value, learningRate: learningRate.current.value, struct: struct.current.value, terminatingError: terminatingError.current.value })

			NNId.current = data

			getNNState()
			interval.current = setInterval(() => {
				getNNState()
			}, 5000)

			setStartDisabled(true)
			setStopDisabled(false)
			setDeleteDisabled(false)
			
			console.log('NN created with ID ' + data)
		}
		catch (err) {
			console.log(err)
		}

	}
	
	async function stopNN() {
		try {
			const response = await NNApi.stopNN(NNId.current)

			clearInterval(interval.current)

			setStopDisabled(true)
			setContinueDisabled(false)

			console.log('process ' + NNId.current + ' stopped with code ' + response)
		}
		catch (err) {
			console.log(err)
		}
	}
	
	async function continueNN() {
		try {
			const response = await NNApi.continueNN(NNId.current)

			getNNState()
			interval.current = setInterval(() => {
				getNNState()
			}, 5000)

			setContinueDisabled(true)
			setStopDisabled(false)

			console.log('process ' + NNId.current + ' continued with code ' + response)
		}
		catch (err) {
			console.log(err)
		}
	}
	
	async function deleteNN() {
		try {
			const response = await NNApi.deleteNN(NNId.current)

			const state = { trainingSets: 0, iteration: 0, errorSum: 0, sw: "" }

			clearInterval(interval.current)

			setStopDisabled(true)
			setDeleteDisabled(true)
			setStartDisabled(false)
			setContinueDisabled(true)
			setNNstate(state)

			console.log('process ' + NNId.current + ' deleted with code ' + response)
		}
		catch (err) {
			console.log(err)
		}
	}
	
	async function getNNState() {
		const data = await NNApi.getNNState(NNId.current)

		setNNstate(data)

		console.log(data)
	}
	
	return (
		<div>
			<p>
				<label>Moment: <input type="number" ref={moment} placeholder="e.g. 0.5" /></label>
			</p>
			<p>
				<label>Learning rate: <input type="number" ref={learningRate} placeholder="e.g. 0.1" /></label>
			</p>
			<p>
				<label>Neural Network struct: <input type="text" ref={struct} placeholder="e.g. 784 26+ 16 10" /></label>
			</p>
			<p>
				<label>Terminating error: <input type="number" ref={terminatingError} placeholder="e.g. 0.00011" /></label>
			</p>

			<button onClick={startNN} disabled={startDisabled}>Start NeuralNetwork teaching</button>
			<button onClick={stopNN} disabled={stopDisabled}>Stop NeuralNetwork teaching</button>
			<button onClick={continueNN} disabled={continueDisabled}>Continue NeuralNetwork teaching</button>
			<button onClick={deleteNN} disabled={deleteDisabled}>Delete NeuralNetwork</button>

		</div>
	)
}