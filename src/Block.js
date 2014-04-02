var Block = cc.Sprite.extend({

	ctor: function( type, name ) {
		this._super();
		this.initWithFile( type , cc.rect( 0, 0, 120, 120 ) );
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;
		this.type = type;

		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( Block.TYPE.GRASS_TOUCHED );
		animation.setDelayPerUnit( 0.1 );
		Block.GRASS_TOUCHED_ACTION =  cc.Animate.create( animation );
	},

	touched: function() {
		if ( this.type == Block.TYPE.GRASS ) {
			this.runAction( Block.GRASS_TOUCHED_ACTION );
		}
	},

	// getTopY: function() {
	// 	return cc.rectGetMaxY( this.getBoundingBoxToWorld() );
	// },

	// hitTop: function( oldRect, newRect ) {
	// 	var brect = this.getBoundingBoxToWorld();
	// 	if ( cc.rectGetMinY( oldRect ) >= cc.rectGetMaxY( brect ) ) {
	// 		var uRect = cc.rectUnion( oldRect, newRect );
	// 		return cc.rectIntersectsRect( uRect, brect );
	// 	}
	// 	return false;
	// },

	// onTop: function( rect ) {
	// 	var brect = this.getBoundingBoxToWorld();
	// 	var bminx = cc.rectGetMinX( brect );
	// 	var bmaxx = cc.rectGetMaxX( brect );
	// 	var minx = cc.rectGetMinX( rect );
	// 	var maxx = cc.rectGetMaxX( rect );
	// 	return ( minx <= bmaxx ) && ( bminx <= maxx );
	// },
	
});

Block.TYPE = {
	AIR: "images/blocks/air.png",
	DIRT: "images/blocks/dirt.png",
	GRASS: "images/blocks/grass.png",
	GRASS_TOUCHED: "images/blocks/grass_touched.png",
}



