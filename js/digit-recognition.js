navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

let model;

var canvasWidth           	= 260;
var canvasHeight 			= 260;
var canvasStrokeStyle		= "white";
var canvasLineJoin			= "round";
var canvasLineWidth       	= 10;
var canvasBackgroundColor 	= "black";
var canvasId              	= "canvas";

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

var canvasBox = document.getElementById('canvas_box');
var canvas    = document.createElement("canvas");

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

ctx = canvas.getContext("2d");

$("#canvas").mousedown(function(e) {
	var rect = canvas.getBoundingClientRect();
	var mouseX = e.clientX- rect.left;;
	var mouseY = e.clientY- rect.top;
	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();
});

canvas.addEventListener("touchstart", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}

	var rect = canvas.getBoundingClientRect();
	var touch = e.touches[0];

	var mouseX = touch.clientX - rect.left;
	var mouseY = touch.clientY - rect.top;

	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();

}, false);


$("#canvas").mousemove(function(e) {
	if(drawing) {
		var rect = canvas.getBoundingClientRect();
		var mouseX = e.clientX- rect.left;;
		var mouseY = e.clientY- rect.top;
		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
});

canvas.addEventListener("touchmove", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	if(drawing) {
		var rect = canvas.getBoundingClientRect();
		var touch = e.touches[0];

		var mouseX = touch.clientX - rect.left;
		var mouseY = touch.clientY - rect.top;

		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
}, false);

$("#canvas").mouseup(function(e) {
	drawing = false;
});

canvas.addEventListener("touchend", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

$("#canvas").mouseleave(function(e) {
	drawing = false;
});

canvas.addEventListener("touchleave", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

function addUserGesture(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickD.push(dragging);
}

function drawOnCanvas() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.strokeStyle = canvasStrokeStyle;
	ctx.lineJoin    = canvasLineJoin;
	ctx.lineWidth   = canvasLineWidth;

	for (var i = 0; i < clickX.length; i++) {
		ctx.beginPath();
		if(clickD[i] && i) {
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			ctx.moveTo(clickX[i]-1, clickY[i]);
		}
		ctx.lineTo(clickX[i], clickY[i]);
		ctx.closePath();
		ctx.stroke();
	}
}

$("#clear-button").click(async function () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	clickX = new Array();
	clickY = new Array();
	clickD = new Array();
	$(".prediction-text").empty();
	$("#result_box").addClass('d-none');
});

async function loadModel() {
  model = undefined;
  model = await tf.loadLayersModel("models/model.json");
  }

loadModel();

function preprocessCanvas(image) {
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([28, 28])
		.mean(2)
		.expandDims(2)
		.expandDims()
		.toFloat();
	
	return tensor.div(255.0);
}

//--------------------------------------------
// predict function 
//--------------------------------------------
$("#predict-button").click(async function () {
    // get image data from canvas
	var imageData = canvas.toDataURL();

	// preprocess canvas
	let tensor = preprocessCanvas(canvas);
	// make predictions on the preprocessed image tensor
	let predictions = await model.predict(tensor).data();

	// get the model's prediction results
	let results = Array.from(predictions);
	
	
	display(results);

	
});


var ref = { 
	'0':   'A',
	'1':   'B',
	'2':   'C',
	'3':   'D',
	'4':   'E',
	'5':   'F',
	'6':   'G',
	'7':   'H',
	'8':   'I',
	'9':   'J',
	'10':  'K',
	'11':  'L',
	'12':  'M',
	'13':  'N',
	'14':  'O',
	'15':  'P',
	'16':  'Q',
	'17':  'R',
	'18':  'S',
	'19':  'T',
	'20':  'U',
	'21':  'V',
	'22':  'W',
	'23':  'X',
	'24':  'Y',
	'25':  'Z',
};

function morse(input) {  
  const        
     outputType = 'vibrate',
     dit = 200, 
     dah = dit * 2,
     symbolSpace = dit,
     letterSpace = dah,
     wordSpace = dit * 6,       
     morseChars = {
       "a"  : "·−",
       "b"  : "−···",
       "c"  : "−·−·",
       "d"  : "−··",
       "e"  : "·",
       "f"  : "··−·",
       "g"  : "−−·",
       "h"  : "····",
       "i"  : "··",
       "j"  : "·−−−",
       "k"  : "−·−",
       "l"  : "·−··",
       "m"  : "−−",
       "n"  : "−·",
       "o"  : "−−−",
       "p"  : "·−−·",
       "q"  : "−−·−",
       "r"  : "·−·",
       "s"  : "···",
       "t"  : "−",
       "u"  : "··−",
       "v"  : "···−",
       "w"  : "·−−",
       "x"  : "−··−",
       "y"  : "−·−−",
       "z"  : "−−··",
    };        
     
  function inputToMorse(input) {
     if (!input) {return;}
     const characters = input.toLowerCase().trim().split('');
     let output = [];
     characters.forEach(character => {
       if (morseChars[character]) {
         output.push(morseChars[character]);
       }
     });
     return output;
  }
   
  function morseCodeToTime(input) {
     let output = []; 
     let morseCode = inputToMorse(input);
     morseCode.forEach((set, index) => {
       let singleCharacters = set.split('');
       singleCharacters.forEach(char => {
         switch (char) {
           case "/":
             output.pop();
             output.push(wordSpace);
             break;
           case "·":
             output.push(dit, symbolSpace);
             break;
           case "−":
             output.push(dah, symbolSpace);
             break;
         }
       });
       if (output.slice(-1)[0] !== wordSpace) {
         output.pop();
         output.push(letterSpace);
       }
     });
     return output;
   }    
   
   function runSequence(input) {
     let timeSequence = morseCodeToTime(input);
     navigator.vibrate(timeSequence);       
   };
   runSequence(input);
};

function display(data) {
	var max = data[0];
    var maxIndex = 0;
    console.log(data)
    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
            ref[maxIndex];
            morse(ref[maxIndex]);
        }
    }
    activate();
    document.getElementById("snackbar").innerHTML = "Predicted"+ " " +ref[maxIndex]+ " " + "with"+ " " +Math.trunc( max*100 )+"% confidence";
}

	
