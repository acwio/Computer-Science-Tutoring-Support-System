/*
	file:			app.js
	author:		alex c. williams
	desc:
	this file implements the functionality of the canvas, window dragging, and 
	event handling for each of the navigation buttons.
*/

var paintVar = 0;
// background canvas 
function makeWB(){
        // get the canvas element and its context
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        var sketchStyle = getComputedStyle(document.getElementById('wrapper'));
        canvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
        canvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);
	console.log("Sketch style: " + sketchStyle);
	
        var lastMouse = {x: 0, y: 0};

        // brush settings
	context.fillStyle = '#343434';
	context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = '#fff';

        // attach the mousedown, mousemove, mouseup event listeners.
        canvas.addEventListener('mousedown', function (e) {
            lastMouse = {
              x: e.pageX - this.offsetLeft,
              y: e.pageY - this.offsetTop
            };
            canvas.addEventListener('mousemove', move, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', move, false);
        }, false);

        function move(e) {
            var mouse = {
              x: e.pageX - this.offsetLeft,
              y: e.pageY - this.offsetTop
            };
            draw(lastMouse, mouse);
            lastMouse = mouse;
        }

        function draw(start, end, remote) {
		console.log("Drawing! ");
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.closePath();
            context.stroke();
            if ((! remote) && TogetherJS.running) {
                TogetherJS.send({type: "draw", start: start, end: end});
		console.log("Sending Draw");
            }
        }

        TogetherJS.hub.on("draw", function (msg) {
            draw(msg.start, msg.end, true);
        });

        TogetherJS.hub.on("togetherjs.hello", function () {
		console.log("Sending!");
            var image = canvas.toDataURL("image/png");
            TogetherJS.send({
              type: "init",
              image: image
            });
        });

        TogetherJS.hub.on("init", function (msg) {
            var image = new Image();
            image.src = msg.image;
            context.drawImage(image, 0, 0);
        });
};

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    var div = document.getElementById('communication');
  div.style.position = 'absolute';
  div.style.top = e.clientY+ 'px';
  div.style.left = e.clientX + 'px';
}

function mouseUp2()
{
    window.removeEventListener('mousemove', divMove2, true);
}

function mouseDown2(e){
  window.addEventListener('mousemove', divMove2, true);
}

function divMove2(e){
    var div = document.getElementById('wrapper2');
  div.style.position = 'absolute';
  div.style.top = e.clientY + 'px';
  div.style.left = e.clientX + 'px';
}

function toggleVideo(){
	if (document.getElementById('communication').style.visibility == 'visible'){
		document.getElementById('communication').style.visibility = 'hidden';
	}
	else{
		document.getElementById('communication').style.visibility = 'visible';
	}
}

function toggleEditor(){
	if (document.getElementById('wrapper2').style.visibility == 'visible'){
		document.getElementById('wrapper2').style.visibility = 'hidden';
		document.getElementById("editor").style.visibility = 'hidden';
	}
	else{
		document.getElementById('wrapper2').style.visibility = 'visible';
		document.getElementById("editor").style.visibility = 'visible';
	}
}

function saveProgram() {
   var editor = ace.edit('editor');
   var pgm_text = editor.getSession().getValue();
   var blob = new Blob([pgm_text], {type: "text/plain;charset=utf-8"});
   saveAs(blob, "main.cpp");
}

function eraseCanvas() {
	var canv = document.getElementById('myCanvas');
	canv.width = canv.width;
	var context = canv.getContext('2d');
	context.fillStyle = '#343434';
	context.fillRect(0, 0, canv.width, canv.height);
	
	context.strokeStyle='#fff';
	
}

function downloadCanvas(){
    var canvas = document.getElementById("myCanvas");
	
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
    
	window.location.href=image;
}

function togglePaint(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	if(paintVar == 0){
		context.strokeStyle = '#f00';
		console.log("Changing strokeStyle to #f00");
	}
	else if (paintVar == 1){
		context.strokeStyle = '#0f0';
		console.log("Changing strokeStyle to #0f0");
	}
	else if (paintVar == 2){
		context.strokeStyle = '#00f';
		console.log("Changing strokeStyle to #00f");
	}		
	else {
		context.strokeStyle = '#fff';
		console.log("Changing strokeStyle to #fff");
		paintVar = -1;
	}
	paintVar += 1;
}

function initiate(){
	/* enable listeners for dragging windows around */
	document.getElementById('communication').addEventListener('mousedown', mouseDown, false);
	window.addEventListener('mouseup', mouseUp, false);
	
	document.getElementById('wrapper2').addEventListener('mousedown', mouseDown2, false);
	window.addEventListener('mouseup', mouseUp2, false);	

	/* draw canvas */	
	makeWB();

	/* start listeners for each navbar button */
	var videobutton = document.getElementById('videobutton');
	videobutton.addEventListener('click', toggleVideo);
	var savebutton = document.getElementById('savebutton');
	savebutton.addEventListener('click', saveProgram);
	var erasebutton = document.getElementById('erasebutton');
	erasebutton.addEventListener('click', eraseCanvas);
	var drawbutton = document.getElementById('drawbutton');
	drawbutton.addEventListener('click', downloadCanvas);	
	var editorbutton = document.getElementById('editorbutton');
	editorbutton.addEventListener('click', toggleEditor);	
	var paintbutton = document.getElementById('paintbutton');
	paintbutton.addEventListener('click', togglePaint);
}
addEventListener('load', initiate);
