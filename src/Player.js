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
		// this.forceToJump = false;

		this.holdRight = false;
		this.holdLeft = false;

		this.vy = 0;
		this.vx = 0;

		this.nextX = 0;
		this.nextY = 0;

		this.setScale( 3 );
		this.PIXEL_SIZE = 120;

		this.MAX_HP = 500;
		this.MAX_SP = 180;
		this.hp = this.MAX_HP;
		this.sp = this.MAX_SP;

		this.aimOrders = [
			[ 1, 1, -45 ],
			[ 2, 1, -30],
			[ 1, 2, -80 ],
			[ 2, 2, -45 ],
			[ 3, 2, -30 ],
			[ 1, 3, -80 ],
			[ 2, 3, -50 ],
			[ 3, 3, -45 ],
			[ 1, 0, -0 ],
			[ 2, 0, -0 ],
			[ 3, 0, -0 ],
		];

		this.isAiming = false;

		this.aimedPixel = null;
		this.aimedBlockX = 0;
		this.aimedBlockY = 0;
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

		this.alertLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.alertLabel );
		this.alertLabel.setPosition( new cc.Point( 10, 50 ) );
		this.alertLabel.setString( "Not enough SP" );
		this.alertLabel.setColor( new cc.Color3B( 255, 255, 255 ) );
		this.alertLabel.enableStroke( new cc.Color3B( 100, 100, 100 ), 1 );
		
		this.crosshair = null;

		this.amountLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.amountLabel );
		this.amountLabel.setPosition( new cc.Point( 20, 50 ) );
		this.amountLabel.setColor( new cc.Color3B( 255, 255, 255 ) );
		this.amountLabel.setString( "+40" );
		this.amountLabel.enableStroke( new cc.Color3B( 100, 100, 100 ), 1 );

		this.sight = cc.Sprite.create ( 'images/sight.png' );
		this.sight.setPosition( new cc.Point( 10 , 30 ) );
		this.sight.setAnchorPoint( new cc.Point( -0.001 , 0.5 ) );
		this.addChild( this.sight );
		this.setFlippedX( true );

		this.isSightOn = true;
	},

	toggleSight: function() {
		if ( this.isSightOn ) {
			this.sight.setOpacity( 0 );
			this.isSightOn = false;
		} else {
			this.sight.setOpacity( 255 );
			this.isSightOn = true;
		}
	},

	setCrosshair: function( crosshair ) {
		this.crosshair = crosshair;
	},

	getCoordinate: function() {
		var position = this.getPosition();
		var blockX = this.convertPixelToBlock( position.x );
		var blockY = this.convertPixelToBlock( position.y );

		var pixelX = this.convertBlockToPixel( blockX );
		var pixelY = this.convertBlockToPixel( blockY );

		return new cc.Point( pixelX, pixelY );
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

	aimTarget: function( direction ) {
		// aim right = positive x-axis , 1
		// aim left = negative x-axis , -1
		for ( var i = 0; i < this.aimOrders.length; i++ ) {
	  	var aim = this.aimOrders[i];
	  	var aimPixelX = aim[ 0 ] * this.PIXEL_SIZE * direction + this.reducePixel( this.getPositionX() );
	  	var aimPixelY = aim[ 1 ] * this.PIXEL_SIZE + this.reducePixel( this.getPositionY() );

	  	this.aimedBlockX = this.convertPixelToBlock( aimPixelX );
	  	this.aimedBlockY = this.convertPixelToBlock( aimPixelY );

	  	if ( this.map.isAimable( this.aimedBlockX, this.aimedBlockY ) ) {
		    this.aimedPixel = new cc.Point( aimPixelX, aimPixelY );
		    this.crosshair.setPosition( this.aimedPixel ); 
		    this.isAiming = true;
		    if ( direction == -1 ) {
		    	this.sight.setRotation( 180 - aim[ 2 ] );
		    } else {
			    this.sight.setRotation( aim[2] );
		    }
	  		break;
	  	}
	  	this.crosshair.setPosition( new cc.Point( -1000, 0 ));
	    this.isAiming = false;
	    if ( direction == -1 ) {
		    this.sight.setRotation( -180 );
		  } else {
		  	this.sight.setRotation( -0 );
		  }

	  }
	},

	fireBomb: function() {

	},

	goRight: function() {
		this.holdRight = true;
		this.setFlippedX( true );

		this.goingRight = true; // need this: in case, did not keyup the left
		// BUT push right it will lag

		this.decreaseSpeedLeft = false;
		this.vx = Physics.WALKING_SPEED;

		this.aimTarget( 1 );

	},
	goLeft: function() {
		this.setFlippedX( false );
		this.holdLeft = true;

		this.goingLeft = true;
		this.decreaseSpeedRight = false;
		this.vx = -Physics.WALKING_SPEED;

		this.aimTarget( -1 );
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
			this.vy += Physics.G;
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
			this.vy = Physics.JUMPING_VELOCITY[ this.jumpStep ];
			this.increaseSP( -10 );
			this.jumpStep += 1;
		}
	},

	start: function() {
		this.started = true;
	},

	stop: function() {
		this.started = false;
	},

});