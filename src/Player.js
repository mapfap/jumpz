var Player = RigidBody.extend({

	ctor: function() {
		this._super();

		this.accumulatedX = 0;
		this.accumulatedY = 0;

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
		this.flash = null;

		this.MAXIMUM_HEALTH_POINT = 500;
		this.MAXIMUM_STAMINA_POINT = 180;
		this.healthPoint = this.MAXIMUM_HEALTH_POINT;
		this.staminaPoint = this.MAXIMUM_STAMINA_POINT;

		this.initAnimation();
		this.initAimingSystem();
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

	initAimingSystem: function() {
		this.aimOrders = [
			[ 1, 1, -45 ],
			[ 2, 1, -30],
			[ 1, 2, -75 ],
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
		this.amountLabel.setString( "+10" );
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

	increaseStaminaPoint: function( amount ) {
		this.staminaPoint += amount;
		if ( this.staminaPoint >= this.MAXIMUM_STAMINA_POINT ) {
			this.staminaPoint = this.MAXIMUM_STAMINA_POINT;
		}
		if ( this.staminaPoint <= 0 )
			this.staminaPoint = 0;
		this.healthBar.setStaminaPointBarLength( ( this.staminaPoint / this.MAXIMUM_STAMINA_POINT ) * 100 );
	},

	increaseHealthPoint: function( amount ) {
		this.healthPoint += amount;
		if ( this.healthPoint >= this.MAXIMUM_HEALTH_POINT ) {
			this.healthPoint = this.MAXIMUM_HEALTH_POINT;
		}
		if ( this.healthPoint <= 0 )
			this.healthPoint = 0;
		this.healthBar.setHealthPointBarLength( ( this.healthPoint / this.MAXIMUM_HEALTH_POINT ) * 100 );
	},

	isStaminaPointEmpty: function() {
		return this.staminaPoint == 0;
	},

	setHealthBar: function( healthBar ) {
		this.healthBar = healthBar;
		this.healthBar.setScale( 0.3 );
		this.healthBar.setPosition( -4, -14 );
		// this.healthBar.setPosition( -4, 45 );
		this.addChild( this.healthBar );
	},

	setFlash: function( flash ) {
		this.flash = flash;
	},

	aimTarget: function() {
		for ( var i = 0; i < this.aimOrders.length; i++ ) {
	  	var aim = this.aimOrders[i];
	  	var aimPixelX = aim[ 0 ] * this.PIXEL_SIZE * this.headingDirection + this.reducePixel( this.getPositionX() );
	  	var aimPixelY = aim[ 1 ] * this.PIXEL_SIZE + this.reducePixel( this.getPositionY() );

	  	this.aimedBlockX = this.convertPixelToBlock( aimPixelX );
	  	this.aimedBlockY = this.convertPixelToBlock( aimPixelY );

	  	if ( this.map.isAimable( this.aimedBlockX, this.aimedBlockY ) ) {
		    this.aimedPixel = new cc.Point( aimPixelX + this.map.getPositionX() , aimPixelY + this.map.getPositionY() );
		    this.crosshair.setPosition( this.aimedPixel ); 
		    this.isAiming = true;
		    if ( this.headingDirection == RigidBody.DIRECTION.LEFT ) {
		    	this.sight.setRotation( 180 - aim[ 2 ] );
		    } else {
			    this.sight.setRotation( aim[2] );
		    }
	  		break;
	  	}
	  	this.crosshair.setPosition( new cc.Point( -1000, 0 ));
	    this.isAiming = false;
	    if ( this.headingDirection == RigidBody.DIRECTION.LEFT ) {
		    this.sight.setRotation( -180 );
		  } else {
		  	this.sight.setRotation( -0 );
		  }

	  }
	},

	dragBlock: function() {
		if ( this.isStaminaPointEmpty() ) {
			this.player.alertLabel.dim( 255, 0, 8 );
			return 0;
		}

		if ( this.isAiming ) {
			this.increaseStaminaPoint( -2 );
			this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
			this.map.dragBlock( this.aimedBlockX, this.aimedBlockY, this.headingDirection );
			this.isAiming = false;

			// this.fallingBlock = cc.Sprite.create( 'images/blocks/bone.png' );
			// this.fallingBlock.setAnchorPoint( cc.p( 0, 0 ) );
			// this.fallingBlock.setPosition( this.aimedPixel );
			// this.getParent().addChild( this.fallingBlock, 20 );
			// var fallAction = cc.MoveTo.create( 0.5, new cc.Point( this.aimedPixel.x , this.aimedPixel.y - 20 ) );
			// console.log( fallAction );
			// this.runAction( fallAction );
		}
	},

	goRight: function() {
		RigidBody.prototype.goRight.call(this);
		this.holdRight = true;
	},

	goLeft: function() {
		RigidBody.prototype.goLeft.call(this);
		this.holdLeft = true;
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
		this.aimTarget();
		this.checkKeyHolded();
		this.calculateNextPosition();

		if ( this.nextPositionX >= RIGHT_FOCUS_BOUND ) {
			var over = this.nextPositionX - RIGHT_FOCUS_BOUND;
			this.nextPositionX = RIGHT_FOCUS_BOUND;
			
			this.map.setPositionX( this.map.getPositionX() - over );
			// this.getParent().monster.setPositionX( this.getParent().monster.getPositionX() - over );

			// console.log( this.map.getPositionX())
			if ( this.map.getPositionX() <= -120 ) {
				this.map.shiftMap( 0, 1 );
				this.map.setPositionX( 0 );
				this.accumulatedX += 120;
			}

		} else if ( this.nextPositionX <= LEFT_FOCUS_BOUND ) {
			var over = this.nextPositionX - LEFT_FOCUS_BOUND;
			this.nextPositionX = LEFT_FOCUS_BOUND;

			this.map.setPositionX( this.map.getPositionX() - over );
			// this.getParent().monster.setPositionX( this.getParent().monster.getPositionX() - over );

			if ( this.map.getPositionX() >= 120 ) {
				this.map.shiftMap( 0, -1 );
				this.map.setPositionX( 0 );
				this.accumulatedX -= 120;
			}
		}

		if ( this.nextPositionY >= UPPER_FOCUS_BOUND ) {
			var over = this.nextPositionY - UPPER_FOCUS_BOUND;
			this.nextPositionY = UPPER_FOCUS_BOUND;

			this.map.setPositionY( this.map.getPositionY() - over );
			// this.getParent().monster.setPositionY( this.getParent().monster.getPositionY() - over );

			if ( this.map.getPositionY() <= -120 ) {
				this.map.shiftMap( -1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY += 120;
			}
		} else if ( this.nextPositionY <= LOWER_FOCUS_BOUND ) {
			var over = this.nextPositionY - LOWER_FOCUS_BOUND;
			this.nextPositionY = LOWER_FOCUS_BOUND;

			// this.getParent().monster.setPositionY( this.getParent().monster.getPositionY() - over );
			this.map.setPositionY( this.map.getPositionY() - over );
			
			if ( this.map.getPositionY() >= 120 ) {
				this.map.shiftMap( 1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY -= 120;
			}
		}

		// console.log( this.nextPositionX );

		// var beforePosition = this.getPosition();
		this.setPosition( new cc.Point( this.nextPositionX, this.nextPositionY ) );
		// var afterPosition = this.getPosition();

		// this.accumulatedX += afterPosition.x - beforePosition.x;
		// this.accumulatedY += afterPosition.y - beforePosition.y;

		// console.log( this.getPositionX() );
		// if ( this.getPositionX() >= RIGHT_FOCUS_BOUND - 120 ) {
			// var compensatedPixel = this.getPositionX() - ( RIGHT_FOCUS_BOUND - 120 );
			// console.log( compensatedPixel );
			// this.getParent().shiftMap( 0, 1, 0 );
			// this.setPosition( new cc.Point( this.getPositionX() + compensatedPixel , this.getPositionY() ) );
		// }
	},

	jump: function() {

		if ( this.isStaminaPointEmpty() ) {
			this.alertLabel.dim( 255, 0, 8 );
			return 0;
		}

		if ( this.jumpStep >= this.maxJump ) {
			return 0;
		}

		this.jumpStep += 1;
		this.increaseStaminaPoint( -2 );
		this.setVelocityY(this.jumpingVelocity[ this.jumpStep ]);

	},

	takeDamage: function( direction ) {
		this.increaseHealthPoint( -150 );
		this.setVelocityX( 20 * direction );
		this.setVelocityY( 30 );
		this.scheduleOnce(function(){
			this.decreaseSpeedRight = true;
			this.decreaseSpeedLeft = true;
		}, 0.5);

		this.flash.setOpacity( 150 );
		this.scheduleOnce(function(){
			this.flash.setOpacity( 0 );
		}, 0.1 );
		
	},

});