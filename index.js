/* index.js


All of the examples for Dew in one place.

*/
<head>

<!-- Styles can go here for testing purposes -->
<style>
html {
	background-color: rgb(240,248,255);
}

footer {
	padding-top: 50px;
}

header {
	display: block;
	width: 96%;
	padding-left: 2%;
	padding-right: 2%;
	height: 50px;
	position: fixed;
	top: 0px;
	z-index: 99;
}

header div {
	float: left;
	width: 100px;
	left: -10px;
	top: 15px;
	font-weight: bold;
	font-style: italic;
	position: relative;
}

header ul {
	position: relative;
	float: right;
}

header ul li {
	padding: 0px;
	top: 0px;
	display: inline-block;
	margin-left: 10px;
}

header ul li a ,
header ul li a:visited {
	text-decoration: none;
	color: black;
}

header ul li a:hover {
	text-decoration: underline;
}

.container {
	background-color: white;
	padding: 100px;
	padding-right: 20px;
	padding-left: 20px;
	margin: 0 auto;
	width: 70%;
	min-width: 300px;
	top: 50px;
	position: relative;
}

.toc a {
	text-transform: capitalize;
}

p {
	font-size: 1.3em;
	font-family: "Times New Roman", serif;
}

pre {
	background-color: #ffffe0;
	color: black;
	font-size: 1.1em;
}

/*
//Maybe really small widths shouldn't show up at all
//Dew and some listeners can be used to selectively display pre code. 
@media screen and (max-width: 700px) {
	pre {
		font-size: 1.1em;
	}
}

@media screen and (max-width: 600px) {
	pre {
		font-size: 0.7em;
	}
}

@media screen and (max-width: 400px) {
	pre {
		font-size: 0.7em;
	}
}
*/

.start {
	text-align: center;
	width: 100%;
	height: 30%;
	position: relative;
}

.start h1 {
	position: relative;
	margin: 0 auto;
	top: 65%;
	font-size: 170px;
	text-align: center;
	letter-spacing: -0.12em;
}

@media screen and (max-width: 700px) {
	.start h1 {
		font-size: 130px;
	}
}

@media screen and (max-width: 600px) {
	.start h1 {
		font-size: 110px;
	}
}

@media screen and (max-width: 400px) {
	.start h1 {
		font-size: 80px;
	}
}


h2 {
	font-size: 3.0em;
	padding-top: 0px;
	margin-top: 120px;
	border-bottom: 3px solid black;
}

h3 {
	font-size: 2.5em;
}

h4 {
	font-size: 2.0em;
}

h5 {
	font-size: 1.4em;
}

h6 {
	font-size: 1.2em;
}

.glossary {
	display: block;
	width: 80%;
}
.glossary th {
	text-align: left;
}
.glossary td:nth-child(1) {
	width: 200px;
}
.glossary tr:nth-child(odd) {
	background-color: pink;
}
.glossary tr:nth-child(even) {
	background-color: red;
}

script {
	display: block;
}
</style>





<!-- Include dew. -->
<script src="dew.js"></script>
<script>
/*Playing with state*/
document.addEventListener( "DOMContentLoaded", function (ev) {
	//A simple, pure JS way to create a div and track state change.
	var a = function() {
		var state = { status:0 };
		return function () {
			//state
			var div = document.createElement( "div" );
			var p = document.createElement( "p" );
			var h3 = document.createElement( "h3" );
			h3.style = "color: red; font-size: 15px; font-weight: bold;";	
			var button = document.createElement( "button" );

			p.innerHTML = "John Salley is a good basketball player.";
			h2.innerHTML = "Title of This";
			button.innerHTML = "Click Me!";

			div.appendChild( h2 );
			div.appendChild( p );
			div.appendChild( button );

			var d = document.querySelector( ".stateTest" );
			d.appendChild( div );

			button.addEventListener( "click", function (ev) {
				state.status = !state.status;
				div.style.backgroundColor = state.status ? "red" : "blue"; 
			});
		}
	}

	//Using a closure, a's state is self contained...
	var b;
	(b = a())();

	//With dew, it's just not necessary. (and takes up less lines of code)
	document.querySelector( ".stateTest" ).appendChild( {
		div: {
			p: "John Salley is a good basketball player."
		, h2: { 
				innerHTML: "Title of This", 
			, style: "color: red; font-size: 15px; font-weight: bold;"
			}
		, button: {
				innerHTML: "Click Me!"
			, listeners: { click: function (ev,_) {
					_.self.style.backgroundColor = ( _.status = !_.status ) ? "red" : "blue";
				}}
			}
		}
	} );
});
</script>


