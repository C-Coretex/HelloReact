import React, { useState, useEffect, useRef } from "react";

import styles from '../scss/components/create.module.scss'

import uploadsvg from './upload.svg'

export default function CreatePage({ changeNNStruct, handlePageTransition, getKey }) {
	
	function handleSubmitClick(){
		
		

		handlePageTransition();
	}
	
	
	const moment = useRef(0);
	const learningRate = useRef(0);
	const layers = useRef([]);
	const terminatingError = useRef(0);
	
	
	return (
		<div className={styles.container}>
			<div className={styles.fullpage_container}>
				<div className={styles.header}>
					<input type="text" maxLength='25' placeholder="Insert Name" />
				</div>
				<div className={styles.main}>
					<div className={styles.setup_container}>
						<div className={styles.row}>
							<SetupInput name="moment" text="Moment" placeholder="0.5" /> { /* const moment = useRef(''); <input ref={moment} /> */}
							<SetupInput name="learningRate" text="Learning Rate" placeholder="0.1" />
						</div>
						<LayersInput getKey={getKey} />

						<SetupInput name="terminatigError" text="Terminating Error" placeholder="0.00011" width={100} maxLimit={9} />
						<TrainingInput />

						<div className={`${styles.bluebutton_palette} ${styles.button}`} onClick={handleSubmitClick}><p><b style={{color: 'white'}}>LET'S GO!</b></p></div>
					</div>
				</div>
			</div>
		</div>
	)
}

function SetupInput({ name, text, placeholder, width, maxLimit = 5 }) {
	return (
		<div className={styles.imputnumber_container}>
			<p>{text}</p>
			<input name={name} style={{ width: width }} type="text" maxLength={maxLimit} placeholder={placeholder} />
		</div >
	)
}

function LayersInput({ getKey }) {
	function SetupInputLocal({ name, text, placeholder }) {
		return (
			<div className={styles.imputnumber_container}>
				<div className={styles.absolute}>
					<p>{text}</p>
				</div>
				<input name={name} type="text" placeholder={placeholder} maxLength={4} />
			</div >
		)
	}

	function HiddenLayer({ data_key, placeholder, handleAddingLayer, handleDeletingLayer
	}) {
		function HiddenLayerButtons() {
			const [isVisible, setVisibility] = useState(true)

			return (
				<div onMouseEnter={() => setVisibility(false)} onMouseLeave={() => setVisibility(true)} className={styles.hiddenLayer_buttons}>
					<div className={styles.plus} onClick={() => handleAddingLayer(data_key)} hidden={isVisible}></div>
					<div className={styles.minus} onClick={() => handleDeletingLayer(data_key)} hidden={isVisible}></div>
				</div>
			)
		}

		return (
			<div className={styles.hiddenLayer}>

				<input type="text" placeholder={placeholder} maxLength={3} />
				<HiddenLayerButtons />
			</div>
		)
	}

	function createHiddenLayerElement() {
		let newKey = getKey()

		let element =
			<div className={styles.hiddenlayer_element} key={newKey}>
				<HiddenLayer name="hidden" data_key={newKey} placeholder='26+' handleAddingLayer={addLayer} handleDeletingLayer={deleteLayer} />
			</ div>

		return {
			key: newKey,
			value: element
		}
	}


	let hiddenLayerCount = 1;

	const [hiddenLayers, setHiddenLayers] = useState([createHiddenLayerElement()])

	function addLayer(key) {
		if (hiddenLayerCount > 6)
			return

		let hiddenLayersTemp = hiddenLayers
		let elementIndex = hiddenLayersTemp.findIndex(layer => {
			return layer.key === key
		})

		hiddenLayersTemp.splice(elementIndex + 1, 0, createHiddenLayerElement())
		++hiddenLayerCount

		setHiddenLayers([...hiddenLayersTemp])
	}

	function deleteLayer(key) {
		if (hiddenLayerCount === 1)
			return

		let hiddenLayersTemp = hiddenLayers

		hiddenLayersTemp = hiddenLayersTemp.filter(layer => {
			return layer.key !== key
		})

		--hiddenLayerCount

		setHiddenLayers([...hiddenLayersTemp])

		console.log(hiddenLayersTemp)
	}

	useEffect(() => {
		console.log(hiddenLayers)
	}, [hiddenLayers])


	return (
		<div className={`${styles.layers_container} ${styles.row}`}>
			<p>Layers</p>
			<SetupInputLocal name="in" text="In" placeholder="784" />
			<div className={styles.hiddenlayers_container}>
				{hiddenLayers.map(element => element.value)}
			</div>
			<SetupInputLocal name="out" text="Out" placeholder="10" />
		</div>
	)
}

function TrainingInput() {
	const [fileName, setFileName] = useState('')

	return (
		<div className={styles.inputfile_container}>
			<label htmlFor="upload-trset" className={styles.inputfile}>

				<div className={styles.upload_img}>
					<img style={{ color: 'white' }} src={uploadsvg} alt="upload file" />
				</div>

				{fileName !== '' ? <p>{fileName} </p> : <p>Upload Training Set</p>}
			</label>
			<input style={{ height: 0, width: 0 }} type="file" id="upload-trset" onChange={(e) => setFileName(e.target.files[0].name)} />
		</div>
	)
}