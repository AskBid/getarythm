const CONJOB_INTERVAL  = 100;
const SPEED_OF_REFRESH = 100; // milliseconds
var SWITCH = false;

class Session {
	constructor (
		current	
	) {
		this.current = {
			'1' : false, 
			'1+': false,
			'2' : false,
			'2+': false,
			'3' : false,
			'3+': false,
			'4' : false,
			'4+': false,
		}
	}
}

async function counting(ms) {
	var counter = 0
	while (SWITCH) {
		// await render(start + (CRONJOB_INTERVAL*index), start)
		// // problem! the OVB limit orders get accumulated over time.
		counter = counter + 1
		console.log(counter)
		await sleep(ms)
	}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const button = document.getElementById('start_stop')
button.setAttribute('onclick', "start_stop()")

function start_stop() {
	const inputBeatms = document.getElementById("beatms");
	SWITCH = SWITCH ? false : true;
	counting(inputBeatms.value);
	button.innerText = button.innerText == "STOP." ? 'START!' : "STOP.";
}
