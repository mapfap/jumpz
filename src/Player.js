var Player = RigidBody.extend({

	ctor: function( isOnFocus ) {
		this._super( isOnFocus );

		this.initStaticColor();
		this.dragUse = 0;
		this.totalCoin = 0;

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

		this.rightOffsetForAim = 0;
		this.yOffsettForAim = 0;

		this.offset = {

			bottomLeft: {
				x: 9,
				y: 0,
			},

			bottomRight: {
				x: -12,
				y: 0,
			},

			topRight: {
				x: -12,
				y: -30,
			},

			topLeft: {
				x: 15,
				y: -30,
			},

		};

		// this.schedule( this.energyDrain, 1 );
	},

	initStaticColor: function() {
		Player.COLOR.RED = new cc.Color3B( 255, 0, 0 );
		Player.COLOR.BLUE = new cc.Color3B( 0, 0, 255 );
		Player.COLOR.GREEN = new cc.Color3B( 0, 255, 0 );
		Player.COLOR.BLACK = new cc.Color3B( 0, 0, 0 );
		Player.COLOR.GRAY = new cc.Color3B( 100, 100, 100 );
		Player.COLOR.YELLOW = new cc.Color3B( 255, 255, 0 );
		Player.COLOR.WHITE = new cc.Color3B( 255, 255, 255 );

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
		this.map.setPlayerMarker( (this.getPositionX() / BLOCK_PIXEL - this.map.getPositionX() / BLOCK_PIXEL), ( this.getPositionY() / BLOCK_PIXEL - this.map.getPositionY() / BLOCK_PIXEL) );
	},

	showNextLevelPopup: function() {

		
		// console.log("-=------------=-=-")
		this.nextLevelLayer = new cc.LayerColor.create( new cc.Color4B( 0, 0, 0, 0 ) );
		this.nextLevelLayer.init();
		cc.AudioEngine.getInstance().playEffect( 'sounds/checkpoint.mp3');
		// this.nextLevelLayer.setOpacity( 0 );
		this.getParent().addChild( this.nextLevelLayer, 21 )
		
		this.nextLevelLabel = cc.LabelTTF.create( 'Level: ' + ( this.map.level ), 'Arial', 55 );
		this.nextLevelLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 80 ) );
		this.nextLevelLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.nextLevelLabel );

		this.coinResult = cc.LabelTTF.create( 'Coin collected: ' + ( this.map.collectedCoin ) + ' / ' + ( this.map.availableCoin ) , 'Arial', 18 );
		this.coinResult.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 25 ) );
		this.coinResult.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.coinResult );

		this.timeResult = cc.LabelTTF.create( 'Time used: ' + ( this.map.timeUsed ) + ' s.' , 'Arial', 18 );
		this.timeResult.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 5 ) );
		this.timeResult.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.timeResult );

		this.enterLabel = cc.LabelTTF.create( 'Enter to continue..', 'Arial', 30 );
		this.enterLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80 ) );
		this.enterLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.nextLevelLayer.addChild( this.enterLabel );


		this.map.collectedCoin = 0;
		this.getParent().state = GameLayer.STATE.STOPPED;
		this.unscheduleUpdate();
		// console.log( this.getParent().state );
	},

	initAnimation: function() {
		this.setScale( 3 * GLOBAL_SCALE );

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
		//[ x, y, theta ]
		this.aimOrders = [
			[ 1, 0, 0 ],
			[ 1, 1, -45 ],

			[ 2, 0, 0 ],
			[ 2, 1, -26 ],

			[ 1, 2, -64 ],
			[ 2, 2, -45 ],
			
			[ 3, 0, 0 ],
			[ 3, 1, -18 ],
		];

		this.isAiming = false;
		this.aimedPixelPoint = null;
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
		this.alertLabel.setColor( new cc.Color3B( 255, 10, 10 ) );
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
				cc.AudioEngine.getInstance().playEffect( 'sounds/alert.mp3');
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

	popup: function( text, color ) {
		var label = DimLabel.create( '0', 'Arial', 13 );
		this.shiftedLayer.addChild( label );
		// this.getParent().addChild( label, 100 );
		label.setScale( 3 );
		label.setPosition( new cc.Point( this.getPositionX() - this.shiftedLayer.getPositionX(), (this.getPositionY() + BLOCK_PIXEL) - this.shiftedLayer.getPositionY() ) );
		label.setColor( color );
		// label.enableStroke( color, 2 );
		// label.setColor( Player.COLOR.BLACK );
		label.enableStroke( Player.COLOR.BLACK, 2 );
		label.popup( text );
	},

	increaseEnergy: function( amount ) {
		text = amount;
		if ( amount > 0 ) {
			text = "+" + amount;
		}
		this.popup( text, Player.COLOR.BLUE );

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
		
	  	var currentPositionX = this.getPositionX();
	  	var currentPositionY = this.getPositionY();
	  	var currentPositionXReferToMap = currentPositionX - this.map.getPositionX();
	  	var currentPositionYReferToMap = currentPositionY - this.map.getPositionY();
	  	var currentBlockX = Math.floor( currentPositionXReferToMap / BLOCK_PIXEL );
	  	var currentBlockY = Math.floor( currentPositionYReferToMap / BLOCK_PIXEL );
		
		if ( this.headingDirection == RigidBody.DIRECTION.RIGHT) {
		  	currentPositionXReferToMap += BLOCK_PIXEL + this.rightOffsetForAim;
		}
	  	
		for ( var i = 0; i < this.aimOrders.length; i++ ) {
		  	var aim = this.aimOrders[i];

		  	this.aimedBlockX = currentBlockX + aim[ 0 ] * this.headingDirection;
		  	this.aimedBlockY = currentBlockY + aim[ 1 ];

		  	// console.log( this.map.isAimable( this.aimedBlockX, this.aimedBlockY ) )

		  	if ( this.map.isAimable( this.aimedBlockX, this.aimedBlockY ) ) {

			    this.isAiming = true;

			    var blockDirection = this.map.getBlockDirection( this.aimedBlockX, this.aimedBlockY, this.headingDirection );

			   	switch( blockDirection ) {
				case Player.BLOCK_DIRECTION.FALL:
					this.crosshair.setPosition( this.aimedBlockX * BLOCK_PIXEL + this.map.getPositionX(), this.aimedBlockY * BLOCK_PIXEL + this.map.getPositionY() );
			    	this.crosshair.setRotation( 0 );
					break;

				case Player.BLOCK_DIRECTION.SLIDE:
			    	if (  this.headingDirection == RigidBody.DIRECTION.LEFT ) {
						this.crosshair.setPosition( this.aimedBlockX * BLOCK_PIXEL + BLOCK_PIXEL + this.map.getPositionX(), this.aimedBlockY * BLOCK_PIXEL + this.map.getPositionY() );

			    		this.crosshair.setRotation( -90 );
			    	} else {
						this.crosshair.setPosition( this.aimedBlockX * BLOCK_PIXEL + this.map.getPositionX(), this.aimedBlockY * BLOCK_PIXEL + BLOCK_PIXEL + this.map.getPositionY() );
			    		this.crosshair.setRotation( 90 );
			    	}
					break;

				case Player.BLOCK_DIRECTION.NONE:
					this.noAiming();
					break;
			   	}
			   
			    if ( this.headingDirection == RigidBody.DIRECTION.LEFT ) {
			    	this.sight.setRotation( 180 - aim[ 2 ] );
			    } else {
				    this.sight.setRotation( aim[ 2 ] );
			    }
		  		
		  		return;
		  	}
		}

		this.noAiming();
	},

	noAiming: function() {
		this.crosshair.setPosition( new cc.Point( -1000, 0 ));
	    this.isAiming = false;
	    if ( this.headingDirection == RigidBody.DIRECTION.LEFT ) {
		    this.sight.setRotation( -180 );
		} else {
		  	this.sight.setRotation( -0 );
		}
	},

	dragBlock: function() {
		if ( this.isEnergyEmpty() ) {
			this.alertLabel.dim( Player.STRING.NEED_ENERGY );
			cc.AudioEngine.getInstance().playEffect( 'sounds/alert.mp3');
			return 0;
		}

		if ( ! this.isSightOn ) {
			// this.alertLabel.dim( Player.STRING.SIGHT_IS_OFF );
			this.toggleSight();
			return 0;
		}

		if ( this.isAiming ) {
			this.increaseEnergy( -10 );
			cc.AudioEngine.getInstance().playEffect( 'sounds/drag.mp3');
			this.dragUse += 1;
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

			if ( this.map.getPositionX() <= -BLOCK_PIXEL ) {
				this.map.shiftMap( 0, 1 );
				this.map.setPositionX( 0 );
				this.accumulatedX += BLOCK_PIXEL;
			}

		} else if ( this.nextPositionX <= LEFT_FOCUS_BOUND ) {
			var over = this.nextPositionX - LEFT_FOCUS_BOUND;
			this.nextPositionX = LEFT_FOCUS_BOUND;
			this.map.setPositionX( this.map.getPositionX() - over );

			if ( this.map.getPositionX() >= BLOCK_PIXEL ) {
				this.map.shiftMap( 0, -1 );
				this.map.setPositionX( 0 );
				this.accumulatedX -= BLOCK_PIXEL;
			}
		}

		if ( this.nextPositionY >= UPPER_FOCUS_BOUND ) {
			var over = this.nextPositionY - UPPER_FOCUS_BOUND;
			this.nextPositionY = UPPER_FOCUS_BOUND;
			this.map.setPositionY( this.map.getPositionY() - over );

			if ( this.map.getPositionY() <= -BLOCK_PIXEL ) {
				this.map.shiftMap( -1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY += BLOCK_PIXEL;
			}
		} else if ( this.nextPositionY <= LOWER_FOCUS_BOUND ) {
			var over = this.nextPositionY - LOWER_FOCUS_BOUND;
			this.nextPositionY = LOWER_FOCUS_BOUND;
			this.map.setPositionY( this.map.getPositionY() - over );
			
			if ( this.map.getPositionY() >= BLOCK_PIXEL ) {
				this.map.shiftMap( 1, 0 );
				this.map.setPositionY( 0 );
				this.accumulatedY -= BLOCK_PIXEL;
			}
		}
	},

	update: function() {
		this.checkKeyHolded();
		this.calculateNextPosition();
		this.handleMainFocus();
		this.applyNextPosition();
		this.aimTarget();
	},

	jump: function() {
		if ( this.jumpStep >= this.maxJump ) {
			return 0;
		}
		console.log("ps")
		cc.AudioEngine.getInstance().playEffect( 'sounds/jump.mp3');
		this.jumpStep += 1;
		this.jumpUse += 1;
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

	collectACoin: function() {
		this.popup( "$", Player.COLOR.YELLOW );
		this.totalCoin += 1;
		cc.AudioEngine.getInstance().playEffect( 'sounds/coin.mp3');
		this.getParent().showCollectedCoin();
	},

	buyEnergy: function() {
		if ( this.totalCoin == 0) {
			this.alertLabel.dim( Player.STRING.NEED_COIN );
			cc.AudioEngine.getInstance().playEffect( 'sounds/alert.mp3');
			return 0;
		}

		if ( this.energy == this.MAXIMUM_ENERGY ) {
			this.alertLabel.dim( Player.STRING.FULL );
			cc.AudioEngine.getInstance().playEffect( 'sounds/alert.mp3');
			return 0;
		}

		this.increaseEnergy( 1 );
		cc.AudioEngine.getInstance().playEffect( 'sounds/buy.mp3');
		this.totalCoin -= 1;
		this.getParent().showCollectedCoin();
	},

});

Player.COLOR = {
	RED: null,
	BLUE: null,
	GREEN: null,
	BLACK: null,
	GRAY: null,
	YELLOW: null,
	WHITE: null,
}

Player.BLOCK_DIRECTION = {
	NONE: 0,
	FALL: 1,
	SLIDE: 2,
}

Player.STRING = {
	FULL: "FULL !",
	NEED_COIN: "NEED COIN !",
	NEED_ENERGY: "NEED ENERGY !",
	// SIGHT_IS_OFF: "SIGHT IS OFF !",
}