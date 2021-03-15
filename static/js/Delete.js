var canvas = document.getElementById('lienzo');
if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    if (ctx) {
        // opacidad 85%
        ctx.globalAlpha = 0.85;
        var arrastrar = false;
        var delta = new Object();

        function oMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return { // devuelve un objeto
                x: Math.round(evt.clientX - rect.left),
                y: Math.round(evt.clientY - rect.top)
            }
        }

        function dibujarUnaEstrella(R, color, X, Y) {
            var L = 5;
            var paso = 2;
            ctx.fillStyle = color;
            var estrella = L / paso
            var rad = (2 * Math.PI) / estrella;
            ctx.beginPath();
            for (var i = 0; i < L; i++) {
                x = X + R * Math.cos(rad * i);
                y = Y + R * Math.sin(rad * i);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        function dibujarLasEstrellas() {
            for (var i = 0; i < estrellasRy.length; i++) {
                dibujarUnaEstrella(estrellasRy[i].R, estrellasRy[i].color, estrellasRy[i].X, estrellasRy[i].Y);
            }
        }

        var estrellasRy = [{
            'X': 250,
            'Y': 210,
            'R': 100,
            'color': '#6ab150',
            'bool': false
        }, {
            'X': 350,
            'Y': 130,
            'R': 75,
            'color': '#ff8844',
            'bool': false
        }, {
            'X': 150,
            'Y': 100,
            'R': 50,
            'color': '#abcdef',
            'bool': false
        }];

        estrellasRy.sort(function (a, b) {
            return a.R - b.R
        })
        //console.log(estrellasRy);

        dibujarLasEstrellas();

        // mousedown ***************************
        canvas.addEventListener('mousedown', function (evt) {
            arrastrar = true;
            //var first = 0;
            var mousePos = oMousePos(canvas, evt);

            for (var i = 0; i < estrellasRy.length; i++) {
                dibujarUnaEstrella(estrellasRy[i].R, estrellasRy[i].color, estrellasRy[i].X, estrellasRy[i].Y);

                if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
                    estrellasRy[i].bool = true;
                    delta.x = estrellasRy[i].X - mousePos.x;
                    delta.y = estrellasRy[i].Y - mousePos.y;
                    break;
                } else {
                    estrellasRy[i].bool = false;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dibujarLasEstrellas();
        }, false);

        // mousemove ***************************
        canvas.addEventListener('mousemove', function (evt) {
            if (arrastrar) {
                var mousePos = oMousePos(canvas, evt);
                for (var i = 0; i < estrellasRy.length; i++) {
                    if (estrellasRy[i].bool) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        X = mousePos.x + delta.x, Y = mousePos.y + delta.y
                        estrellasRy[i].X = X;
                        estrellasRy[i].Y = Y;
                        break;
                    }
                }
                dibujarLasEstrellas();
            }
        }, false);

        // mouseup ***************************
        canvas.addEventListener('mouseup', function (evt) {
            arrastrar = false;
            for (var i = 0; i < estrellasRy.length; i++) {
                estrellasRy[i].bool = false
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dibujarLasEstrellas();
        }, false);

        // mouseout  ***************************
        canvas.addEventListener('mouseout', function (evt) {
            arrastrar = false;
            for (var i = 0; i < estrellasRy.length; i++) {
                estrellasRy[i].bool = false
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dibujarLasEstrellas();
        }, false);
    }
}


/*contorno
ctx.lineWidth=5;//tamaño
ctx.strokeStyle="

//Dibuja un circulo
ctx.beginPath();//nuevo camino
ctx.arc(80, 60, 50, 0, 2 * Math.PI);
ctx.fillStyle = "#48ef65";//colorea
ctx.fill();
// Matriz de transformación
ctx.translate(80, 60);
ctx.rotate(210 * -Math.PI / 180);
ctx.translate(-80, -60);
// rectángulo rotado
ctx.fillStyle = "#ee161c";
ctx.fillRect(80, 60, 50, 2);

//detecta la posición del ratón en el <canvas> y devuelve un objeto con las coordinadas x e y de este.
function oMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {// devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

ctx.beginPath();

ctx.arc(80, 60, 50, 0, 2 * Math.PI);
ctx.fillStyle = "#1fc117";
ctx.fill();

ctx.translate(80, 60);
ctx.rotate((Math.PI / 180) * 25);
ctx.fillStyle = "#ff0319";
ctx.fillRect(0, 0, 50, 2);
ctx.rotate((-Math.PI / 180) * 25);
ctx.translate(-80, -60);


ctx.beginPath();

ctx.arc(300, 60, 50, 0, 2 * Math.PI);
ctx.fillStyle = "#1fc117";
ctx.fill();

ctx.translate(300, 60);
ctx.rotate((Math.PI / 180) * 0);
ctx.fillStyle = "#ff0319";
ctx.fillRect(0, 0, 50, 2);

*/

// canvas related vars
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;


// used to calc canvas position relative to window
function reOffset() {
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
}

var offsetX, offsetY;
reOffset();
window.onscroll = function (e) {
    reOffset();
}
window.onresize = function (e) {
    reOffset();
}
canvas.onresize = function (e) {
    reOffset();
}

// save relevant information about shapes drawn on the canvas
var shapes = [];
// define one circle and save it in the shapes[] array
shapes.push({x: 30, y: 30, radius: 15, color: 'blue'});

// drag related vars
var isDragging = false;
var startX, startY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;

// draw the shapes on the canvas
drawAll();

// listen for mouse events
canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;
canvas.onmouseout = handleMouseOut;

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx, my, shape) {
    if (shape.radius) {
        // this is a circle
        var dx = mx - shape.x;
        var dy = my - shape.y;
        // math test to see if mouse is inside circle
        if (dx * dx + dy * dy < shape.radius * shape.radius) {
            // yes, mouse is inside this circle
            return (true);
        }
    } else if (shape.width) {
        // this is a rectangle
        var rLeft = shape.x;
        var rRight = shape.x + shape.width;
        var rTop = shape.y;
        var rBott = shape.y + shape.height;
        // math test to see if mouse is inside rectangle
        if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
            return (true);
        }
    }
    // the mouse isn't in any of the shapes
    return (false);
}

function handleMouseDown(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for (var i = 0; i < shapes.length; i++) {
        if (isMouseInShape(startX, startY, shapes[i])) {
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex = i;
            // set the isDragging flag
            isDragging = true;
            // and return (==stop looking for
            //     further shapes under the mouse)
            return;
        }
    }
}

function handleMouseUp(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}

function handleMouseOut(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}

function handleMouseMove(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    // move the selected shape by the drag distance
    var selectedShape = shapes[selectedShapeIndex];
    selectedShape.x += dx;
    selectedShape.y += dy;
    // clear the canvas and redraw all shapes
    drawAll();
    // update the starting drag position (== the current mouse position)
    startX = mouseX;
    startY = mouseY;
}

// clear the canvas and
// redraw all shapes in their current positions
function drawAll() {
    ctx.clearRect(0, 0, cw, ch);
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.radius) {
            // it's a circle
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.fillStyle = shape.color;
            ctx.fill();
        }
    }
}

function addCircle() {
    shapes.push({x: 30, y: 30, radius: 15, color: 'green'});
    drawAll();
    alert("Robot añadido")
}

function deleteCircle() {
    shapes.pop();
    drawAll();
    alert("Robot borrado");
}
