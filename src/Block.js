var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();

		if ( type == Block.TYPE.COIN ) {
			// console.log("coin!")
			this.createSpinningCoin();
		} else {
			this.initWithFile( type );
		}

		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;
		this.type = type;

		if ( this.type == Block.TYPE.GRASS ) {
			this.animation = new cc.Animation.create();
			this.animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
			this.animation.setDelayPerUnit( 10 );
			this.GRASS_TOUCHED_ACTION = cc.Animate.create( this.animation );
		}

	},

	touched: function() {
		if ( this.type == Block.TYPE.GRASS ) {
			this.runAction( this.GRASS_TOUCHED_ACTION );
		}
	},

	createSpinningCoin: function() {
		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/coin/coin0.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin1.png' );
		animation.addSpriteFrameWithFile( 'images/coin/coin2.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin3.png' );
		animation.addSpriteFrameWithFile( 'images/coin/coin4.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin5.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin0.png' );
		animation.setDelayPerUnit( 0.1 );

		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.runAction( movingAction );
	},
	
});

Block.TYPE = {
	AIR: "images/blocks/air.png",
	COIN: "images/blocks/coin.png",
	DIRT: "images/blocks/dirt.png",
	DIRT_FLOAT: "images/blocks/dirt_float.png",
	GRASS: "images/blocks/grass.png",
	GRASS_TOUCHED: "images/blocks/grass_touched.png",
}



