var Corner = cc.Node.extend({
	
	ctor: function( isOnFocus, point ) {
		this._super();

		this.x = point.x;
		this.y = point.y;

		this.isOnFocus = isOnFocus;
	},

	getBlockX: function() {
		if ( this.isOnFocus ) {
			return Math.floor( ( this.x - Corner.map.getPositionX() ) / BLOCK_PIXEL );
		}
		return Math.floor( ( this.x + Corner.shiftedLayer.getPositionX() ) / BLOCK_PIXEL ); 
	},

	getBlockY: function() {
		if ( this.isOnFocus ) {
			return Math.floor( ( this.y - Corner.map.getPositionY() ) / BLOCK_PIXEL );
		}
		return Math.floor( ( this.y + Corner.shiftedLayer.getPositionY() ) / BLOCK_PIXEL );
	},

	isFree: function() {
		return ! Corner.map.isBlock( this.getBlockX(), this.getBlockY() );
	},

	isAThing: function() {
		return Corner.map.isAThing( this.getBlockX(), this.getBlockY() );
	},

});

Corner.map = null;
Corner.shiftedLayer = null;