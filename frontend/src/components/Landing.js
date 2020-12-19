import React from "react";

import styles from '../scss/components/landing.module.scss'

export default function LandingPage({ handlePageTransition }) {
	return (
		<div className='container'>
			<div className={styles.fullpage_container}>
				<div className={styles.flex_container}>
					<div className={`${styles.button_create} ${styles.button}`} onClick={handlePageTransition}>
						<p className={styles.create}>CREATE</p>
						<p className={styles.neuralnetwork}>NEURAL NETWORK</p>
					</div>
				</div>
			</div>
			<div className={styles.container_text}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt consectetur inventore velit repellat dicta! Suscipit placeat cumque odit hic numquam officiis enim inventore commodi, dolorum minima aliquam dolore itaque maiores. Officia molestiae, libero magnam quasi eveniet voluptas incidunt voluptates error nesciunt molestias suscipit est iste sint consequatur porro, minima culpa? Inventore possimus dolore nostrum nisi mollitia ab laudantium sapiente repudiandae soluta facilis sit aliquam distinctio amet libero corporis, cum voluptate. Deleniti illum non ipsam reiciendis natus rerum tempore minima, impedit quis earum neque sit obcaecati ratione atque quam perspiciatis ab id molestias accusantium soluta libero. Doloribus fugit illum ullam officia.

			</div>

			<p><b>All rights reserved</b></p>
		</div>
	)
}