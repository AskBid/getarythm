var SWITCH = false;
var MILLISECONDS; // for half a beat so whole 1 period, whole 1+ period, whole 2 period ... 

class Session {
	constructor (
		current,
		bar
	) {
		this.current = '1';
		this.bar = {
			'1' : {'next': '1+', 'prev':'4+', 'hits': []}, 
		        '1+': {'next': '2',  'prev':'1', 'hits': []},
			'2' : {'next': '2+',  'prev':'1+', 'hits': []},
			'2+': {'next': '3',  'prev':'2', 'hits': []},
			'3' : {'next': '3+',  'prev':'2+', 'hits': []},
			'3+': {'next': '4',  'prev':'3', 'hits': []},
			'4' : {'next': '4+',  'prev':'3+', 'hits': []},
			'4+': {'next': '1',  'prev':'4', 'hits': []},
		}
	}

	next() {
		this.current = this.bar[this.current].next
	}
}

var thisSession = new Session();
var tapAudio = new Audio('/home/marep/Downloads/Pmiscck.wav');
var glassAudio = new Audio('/home/marep/Downloads/Ptjunk.wav');

async function counting(ms, thisSession) {
	var counter = 0

	while (SWITCH) {
		const target_timestamp = Date.now() + (ms/2);
		// console.log(`target timestamp date for calc: ${target_timestamp-ms/2}`)
		// console.log(`target timestamp ${ms/2} ${target_timestamp}`)
		thisSession.bar[thisSession.current].playing = target_timestamp;
		// console.log(`equal to target for calc ${Date.now()}`)
		var lighttype = 'lightsoft'
		if (counter % 2 == 0) {
			glassAudio.currentTime = 0
			glassAudio.play();
			lighttype = 'light'
		}  

		await sleep(ms/2)
		// console.log(`timestamp halfway (equal target?) ${Date.now()}`)
		const lightoff = document.getElementById(thisSession.bar[thisSession.current].prev)
		lightoff.setAttribute('class', "cell")
		const light = document.getElementById(thisSession.current)
		light.setAttribute('class', `cell ${lighttype}`)

		// await render(start + (CRONJOB_INTERVAL*index), start)
		// // problem! the OVB limit orders get accumulated over time.
		counter = counter + 1
		// console.log(`still halfway? (halfway but after calcs) ${Date.now()}`)

		await sleep(ms/2)
		// console.log(`at the end (should same next target timestamp for calc) ${Date.now()}`)

		thisSession.next()
	}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const button = document.getElementById('start_stop')
button.setAttribute('onclick', "start_stop()")

const tap = document.getElementById('tap')
tap.setAttribute('onclick', "space_press(thisSession)")

function start_stop() {
	const inputBeatms = document.getElementById("beatms");
	SWITCH = SWITCH ? false : true;
	MILLISECONDS = ((60 / inputBeatms.value) * 1000)/2
	counting(MILLISECONDS, thisSession);
	button.innerText = button.innerText == "STOP." ? 'START!' : "STOP.";
}

function space_press(thisSession) {
	const hit_timestamp = Date.now();
	const target_timestamp = thisSession.bar[thisSession.current].playing
	thisSession.bar[thisSession.current].hits.push(hit_timestamp - target_timestamp)
	console.log(`current ${target_timestamp} ${thisSession.current}`)
	console.log(`${target_timestamp - MILLISECONDS} - ${target_timestamp + MILLISECONDS}`)
	console.log(Date.now())
	const svg = document.getElementById(`${thisSession.current}Svg`)
	drawHit(svg);
	tapAudio.currentTime = 0;
	tapAudio.play();
}

function drawHit(svg) {
	var bbox = svg.getBBox();
	const svgWidth = bbox.width;
	const svgHeight = bbox.height;

}
