"use strict";

var canvas;
var gl;
var program;

var theta = 0.0;
var thetaLoc;
var changedirection = true; // global initialization

var delay = 50;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var colorsForEachVertices = [];

    var myButton = document.getElementById("DirectionButton"); //toggle
    myButton.addEventListener("click", function() {
        changedirection = !changedirection;
    });

    var myButton1 = document.getElementById("SpeedUp"); //speed up
    myButton1.addEventListener("click", function() {
        delay /= 2.0;
    });

    var myButton2 = document.getElementById("Slow"); //slow down
    myButton2.addEventListener("click", function() {
        delay *= 2.0;
    });

    var myButtonForColor = document.getElementById("RandomColorChanging"); //color
    myButtonForColor.addEventListener("click", function() {
        colorChange(colorsForEachVertices);
    });

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [  //vertices of triangle
        vec2( 0,0.6),
        vec2( -0.519, -0.3),
        vec2( 0.519, -0.3)
    ];

    colorsForEachVertices = [];
    for (var i =0;i<9;i++){
        colorsForEachVertices.push(Math.random());//determine color of each vertex initially
    }

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsForEachVertices), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};

function colorChange(colorsForEachVertices) { //after push the color button,change color randomly for each vertex
    colorsForEachVertices=[];
    for (var i =0;i<9;i++){
        colorsForEachVertices.push(Math.random()); //for random color
    }
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsForEachVertices), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function render() { //draw triangle shape

    setTimeout(function() {
        requestAnimFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
        theta += (changedirection ? 0.1 : -0.1);  //for changing direction of shape
        gl.uniform1f(thetaLoc, theta);
        gl.drawArrays(gl.LINE_LOOP, 0, 3);
    }, delay);
}
