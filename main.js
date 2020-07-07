// config
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0, 0, 500, 500)

// gloobals
let gravity = .98
let interval
let frames = 0
let images = {
    bg: "https://i.imgur.com/eNytwgA.png",
    bird: "https://i.imgur.com/nnOXDvk.png",
    pipe1: "",
    pipe2: "",
    floor: "https://i.imgur.com/KovnIuV.png"

}

// clases
class GameObject {
    constructor(config = {}) {
        this.x = config.x || 0
        this.y = config.y || 0
        this.width = config.width || canvas.width
        this.height = config.height || canvas.height - 80
        this.img = new Image()
        this.img.src = config.image || images.bg
    }
    draw = () => {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

// instances
let bg = new GameObject()
let floor = new GameObject({
    y: canvas.height - 80,
    height: 80,
    image: images.floor
})
let bird = new GameObject({
    x: 150,
    y: 200,
    width: 40,
    height: 30,
    image: images.bird
})

// mods
bird.vy = 0
bird.jumpStrength = 20
bird.draw = function () {
    if ((this.y + this.height) < floor.y) {
        this.y += this.vy
        this.vy += gravity  // acelaración
    } else {
        this.vy = 0
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
}

bg.draw = function () {
    if (this.x > canvas.width) this.x = 0
    this.x += .2
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    ctx.drawImage(this.img, this.x - this.width, this.y, this.width, this.height)
}

floor.draw = function () {
    if ((this.x + this.width) < 0) {
        this.x = 0
    }
    this.x -= 3
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    // donde va el 2do?
    ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
}

// main functions
let start = () => interval = setInterval(update, 1000 / 60)

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    frames++
    bg.draw()
    floor.draw()
    bird.draw()
}
function stop() { }  // pause, stop, partial stop (bg, flappy)

// aux functions

// listeners
addEventListener('keydown', e => {
    if (e.keyCode === 32) bird.y -= bird.jumpStrength * 2
})

start()