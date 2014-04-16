var Player = RigidBody.extend({

	ctor: function() {
		this._super();

		this.walkingSpeed = 20;
		this.jumpingVelocity = [ 40, 50 ],

		this.canJump = true;
		this.jumpStep = 0;
		this.maxJump = 1;

		this.goingRight = false;
		this.goingLeft = false;

		this.holdRight = false;
		this.holdLeft = false;

		this.healthBar = null;
		this.crosshair = null;

		this.MAXIMUM_HEALTH_POINT = 500;
		this.MAXIMUM_STAMINA_POINT = 180;
		this.healthPoint = this.MAXIMUM_HEALTH_POINT;
		this.staminaPoint = this.MAXIMUM_STAMINA_POINT;

		this.initAnimation();
		this.initAimSystem();
		this.initLabel();
	},

	initAnimation: function() {
		this.setScale( 3 );

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
	},

	initAimSystem: function() {
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
		
		this.setFlippedX( true );
		this.isSightOn = true;

		this.sight = cc.Sprite.create ( 'images/sight.png' );
		this.sight.setPosition( new cc.Point( 10 , 30 ) );
		this.sight.setAnchorPoint( new cc.Point( -0.001 , 0.5 ) );
		this.addChild( this.sight );
	},

	initLabel: function() {
		this.alertLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.alertLabel );
		this.alertLabel.setPosition( new cc.Point( 10, 50 ) );
		this.alertLabel.setString( "Not enough SP" );
		this.alertLabel.setColor( new cc.Color3B( 255, 255, 255 ) );
		this.alertLabel.enableStroke( new cc.Color3B( 100, 100, 100 ), 1 );
		
		this.amountLabel = cc.DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.amountLabel );
		this.amountLabel.setPosition( new cc.Point( 20, 50 ) );
		this.amountLabel.setColor( new cc.Color3B( 255, 255, 255 ) );
		this.amountLabel.setString( "+40" );
		this.amountLabel.enableStroke( new cc.Color3B( 100, 100, 100 ), 1 );
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

	increaseSP: function( amount ) {
		this.staminaPoint += amount;
		if ( this.staminaPoint >= this.MAXIMUM_STAMINA_POINT ) {
			this.staminaPoint = this.MAXIMUM_STAMINA_POINT;
		}
		if ( this.staminaPoint <= 0 )
			this.staminaPoint = 0;
		this.healthBar.setSP( ( this.staminaPoint / this.MAXIMUM_STAMINA_POINT ) * 100 );
	},

	setHealthBar: function( healthBar ) {
		this.healthBar = healthBar;
		this.healthBar.setScale( 0.3 );
		this.healthBar.setPosition( -4, -14 );
		// this.healthBar.setPosition( -4, 45 );
		this.addChild( this.healthBar );
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

	goRight: function() {
		// this._super.goRight();
		RigidBody.prototype.goRight.call(this);
		this.holdRight = true;
		this.aimTarget( 1 );
	},

	goLeft: function() {
		RigidBody.prototype.goLeft.call(this);
		this.holdLeft = true;
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

	checkKeyHolded: function() {
		if ( this.holdLeft && ( !this.holdRight ) ) {
			this.goLeft();
		}

		if ( this.holdRight && ( !this.holdLeft ) ) {
			this.goRight();
		}
	},

	update: function() {
		this.checkKeyHolded();
		this.applyAllForces();
	},

	jump: function() {

		if ( this.staminaPoint == 0 ) {
			this.alertLabel.dim( 255, 0, 8 );
			return 0;
		}

		if ( this.jumpStep >= this.maxJump ) {
			return 0;
		}

		this.jumpStep += 1;
		this.increaseSP( -10 );
		this.setVelocityY(this.jumpingVelocity[ this.jumpStep ]);

	},

});