var Monster = cc.Sprite.extend({

	ctor: function( size ) {

		this._super();
		this.setScale( size );
		this.positionX = this.getPositionX();
		this.positionY = this.getPositionY();
		this.velocityX = 0;
		this.velocityY = 0;

		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/monsters/soul0.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul1.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul2.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul3.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul4.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul5.png' );
		animation.setDelayPerUnit( 0.15 );

		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.runAction( movingAction );

		this.ground = null;
		this.map = null;

	},

	update: function() {
		var currentPositionRect = this.getPlayerRect();

		this.updateYMovement();
		this.updateXMovement();

		var newPositionRect = this.getPlayerRect();
		this.handleCollision( currentPositionRect, newPositionRect );
		this.updateSpritePosition();

		// console.log(this.getPositionX())
		// console.log(this.getPositionY())
		// console.log("--------------");
	},

	updateXMovement: function() {
	// if ( this.ground ) {
	// if ( ( !this.moveLeft ) && ( !this.moveRight ) ) {
	// this.autoDeaccelerateX();
	// } else if ( this.moveRight ) {
	// this.accelerateX( 1 );
	// } else {
	// this.accelerateX( -1 );
	// }
	// }
	// this.positionX += this.vx;
	// if ( this.positionX < 0 ) {
	// this.positionX += screenWidth;
	// }
	// if ( this.positionX > screenWidth ) {
	// this.positionX -= screenWidth;
	// }
	},

	updateYMovement: function() {
		// console.log( this.ground )
		if ( this.ground ) {
			this.velocityY = 0;
			if ( this.jump ) {
				this.velocityY = this.jumpV;
				this.positionY = this.ground.getTopY() + this.velocityY;
				this.ground = null;
			}
		} else {
			this.velocityY += Physics.G;
			this.positionY += this.velocityY;
		}
	},

	getPlayerRect: function() {
		var spriteRect = this.getBoundingBoxToWorld();
		var spritePos = this.getPosition();

		var dX = this.positionX - spritePos.x;
		var dY = this.positionY - spritePos.y;
		return cc.rect( spriteRect.x + dX, spriteRect.y + dY, spriteRect.width, spriteRect.height );
	},

	updateSpritePosition: function() {
		this.setPosition( cc.p( Math.round( this.positionX ),  Math.round( this.positionY ) ) );
	},
	
	handleCollision: function( oldRect, newRect ) {
		var blocks = this.map.getBlocks();
		if ( this.ground ) {
			if ( !this.ground.onTop( newRect ) ) {
				this.ground = null;
			}
		} else {
			if ( this.velocityY <= 0 ) {
				var topBlock = this.findTopBlock( blocks, oldRect, newRect );
				// console.log(topBlock)
				if ( topBlock ) {
					this.ground = topBlock;
					this.positionY = topBlock.getTopY();
					this.velocityY = 0;
				}
			}
		}
	},

	findTopBlock: function( blocks, oldRect, newRect ) {
		var topBlock = null;
		var topBlockY = -1;

		// console.log(blocks)

		blocks.forEach( function( b ) {
			if ( b.hitTop( oldRect, newRect ) ) {
				if ( b.getTopY() > topBlockY ) {
					topBlockY = b.getTopY();
					topBlock = b;
				}
			}
		}, this );

		return topBlock;
	},

	setMap: function( map ) {
		this.map = map;
	},
});

Monster.SIZE = {
	SMALL: 0.25,
	MEDIUM: 0.50,
	LARGE: 0.75,
	XLARGE: 1,
};