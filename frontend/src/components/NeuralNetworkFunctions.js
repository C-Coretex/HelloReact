

// #region API URLs
const urlStartNN = "http://localhost:7071/api/StartNN"
const urlStopNN = "http://localhost:7071/api/StopNN"
const urlContinueNN = "http://localhost:7071/api/ContinueNN"
const urlGetNNState = "http://localhost:7071/api/GetNNState"
const urlTestNN = "http://localhost:7071/api/TestNN"
const urlDeleteNN = "http://localhost:7071/api/DeleteNN"
// #endregion


export async function startNN(NNStructObj) {
	const { moment, learningRate, struct, terminatingError } = NNStructObj

	let NNStruct = {
		MomentTemp: moment === "" ? 0 : moment,
		LearningRateTemp: learningRate === "" ? 0 : learningRate,
		NeuronsAndLayers: struct === "" ? "" : struct,
		TerminatingErrorProcents: terminatingError === "" ? 0 : terminatingError
	}

	console.log(NNStruct)

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(NNStruct)
	}


	try {
		const response = await fetch(urlStartNN, requestOptions)
		if (!response.ok) throw new Error('Problem in response with message: ' + response)

		const data = await response.json();
		return data
	}
	catch (err) {
		throw new Error('Exited with error: ' + err)
	}
}

export async function stopNN(NNId) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(NNId)
	}


	try {
		const response = await fetch(urlStopNN, requestOptions)
		if (!response.ok) throw new Error('Problem in response with message: ' + response)

		const data = response.json()
		return data
	}
	catch (err) {
		throw new Error('Exited with error: ' + err)
	}
}

export async function continueNN(NNId) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(NNId)
	}


	try {
		const response = await fetch(urlContinueNN, requestOptions)
		if (!response.ok) throw new Error('Problem in response with message: ' + response)

		const data = await response.json();
		return data
	}
	catch (err) {
		throw new Error('Exited with error: ' + err)
	}
}

export async function deleteNN(NNId) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(NNId)
	}


	try {
		const response = await fetch(urlDeleteNN, requestOptions)
		if (!response.ok) throw new Error('Problem in response with message: ' + response)

		const data = await response.json();
		return data
	}
	catch (err) {
		throw new Error('Exited with error: ' + err)
	}
}

export async function getNNState(NNId) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(NNId)
	}

	try {
		const response = await fetch(urlGetNNState, requestOptions)
		if (!response.ok) throw new Error('Problem in response with message: ' + response)
		
		const data = await response.json();
		return data
	}
	catch (err) {
		throw new Error('Exited with error: ' + err)
	}
}