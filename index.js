// A handtracking game based on MediaPipe Hands

const videoElement = document.getElementsByClassName('input')[0];
let results

const hands = new Hands({locateFile: (file) => {
	return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
}})
hands.setOptions({
	maxNumHands: 2,
	modelComplexity: 1,
	minDetectionConfidence: 0.3,
	minTrackingConfidence: 0.3
})
hands.onResults(r => results = r)

const camera = new Camera(videoElement, {
	onFrame: async () => {
		await hands.send({image: videoElement})
	},
	width: 1280,
	height: 720
})
camera.start()

function center(landmarks) {
	let x = 0, y = 0
	for(let point of landmarks) {
		x += point.x
		y += point.y
	}
	x /= landmarks.length
	y /= landmarks.length
	return { x: x, y: y }
}

const canvas = p => {
	let points = []
	let particles = []
	let combo = 0
	let maxCombo = 0
	let updateCombo = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
  		p.textAlign(p.CENTER, p.CENTER)
		p.strokeWeight(60)
		p.strokeJoin(p.BEVEL)
		p.fill(200)
		p.background(0)
		p.ellipseMode(p.CENTER)
		p.rectMode(p.CENTER)
		p.pixelDensity(1)

		for(let i = 0; i < 10; i++) particles.push(new Background())
	}

	p.draw = () => {
		p.background(0, 90)

		p.noFill()
		p.stroke(50)
		p.strokeWeight(1)
		for(let i = 10; i < p.width; i += 50) {
			p.line(i, 0, i, p.height)
		}
		for(let i = 10 - (p.frameCount / 2) % 50; i < p.height; i += 50) {
			p.line(0, i, p.width, i)
		}

		p.stroke(255)
		p.strokeWeight(2)
		p.circle(p.width / 2, p.height / 2, 750)

		p.strokeWeight(20)
		p.stroke(50 + updateCombo)
		p.fill(50 + updateCombo)
		updateCombo *= 0.9
		p.textSize(300)
		p.text(combo, p.width / 2, p.height / 2 - 20)
		p.strokeWeight(3)
		p.stroke(50)
		p.fill(50)
		updateCombo *= 0.9
		p.textSize(50)
		p.text('Max Combo  ' + maxCombo, p.width / 2, p.height / 2 + 140)

		points.length = 0
		if(!results) return
		if(results.multiHandLandmarks) {
	    for(const [i, landmarks] of results.multiHandLandmarks.entries()) {
	    	drawHand(landmarks)
	    	points[i] = center(landmarks)
	    	points[i].r = (p.atan2(points[i].y - 0.5, -points[i].x + 0.5) + p.TWO_PI) % p.TWO_PI
	    	p.noFill()
			p.strokeWeight(12)
	    	p.stroke(200, 50)
	    	p.circle(mapX(points[i].x), mapY(points[i].y), 260)
			p.push()
			p.strokeCap(p.SQUARE)
			p.translate(p.width / 2, p.height / 2)
			p.rotate(points[i].r)
	    	p.noFill()
			p.strokeWeight(6)
	    	p.stroke(200, 50)
			p.arc(0, 0, 700, 700, -0.5, 0.5)
			p.strokeWeight(20)
	    	p.stroke(255)
			p.arc(0, 0, 700, 700, -0.2, 0.2)
			p.pop()
	    }
	  }

		if(p.frameCount % 30 == 0) particles.push(new Bubble())
		if(p.frameCount % 120 == 0) particles.push(new Bubble())
		if((p.frameCount + 30) % 60 == 0) particles.push(new Bubble())
		for(let o of particles) { o.update() }
		particles = particles.filter(o => o.active)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.background(0)
	}

	function mapX(x) { return p.map(x * 1280, 0, 1280, p.width, 0) }
	function mapY(y) { return p.map(y * 1280, 0, 1280, 0, p.height) }
	function drawHand(landmarks) {
		p.strokeWeight(60)
	  	p.noFill()
		p.stroke(200, 30)
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[0].x), mapY(landmarks[0].y))
	  	p.curveVertex(mapX(landmarks[0].x), mapY(landmarks[0].y))
	  	p.curveVertex(mapX(landmarks[1].x), mapY(landmarks[1].y))
	  	p.curveVertex(mapX(landmarks[2].x), mapY(landmarks[2].y))
	  	p.curveVertex(mapX(landmarks[3].x), mapY(landmarks[3].y))
	  	p.curveVertex(mapX(landmarks[4].x), mapY(landmarks[4].y))
	  	p.endShape()
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[0].x), mapY(landmarks[0].y))
	  	p.curveVertex(mapX(landmarks[5].x), mapY(landmarks[5].y))
	  	p.curveVertex(mapX(landmarks[6].x), mapY(landmarks[6].y))
	  	p.curveVertex(mapX(landmarks[7].x), mapY(landmarks[7].y))
	  	p.curveVertex(mapX(landmarks[8].x), mapY(landmarks[8].y))
	  	p.endShape()
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[9].x), mapY(landmarks[9].y))
	  	p.curveVertex(mapX(landmarks[9].x), mapY(landmarks[9].y))
	  	p.curveVertex(mapX(landmarks[10].x), mapY(landmarks[10].y))
	  	p.curveVertex(mapX(landmarks[11].x), mapY(landmarks[11].y))
	  	p.curveVertex(mapX(landmarks[12].x), mapY(landmarks[12].y))
	  	p.endShape()
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[13].x), mapY(landmarks[13].y))
	  	p.curveVertex(mapX(landmarks[13].x), mapY(landmarks[13].y))
	  	p.curveVertex(mapX(landmarks[14].x), mapY(landmarks[14].y))
	  	p.curveVertex(mapX(landmarks[15].x), mapY(landmarks[15].y))
	  	p.curveVertex(mapX(landmarks[16].x), mapY(landmarks[16].y))
	  	p.endShape()
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[17].x), mapY(landmarks[17].y))
	  	p.curveVertex(mapX(landmarks[17].x), mapY(landmarks[17].y))
	  	p.curveVertex(mapX(landmarks[18].x), mapY(landmarks[18].y))
	  	p.curveVertex(mapX(landmarks[19].x), mapY(landmarks[19].y))
	  	p.curveVertex(mapX(landmarks[20].x), mapY(landmarks[20].y))
	  	p.endShape()
	  	p.fill(200, 30)
	  	p.beginShape()
	  	p.curveVertex(mapX(landmarks[17].x), mapY(landmarks[17].y))
	  	p.curveVertex(mapX(landmarks[0].x), mapY(landmarks[0].y))
	  	p.curveVertex(mapX(landmarks[1].x), mapY(landmarks[1].y))
	  	p.curveVertex(mapX(landmarks[5].x), mapY(landmarks[5].y))
	  	p.curveVertex(mapX(landmarks[9].x), mapY(landmarks[9].y))
	  	p.curveVertex(mapX(landmarks[13].x), mapY(landmarks[13].y))
	  	p.curveVertex(mapX(landmarks[17].x), mapY(landmarks[17].y))
	  	p.curveVertex(mapX(landmarks[0].x), mapY(landmarks[0].y))
	  	p.endShape(p.CLOSE)
	  	p.noStroke()
	}

	class Bubble {
		constructor() {
			this.r = p.floor(p.random(0, 6)) * p.TWO_PI / 6
			this.time = 90
			this.active = true
		}

		update() {
			p.push()
			p.noFill()
			p.strokeWeight(12)
			p.stroke(255)
			p.translate(p.width / 2, p.height / 2)
			p.rotate(this.r)
			p.arc(0, 0, 810 - this.time * 9, 810 - this.time * 9, -0.2, 0.2)
			p.pop()
			for(let point of points) {
				if(this.time < 20 && p.abs(this.r - point.r) < 0.6) {
					combo++
					if(combo > maxCombo) maxCombo = combo
					updateCombo = 100
					particles.push(new FX2(p.cos(this.r) * 400, p.sin(this.r) * 400))
					for(let i = 0; i < 10; i++) particles.push(new FX(p.cos(this.r) * 400, p.sin(this.r) * 400))
					this.active = false
					return
				}
			}
			this.time--
			if(this.time <= 0) {
				combo = 0
				particles.push(new Miss(p.cos(this.r) * 400, p.sin(this.r) * 400))
				this.active = false
			}
		}
	}

	class FX {
		constructor(x, y) {
			this.x = p.width / 2 + x
			this.y = p.height / 2 + y
			this.r = p.random(p.TWO_PI)
			this.vx = p.cos(this.r) * 15
			this.vy = p.sin(this.r) * 15
			this.time = 60 + p.random(0, 60)
			this.active = true
		}

		update() {
			this.time--
			this.vx *= 0.9
			this.vy = this.vy * 0.99 + 1
			this.x += this.vx
			this.y += this.vy
			p.noStroke()
			p.fill(255, 90)
			p.circle(this.x, this.y, 10)
			if(this.time <= 0) this.active = false
		}
	}

	class FX2 {
		constructor(x, y) {
			this.x = p.width / 2 + x
			this.y = p.height / 2 + y
			this.time = 30
			this.active = true
		}

		update() {
			this.time--
			p.strokeWeight(5)
			p.stroke(255, this.time * 3)
			p.noFill()
			p.circle(this.x, this.y, 330 - this.time * 5) 
			if(this.time <= 0) this.active = false
		}
	}

	class Miss {
		constructor(x, y) {
			this.x = p.width / 2 + x
			this.y = p.height / 2 + y
			this.time = 30
			this.active = true
		}

		update() {
			this.time--
			p.noStroke()
			p.fill(200, this.time * 3)
			p.textSize(50)
			p.text('Miss', this.x, this.y)
			if(this.time <= 0) this.active = false
		}
	}

	class Background {
		constructor() {
			this.s = p.random(900, 1200)
			this.r = p.random(0, p.PI)
			this.w = p.random(1, 15)
			this.speed = p.random(1, 10)
			this.active = true
		}

		update() {
			p.push()
			p.translate(p.width / 2, p.height / 2)
			p.rotate(this.speed * p.frameCount / 100)
			p.strokeWeight(this.w)
			p.stroke(200, 20)
			p.noFill()
			p.arc(0, 0, this.s, this.s, 0, this.r)
			p.pop()
		}
	}
}

new p5(canvas, 'canvas')