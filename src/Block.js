var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();
		this.setScale( GLOBAL_SCALE );

		this.initWithFile( type );

		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;
		this.type = type;

		switch ( this.type ) {

		case Block.TYPE.GRASS:
			var animation = new cc.Animation.create();
			animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
			animation.setDelayPerUnit( 1 );
			this.action = cc.Animate.create( animation );
			break;
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



