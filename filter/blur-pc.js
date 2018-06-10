var canvasHeight = 600
var canvasWidht = 800

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")
canvas.width = canvasWidht
canvas.height = canvasHeight

var img = new Image()
var radius = 50
var clippingRegion = {x: -1, y: -1, r: radius}
img.src = "1.jpg"
img.onload = function (e) {
    initCanvas()
}
function initCanvas() {
    clippingRegion = {
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: Math.random() * (canvas.height - 2 * radius) + radius,
        r: radius
    }
    draw(img, clippingRegion)
}
function setClippingRegion() {
    context.beginPath()
    context.arc(clippingRegion.x, clippingRegion.y, clippingRegion.r, 0, Math.PI * 2, false)
    context.clip()

}

function draw(img, clippingRegion) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    setClippingRegion(clippingRegion)
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    context.restore()
}

function show() {
    var theAnimation = setInterval(function () {
        console.log("theAnimation..")
        clippingRegion.r += 20
        if (clippingRegion.r > 2 * Math.max(canvas.width, canvas.height)) {
            clearInterval(theAnimation)
        }
        draw(img, clippingRegion)

    }, 30)

}

function reset() {
    // initCanvas()
    tempR = 2 * Math.min(canvas.width, canvas.height)

    // clippingRegion = {
    //     x: Math.random() * (canvas.width - 2 * radius) + radius,
    //     y: Math.random() * (canvas.height - 2 * radius) + radius,
    //     r: tempR
    // }
    clippingRegion = {
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: Math.random() * (canvas.height - 2 * radius) + radius,
    }
    var animation = setInterval(
        function () {

            context.clearRect(0, 0, canvas.width, canvas.height)
            context.save()
            // setClippingRegion(clippingRegion)
            context.beginPath()
            tempR -= 30
            if(tempR<radius){
                clearInterval(animation)
                tempR = radius
                clippingRegion.r = radius
            }

            context.arc(clippingRegion.x, clippingRegion.y, tempR, 0, Math.PI * 2, false)
            context.clip()
            context.drawImage(img, 0, 0, canvas.width, canvas.height)
            context.restore()
        }, 30
    )


}