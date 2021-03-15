var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext('2d');


var arrastrar = false;
var robots = [];

var valConGrados = document.getElementById('controlGrados');

//detecta la posición del ratón en el <canvas> y devuelve un objeto con las coordinadas x e y de este.
function oMousePos(canvas, evt) {


    var rect = canvas.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}

drawAllRobots();

function drawRobot(x, y, angulo) {

    ctx.beginPath();

    ctx.globalAlpha = 0.85;//opacidad al 0.88

    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#1fc117";
    ctx.fill();

    ctx.translate(x, y);
    ctx.rotate((-Math.PI / 180) * angulo); //Rota
    ctx.fillStyle = "#ff0319";
    ctx.fillRect(0, 0, 20, 2);
    ctx.rotate((Math.PI / 180) * angulo);
    ctx.translate(-x, -y);

}

canvas.addEventListener('mousedown', function (evt) {

    arrastrar = true;

    var mousePos = oMousePos(canvas, evt);


    for (var i = 0; i < robots.length; i++) {

        drawRobot(robots[i].x, robots[i].y, robots[i].direccion);

        if (ctx.isPointInPath(mousePos.x, mousePos.y)) {

            robots[i].move = true;

            break;
        } else {
            robots[i].move = false;
        }
    }

    for (var i = 0; i < robots.length; i++) {

        drawRobot(robots[i].x, robots[i].y, robots[i].direccion);

        if (ctx.isPointInPath(mousePos.x, mousePos.y)) {

            robots[i].select = true;

            valConGrados.value = robots[i].direccion;

        } else {
            robots[i].select = false;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllRobots();

}, false);

canvas.addEventListener('mousemove', function (evt) {

    var mousePos = oMousePos(canvas, evt);

    if (arrastrar) {

        for (var i = 0; i < robots.length; i++) {
            drawRobot(robots[i].x, robots[i].y, robots[i].direccion);

            if (robots[i].move) {

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                robots[i].x = mousePos.x;
                robots[i].y = mousePos.y;

                break;
            }
        }

        drawAllRobots();

    }

    if (mousePos.x < 5 || mousePos.y < 5 || mousePos.x > 995 || mousePos.y > 495) {
        arrastrar = false;


    }

}, false);

canvas.addEventListener('mouseup', function (evt) {

    arrastrar = false;

}, false);

function drawAllRobots() {

    for (var i = 0; i < robots.length; i++) {

        var x = robots[i].x;
        var y = robots[i].y;

        if (x < 20) {
            x = 20;
        } else if (x > 980) {
            x = 980;
        }
        if (y < 20) {
            y = 20;
        } else if (y > 480) {
            y = 480;
        }

        drawRobot(x, y, robots[i].direccion);

        if (robots[i].select) {
            ctx.strokeRect(x - 20, y - 20, 40, 40);
        }
    }
}

function Robots(x, y, colorRobot, colorLinea, direccion, move, name, select) {
    this.x = x;
    this.y = y;
    this.colorRobot = colorRobot;
    this.colorLinea = colorLinea;
    this.direccion = direccion;
    this.move = move;
    this.name = name;
    this.select = select;

    this.pointsX = [];
    this.pointsY = [];
}

function addRobot(x, y, name) {
     robots.push(new Robots(x, y, "#12345678", "#12345678", 0, false, name, false));
}


function updateAnguloRobot(grades) {
    for (var i = 0; i < robots.length; i++) {
        if (robots[i].select) {

            console.log("robot seleccionado " + robots[i].name + "--" + grades);

            robots[i].direccion = grades;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawAllRobots();
        }
    }
}

function savePos() {
    robots.forEach(robot => robot.pointsX.push(robot.x))
    robots.forEach(robot => robot.pointsY.push(robot.y))
     for(i=0; i<robots.length ; i++){
            console.log(robots[i]);
        }
}
function ajax(){
  var cordX;
  var cordY;
  var nRobots = robots.length;
    for(i = 0; i<robots.length; i++){
        cordX=robots[i].pointsX.toString();
        cordY=robots[i].pointsY.toString();
        console.log(cordX+"---"+cordY+" Dentro del for")
        $.ajax({
			url: '/dataFigure',
            data: {nBots:nRobots, posX:cordX, posY:cordY},
			type: 'POST',
			success: function(response){
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
    }
    console.log(cordX+"---"+cordY)
}
function show() {
    robots.forEach(function (robot, indice, array) {
         robot.pointsX.forEach(point => console.log("X="+point))
         robot.pointsY.forEach(point => console.log("Y="+point))
    })
    ajax();
}

//----------------------------------------------------------------------------------------------------------------------

function addNewRobot() {
    if (robots.length > 9) {
        alert("Error, no se pueden agregar mas robots");
    } else {
        addRobot(100, 50, robots.length);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAllRobots(robots);
    }
}

function deleteRobot() {
    if (robots.length == 0) {
        alert("Error, no se pueden quitar mas robots");
    } else {
        robots.pop();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllRobots();

}

function cambia() {
    console.log(valConGrados.value);

    updateAnguloRobot(valConGrados.value);
}

function joinTwoRobots() {
    ctx.beginPath();
    ctx.translate(0, .5);
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(230, 50);
    ctx.stroke();
}