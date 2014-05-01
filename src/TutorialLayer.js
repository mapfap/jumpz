var TutorialLayer = cc.LayerColor.extend({
	
	init: function() {
		new cc.Color4B( 0, 0, 0, 0 )
		this.setPosition( new cc.Point( 780, 380 ) );
		this.setScale( 0.8 );

		this.arrowUp = new cc.Sprite.create( 'images/arrow.png' );
		this.arrowUp.setScale( 0.6 );
		this.arrowUp.setOpacity( 50 );
		this.arrowUp.setAnchorPoint( new cc.Point( 0.5, 0.5 ) );
		this.arrowUp.setPosition( new cc.Point( 200, 200 ) );
		this.addChild( this.arrowUp );

		this.arrowDown = new cc.Sprite.create( 'images/arrow.png' );
		this.arrowDown.setScale( 0.6 );
		this.arrowDown.setOpacity( 50 );
		this.arrowDown.setRotation( 180 );
		this.arrowDown.setAnchorPoint( new cc.Point( 0.5, 0.5 ) );
		this.arrowDown.setPosition( new cc.Point( 200, 100 ) );
		this.addChild( this.arrowDown );

		this.arrowLeft = new cc.Sprite.create( 'images/arrow.png' );
		this.arrowLeft.setScale( 0.6 );
		this.arrowLeft.setOpacity( 50 );
		this.arrowLeft.setRotation( -90 );
		this.arrowLeft.setAnchorPoint( new cc.Point( 0.5, 0.5 ) );
		this.arrowLeft.setPosition( new cc.Point( 100, 100 ) );
		this.addChild( this.arrowLeft );

		this.arrowRight = new cc.Sprite.create( 'images/arrow.png' );
		this.arrowRight.setScale( 0.6 );
		this.arrowRight.setOpacity( 50 );
		this.arrowRight.setRotation( 90 );
		this.arrowRight.setAnchorPoint( new cc.Point( 0.5, 0.5 ) );
		this.arrowRight.setPosition( new cc.Point( 300, 100 ) );
		this.addChild( this.arrowRight );

		return true;
	},

	glowArrowUp: function() {
		this.arrowUp.initWithFile( 'images/arrow_glow.png' );
		this.arrowUp.setOpacity( 150 );
	},

	glowArrowDown: function() {
		this.arrowDown.initWithFile( 'images/arrow_glow.png' );
		this.arrowDown.setOpacity( 150 );
	},

	glowArrowLeft: function() {
		this.arrowLeft.initWithFile( 'images/arrow_glow.png' );
		this.arrowLeft.setOpacity( 150 );
	},

	glowArrowRight: function() {
		this.arrowRight.initWithFile( 'images/arrow_glow.png' );
		this.arrowRight.setOpacity( 150 );
	},

	unGlowArrowUp: function() {
		this.arrowUp.initWithFile( 'images/arrow.png' );
		this.arrowUp.setOpacity( 50 );
	},

	unGlowArrowDown: function() {
		this.arrowDown.initWithFile( 'images/arrow.png' );
		this.arrowDown.setOpacity( 50 );
	},

	unGlowArrowLeft: function() {
		this.arrowLeft.initWithFile( 'images/arrow.png' );
		this.arrowLeft.setOpacity( 50 );
	},

	unGlowArrowRight: function() {
		this.arrowRight.initWithFile( 'images/arrow.png' );
		this.arrowRight.setOpacity( 50 );
	},

});