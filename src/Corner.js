var Corner = cc.Node.extend({
	
	ctor: function( point, map ) {
		this._super();

		this.map = map
		this.x = point.x;
		this.y = point.y;
	},

	// setMap: function( map ) {
	// 	this.map = map;
	// },

	isFree: function() {
		// console.log( this.map.getPositionY() )
		return ! this.map.isGround( Math.floor( ( this.x - this.map.getPositionX() ) / 120 ) , Math.floor( ( this.y - this.map.getPositionY() ) / 120 ) );
	},

});

// Corner.map = null;