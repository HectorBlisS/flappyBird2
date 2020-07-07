// config
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0, 0, 500, 500)

// gloobals
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
}
function stop() { }  // pause, stop, partial stop (bg, flappy)

// aux functions

// listeners
start()