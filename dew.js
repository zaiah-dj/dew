/* ---------------------------------------------- *
 * dew.js
 * ======
 *
 * Summary
 * -------
 * See test.html for stuff. 
 *  
 *  
 * Author 
 * ------
 * ramar@tubularmodular.com
 * 
 * ---------------------------------------------- */

dew = (function () {

	//state for just dew
	var me = {
		debuggable: 0
	};

	//private: print formatted string 
	function printf ( srcstr ) {
		if ( arguments.length > 1 ) {
			for ( var i = 1; i < arguments.length; i ++ ) {
				srcstr = srcstr.replace( "$" + i, arguments[ i ] );
			}
		}
		return srcstr;
	}


	//private: log things
	function log ( str ) {
		if ( me.debuggable ) {
			console.log( str );
		} 
	}

	//Traverse back and forth, with more terse, concise code. 
  function traverse(e) {

	}

	return {

		//Generate a set of elements.
		debuggable: function () {
			me.debuggable = !me.debuggable; 
		}	

	, router: function (args) {
			var local = {};

			if ( !args ) {
				return;
			}

			//Only for development
			local.dev = 1;

			//Verbose
			local.verbose = args.verbose || 0;

			//Split the URL	
			local.locationArray = location.href.split( "/" ) ;

			//Get the user's current location within the application.
			local.currentLocation = ( local.locationArray[ local.locationArray.length - 1 ] == "" ) 
				? "/" : local.locationArray[ local.locationArray.length - 1 ];

			//Check for routes in args
			local.routes = args.routes || {};

			//local development stuff
			if ( local.dev ) {
			}	
			
			return {
				init: function ( ) {
					//Loop through the elements in the route specified.
					//	( VERBOSE ) ? console.log( "Loading handlers for route '" + loc + "'" ) : 0;
					for ( r in local.routes ) {
						if ( local.currentLocation.indexOf( r ) > -1 ) {
							for ( t in local.routes[ r ] ) {
								tt = local.routes[ r ][ t ];
								try {
									//Find the DOM elements This call will only fail if the syntax of the selector was wrong.
									//TODO: Would it be helpful to let the dev know that this has occurred and on which index?
									dom = [].slice.call( document.querySelectorAll( tt.domSelector ) );
									( local.verbose ) ? console.log( "Binding to '" + tt.domSelector + "'.  Element references below:" ) : 0;
									( local.verbose ) ? console.log( dom ) : 0;
								}
								catch ( e ) {
									//TODO: Handle SYNTAX_ERR using e.name 
									console.log( e.message );
								}
							
								//Apply attributes first
								//TODO: This is a bad idea because removal needs to also work. 
								//There's another key and subsequently an overcomplicated data structure.
								if ( tt.attr ) {
									//handle strings and common things like 'required' or 'checked'
									for ( d in dom ) {
										for ( key in tt.attr ) {
											( local.verbose ) ? console.log( "Setting key '" + key + "' to '" + tt.attr[ key ] + "'" + " on element " + tt.domSelector + "(" + d + ")"  ) : 0;
											dom[d].setAttribute( key, tt.attr[ key ] );
										} 	
									} 	
								}

								//Bind function(s) to event
								if ( typeof tt.f === 'function' && typeof tt.event === 'string' ) {
									( local.verbose ) ? console.log( "Binding single function " + tt.f.name + " \n\n" ) : 0;
									for ( d in dom ) { 
										( local.verbose ) ? dom[ d ].addEventListener( tt.event, (function(fname) { f = fname; return function(ev){console.log("Calling " + f); }})(tt.f.name) ) : 0;
										dom[ d ].addEventListener( tt.event, tt.f ); 
									}
								}
								else if ( typeof tt.f === 'object' && typeof tt.event === 'string' ) {
									( local.verbose ) ? console.log( "Binding multiple functions" ) : 0;
									for ( d in dom ) {
										for ( ff in tt.f ) {
											( local.verbose ) ? dom[d].addEventListener( tt.event, whatFunct.bind( null, tt.f[ff].name ) ) : 0;
											dom[d].addEventListener( tt.event, tt.f[ ff ] ); 
										}
									}
									( local.verbose ) ? console.log( "\n\n" ) : 0;
								}
							}
						}
					}
				}
			}
		}

		//Generate a set of elements.
	, create: function ( element ) {
			var node = null, children = [];
			const keys = ["class", "className","children","id","innerHTML","style","listeners"];
			//const keys = "class,className,children,id,innerHTML,style,listeners";

			//we CAN handle strings
			//div#id
			//div.class
			//div.class = something
			if ( typeof element == "string" ) {
				var tt = [];
				for ( var v, k=0, t = [ "#",".","=" ]; k<t.length; k++ )
					if (( v = element.indexOf( t[k] )) > -1 ) tt.push( { chr: t[k], pos: v } );

				//Do some chopping
				var y = tt.sort( function (a,b) { return a.pos - b.pos; } );
				//TODO: Trim the 'element'
				for ( var estr, q, r=0, jj=0; jj <= tt.length; jj++ ) { 
					q = ( tt[ jj ] !== undefined ) ? tt[ jj ] : { pos: element.length }; 
					if ( (estr = element.substr( r, q.pos - r ))[0] == '#' )
						node.id = estr.substr( 1, estr.length - 1 );
					else if ( estr[0] == '.' ) 
						node.className = estr.substr( 1, estr.length - 1 );
					else if ( estr[0] == '=' && estr[1] == ' ' )
						node.innerHTML = estr.substr( 2, estr.length - 2 );
					else if ( estr[0] == '=' )
						node.innerHTML = estr.substr( 1, estr.length - 1 );
					else {
						node = document.createElement( estr );		
					}
					r = q.pos;
				}
				return node;
			}
			else if ( typeof element == "object" ) {
				//Array	
				if ( element instanceof Array )	{
				}	
				//Object
				else {
					//the root element is the root element (node)
					for ( var k in element ) {
						log( printf( "$1 is $2", k, element[ k ] ) );

						//create the element
						var el = document.createElement( k );

						//if v is a simple value, its a text node.
						if ( typeof element[k] != 'object' ) {
							log( printf( "Setting $1 = '$2'", "el.innerHTML", element[ k ] ) );
							el.innerHTML = element[ k ];
						}

						else if ( element[k] instanceof Array )	{ 
							//likewise, if an array is applied and all the values are simple, it's probably a list...
						}

						else {
							if ( "class" in element[k] ) el.className = element[k]["class"]; 
							if ( "className" in element[k] ) el.className = element[k]["className"];
							if ( "id" in element[k] ) el.id = element[k]["id"];
							if ( "innerHTML" in element[k] ) el.innerHTML = element[k]["innerHTML"];
							//TODO: Double check this...
							if ( "style" in element[k] ) el.style = element[k]["style"]
							//Apply listeners... 
							if ( "listeners" in element[k] ) {
								var l = element[k]["listeners"];
								if ( typeof l == "object" && l instanceof Object ) {
									for ( var lf in l ) {
										log( printf( "Adding listener $1 to element: ", lf ) );
										if ( typeof l[lf] == 'function' )
											el.addEventListener( lf, l[lf] );
										else if ( typeof l[lf] == 'object' && l[lf] instanceof Array ) {
											for ( var ilf in l[lf] ) {
												if ( typeof l[lf] == 'function' ) {
													el.addEventListener( lf, l[lf][ilf] );
												}
											}
										}
									}
								}	
							}
							//children
							if ( "children" in element[k] ) {
								for ( var vv in element[k]["children"] ) {
									//children.push( this.create( element[k]["children"] ) );	
								}
							}
							//Unset each of these.
							for ( var key in keys ) {
								if ( keys[key] in element[k] ) {
									log( printf( "Deleting key '$1'", keys[key] ) );
									delete element[k][ keys[key] ];
								}
							}
							//TODO: If there are any elements left, run this on each of them. 
							for ( var key in element[k] ) {
								el.appendChild( this.create( { [ key ]: element[k][key] } ) );
							}
						}
						node = el;
					}
				}
			}
			return node;
		}


		//Generate random strings
	, rand: function ( length ) {
			/*
			function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
			*/
			const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var rS="";
			//rS += str[ getRandomInt(0, alphaStr.length) ];
			for (var n=0; n < length; n++) rS+=str[ Math.floor(Math.random() * n) ];
			return rS;
		}


		//Get something from HTTP request
	, get: function ( addr, st ) {
			var x = new XMLHttpRequest();
			x.onreadystatechange = ( st.callback ) ? st.callback : function () {;} 
			x.open( "GET", addr/*st.sendTo*/, false );
			/*
			if ( ! ("multipart" in st) )
				x.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
			else {
				x.setRequestHeader( 'Content-Type', "multipart/form-data; boundary=" + boundary );
				Vals += "\r\n--" + boundary + "--"; 
			}
			*/
			x.send();
		}

		//Send values back to a server, based on a selector
	, post: function ( addr, st ) {
			var tv={}, av=[], mv=[]; 
			var boundary = "------------------" + this.rand( 31 );
			//Define this here, but figure out something else.
			var packMsg = function ( k, v, mt, f ) {
				if ( !("multipart" in st) )
					return k + '=' + v;
				else {
					return [
						"--$BOUNDARY"
					, "Content-Disposition: form-data; name=$KEY$FILE"
					, "Content-Type: $MIMETYPE\r\n"
					, "$VALUE"
					].join( "\r\n" )
						.replace( "$BOUNDARY", boundary )
						.replace( "$KEY", k )
						.replace( "$FILE", !f ? "" : '; filename="'+f+'"' )
						.replace( "$MIMETYPE", !mt ? "text/plain" : mt )
						.replace( "$VALUE", v );
				}
			}

			//if selector is an array, then loop through these
			//Get all the values
			if ( st.selector )	{
				var v = [].slice.call(document.querySelectorAll( st.selector ));
				for ( var i=0; i<v.length; i++ ) mv.push( v[i] );
			}

			//loaded selector assumes the dev ran querySelectorAll elsewhere
			if ( st.loadedSelector ) {
				for ( var v in st.loadedSelector ) mv.push( v );
			}

			//TODO: Check if 'name', 'value' and 'type' are valid keys
			//TODO: Also check the type of 'rawText'...
			if ( st.rawText ) {
				var ap = (Array.isArray(st.rawText)) ? st.rawText : [ st.rawText ]; 
				ap.map( function (t) { mv.push( t ) } );
			}

			//Get all the additional values
			if ( st.extra ) {
				st.extra.forEach( function (el) { mv.push( el ); } );
			}

			//This simple loop is used to ensure I catch ALL form values, 
			//be they checkboxes or radios or not
			for (var i=0; i < mv.length; i++) { 
				var fName = mv[ i ].name ;
				var ftype = mv[ i ].type.toLowerCase();

				//Make sure to track the value of ALL form input types
				if ( ["radio","checkbox","select-multiple"].indexOf( ftype ) == -1 )
					av.push( packMsg( fName, mv[i].value, mv[i].mimetype || 0, mv[i].file || 0 ) );
				else { 
					//Get values and add it to the list of values
					if ( !tv[ fName ] ) {
						tv[ fName ] = true;
						var ivals = [];
						var sel = ( ftype != "select-multiple" ) ? "input[name=" + fName + "]" : "select[name=" + fName + "] option"; 
						var abc = [].slice.call( document.querySelectorAll( sel + ":checked" ) );
						abc.forEach( function(el) { ivals.push( el.value ) } );

						//av.push( fName + '=' + ivals.join( ',' ) ); 
						//av.push( packMsg( fName, ivals.join( ',' ) ) ); 
						av.push( packMsg( fName, ivals.join(','), mv[i].mimetype || 0, mv[i].file || 0 ) );
					}
				}
			}

			//Join and make a payload
			var Vals = av.join( ("multipart" in st) ? "\r\n" : "&" ); 
			//( cmsDebug ) ? console.log( Vals ) : 0;
			//( cmsDebug ) ? console.log( st.sendTo ) : 0;

			//Make XHR to server and you're done
			var x = new XMLHttpRequest();
			x.onreadystatechange = ( st.callback ) ? st.callback : function () { ; }; 

			//...
			st.method = (!st.method) ? "POST" : st.method;
			x.open( st.method, addr/*st.sendTo*/, false );

			if ( ! ("multipart" in st) )
				x.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
			else {
				x.setRequestHeader( 'Content-Type', "multipart/form-data; boundary=" + boundary );
				Vals += "\r\n--" + boundary + "--"; 
			}
			x.send(Vals);
		}

	}

})();