<script>
/*Declarative Nodes*/
document.addEventListener( "DOMContentLoaded", function (ev) {

	//Declare a node.
	var el = {
		div: "simple text"
	}

	//Declare another node.
	var el1 = {
		div: { 
			innerHTML: "simple text"
		, listeners: {
				click: function () { console.log( "Element was clicked." ); }
			}
		}
	}

	//Declare yet another node.
	var el2 = {
		div: {
			children: [
				{ p: "Your mom" }
			, { h2: "Title" }
			, { button: "Your Mom" }
			]
		}
	}

	//Declare one more node.
	var el3 = {
		div: {
			p: "Your mom"
		, h2: "Title"
		, button: "Your Mom"
		}
	}

	//Declare one last node.
	var el4 = "div#mastermind";
	var el5 = "div.myClassName#mastermind";
	var el6 = "p.wisher";
	var el7 = "div.bob = Some random text can go here.";

	//Returns a node.
	var ee = [ el, el1, el2, el3 ];
	var d = [ dew.create( el ), dew.create( el1 ), dew.create( el2 ), dew.create( el3 ) ];
	//var d = [ dew.create( el4 ), dew.create( el5 ), dew.create( el6 ), dew.create( el7 ) ];
	for ( var n=0; n<d.length; n++ ) {
		document.getElementsByClassName( "generationTest" )[0].appendChild( d[n] );		
	}	

});
</script>

<script>
//Traversal
document.addEventListener( "DOMContentLoaded", function (ev) {
	//Use the element in the div.
	var d1 = document.querySelector( ".traversal .example1" );
	
	//Show something and modify something...
	//dew.traverse( d1, "@" );

	//Generate a new element and run on that too
	var d2 = {
		div: {
			p: "There is some much to say."
		, span: {
				className: "peter"
			, innerHTML: "Peter robbed Paul."
			} 
		}
	}

	//Show something and modify something...

	//Finally, try something that relies on a timeout
});
</script>

<script>
//XMLHttpRequest - GET
document.addEventListener( "DOMContentLoaded", function (ev) {
	//Find the element.
	var d = document.querySelector( ".xhrGetTest" );
	var a = function () { 0; }	

	//Add a button
	d.appendChild( dew.create( {
		div: {
			button: {
				innerHTML: "Click Me."
			, listeners: {
					click: function () {
						//dew.get does need a callback
						var t= dew.get( "http://ramarcollins.com", a ).responseText;
						//../div - Go back from where we currently are to div
						//@/div - Start at root (@) and div
						//@/div = t; 
					}
				}
			}
		, div: "" //Simple blank div
		}
	}));

	//Make requests and send them somewhere.
	//var d = dew.get( "http://ramarcollins.com", where );
});
</script>


<script>
//XMLHttpRequest - POST 
document.addEventListener( "DOMContentLoaded", function (ev) {
	//Make requests by sending data to server.
	var d = document.querySelector( "xhrGetTest" );
	//var d = dew.post( "http://ramarcollins.com", [] );
});
</script>


<script>
//Routing
document.addEventListener( "DOMContentLoaded", function (ev) {
	//Routing here
	var p = [];
});
</script>






<script>
//The app that tests all of the code on this page.
document.addEventListener( "DOMContentLoaded", function (ev) {
	//Find all of the script tags and put them in pre tags?
	var p = [].slice.call( document.getElementsByTagName( "script" ) );
	p = p.slice( 1, p.length - 1 );

	//For this first run, each pre tag is associated one of the scripts.
	var pre = [].slice.call(document.getElementsByTagName( "pre" ));
	for ( var i=0; i<p.length; i++ ) {
		pre[ i ].innerText = p[ i ].innerText;
	}	

	//All the pre code will be triggered by buttons that sit above the example.
	//...
	console.log( "STARTING LAST RUN OF CODE..." );
	var d1 = document.querySelector( ".traversal .example1" );
	dew.traverse( d1, "@" );
	//after a dew.create, this should be set...
	var d2 = document.querySelector( ".abovefooter" );
	d2.appendChild( dew.create({ 
		button: { 
			innerHTML: "Hi!"
		, listeners: { 
				click: function () { dew.traverse( "@" ); }
			}
		}
	}));
	//after an XHR call this should be set...
	//hmm, wonder what would happen when there is no root element 
});
</script>

</head>
