var Player = cc.Sprite.extend({
	
	ctor: function() {
		this.started = false;
		this._super();
		this.canJump = true;
		this.map = null;

		this.jumpingStep = 0;
		this.maxJump = 2;
		this.decreaseSpeedRight = false;
		this.decreaseSpeedLeft = false;

		this.goingRight = false;

		this.holdRight = false;
		this.holdLeft = false;

		this.velocityY = Player.STARTING_VELOCITY;
		this.velocityX = 0;

		this.nextX = 0;
		this.nextY = 0;

		this.setScale( 3 );

		this.MAX_HP = 500;
		this.MAX_SP = 180;
		this.hp = this.MAX_HP;
		this.sp = this.MAX_SP;

		this.healthBar = null;

		this.ENVIRONMENT = {
			GROUND: 0,
			AIR: 1,
		};

		this.touchingAbove = this.ENVIRONMENT.AIR;
		this.touchingBelow = this.ENVIRONMENT.AIR;
		this.touchingLeft = this.ENVIRONMENT.AIR;
		this.touchingRight = this.ENVIRONMENT.AIR;

		this.setAnchorPoint( new cc.Point( 0, 0 ) );
		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/poring0.png' );
		animation.addSpriteFrameWithFile( 'images/poring1.png' );
		animation.addSpriteFrameWithFile( 'images/poring2.png' );
		animation.addSpriteFrameWithFile( 'images/poring1.png' );
		animation.addSpriteFrameWithFile( 'images/poring0.png' );
		animation.setDelayPerUnit( 0.1 );

		// var movingAction = cc.Animate.create( animation );
		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.runAction( movingAction );

		// this.alertLabel = new DimLabel();//.create( '0', 'Arial', 13 );
		this.alertLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.alertLabel );
		this.alertLabel.setPosition( new cc.Point( 10, 50 ) );
		this.alertLabel.setString( "Not enough SP" );
		// this.alertLabel.setOpacity( 220 );
		// this.alertLabel.setString(this.alertLabel.getOpacity());

		this.amountLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.amountLabel );
		this.amountLabel.setPosition( new cc.Point( 20, 50 ) );
		this.amountLabel.setString( "+20" );
	},

	setPosition: function( point ) {
		this._super( point );
		this.nextX = point.x;
		this.nextY = point.y;
	},

	increaseSP: function( amount ) {
		this.sp += amount;
		if ( this.sp >= this.MAX_SP ) {
			this.sp = this.MAX_SP;
		}
		if ( this.sp <= 0 )
			this.sp = 0;
		this.healthBar.setSP( ( this.sp / this.MAX_SP ) * 100 );
	},

	setHealthBar: function( healthBar ) {
		this.healthBar = healthBar;
		this.healthBar.setScale( 0.3 );
		this.healthBar.setPosition( -4, -14 );
		// this.healthBar.setPosition( -4, 45 );
		this.addChild( this.healthBar );
	},

	setMap: function( map ) {
		this.map = map;
	},

	goRight: function() {
		this.holdRight = true;
		this.setFlippedX( true );

		this.goingRight = true; // need this: in case, did not keyup the left
		// BUT click right it will lag

		decreaseSpeedLeft = false;
		this.velocityX = Physics.WALKING_SPEED;
	},
	goLeft: function() {
		this.setFlippedX( false );
		this.holdLeft = true;

		this.goingLeft = true;
		decreaseSpeedRight = false;
		this.velocityX = -Physics.WALKING_SPEED;
	},

	stopRight: function() {

		this.holdRight = false;
		this.goingRight = false;
		if ( !this.goingLeft ) {
			this.decreaseSpeedRight = true;
		}
	},

	stopLeft: function() {

		this.holdLeft = false;
		this.goingLeft = false;
		if ( !this.goingRight ) {
			this.decreaseSpeedLeft = true;
		}
	},

	convertPixelToBlock: function( coordinate, isFloor ) {
		return Math.floor( coordinate / 3 / 40 );
		// if ( isFloor == null ) {
		// 	return Math.round( coordinate / 3 / 40 );
		// }
		// if ( isFloor ) {
		// 	return Math.floor( coordinate / 3 / 40 );
		// }

		// return Math.ceil( coordinate / 3 / 40 );
	},

	convertBlockToPixel: function( coordinate ) {
		return coordinate * 3 * 40;
	},

	reducePixel: function ( coordinate ) {
		this.convertBlockToPixel( this.convertPixelToBlock ( coordinate ) );
	},

	checkKeyHolded: function() {
		if ( this.holdLeft && ( !this.holdRight ) ) {
			this.goLeft();
		}

		if ( this.holdRight && ( !this.holdLeft ) ) {
			this.goRight();
		}
	},

	resetJumpingStep: function() {
		// if ( this.touchingBelow == this.ENVIRONMENT.GROUND ) {
		// 	this.jumpingStep = 0;
		// }
	},

	getCoordinate: function() {
		var position = this.getPosition();
		var blockX = this.convertPixelToBlock( position.x );
		var blockY = this.convertPixelToBlock( position.y );

		var pixelX = this.convertBlockToPixel( blockX );
		var pixelY = this.convertBlockToPixel( blockY );

		return new cc.Point( pixelX, pixelY );
	},

	getEnvironmentAt: function( blockX, blockY ) {
		if ( this.map.isGround( blockX, blockY ) ) {
			return this.ENVIRONMENT.GROUND;
		} else {
			return this.ENVIRONMENT.AIR;
		}
	},

	updateTouch: function() {
		var blockX = this.convertPixelToBlock( this.getPositionX() );
		var blockY = this.convertPixelToBlock( this.getPositionY() );

		var nextBlockX = this.convertPixelToBlock( this.nextX );
		var nextBlockY = this.convertPixelToBlock( this.nextY );

		this.canGoX = this.getEnvironmentAt( nextBlockX, blockY ) == this.ENVIRONMENT.AIR;
		this.canGoY = this.getEnvironmentAt( blockX, nextBlockY ) == this.ENVIRONMENT.AIR;

		this.minAvailableY = this.convertBlockToPixel( nextBlockY + 1 );
		this.maxAvailableY = this.convertBlockToPixel( nextBlockY - 1 );

		// this.touchingAbove = this.getEnvironmentAt( blockX, blockY + 1 );
		// this.touchingBelow = this.getEnvironmentAt( blockX, blockY - 1);
		// this.touchingLeft = this.getEnvironmentAt( blockX - 1, blockY );
		// this.touchingRight = this.getEnvironmentAt( blockX + 1, blockY );
	},

	applyFriction: function() {

		if ( this.decreaseSpeedRight && this.velocityX >= 0 ) {

			// if ( this.touchingBelow == this.ENVIRONMENT.AIR ) {
				// this.velocityX -= Physics.AIR_FRICTION;
			// } else {
				this.velocityX -= Physics.FLOOR_FRICTION;
			// }
			if ( this.velocityX <= 0 ) {
				this.decreaseSpeedRight = false;
				this.velocityX = 0;
			}
		}

		if ( this.decreaseSpeedLeft && this.velocityX <= 0 ) {

			// if ( this.touchingBelow == this.ENVIRONMENT.AIR ) {
				// this.velocityX += Physics.AIR_FRICTION;
			// } else {
				this.velocityX += Physics.FLOOR_FRICTION;
			// }

			if ( this.velocityX >= 0 ) {
				this.decreaseSpeedLeft = false;
				this.velocityX = 0;
			}
		}

	},

	update: function() {

		this.resetJumpingStep();
		this.checkKeyHolded();

		this.applyFriction();
		this.velocityY += Player.G;
		this.nextY = this.getPositionY() + this.velocityY;
		this.nextX = this.getPositionX() + this.velocityX;
		
		this.updateTouch();


		if ( ! this.canGoY ) { // must seperate too floor
 			// this.nextY = this.reducePixel( this.getPositionY() );
			if ( this.velocityY < 0) {
				this.nextY = this.getPositionY();
				// this.nextY = this.minAvailableY;
				this.jumpingStep = 0;
			} else {
	 			// this.nextY = this.maxAvailableY;
			}
			this.velocityY = 0;
		}

		if ( ! this.canGoX ) {
			if ( this.velocityX < 0) {
				this.nextX = this.getPositionX();
			} else {
				this.nextX = this.getPositionX() - 120;
			}
			this.velocityX = 0;
		}

			// console.log( this.nextY );	
		this.setPosition( new cc.Point( this.nextX, this.nextY ) );

	},

	jump: function() {

		if ( this.sp == 0 ) {
			this.alertLabel.dim( 255, 0, 8 );
			return 0;
		}

		if ( this.jumpingStep < this.maxJump ) {
			console.log("jump")

			this.velocityY = Physics.JUMPING_VELOCITY[this.jumpingStep];

			// this.increaseSP( -10 );

			this.jumpingStep += 1;
		}
	},

	start: function() {
		this.started = true;
	},

	stop: function() {
		this.started = false;
	},

});

Player.STARTING_VELOCITY = 3;
Player.G = Physics.G;