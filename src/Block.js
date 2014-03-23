var Block = cc.Sprite.extend({

	ctor: function( resource, name ) {
		this._super();
		this.initWithFile( resource, cc.rect( 0, 0, 120, 120 ) );
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.name = name;

		this.animation = new cc.Animation.create();
		this.animation.addSpriteFrameWithFile( 'images/grass_walk.png' );
		this.animation.setDelayPerUnit( 0.1 );
		this.movingAction = cc.Animate.create( this.animation );

	},

	walk: function() {
		this.runAction( this.movingAction );
		// console.log("walk");
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
