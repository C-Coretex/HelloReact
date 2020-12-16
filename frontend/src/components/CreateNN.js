import React from "react";

import styles from '../scss/components/create.module.scss'

export default function CreatePage() {
	return (
		<div className={styles.fullpage_container}>
			<header>
				<input type="text" placeholder="Insert Name" />
			</header>
			<main>
				<div className={styles.settup_container}>
					<SetupInput text="Moment" />
					<SetupInput text="Learning Rate" />
					<LayersInput />
					<SetupInput text="Terminal Error" />
					<TrainingInput />

					<div className={styles.button}><b>LET'S GO!</b></div>
				</div>
			</main>
		</div>
	)
}

function SetupInput({ text }) {
	return (
		<div>
			<p>{text}</p>
			<input type="text" />
		</div>
	)
}
function LayersInput() {
	return (
		<div>ooooooooooaaaaaaaaaaaaaa</div>
	)
}
function TrainingInput() {
	return (
		<div>lllllllllllllllllllllllll</div>
	)
}