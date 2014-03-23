var Block = cc.Sprite.extend({
	ctor: function( resource ) {
		this._super();
		this.initWithFile( resource, cc.rect( 0, 0, 120, 120 ) );
		this.setAnchorPoint( cc.p( 0, 0 ) );
	},

	getTopY: function() {
		return cc.rectGetMaxY( this.getBoundingBoxToWorld() );
	},

	hitTop: function( oldRect, newRect ) {
		var brect = this.getBoundingBoxToWorld();
		if ( cc.rectGetMinY( oldRect ) >= cc.rectGetMaxY( brect ) ) {
			var uRect = cc.rectUnion( oldRect, newRect );
			return cc.rectIntersectsRect( uRect, brect );
		}
		return false;
	},

	onTop: function( rect ) {
		var brect = this.getBoundingBoxToWorld();
		var bminx = cc.rectGetMinX( brect );
		var bmaxx = cc.rectGetMaxX( brect );
		var minx = cc.rectGetMinX( rect );
		var maxx = cc.rectGetMaxX( rect );
		return ( minx <= bmaxx ) && ( bminx <= maxx );
	}
});
