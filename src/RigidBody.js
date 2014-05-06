var RigidBody = cc.Sprite.extend({
	ctor: function( isOnfocus ) {
		this._super();

		this.velocityY = 0;
		this.velocityX = 0;
		this.isOnfocus = isOnfocus;

		this.nextPositionX = 0;
		this.nextPositionY = 0;

		this.decreaseSpeedRight = false;
		this.decreaseSpeedLeft = false;

		this.map = null;
		this.allRigidBodies = null;

		// this.blockPixelWithOffset = BLOCK_PIXEL - 0;
		// console.log( this.offset.bottomRight.x )

		this.walkingSpeed = 0;

		this.headingDirection = RigidBody.DIRECTION.RIGHT;
		this.setFlippedX( true );
	},

	setShiftedLayer: function( shiftedLayer ) {
		this.shiftedLayer = shiftedLayer;
	},

	convertPixelToBlock: function( coordinate, isFloor ) {
		if ( isFloor === null ) {
			return Math.round( coordinate / BLOCK_PIXEL);
		}
		if ( isFloor ) {
			return Math.floor( coordinate / BLOCK_PIXEL);
		}

		return Math.ceil( coordinate / BLOCK_PIXEL);
	},

	convertBlockToPixel: function( coordinate ) {
		return coordinate * BLOCK_PIXEL;
	},

	reducePixel: function( coordinate ) {
		return this.convertBlockToPixel( this.convertPixelToBlock( coordinate ) );
	},

	isFlying: function() {
		var bottomLeftCorner = new Corner( this.isOnfocus, new cc.Point( this.getPositionX(), this.getPositionY() + this.velocityY ) , this.map );
		var bottomRightCorner = new Corner( this.isOnfocus, new cc.Point( this.getPositionX() + this.offset.bottomRight.x, this.getPositionY() + this.velocityY + this.offset.bottomRight.y ), this.map );
		return bottomLeftCorner.isFree() && bottomRightCorner.isFree();
	},

	isHitOtherRigidBodies: function( dt ) {
		// console.log( this.allRigidBodies );
		var thisPositionX = this.getPositionX() + dt;
		var thisPositionY = this.getPositionY();

		for ( var i = 0; i < this.allRigidBodies.length; i++ ) {
			var that = this.allRigidBodies[i];
			var thatPositionX = that.getPositionX();
			var thatPositionY = that.getPositionY();

			if ( Math.abs( thisPositionY - thatPositionY ) < BLOCK_PIXEL) {
				if ( Math.abs( thisPositionX - thatPositionX ) < BLOCK_PIXEL) {
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
		this.velocityY += PHYSICS.GRAVITY;
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
			if ( this.isFlying() ) {
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
			if ( this.isFlying() ) {
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

	checkLeftOrRightCollision: function( topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner ) {
		if ( this.velocityX < 0 ) {
			if ( topLeftCorner.isFree() && bottomLeftCorner.isFree() ) {
				this.nextPositionX += this.velocityX;
				this.map.touch( [ topLeftCorner, bottomLeftCorner ] );
				return;
			}
		} else if ( this.velocityX > 0 ) {
			if ( topRightCorner.isFree() && bottomRightCorner.isFree() ) {
				this.nextPositionX += this.velocityX;
				this.map.touch( [ topRightCorner, bottomRightCorner ] );
				return;
			}
		} else {
			return;
		}

		this.nextPositionX = this.getPositionX();
		this.velocityX = 0;
	},

	touchTheGround: function( bottomLeftCorner, bottomRightCorner ) {
		this.jumpStep = 0;
		this.map.touch( [ bottomLeftCorner, bottomRightCorner ] );
	},

	checkTopOrBottomCollision: function( topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner ) {
		if ( this.velocityY < 0 ) {
			if ( bottomLeftCorner.isFree() && bottomRightCorner.isFree() ) {
				this.nextPositionY += this.velocityY;
				this.map.touch( [ bottomLeftCorner, bottomRightCorner ] );
				return;
			} else {
				this.touchTheGround( bottomLeftCorner, bottomRightCorner );
			}
			
		} else if ( this.velocityY > 0 ) {
			if ( topLeftCorner.isFree() && topRightCorner.isFree() ) {
				this.nextPositionY += this.velocityY;
				this.map.touch( [ topLeftCorner, topRightCorner ] );
				return;
			}
		} else {
			return;
		}

		this.nextPositionY = this.getPositionY();
		this.velocityY = 0;

	},

	checkCollision: function() {
		var currentPositionX = this.getPositionX();
		var currentPositionY = this.getPositionY();
		var newPositionX = this.getPositionX() + this.velocityX;
		var newPositionY = this.getPositionY() + this.velocityY;

		// new X but, current Y 
		var topLeftCorner = new Corner( this.isOnfocus, new cc.Point( newPositionX + this.offset.topLeft.x, BLOCK_PIXEL + currentPositionY + this.offset.topLeft.y ) );
		var topRightCorner = new Corner( this.isOnfocus, new cc.Point( BLOCK_PIXEL + newPositionX + this.offset.topRight.x , BLOCK_PIXEL + currentPositionY + this.offset.topRight.y ) );
		var bottomLeftCorner = new Corner( this.isOnfocus, new cc.Point( newPositionX + this.offset.bottomLeft.x , currentPositionY + this.offset.bottomLeft.y ) );
		var bottomRightCorner = new Corner( this.isOnfocus, new cc.Point( BLOCK_PIXEL +  newPositionX + this.offset.bottomRight.x, currentPositionY + this.offset.bottomRight.y ) );
		this.checkLeftOrRightCollision( topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner );
		
		// new X and, new Y 
		var topLeftCorner = new Corner( this.isOnfocus, new cc.Point( currentPositionX + this.offset.topLeft.x, BLOCK_PIXEL + newPositionY + this.offset.topLeft.y ) );
		var topRightCorner = new Corner( this.isOnfocus, new cc.Point( BLOCK_PIXEL + currentPositionX + this.offset.topRight.x , BLOCK_PIXEL + newPositionY + this.offset.topRight.y ) );
		var bottomLeftCorner = new Corner( this.isOnfocus, new cc.Point( currentPositionX + this.offset.bottomLeft.x, newPositionY + this.offset.bottomLeft.y ) );
		var bottomRightCorner = new Corner( this.isOnfocus, new cc.Point( BLOCK_PIXEL + currentPositionX + this.offset.bottomRight.x, newPositionY + this.offset.bottomRight.y ) );
		this.checkTopOrBottomCollision( topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner );

	},

	calculateNextPosition: function( onFocus ) {
		this.applyGravity();
		this.applyFriction();
		this.checkCollision();
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