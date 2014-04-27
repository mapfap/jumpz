var RigidBody = cc.Sprite.extend({
	ctor: function() {
		this._super();

		this.velocityY = 0;
		this.velocityX = 0;

		this.nextPositionX = 0;
		this.nextPositionY = 0;

		this.decreaseSpeedRight = false;
		this.decreaseSpeedLeft = false;

		this.map = null;
		this.allRigidBodies = null;

		this.PIXEL_SIZE = 120;
		this.walkingSpeed = 0;

		this.headingDirection = RigidBody.DIRECTION.RIGHT;
		this.setFlippedX( true );
	},

	convertPixelToBlock: function( coordinate, isFloor ) {
		if ( isFloor === null ) {
			return Math.round( coordinate / this.PIXEL_SIZE );
		}
		if ( isFloor ) {
			return Math.floor( coordinate / this.PIXEL_SIZE );
		}

		return Math.ceil( coordinate / this.PIXEL_SIZE );
	},

	convertBlockToPixel: function( coordinate ) {
		return coordinate * this.PIXEL_SIZE;
	},

	isInTheAir: function() {
		var posX = this.convertPixelToBlock( this.getPositionX(), false );
		var posY = this.convertPixelToBlock( this.getPositionY(), true ) - 1;
		return !this.map.isGround( posX, posY );
	},

	reducePixel: function( coordinate ) {
		return this.convertBlockToPixel( this.convertPixelToBlock( coordinate ) );
	},

	canFallTo: function( dt ) {
		var isFloor = dt < 0;
		var posX = this.convertPixelToBlock( this.getPositionX(), isFloor );
		var posY = this.convertPixelToBlock( this.getPositionY() + dt, isFloor );
		var isGround = this.map.isGround( posX, posY );
		if ( isGround ) {
			this.map.touched( posX, posY );
		}
		return ! isGround ;
	},

	canWalkTo: function( dt ) {
		var isFloor = dt < 0;
		var posX = this.convertPixelToBlock( this.getPositionX() + dt, isFloor );
		var posY = this.convertPixelToBlock( this.getPositionY(), isFloor );
		// console.log( this.getPositionY() )
		// console.log( this.isHitOtherRigidBodies( dt ) )
		// console.log(this.isHitOtherRigidBodies( dt ));
		return !this.map.isGround( posX, posY ) && !this.isHitOtherRigidBodies( dt );
	},

	isHitOtherRigidBodies: function( dt ) {
		// console.log( this.allRigidBodies );
		var thisPositionX = this.getPositionX() + dt;
		var thisPositionY = this.getPositionY();

		for ( var i = 0; i < this.allRigidBodies.length; i++ ) {
			var that = this.allRigidBodies[i];
			var thatPositionX = that.getPositionX();
			var thatPositionY = that.getPositionY();

			if ( Math.abs( thisPositionY - thatPositionY ) < this.PIXEL_SIZE) {
				if ( Math.abs( thisPositionX - thatPositionX ) < this.PIXEL_SIZE) {
					if ( this !== that ) {
						if ( that instanceof Player ) {
							var direction = 1;
							if ( thisPositionX > thatPositionX ) {
								direction *= -1;
							}
							that.takeDamage( direction );
						}
						return true;
					}
				}
			}
		}
		return false;
	},

	applyGravity: function() {
		if ( !this.isInTheAir() ) { // on the ground
			this.jumpStep = 0;
		} else {
			this.velocityY += PHYSICS.GRAVITY;
		}
	},

	checkWallCollision: function() {
		if ( this.canWalkTo( this.velocityX ) ) {
			this.nextPositionX += this.velocityX;
		}
	},

	checkFloorCollision: function() {
		if ( this.canFallTo( this.velocityY ) ) {
			this.nextPositionY += this.velocityY;
		} else {
			this.nextPositionY = this.convertBlockToPixel( this.convertPixelToBlock( this
					.getPositionY(), this.velocityY < 0 ) );
		}
	},

	setPosition: function( point ) {
		this._super( point );
		this.nextPositionX = point.x;
		this.nextPositionY = point.y;
	},

	setMap: function( map ) {
		this.map = map;
	},

	setAllRigidBodies: function( allRigidBodies ) {
		this.allRigidBodies = allRigidBodies;
	},

	setVelocityY: function( velocity ) {
		this.velocityY = velocity;
	},

	setVelocityX: function( velocity ) {
		this.velocityX = velocity;
	},

	applyFriction: function() {

		if ( this.decreaseSpeedRight && this.velocityX >= 0 ) {
			if ( this.isInTheAir() ) {
				this.velocityX -= PHYSICS.AIR_FRICTION;
			} else {
				this.velocityX -= PHYSICS.FLOOR_FRICTION;
			}

			if ( this.velocityX <= 0 ) {
				this.decreaseSpeedRight = false;
				this.velocityX = 0;
			}
		}

		if ( this.decreaseSpeedLeft && this.velocityX <= 0 ) {
			if ( this.isInTheAir() ) {
				this.velocityX += PHYSICS.AIR_FRICTION;
			} else {
				this.velocityX += PHYSICS.FLOOR_FRICTION;
			}

			if ( this.velocityX >= 0 ) {
				this.decreaseSpeedLeft = false;
				this.velocityX = 0;
			}
		}

	},

	calculateNextPosition: function( onFocus ) {
		this.applyFriction();
		this.checkWallCollision();
		this.checkFloorCollision();
		this.applyGravity();
	},

	applyNextPosition: function() {
		this.setPosition( new cc.Point( this.nextPositionX, this.nextPositionY ) );
	},

	getCoordinate: function() {
		var position = this.getPosition();
		var blockX = this.convertPixelToBlock( position.x );
		var blockY = this.convertPixelToBlock( position.y );

		var pixelX = this.convertBlockToPixel( blockX );
		var pixelY = this.convertBlockToPixel( blockY );

		return new cc.Point( pixelX, pixelY );
	},

	goRight: function() {
		// need this: in case, did not keyup the left
		// BUT push right it will lag
		this.goingRight = true;
		this.decreaseSpeedLeft = false;
		this.setFlippedX( true );
		this.headingDirection = RigidBody.DIRECTION.RIGHT;
		this.velocityX = this.walkingSpeed;
	},

	goLeft: function() {
		this.goingLeft = true;
		this.decreaseSpeedRight = false;
		this.setFlippedX( false );
		this.headingDirection = RigidBody.DIRECTION.LEFT;
		this.velocityX = -this.walkingSpeed;
	},


});

RigidBody.DIRECTION = {
	LEFT: -1,
	RIGHT: 1,
}