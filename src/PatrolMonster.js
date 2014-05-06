var PatrolMonster = Monster.extend({

	ctor: function( isOnFocus, size ) {
		this._super( isOnFocus, size );
	},

	update: function() {
		var beforeWalk = this.getPositionX();

		// console.log( this.getPositionY() + this.shiftedLayer.getPositionY() )

		this.calculateNextPosition();
		this.applyNextPosition();
		
		// this.velocityY += PHYSICS.GRAVITY;
		// this.applyGravity();
		// this.checkFloorCollision();
		// this.velocityY += -0.5;
		// var newPositionY = this.getPositionY() + this.velocityY;

		// if ( this.map. )
		// this.nextPositionY = newPositionY;
		

		
		var afterWalk = this.getPositionX();

		if ( beforeWalk == afterWalk ) {

			if ( Math.random() < 0.5 ) {
				this.goLeft();
			} else {
				this.goRight();
			}
		}
			
		// 	// if ( this.canWalkTo( this.walkingSpeed ) ) {
		// 	// 	this.goRight();
		// 	// } else {
		// 	// 	this.goLeft();
		// 	// }

		// }

	},

	// checkFloorCollision: function() {
	// 	var posX = Math.floor( this.getPositionX() - this. / BLOCK_PIXEL);
	// 	var posY = Math.floor( (this.getPositionY() + this.velocityY) / BLOCK_PIXEL);
	// 	var isBlock = this.map.isBlock( posX, posY );
	// 	// console.log( posX, posY );
	// 	if ( !isBlock ) {
	// 		this.nextPositionY += this.velocityY;
	// 	} else {
	// 		this.nextPositionY = this.getPositionY();
	// 	}
	// },

});