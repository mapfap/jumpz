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

        this.hpBar = cc.Sprite.create( 'images/hp_green.png' );
        this.hpBar.setScaleY(3);
        this.hpBar.setScaleX( this.DEFAULT_SCALE_X );
        this.hpBar.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.hpBar.setPosition( new cc.Point( 0, 12 ) );
        this.addChild( this.hpBar );
     
        this.spBar = cc.Sprite.create( 'images/sp.png' );
        this.spBar.setScaleY( 3 );
        this.spBar.setScaleX( this.DEFAULT_SCALE_X );
        this.spBar.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.spBar.setPosition( new cc.Point( 0, 0 ) );
        this.addChild( this.spBar );

        this.barBoarder = cc.Sprite.create( 'images/bar_border.png' );
        this.barBoarder.setScaleY( 3 );
        this.barBoarder.setScaleX( 2 );
        this.barBoarder.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.barBoarder.setPosition( new cc.Point( 0, 0 ) );
        this.addChild( this.barBoarder );

    },

    setHP: function( percent ) {
        console.log( this.DEFAULT_SCALE_X * percent / 100 )
        this.hpBar.setScaleX( this.DEFAULT_SCALE_X * percent / 100 );
    },

    setSP: function( percent ) {
        console.log( this.DEFAULT_SCALE_X * percent / 100 )
        this.spBar.setScaleX( 4 * (percent/100.0) );
    },
    // update: function( dt ) {

        // var posX = this.getPositionX();
        // if ( posX < - 30 ) {
        //     this.setPositionX( screenWidth + 30 );
        //     this.setPositionY( Math.floor( Math.random() * screenHeight ) );
        // } else {
        //     this.setPositionX( this.getPositionX() - 5 );
        // }
        
    // },
});