var PatrolMonster = Monster.extend({

	ctor: function( size ) {
		this._super( size );
	},

	update: function() {
		var beforeWalk = this.getPositionX();
		this.calculateNextPosition();
		this.applyNextPosition();
		var afterWalk = this.getPositionX();
		if ( beforeWalk == afterWalk ) {

			if ( Math.random() < 0.5 ) {
				this.goLeft();
			} else {
				this.goRight();
			}
			
			// if ( this.canWalkTo( this.walkingSpeed ) ) {
			// 	this.goRight();
			// } else {
			// 	this.goLeft();
			// }

		}

	},


});