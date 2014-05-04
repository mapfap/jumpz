var Player = RigidBody.extend({

	ctor: function() {
		this._super();

		this.energyDrainRate = -2; // per second

		this.accumulatedX = 0;
		this.accumulatedY = 0;

		this.walkingSpeed = 20;
		this.jumpingVelocity = [ 0, 50, 60, ];
		this.weakJumpVelocity = 0; 

		this.canJump = true;
		this.jumpStep = 0;
		this.maxJump = 2;

		this.goingRight = false;
		this.goingLeft = false;

		this.holdRight = false;
		this.holdLeft = false;

		this.statusBar = null;
		this.crosshair = null;
		this.flash = null;

		this.MAXIMUM_HEALTH = 500;
		this.MAXIMUM_ENERGY = 180;
		this.health = this.MAXIMUM_HEALTH;
		this.energy = this.MAXIMUM_ENERGY;

		this.initAnimation();
		this.initAimingSystem();
		this.initLabel();

		// this.schedule( this.energyDrain, 1 );
	},

	setMap: function( map ) {
		// this._super( map );
		this.map = map;
		this.setMarkerToMinimap();
	},

	setPosition: function( point ) {
		this._super( point );
		if ( this.map ) {
			this.setMarkerToMinimap();
		}
	},

	setMarkerToMinimap: function() {
		this.map.setPlayerMarker( (this.getPositionX() / 120 - this.map.getPositionX() / 120), ( this.getPositionY() / 120 - this.map.getPositionY() / 120) );
	},

	showNextLevelPopup: function() {
		// console.log("-=------------=-=-")
		this.nextLevelLayer = new cc.LayerColor.create( new cc.Color4B( 0, 0, 0, 0 ) );
		this.nextLevelLayer.init();
		// this.nextLevelLayer.setOpacity( 0 );
		this.getParent().addChild( this.nextLevelLayer, 21 )
		
		this.nextLevelLabel = cc.LabelTTF.create( 'Level: ' + ( this.map.level + 1 ), 'Arial', 60 );
		this.nextLevelLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 40 ) );
		this.nextLevelLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.nextLevelLabel );

		this.enterLabel = cc.LabelTTF.create( 'Enter to continue..', 'Arial', 30 );
		this.enterLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60 ) );
		this.enterLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.enterLabel );


		this.getParent().state = GameLayer.STATE.STOPPED;
		this.unscheduleUpdate();
		// console.log( this.getParent().state );
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

		this.sight = cc.Sprite.create( 'images/sight.png' );
		this.sight.setPosition( new cc.Point( 10 , 30 ) );
		this.sight.setAnchorPoint( new cc.Point( -0.001 , 0.5 ) );
		this.addChild( this.sight );
	},

	initLabel: function() {
		// console.log( DimLabel )
		// console.log( DimLabel.create )
		this.alertLabel = DimLabel.create( '0', 'Arial', 13 );
		this.addChild( this.alertLabel );
		this.alertLabel.setPosition( new cc.Point( 20, 50 ) );
		this.alertLabel.setColor( new cc.Color3B( 255, 255, 255 ) );
		this.alertLabel.enableStroke( new cc.Color3B( 100, 100, 100 ), 3 );
	},

	toggleSight: function() {

		if ( this.isSightOn ) {
			this.sight.setOpacity( 0 );
			this.crosshair.setOpacity( 0 );
			this.isSightOn = false;
		} else {

			if ( this.isEnergyEmpty() ) {
				this.alertLabel.dim( Player.STRING.NEED_ENERGY );
				return 0;
			}

			this.sight.setOpacity( 255 );
			this.crosshair.setOpacity( 255 );
			this.isSightOn = true;
		}
	},

	setCrosshair: function( crosshair ) {
		this.crosshair = crosshair;
	},

	setShiftedLayer: function( shiftedLayer ){
		this.shiftedLayer = shiftedLayer;
	},

	popup: function( text ) {
		var label = DimLabel.create( '0', 'Arial', 13 );
		this.shiftedLayer.addChild( label );
		// this.getParent().addChild( label, 100 );
		label.setScale( 3 );
		label.setPosition( new cc.Point( this.getPositionX() - this.shiftedLayer.getPositionX(), (this.getPositionY() + this.PIXEL_SIZE) - this.shiftedLayer.getPositionY() ) );
		label.setColor( new cc.Color3B( 255, 255, 255 ) );
		label.enableStroke( new cc.Color3B( 100, 100, 100 ), 3 );
		label.popup( text );
	},

	increaseEnergy: function( amount ) {
		text = amount;
		if ( amount > 0 ) {
			text = "+" + amount;
		}
		this.popup( text );

		this.energy += amount;
		if ( this.energy >= this.MAXIMUM_ENERGY ) {
			this.energy = this.MAXIMUM_ENERGY;
		}
		if ( this.energy <= 0 )
			this.energy = 0;
		this.statusBar.setEnergyBarLength( ( this.energy / this.MAXIMUM_ENERGY ) * 100 );
	},

	increaseHealth: function( amount ) {
		this.health += amount;
		if ( this.health >= this.MAXIMUM_HEALTH ) {
			this.health = this.MAXIMUM_HEALTH;
		}
		if ( this.health <= 0 )
			this.health = 0;
		this.statusBar.setHealthBarLength( ( this.health / this.MAXIMUM_HEALTH ) * 100 );
	},

	isEnergyEmpty: function() {
		return this.energy == 0;
	},

	setStatusBar: function( statusBar ) {
		this.statusBar = statusBar;
		this.statusBar.setScale( 0.3 );
		this.statusBar.setPosition( -4, -14 );
		this.addChild( this.statusBar );
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
		if ( this.isEnergyEmpty() ) {
			this.alertLabel.dim( Player.STRING.NEED_ENERGY );
			return 0;
		}

		if ( ! this.isSightOn ) {
			// this.alertLabel.dim( Player.STRING.SIGHT_IS_OFF );
			this.toggleSight();
			return 0;
		}

		if ( this.isAiming ) {
			this.increaseEnergy( -5 );
			this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
			this.map.dragBlock( this.aimedBlockX, this.aimedBlockY, this.headingDirection );
			this.isAiming = false;
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

	energyDrain: function() {
		if ( this.isSightOn ) {
			this.increaseEnergy( this.energyDrainRate );
			
			if ( this.isEnergyEmpty() ) {
				this.toggleSight();
			}
		}
	},

	handleMainFocus: function() {
		if ( this.nextPositionX >= RIGHT_FOCUS_BOUND ) {
			var over = this.nextPositionX - RIGHT_FOCUS_BOUND;
			this.nextPositionX = RIGHT_FOCUS_BOUND;
			this.map.setPositionX( this.map.getPositionX() - over );

			if ( this.map.getPositionX() <= -120 ) {
				this.map.shiftMap( 0, 1 );
				this.map.setPositionX( 0 );
				this.accumulatedX += 120;
			}

		} else if ( this.nextPositionX <= LEFT_FOCUS_BOUND ) {
			var over = this.nextPositionX - LEFT_FOCUS_BOUND;
			this.nextPositionX = LEFT_FOCUS_BOUND;
			this.map.setPositionX( this.map.getPositionX() - over );

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

			if ( this.map.getPositionY() <= -120 ) {
				this.map.shiftMap( -1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY += 120;
			}
		} else if ( this.nextPositionY <= LOWER_FOCUS_BOUND ) {
			var over = this.nextPositionY - LOWER_FOCUS_BOUND;
			this.nextPositionY = LOWER_FOCUS_BOUND;
			this.map.setPositionY( this.map.getPositionY() - over );
			
			if ( this.map.getPositionY() >= 120 ) {
				this.map.shiftMap( 1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY -= 120;
			}
		}
	},

	update: function() {
		this.aimTarget();
		this.checkKeyHolded();
		this.calculateNextPosition();
		this.handleMainFocus();
		this.applyNextPosition();
	},

	jump: function() {
		if ( this.jumpStep >= this.maxJump ) {
			return 0;
		}
		this.jumpStep += 1;
		this.setVelocityY( this.getJumpingVelocity( this.jumpStep ) );
	},

	getJumpingVelocity: function( jumpStep ) {
		if ( jumpStep < this.jumpingVelocity.length ) {
			return this.jumpingVelocity[ jumpStep ]
		}
		return this.weakJumpVelocity;
	},

	takeDamage: function( direction ) {
		this.increaseHealth( -150 );
		this.setVelocityX( 20 * direction );
		this.setVelocityY( 30 );
		this.scheduleOnce(function(){
			this.decreaseSpeedRight = true;
			this.decreaseSpeedLeft = true;
		}, 0.5);

		this.flashScreen( 0.1 );
		
	},

	flashScreen: function( time ) {
		this.flash.setOpacity( 150 );
		this.scheduleOnce(function(){
			this.flash.setOpacity( 0 );
		}, time );
	},

});

Player.STRING = {
	NEED_ENERGY: "NEED ENERGY !",
	SIGHT_IS_OFF: "SIGHT IS OFF !",
}