var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();
		this.initWithFile( type , cc.rect( 0, 0, 120, 120 ) );
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;
		this.type = type;

		this.animation = new cc.Animation.create();
		this.animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
		this.animation.setDelayPerUnit( 0.1 );
		this.GRASS_TOUCHED_ACTION = cc.Animate.create( this.animation );
	},

	touched: function() {
		if ( this.type == Block.TYPE.GRASS ) {
			this.runAction( this.GRASS_TOUCHED_ACTION );
		}
	},
	
});

Block.TYPE = {
	AIR: "images/blocks/air.png",
	DIRT: "images/blocks/dirt.png",
	DIRT_FLOAT: "images/blocks/dirt_float.png",
	GRASS: "images/blocks/grass.png",
	GRASS_TOUCHED: "images/blocks/grass_touched.png",
}



