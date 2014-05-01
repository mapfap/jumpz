var Corner = cc.Node.extend({
	
	ctor: function( point ) {
		this._super();

		this.x = point.x;
		this.y = point.y;
	},

	getBlockX: function() {
		return Math.floor( ( this.x - Corner.map.getPositionX() ) / 120 );
	},

	getBlockY: function() {
		return Math.floor( ( this.y - Corner.map.getPositionY() ) / 120 );
	},

	isFree: function() {
		return ! Corner.map.isBlock( this.getBlockX(), this.getBlockY() );
	},

	isAThing: function() {
		return Corner.map.isAThing( this.getBlockX(), this.getBlockY() );
	},

});

Corner.map = null;