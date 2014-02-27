var HealthBar = cc.Node.extend({
    ctor: function() {
        this.started = false;

        this._super();
        this.barBG = cc.Sprite.create( 'images/bar_bg.png' );
        this.barBG.setScaleY(3);
        this.barBG.setScaleX(2);
        this.barBG.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.barBG.setPosition( new cc.Point( 0, 0 ) );
        this.addChild( this.barBG );

        this.hp = cc.Sprite.create( 'images/hp_green.png' );
        this.hp.setScaleY(3);
        this.hp.setScaleX(4);
        this.hp.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.hp.setPosition( new cc.Point( 0, 12 ) );
        this.addChild( this.hp );
     
        this.sp = cc.Sprite.create( 'images/sp.png' );
        this.sp.setScaleY(3);
        this.sp.setScaleX(4);
        this.sp.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.sp.setPosition( new cc.Point( 0, 0 ) );
        this.addChild( this.sp );

        this.barBoarder = cc.Sprite.create( 'images/bar_border.png' );
        this.barBoarder.setScaleY(3);
        this.barBoarder.setScaleX(2);
        this.barBoarder.setAnchorPoint( new cc.Point( 0, 0 ) );
        this.barBoarder.setPosition( new cc.Point( 0, 0 ) );
        this.addChild( this.barBoarder );

    },
    update: function( dt ) {

        // var posX = this.getPositionX();
        // if ( posX < - 30 ) {
        //     this.setPositionX( screenWidth + 30 );
        //     this.setPositionY( Math.floor( Math.random() * screenHeight ) );
        // } else {
        //     this.setPositionX( this.getPositionX() - 5 );
        // }
        
    },
});