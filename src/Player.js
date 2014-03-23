var Player = cc.Sprite.extend({
	ctor: function() {
		this.started = false;
		this._super();
		this.canJump = true;
		this.map = null;

		this.jumpStep = 0;
		this.maxJump = 2;
		this.decreaseSpeedRight = false;
		this.decreaseSpeedLeft = false;

		this.goingRight = false;

		this.holdRight = false;
		this.holdLeft = false;

		this.vy = Player.STARTING_VELOCITY;
		this.vx = 0;

		this.nextX = 0;
		this.nextY = 0;

		this.setScale( 3 );

		this.MAX_HP = 500;
		this.MAX_SP = 180;
		this.hp = this.MAX_HP;
		this.sp = this.MAX_SP;

		this.healthBar = null;

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
		this.vx = Physics.WALKING_SPEED;
	},
	goLeft: function() {
		this.setFlippedX( false );
		this.holdLeft = true;

		this.goingLeft = true;
		decreaseSpeedRight = false;
		this.vx = -Physics.WALKING_SPEED;
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
		if ( isFloor == null ) {
			return Math.round( coordinate / 3 / 40 );
		}
		if ( isFloor ) {
			return Math.floor( coordinate / 3 / 40 );
		}

		return Math.ceil( coordinate / 3 / 40 );
	},

	convertBlockToPixel: function( coordinate ) {
		return coordinate * 3 * 40;
	},

	isInTheAir: function() {
		var posX = this.convertPixelToBlock( this.getPositionX(), false );
		var posY = this.convertPixelToBlock( this.getPositionY(), false ) - 1;
		return !this.map.isGround( posX, posY );
	},

	canFallTo: function( dt ) {
		var isFloor = dt < 0;
		var posX = this.convertPixelToBlock( this.getPositionX(), isFloor );
		var posY = this.convertPixelToBlock( this.getPositionY() + dt, isFloor );
		return !this.map.isGround( posX, posY );
	},

	canWalkTo: function( dt ) {
		var isFloor = dt < 0;
		var posX = this.convertPixelToBlock( this.getPositionX() + dt, isFloor );
		var posY = this.convertPixelToBlock( this.getPositionY(), isFloor );
		return !this.map.isGround( posX, posY );
	},
	checkKeyHolded: function() {
		if ( this.holdLeft && ( !this.holdRight ) ) {
			this.goLeft();
		}

		if ( this.holdRight && ( !this.holdLeft ) ) {
			this.goRight();
		}
	},
	applyGravity: function() {

		if ( !this.isInTheAir() ) { // on the ground
			this.jumpStep = 0;
		} else {
			this.vy += Player.G;
		}
	},

	checkWallCollision: function() {
		if ( this.canWalkTo( this.vx ) ) {
			this.nextX += this.vx;
		} else {
			// this.nextX = this.convertBlockToPixel( this.convertPixelToBlock(
			// this.getPositionX() , this.vx < 0) );
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
	applyFriction: function() {

		if ( this.decreaseSpeedRight && this.vx >= 0 ) {

			if ( this.isInTheAir() ) {
				this.vx -= Physics.AIR_FRICTION;
			} else {
				this.vx -= Physics.FLOOR_FRICTION;
			}
			if ( this.vx <= 0 ) {
				this.decreaseSpeedRight = false;
				this.vx = 0;
			}
		}

		if ( this.decreaseSpeedLeft && this.vx <= 0 ) {

			if ( this.isInTheAir() ) {
				this.vx += Physics.AIR_FRICTION;
			} else {
				this.vx += Physics.FLOOR_FRICTION;
			}

			if ( this.vx >= 0 ) {
				this.decreaseSpeedLeft = false;
				this.vx = 0;
			}
		}

	},
	update: function() {

		this.checkKeyHolded();

		this.applyFriction();

		this.checkWallCollision();

		this.checkFloorCollision();

		this.applyGravity();

		this.setPosition( new cc.Point( this.nextX, this.nextY ) );

	},
	jump: function() {

		if ( this.sp == 0 ) {
			this.alertLabel.dim( 255, 0, 8 );
			return 0;
		}

		if ( this.jumpStep < this.maxJump ) {

			this.vy = Physics.JUMPING_VELOCITY[this.jumpStep];
			if ( !this.isInTheAir() ) {
				this.setPositionY( this.getPositionY() + 120 );
			}

			this.increaseSP( -10 );

			this.jumpStep += 1;
		}
	},
	start: function() {
		this.started = true;
	},
	stop: function() {
		this.started = false;
	}
});

Player.STARTING_VELOCITY = 3;
Player.G = Physics.G;