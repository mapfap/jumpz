var PatrolMonster = Monster.extend({

	ctor: function( isOnFocus, size ) {
		this._super( isOnFocus, size );
		this.maxRadius = 10 + BLOCK_PIXEL;
		this.radius = 0;
		this.speed = 3;
		this.isGoUp = true;

	},

	update: function() {
		
		if ( this.isGoUp ) {
			this.setPositionY( this.getPositionY() + this.speed );
			this.radius += this.speed;
		} else {
			this.setPositionY( this.getPositionY() - this.speed );
			this.radius -= this.speed;
		}

		if ( this.radius > this.maxRadius || this.radius < 0 ) {
			this.isGoUp = !this.isGoUp
		}
	},

});
