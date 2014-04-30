var Corner = cc.Node.extend({
	
	ctor: function( point ) {
		this._super();

		this.x = point.x;
		this.y = point.y;
	},

	isFree: function() {
		// console.log( this.map.getPositionY() )
		return ! Corner.map.isBlock( Math.floor( ( this.x - Corner.map.getPositionX() ) / 120 ) , Math.floor( ( this.y - Corner.map.getPositionY() ) / 120 ) );
	},

});

Corner.map = null;