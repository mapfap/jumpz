var PatrolMonster = Monster.extend({

	ctor: function( size ) {
		this._super( size );
	},

	update: function() {
		var beforeWalk = this.getPositionX();
		this.applyAllForces();
		var afterWalk = this.getPositionX();
		if ( beforeWalk == afterWalk ) {
			if ( this.canWalkTo( this.walkingSpeed ) ) {
				this.goRight();
			} else {
				this.goLeft();
			}
		}

	},


});