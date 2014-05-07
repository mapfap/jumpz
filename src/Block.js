var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();
		this.name = name;
		this.type = type;

		switch ( this.type ) {


		case Block.TYPE.CHECKPOINT:
			var randomStart = ( Math.floor( Math.random() * 4 ) );
			this.initWithFile( "images/checkpoint/" + randomStart + ".png" );
			console.log( randomStart )
			var animation = new cc.Animation.create();
			animation.addSpriteFrameWithFile( "images/checkpoint/0.png" );
			animation.addSpriteFrameWithFile( "images/checkpoint/1.png" );
			animation.addSpriteFrameWithFile( "images/checkpoint/2.png" );
			animation.addSpriteFrameWithFile( "images/checkpoint/3.png" );
			animation.addSpriteFrameWithFile( "images/checkpoint/4.png" );
			animation.setDelayPerUnit( 0.1 );
			this.action = cc.RepeatForever.create( cc.Animate.create( animation ) );
			this.runAction( this.action );
			break;

		case Block.TYPE.GRASS:
			var animation = new cc.Animation.create();
			animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
			animation.setDelayPerUnit( 1 );
			this.action = cc.Animate.create( animation );

		default:
			this.initWithFile( type );
			break;
		}

		this.setScale( GLOBAL_SCALE );
		this.setAnchorPoint( cc.p( 0, 0 ) );

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
	
});

Block.TYPE = {
	AIR: "images/blocks/air.png",
	CHECKPOINT: "images/checkpoint/0.png",
	COIN: "images/blocks/coin.png",
	DIRT: "images/blocks/dirt.png",
	DIRT_FLOAT: "images/blocks/dirt_float.png",
	GRASS: "images/blocks/grass.png",
	GRASS_TOUCHED: "images/blocks/grass_touched.png",
	METAL: "images/blocks/metal.png",
}



