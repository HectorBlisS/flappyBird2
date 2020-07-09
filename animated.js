// config
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0, 0, 500, 500)

// gloobals
let test = new Image()
test.src = "https://i.imgur.com/ppN8APd.png"

let gravity = .98
let interval
let frames = 0
let images = {
    bg: "https://i.imgur.com/eNytwgA.png",
    bird: "https://i.imgur.com/nnOXDvk.png",
    pipe1: "https://i.imgur.com/YaHT4GQ.png",
    pipe2: "https://i.imgur.com/t7nP5Bv.png",
    floor: "https://i.imgur.com/KovnIuV.png"

}
//NEW:
let keys = {} // 1.- para detección de teclas (listeners) 
let pipes = []

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
    isTouching = (item) => {
        return    (this.x < item.x + item.width) &&
                    (this.x + this.width > item.x) &&
                    (this.y < item.y + item.height) &&
                    (this.y + this.height > item.y);
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
bird.jumpStrength = 3
bird.animation = 1
bird.changeImg = function () {
    if (this.animation === 3) this.animation = 1
    else if (frames % 13 === 0) this.animation++
    switch (this.animation) {
        case 1:
            return ctx.drawImage(test, 0, 0, 175, 120, this.x, this.y, this.width, this.height)
        case 2:
            return ctx.drawImage(test, 170, 0, 175, 120, this.x, this.y, this.width, this.height)
        case 3:
            return ctx.drawImage(test, 340, 0, 175, 120, this.x, this.y, this.width, this.height)
    }
}
bird.move = function () { // AGREGAR FRICCIÓN -- SOLO POR EXPERIMENTO en el eje X
    if (this.y < 50) return
    if (keys[32] || keys[38]) { // haaa así se usan los datos de la izquierda del objeto
        this.y-- // levantarlo del piso un poquito
        this.vy = 0 // esto lo desacelera es detenerlo
        this.vy += -this.jumpStrength * 2 // - aceleración a la inversa!!
    }
}
bird.draw = function () {
    //NEW
    this.move()

    if ((this.y + this.height) < floor.y) {
        this.y += this.vy
         this.vy += gravity  // acelaración
    } else {
        this.vy = 0
        this.y = floor.y - this.height
    }
    this.changeImg()
    //ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
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
    // generate & draw pipes
    if(frames%200===0) generatePipes()
    drawPipes()
    // si no esta en update no esta
    checkCollition()
}
function stop() {
    clearInterval(interval)
}  // pause, stop, partial stop (bg, flappy)

// aux functions

// EL CORAZON DEL JUEGO:
function generatePipes(){
   // 1 generar la de arriba
   // 2 generar la de abajo
   // 3 deben permitir la entrada al pajaro -- ((alturaTotal - gap) - random = pipe2) 
   // 4.- TAREA min y max de alturas
    //    let alturas = [90,30,50,100]
    let gap = 150
    let minHeight = 80
    let randomHeight = Math.floor(
        Math.random() * (canvas.height - floor.height - gap - minHeight) + minHeight
        )
    let height2 = (canvas.height - floor.height - randomHeight - gap)
    let pipe1 = new GameObject({
        x:canvas.width-100,
        y:0,
        width:100,
        height:randomHeight,
        image:images.pipe1
    })
    pipes.push(pipe1)
    let pipe2 = new GameObject({
        x:canvas.width-100,
        y:randomHeight+gap,
        width:100,
        height:height2,
        image:images.pipe2
    })
    pipes.push(pipe2)
}

function drawPipes(){
    pipes.forEach(pipe=>{
        pipe.x--
        pipe.draw()
    })
}

function checkCollition(){
    pipes.forEach(pipe=>{
       if(pipe.isTouching(bird)) stop()
    })
}

// listeners
addEventListener('keydown', e => { // 2.- guardamos en tiempo real que tecla se presiona
    keys[e.keyCode] = true // keys = { 32:true } // obj = {"bliss":true, "karen":true, "fabi"} -- {name:"bliss"}
})

addEventListener('keyup', e => {
    keys[e.keyCode] = false // keys = { 32:false }
    // delete keys[e.keyCode]
})

setTimeout(start,3000)

// 1.- pantallas de bienvenida y gameover
// 2.- sumar puntuacion (contar el tiempo) | (contar cuantos gaps pasas)
// 3.- Arreglar la altura del pipe de abajo que nunca sea 0
// 4.- investigar la fuerza del brinco, gap, distancia entre pipes, todo lo original
// 5.- Html + Canvas (position) con el score y el boton de reset