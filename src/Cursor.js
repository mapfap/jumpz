var Cursor = cc.Sprite.extend({

	ctor: function() {
		this._super();
		this.setScale( 0.1 );
		// this.setScale( 0.5 );
		this.setAnchorPoint( new cc.Point( 0, 1 ) );
		this.initWithFile( 'images/cursor.png' );
		// this.initAnimation();
	},

	initAnimation: function() {

		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/poring0.png' );
		animation.addSpriteFrameWithFile( 'images/poring1.png' );
		animation.addSpriteFrameWithFile( 'images/poring2.png' );
		animation.addSpriteFrameWithFile( 'images/poring1.png' );
		animation.addSpriteFrameWithFile( 'images/poring0.png' );
		// animation.addSpriteFrameWithFile( 'images/cursor.png' );
		animation.setDelayPerUnit( 0.1 );
		// animation.setDelayPerUnit( 100 );

		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.runAction( movingAction );
	},
	
});