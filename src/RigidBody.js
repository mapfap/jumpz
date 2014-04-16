var RigidBody = cc.Sprite.extend({
	ctor: function() {
		this._super();

		this.vy = 0;
		this.vx = 0;

		this.nextX = 0;
		this.nextY = 0;

		this.decreaseSpeedRight = false;
		this.decreaseSpeedLeft = false;

		this.map = null;

		this.PIXEL_SIZE = 120;
		this.walkingSpeed = 0;
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
		var posY = this.convertPixelToBlock( this.getPositionY(), false ) - 1;
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
			this.map.walk( posX, posY );
		}
		return ! isGround ;
	},

	canWalkTo: function( dt ) {
		var isFloor = dt < 0;
		var posX = this.convertPixelToBlock( this.getPositionX() + dt, isFloor );
		var posY = this.convertPixelToBlock( this.getPositionY(), isFloor );
		// console.log( this.getPositionY() )
		return !this.map.isGround( posX, posY );
	},


	applyGravity: function() {
		if ( !this.isInTheAir() ) { // on the ground
			this.jumpStep = 0;
		} else {
			this.vy += PHYSICS.GRAVITY;
		}
	},

	checkWallCollision: function() {
		if ( this.canWalkTo( this.vx ) ) {
			this.nextX += this.vx;
		}
	},

	checkFloorCollision: function() {
		if ( this.canFallTo( this.vy ) ) {
			this.nextY += this.vy;
		} else {
			this.nextY = this.convertBlockToPixel( this.convertPixelToBlock( this
					.getPositionY(), this.vy < 0 ) );
		}
	},

	setPosition: function( point ) {
		this._super( point );
		this.nextX = point.x;
		this.nextY = point.y;
	},

	setMap: function( map ) {
		this.map = map;
	},

	applyFriction: function() {

		if ( this.decreaseSpeedRight && this.vx >= 0 ) {
			if ( this.isInTheAir() ) {
				this.vx -= PHYSICS.AIR_FRICTION;
			} else {
				this.vx -= PHYSICS.FLOOR_FRICTION;
			}

			if ( this.vx <= 0 ) {
				this.decreaseSpeedRight = false;
				this.vx = 0;
			}
		}

		if ( this.decreaseSpeedLeft && this.vx <= 0 ) {
			if ( this.isInTheAir() ) {
				this.vx += PHYSICS.AIR_FRICTION;
			} else {
				this.vx += PHYSICS.FLOOR_FRICTION;
			}

			if ( this.vx >= 0 ) {
				this.decreaseSpeedLeft = false;
				this.vx = 0;
			}
		}

	},

	applyAllForces: function() {
		this.applyFriction();
		this.checkWallCollision();
		this.checkFloorCollision();
		this.applyGravity();
		this.setPosition( new cc.Point( this.nextX, this.nextY ) );
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
		this.vx = this.walkingSpeed;
	},

	goLeft: function() {
		this.goingLeft = true;
		this.decreaseSpeedRight = false;
		this.setFlippedX( false );
		this.vx = -this.walkingSpeed;
	},


});