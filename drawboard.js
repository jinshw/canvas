/**
 * Created by Administrator on 2018/6/5.
 */
canvasWidth = document.body.clientWidth;
canvasHeight = 1000
var drawType = "" // 要画的形状：rect,cycle

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

var offCanvas = document.getElementById("offCanvas")
var offContext = offCanvas.getContext("2d")
canvas.width = canvasWidth
canvas.height = canvasHeight
offCanvas.width = canvasWidth
offCanvas.height = canvasHeight

// 鼠标坐标点转化为canvas上的点
function toCanvasXY(point) {
    var rectObject = canvas.getBoundingClientRect()
    return {x: point.x - rectObject.left, y: point.y - rectObject.top}
}

function getRectWH(startPoint, endPoint) {
    return {width: endPoint.x - startPoint.x, height: endPoint.y - startPoint.y}
}


var isDraw = false
var isMouseHoldDown = false
var rubberRadius = 20
var drawPenPoints = []
var startPoint = {x: -1, y: -1}, endPoint = {x: -1, y: -1}

window.onload = function () {
    var active = document.querySelector("li.active")
    drawType = active.getAttribute("data-type")

    //工具栏点击事件绑定
    var lis = document.querySelectorAll("#toolsBar>li")
    lis.forEach(function (value, index, array) {
        console.log(value, index, array, array[index])
        value.onclick = function (e) {
            for (var i = 0; i < array.length; i++) {
                array[i].className = ""
            }
            console.log(value)
            value.className = "active"
            drawType = value.getAttribute("data-type")
            if (drawType == "clear-canvas") {
                context.clearRect(0, 0, canvas.width, canvas.height)
            }
        }
    })

    // 字体保存或清除事件
    var wordText = document.querySelector("#wordText")
    var saveWord = document.querySelector("#wordSave")
    var clearWord = document.querySelector("#clearWord")

    saveWord.onclick = function (e) {
        console.log("saveWord...")
        var text = wordText.value.trim()
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        drawWord(text, startPoint)
    }
    wordText.onkeyup = function (e) {
        console.log("onchange....")
        var text = wordText.value.trim()
        drawWordToOffCanvas(text, startPoint)
    }
    clearWord.onclick = function (e) {
        wordText.value = ""
        var text = wordText.value.trim()
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        drawWord(text, startPoint)
    }

}


offCanvas.onmousedown = function (e) {
    isMouseHoldDown = true
    startPoint = toCanvasXY({x: e.clientX, y: e.clientY})
    if (drawType != "") {
        isDraw = true
    }
}
offCanvas.onmousemove = function (e) {
    if (isDraw) {
        drawGraphToOffCanvas(drawType, startPoint, {x: e.clientX, y: e.clientY})
    }
}

offCanvas.onmouseup = function (e) {
    isMouseHoldDown = false
    endPoint = toCanvasXY({x: e.clientX, y: e.clientY})
    // var rectWH = getRectWH(startPoint, endPoint)
    if (isDraw) {
        drawGraphToCanvas(drawType, startPoint, endPoint)
    }
    isDraw = false
    drawPenPoints = []
}
offCanvas.onmouseout = function (e) {
    isMouseHoldDown = false
    console.log("onmouseout........")
    isDraw = false
    drawPenPoints = []
    if (drawType != "draw-word") {
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
    }
}
offCanvas.onmo

function drawGraphToOffCanvas(drawType, point, endPoint) {
    var rectWH = getRectWH(startPoint, endPoint)
    // offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
    offContext.save()
    offContext.beginPath()
    // context.fillStyle = "#108997"
    if (drawType == "line") {
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        offContext.moveTo(startPoint.x, startPoint.y)
        offContext.lineTo(endPoint.x, endPoint.y)
    } else if (drawType == "rect") {
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        offContext.rect(point.x, point.y, rectWH.width, rectWH.height)
    } else if (drawType == "cycle") {
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        var cycleObj = getCycleAttribute(point, rectWH.width, rectWH.height)
        console.log(cycleObj)
        offContext.arc(cycleObj.x, cycleObj.y, Math.abs(cycleObj.r), 0, Math.PI * 2)
    } else if (drawType.split("-")[0] == "triangle") {
        offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
        var tPoints = getTrianglePoints(drawType, startPoint, endPoint)
        var p1 = tPoints[0]
        var p2 = tPoints[1]
        var p3 = tPoints[2]
        offContext.moveTo(p1.x, p1.y)
        offContext.lineTo(p2.x, p2.y)
        offContext.lineTo(p3.x, p3.y)
        offContext.lineTo(p1.x, p1.y)
    } else if (drawType.split("-")[0] == "drawpen") {
        offContext.lineJoin = "round"
        offContext.moveTo(startPoint.x, startPoint.y)
        offContext.lineTo(endPoint.x, endPoint.y)
        drawPenPoints.push(startPoint)
        drawPenPoints.push(endPoint)
        startPoint = endPoint
    } else if (drawType == "rubber") {
        var rubberTools = drawRubberToOffCanvas(endPoint)
        context.clearRect(rubberTools.x, rubberTools.y, rubberTools.sw, rubberTools.sh)
    }
    offContext.stroke()
    offContext.closePath()
    offContext.restore()
}

