var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();

		// if ( type == Block.TYPE.COIN ) {
		// 	// console.log("coin!")
		// 	// this.createSpinningCoin();
		// 	this.initWithFile( type );
		// } else if ( type == Block.TYPE.CHECKPOINT ) {

		// 	this.initWithFile( type );
		// 	// this.setScale( 2 );
			
		// } else {
			this.initWithFile( type );
		// }
		if ( type == Block.TYPE.CHECKPOINT ) {
			this.setScale( 2 );
		}

		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;
		this.type = type;

		switch ( this.type ) {

		case Block.TYPE.GRASS:
			var animation = new cc.Animation.create();
			animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
			animation.setDelayPerUnit( 1000 );
			this.action = cc.Animate.create( animation );
			break;

		// case Block.TYPE.COIN:
			// var animation = new cc.Animation.create();
			// animation.addSpriteFrameWithFile( Block.TYPE.COIN_TOUCH );
			// animation.setDelayPerUnit( 1000 );
			// this.action = cc.Animate.create( animation );
			// break;

		}

	},

	touched: function() {
		switch ( this.type ) {

		case Block.TYPE.GRASS:
			this.runAction( this.action );
			break;

		case Block.TYPE.COIN:
			// this.runAction( this.action );
			// console.log( "get coin")
			break;

		case Block.TYPE.CHECKPOINT:
			// GameController.nextLevel();
			break;

		}
	},

	// createSpinningCoin: function() {
		// var animation = new cc.Animation.create();
		// animation.addSpriteFrameWithFile( 'images/coin/coin0.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin1.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin2.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin3.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin4.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin5.png' );
		// animation.addSpriteFrameWithFile( 'images/coin/coin0.png' );
	// 	animation.setDelayPerUnit( 0.1 );

	// 	var movingAction = cc.RepeatForever.create( cc.Animate
	// 			.create( animation ) );
	// 	this.runAction( movingAction );
	// },
	
});

Block.TYPE = {
	AIR: "images/blocks/air.png",
	CHECKPOINT: "images/blocks/checkpoint.png",
	COIN: "images/blocks/coin.png",
	DIRT: "images/blocks/dirt.png",
	DIRT_FLOAT: "images/blocks/dirt_float.png",
	GRASS: "images/blocks/grass.png",
	GRASS_TOUCHED: "images/blocks/grass_touched.png",
	METAL: "images/blocks/metal.png",
}



