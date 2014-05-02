DimLabel = cc.LabelTTF.extend({

	popup: function( text ) {
		this.setString( text );
		this.setOpacity( 255 );
		var step = 2;
		// this.scheduleOnce( function() {
			this.schedule( function() {
				this.setPositionY( this.getPositionY() + 1 );
				var newOpacity = this.getOpacity() - step;
				this.setOpacity( this.getOpacity() - step );
				// console.log( this.getOpacity() )
				if ( newOpacity <= 0 ) {
					this.getScheduler().unscheduleAllCallbacksForTarget( this );
					this.removeFromParent();
					// console.log( "stop" )
					this.state = DimLabel.STATE.HIDE;
				}
			}, 1.0 / 45 );
		// }, 0.1 )
	},

	dim: function( text ) {
		var startOpacity = 255;
		var stopOpacity = 0;
		var duration = 8;
		this.setString( text );

		if ( this.state == DimLabel.STATE.HIDE ) {
			// this.state = this.STATE.SHOW;
			this.setOpacity( startOpacity );
			this.step = ( startOpacity - stopOpacity ) / duration;
			this.scheduleOnce( function() {
				this.schedule( function() {
					var newOpacity = this.getOpacity() - this.step;
					this.setOpacity( this.getOpacity() - this.step );
					// console.log( this.getOpacity() )
					if ( newOpacity <= 0 ) {
						this.getScheduler().unscheduleAllCallbacksForTarget( this );
						// console.log( "stop" )
						this.state = DimLabel.STATE.HIDE;
					}
				}, 1.0 / 45 );
			}, 0.5 )
		}
	},
});

DimLabel.create = function( label, fontName, fontSize, dimensions, hAlignment, vAlignment ) {
	var ret = new DimLabel();
	if ( ret.initWithString( label, fontName, fontSize, dimensions, hAlignment, vAlignment ) ) {
		ret.setOpacity( 0 );
		ret.state = DimLabel.STATE.HIDE;
		return ret;
	}
	return null;
};

DimLabel.STATE = {
	HIDE: 0,
	SHOW: 1,
};