function drawGraphToCanvas(drawType, startPoint, endPoint) {
    offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
    var rectWH = getRectWH(startPoint, endPoint)
    if (drawType == "line") {
        drawLine(startPoint, endPoint)
    } else if (drawType == "rect") {
        drawRect(startPoint, rectWH.width, rectWH.height)
    } else if (drawType == "cycle") {
        drawCycleTools(startPoint, rectWH.width, rectWH.height)
    } else if (drawType.split("-")[0] == "triangle") {
        var tPoints = getTrianglePoints(drawType, startPoint, endPoint)
        var p1 = tPoints[0]
        var p2 = tPoints[1]
        var p3 = tPoints[2]
        drawTriangle(p1, p2, p3)
    } else if (drawType.split("-")[0] == "drawpen") {
        drawPen(drawPenPoints)
    } else if (drawType == "draw-word") {
        drawWordToOffCanvas("文字在这里显示...", startPoint)
    }
}

function drawRect(point, width, height) {
    context.save()
    context.beginPath()
    context.rect(point.x, point.y, width, height)
    context.stroke()
    context.closePath()
    context.restore()
}
function drawCycleTools(startPoint, width, height) {
    var cycleObj = getCycleAttribute(startPoint, width, height)
    drawCycle(cycleObj, cycleObj.r)
}

function getCycleAttribute(startPoint, width, height) {
    var cr = Math.min(width, height) / 2
    return {x: startPoint.x + cr, y: startPoint.y + cr, r: cr}

}
function drawCycle(point, r) {
    context.save()
    context.beginPath()
    // context.fillStyle = "#108997"
    context.arc(point.x, point.y, Math.abs(r), 0, Math.PI * 2)
    // context.fillRect(point.x, point.y, width, height)
    context.stroke()
    context.closePath()
    context.restore()
}

function drawLine(startPoint, endPoint) {
    context.save()
    context.beginPath()
    context.moveTo(startPoint.x, startPoint.y)
    context.lineTo(endPoint.x, endPoint.y)
    context.stroke()
    context.closePath()
    context.restore()
}
function drawTriangle(p1, p2, p3) {
    context.save()
    context.beginPath()
    context.moveTo(p1.x, p1.y)
    context.lineTo(p2.x, p2.y)
    context.lineTo(p3.x, p3.y)
    context.lineTo(p1.x, p1.y)
    context.stroke()
    context.closePath()
    context.restore()
}

function getTrianglePoints(type, startPoint, endPoint) {
    var p1, p2, p3
    if (type == "triangle-top") {
        var wlen = endPoint.x - startPoint.x
        p1 = {x: startPoint.x + wlen / 2, y: startPoint.y}
        p2 = {x: startPoint.x, y: endPoint.y}
        p3 = endPoint
    } else if (type == "triangle-bottom") {
        var wlen = endPoint.x - startPoint.x
        p1 = {x: endPoint.x - wlen / 2, y: endPoint.y}
        p2 = {x: endPoint.x, y: startPoint.y}
        p3 = startPoint
    } else if (type == "triangle-left") {
        var hlen = endPoint.y - startPoint.y
        p1 = {x: startPoint.x, y: endPoint.y - hlen / 2}
        p2 = {x: endPoint.x, y: startPoint.y}
        p3 = endPoint
    } else if (type == "triangle-right") {
        var hlen = endPoint.y - startPoint.y
        p1 = {x: endPoint.x, y: endPoint.y - hlen / 2}
        p2 = {x: startPoint.x, y: endPoint.y}
        p3 = startPoint
    }
    return [p1, p2, p3]
}
function drawPen(drawPenPoints) {
    for (var i = 0; i < drawPenPoints.length - 1; i++) {
        context.save()
        context.beginPath()
        context.lineJoin = "round"
        context.moveTo(drawPenPoints[i].x, drawPenPoints[i].y)
        context.lineTo(drawPenPoints[i + 1].x, drawPenPoints[i + 1].y)
        context.stroke()
        context.closePath()
        context.restore()
    }

}

function drawWord(text, point) {
    context.save()
    context.fillStyle = "red"
    context.font = "normal normal lighter 20px '微软雅黑'"
    context.textAlign = "left"
    context.shadowBlur = 0
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    context.shadowColor = "black"
    context.strokeText(text, point.x, point.y)
    context.fillText(text, point.x, point.y)
    context.restore()
}
function drawWordToOffCanvas(text, point) {
    offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
    offContext.fillStyle = "red"
    offContext.font = "normal normal lighter 20px '微软雅黑'"
    offContext.textAlign = "left"
    offContext.shadowBlur = 0
    offContext.shadowOffsetX = 0
    offContext.shadowOffsetY = 0
    offContext.shadowColor = "black"
    offContext.strokeText(text, point.x, point.y)
    offContext.fillText(text, point.x, point.y)
}

function drawRubberToOffCanvas(point) {
    offContext.clearRect(0, 0, offCanvas.width, offCanvas.height)
    var sx = point.x - rubberRadius
    var sy = point.y - rubberRadius
    // offContext.rect(sx, sy, 2 * rubberRadius, 2 * rubberRadius)
    offContext.fillStyle = "#3d443d"
    offContext.fillRect(sx, sy, 2 * rubberRadius, 2 * rubberRadius)
    return {x: sx, y: sy, sw: 2 * rubberRadius, sh: 2 * rubberRadius}
}