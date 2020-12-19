import React from "react";

import styles from '../scss/components/create.module.scss'

export default function CreatePage() {
	return (
		<div className={styles.fullpage_container}>
			<div className={styles.header}>
				<input type="text" maxLength='25' placeholder="Insert Name" />
			</div>
			<div className={styles.main}>
				<div className={styles.setup_container}>
					<div className={styles.row}>
						<SetupInput text="Moment" placeholder="0.5" />
						<SetupInput text="Learning Rate" placeholder="0.1" />
					</div>
					<LayersInput />

					<SetupInput text="Terminating Error" placeholder="0.00011" width={100} maxLimit={9}/>
					<TrainingInput />

					<div className={`${styles.bluebutton_palette} ${styles.button}`}><b>LET'S GO!</b></div>
				</div>
			</div>
		</div>
	)
}

function SetupInput({ text, placeholder, width, maxLimit = 5 }) {
	return (
		<div className={styles.imputnumber_container}>
			<p>{text}</p>
			<input style={{ width: width }} type="text" maxLength={maxLimit} placeholder={placeholder} />
		</div >
	)
}

function LayersInput() {
	function SetupInputLocal({ text, placeholder }) {
		return (
			<div className={styles.imputnumber_container}>
				<div className={styles.absolute}>
					<p>{text}</p>
				</div>
				<input type="text" placeholder={placeholder} maxLength={3} />
			</div >
		)
	}
	function HiddenLayer({ placeholder }) {
		return (
			<div className={styles.hiddenLayer}>
				<input type="text" placeholder={placeholder} maxLength={3}/>
			</div>
		)
	}

	return (
		<div className={`${styles.layers_container} ${styles.row}`}>
			<p>Layers</p>
			<SetupInputLocal text="In" placeholder="784" />
			<div className={styles.hiddenlayers_container}>
				<HiddenLayer placeholder='26+' />
			</div>
			<SetupInputLocal text="Out" placeholder="10" />
		</div>
	)
}

function TrainingInput() {
	return (
		<div className={styles.inputfile_container}>
			<p>Upload Training Set</p>
			<input type="file" />
		</div>
	)
}