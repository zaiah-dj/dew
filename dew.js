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

	return {

		//Generate a set of elements.
		debuggable: function () {
			me.debuggable = !me.debuggable; 
		}	

		//Traverse back and forth, with more terse, concise code. 
	, traverse: function (e) {

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
	, get: function ( st ) {

		}

		//Send values back to a server, based on a selector
	, post: function ( st ) {
			var tv={}, av=[], mv=[]; 
			var boundary = "------------------" + randStr( 31 );
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
			x.onreadystatechange = ( st.callback ) ? st.callback : function ( evt ) { 
				if ( this.readyState == 1 )
					console.log( evt, 'at ready state 1' );	
				if ( this.readyState == 2 )
					console.log( evt, 'at ready state 2' );	
				if ( this.readyState == 3 )
					console.log( evt, 'at ready state 3' );	
				if ( this.readyState == 4 ) {
					console.log( evt, x.responseText );
				}
			}

			//...
			st.method = (!st.method) ? "POST" : st.method;
			x.open( st.method, st.sendTo, false );

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
