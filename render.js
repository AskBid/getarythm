var SWITCH = false;
var MILLISECONDS; // for half a beat so whole 1 period, whole 1+ period, whole 2 period ... 
var TOLLERANCE = 0.5


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
		const target_timestamp = Date.now() + (ms/2); //0 -> 50
		// console.log(`target timestamp date for calc: ${target_timestamp-ms/2}`)
		// console.log(`target timestamp ${ms/2} ${target_timestamp}`)
		thisSession.bar[thisSession.current].playing = target_timestamp;
		// console.log(`equal to target for calc ${Date.now()}`)

		await sleep((ms/2)-10) //50
		var lighttype = 'lightsoft'
		if (counter % 2 == 0) {
			glassAudio.currentTime = 0
			glassAudio.play();
			lighttype = 'light'
		}  
		// console.log(`timestamp halfway (equal target?) ${Date.now()}`)
		const lightoff = document.getElementById(thisSession.bar[thisSession.current].prev)
		lightoff.setAttribute('class', "cell")
		const light = document.getElementById(thisSession.current)
		light.setAttribute('class', `cell ${lighttype}`)

		// await render(start + (CRONJOB_INTERVAL*index), start)
		// // problem! the OVB limit orders get accumulated over time.
		counter = counter + 1
		// console.log(`still halfway? (halfway but after calcs) ${Date.now()}`)

		await sleep(ms/2) //+50
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
	const hit_timestamp = Date.now(); //33
	const target_timestamp = thisSession.bar[thisSession.current].playing //50
	const hit_delta = hit_timestamp - target_timestamp //33-50= -17
	thisSession.bar[thisSession.current].hits.push(hit_delta) // -17
	console.log(`current ${target_timestamp} ${thisSession.current}`)
	console.log(`${target_timestamp - MILLISECONDS} - ${target_timestamp + MILLISECONDS}`)
	console.log(Date.now())
	const svg = document.getElementById(`${thisSession.current}Svg`)
	drawHit(svg, hit_delta);
	tapAudio.currentTime = 0;
	tapAudio.play();
}

function drawHit(svg, hit_delta) {
	// var bbox = svg.getBBox();
	// svg.setAttribute('width', bbox.width);
	// svg.setAttribute('height', bbox.height);
	const circleprev = document.getElementById('circ')
	console.log(circleprev)
	if (circleprev != null) {circleprev.remove()}
	const svgWidth = svg.width.baseVal.value;
	const svgHeight = svg.height.baseVal.value;
	const middleX = svgWidth / 2;
	var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

	const circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
	const x = middleX + (svgWidth * (hit_delta / (MILLISECONDS)))
        // Set the circle's attributes
        circle.setAttribute("cx", x); // x-coordinate of the center
        circle.setAttribute("cy", svgHeight); // y-coordinate of the center
        circle.setAttribute("r", 10);   // radius
        circle.setAttribute("fill", "yellow"); // fill color
	circle.setAttribute("id", 'circ');
	svg.appendChild(circle)

	console.log(svgWidth);
	console.log(svgHeight);
	const tol = (MILLISECONDS * TOLLERANCE) / 2 // 100 * 0.5 = 50 / 2 = 25

	// Step 3: Set attributes for the rectangle
	rect.setAttribute('x', x); // -17 / 100 
	console.log(`middle: ${middleX}`)
	console.log(`width: ${svgWidth}`)
	console.log(`pixs from middle: ${svgWidth * -0.17}`)
	console.log(`pixs final: ${middleX + (svgWidth * -0.17)}`)
	rect.setAttribute('y', 0);
	rect.setAttribute('height', svgHeight+50);
	if (hit_delta >= (-tol) && hit_delta <= tol) {
		rect.setAttribute('width', 3);
		rect.setAttribute('fill', 'green');
		rect.setAttribute('fill-opacity', 0.5);
	} else {
		rect.setAttribute('width', 2);
		rect.setAttribute('fill', 'red');
		rect.setAttribute('fill-opacity', 0.3);
	}

	// Step 4: Append the rectangle to the SVG
	svg.appendChild(rect);
}


