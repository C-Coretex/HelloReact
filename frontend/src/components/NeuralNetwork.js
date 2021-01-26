import React, { useState, useRef } from "react";

import * as NNApi from "./NeuralNetworkFunctions"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import styles from '../scss/components/neuralnetwork.module.scss'
import uploadsvg from './upload.svg'
import startsvg from './start.svg'
import stopsvg from './stop.svg'


export default function NeuralNetwork() {

	//#region Variables
	const NNId = useRef('');
	const interval = useRef('');

	const moment = useRef(0.5);
	const learningRate = useRef(0.1);
	const struct = useRef('784 26+ 16 10');
	const terminatingError = useRef(0.00011);

	const [startDisabled, setStartDisabled] = useState(false);
	const [stopDisabled, setStopDisabled] = useState(false);
	const [continueDisabled, setContinueDisabled] = useState(true);
	const [deleteDisabled, setDeleteDisabled] = useState(false);
	const [NNstate, setNNstate] = useState(null);
	//#endregion


	async function startNN() {
		try {
			const data = await NNApi.startNN({ moment: moment.current.value, learningRate: learningRate.current.value, struct: struct.current.value, terminatingError: terminatingError.current.value })

			NNId.current = data

			getNNState()
			interval.current = setInterval(() => {
				getNNState()
			}, 5000)

			setStartDisabled(true)
			setContinueDisabled(true)
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

	const data = [
		{ time: '0:00', mistake: 79 },
		{ time: '0:05', mistake: 77 },
		{ time: '0:10', mistake: 70 },
		{ time: '0:15', mistake: 64 },
		{ time: '0:20', mistake: 67 },
		{ time: '0:25', mistake: 64 },
		{ time: '0:30', mistake: 64 },
		{ time: '0:35', mistake: 62 },
		{ time: '0:40', mistake: 60 },
	]


	return (
		<div className={styles.container}>
			<div className={styles.fullpage_container}>
				<div className={styles.name_container}>
					<p>My Neural Network</p>
				</div>
				<div className={styles.center_container}>
					<div className={styles.grid}>
						<div className={styles.column}>
							<p>
								<label>Moment: <b>{moment.current}</b></label>
							</p>
							<p>
								<label>Learning rate: <b>{learningRate.current}</b></label>
							</p>
							<p>
								<label>Neural Network struct: <b>{struct.current}</b></label>
							</p>
							<p>
								<label>Terminating error: <b>{terminatingError.current}</b></label>
							</p>
						</div>

						<div style={{ alignItems: 'flex-end', marginRight: '100px' }} className={styles.column}>
							<div className={`${styles.graph_container}`}>
								<LineChart
									width={600}
									height={400}
									data={data}
									margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
								>
									<Line type="monotone" dataKey="mistake" stroke="#ff7300" yAxisId={0} />
									<XAxis dataKey="time" />
									<YAxis />
									<CartesianGrid stroke="#f5f5f5" />
									<Tooltip />
								</LineChart>
							</div>
							<div className={styles.button_container}>
								<div className={styles.svgbuttons}>
									<div className={`${styles.svg_container} ${continueDisabled ? styles.disabled : styles.enabled}`} onClick={startDisabled ? continueNN : startNN}>
										<img style={{ color: 'white', marginRight: '5px', marginBottom: '5px', height: '40px', width: '40px' }} src={startsvg} alt="Start NeuralNetwork" />
									</ div>
									<div className={`${styles.svg_container} ${stopDisabled ? styles.disabled : styles.enabled}`} onClick={stopNN}>
										<img style={{ color: 'white' }} src={stopsvg} alt="Stop NeuralNetwork" />
									</ div>
								</div>
								<div className={`${styles.bluebutton_palette} ${styles.button} ${deleteDisabled ? styles.disabled : styles.enabled}`} onClick={deleteNN}><p>Download</p> <img style={{ color: 'white' }} src={uploadsvg} alt="Download NeuralNetwork" /></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}