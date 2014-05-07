var StatusBar = cc.Node.extend({
	
	ctor: function() {
		this.started = false;
		this.opacity = 255;

		this._super();

		this.barBG = cc.Sprite.create( 'images/bar_bg.png' );
		this.barBG.setScaleY( 3 );
		this.barBG.setScaleX( 2 );
		this.barBG.setOpacity( this.opacity );
		this.barBG.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.barBG.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.barBG );

		this.DEFAULT_SCALE_X = 4;

		this.healthBar = cc.Sprite.create( 'images/hp_green.png' );
		this.healthBar.setScaleY( 3 );
		this.healthBar.setScaleX( this.DEFAULT_SCALE_X );
		this.healthBar.setOpacity( this.opacity );
		this.healthBar.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.healthBar.setPosition( new cc.Point( 0, 12 ) );
		this.addChild( this.healthBar );

		this.energyBar = cc.Sprite.create( 'images/sp.png' );
		this.energyBar.setScaleY( 3 );
		this.energyBar.setScaleX( this.DEFAULT_SCALE_X );
		this.energyBar.setOpacity( 200 );
		this.energyBar.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.energyBar.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.energyBar );

		this.barBoarder = cc.Sprite.create( 'images/bar_border.png' );
		this.barBoarder.setScaleY( 3 );
		this.barBoarder.setScaleX( 2 );
		this.barBoarder.setOpacity( 200 );
		this.barBoarder.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.barBoarder.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.barBoarder );

	},

	setHealthBarLength: function( percent ) {
		// console.log( this.DEFAULT_SCALE_X * percent / 100 )
		this.healthBar.setScaleX( this.DEFAULT_SCALE_X * ( percent / 100.0 ) );
	},

	setEnergyBarLength: function( percent ) {
		this.energyBar.setScaleX( this.DEFAULT_SCALE_X * ( percent / 100.0 ) );
	},
	
});