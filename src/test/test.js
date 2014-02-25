var assert = function( actual, expected, message ) {
    var msg = "";
 
    if ( actual === expected ) {
	msg = '<span style="color: green">OK</span>';
    } else {
	msg = '<span style="color: red; font-weight: bold">Failed:</span> ' + message;
    }
 
    var elt = document.getElementById( 'test-output' );
    elt.innerHTML += "<li>" + msg + "</li>";
};
 
assert( checkPlayerPillarCollision( 100, 100, 300, 200 ), false,
	'when the dot is very far left of the pillar pair' );
assert( checkPlayerPillarCollision( 300, 300, 300, 200 ), true,
	'when the dot hit the middle of the top pillar' );