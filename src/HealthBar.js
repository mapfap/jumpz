var HealthBar = cc.Node.extend({
	
	ctor: function() {
		this.started = false;

		this._super();
		this.barBG = cc.Sprite.create( 'images/bar_bg.png' );
		this.barBG.setScaleY( 3 );
		this.barBG.setScaleX( 2 );
		this.barBG.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.barBG.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.barBG );

		this.DEFAULT_SCALE_X = 4;

		this.healthPointBar = cc.Sprite.create( 'images/hp_green.png' );
		this.healthPointBar.setScaleY( 3 );
		this.healthPointBar.setScaleX( this.DEFAULT_SCALE_X );
		this.healthPointBar.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.healthPointBar.setPosition( new cc.Point( 0, 12 ) );
		this.addChild( this.healthPointBar );

		this.staminaPointBar = cc.Sprite.create( 'images/sp.png' );
		this.staminaPointBar.setScaleY( 3 );
		this.staminaPointBar.setScaleX( this.DEFAULT_SCALE_X );
		this.staminaPointBar.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.staminaPointBar.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.staminaPointBar );

		this.barBoarder = cc.Sprite.create( 'images/bar_border.png' );
		this.barBoarder.setScaleY( 3 );
		this.barBoarder.setScaleX( 2 );
		this.barBoarder.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.barBoarder.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.barBoarder );

	},

	setHealthPointBarLength: function( percent ) {
		// console.log( this.DEFAULT_SCALE_X * percent / 100 )
		this.healthPointBar.setScaleX( this.DEFAULT_SCALE_X * ( percent / 100.0 ) );
	},

	setStaminaPointBarLength: function( percent ) {
		this.staminaPointBar.setScaleX( this.DEFAULT_SCALE_X * ( percent / 100.0 ) );
	},
	
});