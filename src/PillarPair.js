var PillarPair = cc.Node.extend({
    ctor: function() {
        this.started = false;

        this._super();
        this.topPillar = cc.Sprite.create( 'images/pillar-top.png' );
        this.topPillar.setAnchorPoint( new cc.Point( 0.5, 0 ) );
        this.topPillar.setPosition( new cc.Point( 0, 100 ) );
        this.addChild( this.topPillar );
     
        this.bottomPillar = cc.Sprite.create( 'images/pillar-bottom.png' );
        this.bottomPillar.setAnchorPoint( new cc.Point( 0.5, 1 ) );
        this.bottomPillar.setPosition( new cc.Point( 0, -100 ) );
        this.addChild( this.bottomPillar );
    },
    update: function( dt ) {

        var posX = this.getPositionX();
        if ( posX < - 30 ) {
            this.setPositionX( screenWidth + 30 );
            this.setPositionY( Math.floor( Math.random() * screenHeight ) );
        } else {
            this.setPositionX( this.getPositionX() - 5 );
        }
        
    },
    hit: function( player ) {
        var playerPos = player.getPosition();
        var myPos = this.getPosition();
        return checkPlayerPillarCollision( playerPos.x, playerPos.y, myPos.x, myPos.y );
    }
});