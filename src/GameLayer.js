var GameLayer = cc.LayerColor.extend({
    init: function() {

        this.debugLabel = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.debugLabel.setPosition( new cc.Point( screenWidth / 2, screenHeight - 30 ) );
        this.addChild( this.debugLabel, 2 );

        

        this.map = new Map();
        this.map.setPosition( new cc.Point(0, 0));
        this.addChild( this.map );

        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        // this.bar.setPosition( new cc.Point( 300, 300 ) );

        this.player = new Player();
        this.player.setHealthBar( new HealthBar() );
        this.player.setPosition( new cc.Point( 100, 100 ) );
        this.addChild( this.player, 1 );
        this.player.setMap( this.map );

        // this.scheduleUpdate();
        this.startGame();
        this.setKeyboardEnabled( true );
        this.player.scheduleUpdate();
        return true;
    },
    // createBlocks: function() {
        // var groundBlock = new Block( 0, 0, 120, 120 );
        // this.blocks.push( groundBlock );

        // var middleBlock = new Block( 0, 200, 400, 250 );
        // this.blocks.push( middleBlock );

        // var topBlock = new Block( 600, 400, 800, 450 );
        // this.blocks.push( topBlock );

        // this.blocks.forEach( function( b ) {
            // this.addChild( b );
        // }, this );
    // },
    startGame: function() {
        this.player.start();
    },
    endGame: function() {
        this.player.stop();
    },
    createPillarPair: function() {
        this.pillarPair = new PillarPair();
        this.pillarPair.setPosition( new cc.Point( 900, 300 ) );
        this.addChild( this.pillarPair );
        this.pillarPair.scheduleUpdate();
    },
    onKeyDown: function( e ) {
        if ( e == cc.KEY.space ) {
            this.player.jump();
        }

        if ( e == cc.KEY.right ) {
            this.player.goRight();
        }

        if ( e == cc.KEY.left ) {
            this.player.goLeft();
        }

        if ( e == cc.KEY.e ) {
            this.debugLabel.setString(Math.round(this.player.getPositionX()/3/40) + ", " + (Math.round(this.player.getPositionY()/3/40)-1) );
        }

        if ( e == cc.KEY.d ) {
            this.map.shiftMap( 0, 1 );
            this.player.setPositionX( this.player.getPositionX() - 120 );
        }

        if ( e == cc.KEY.a ) {
            this.map.shiftMap( 0, -1 );
            this.player.setPositionX( this.player.getPositionX() + 120 );
        }
    },
    onKeyUp: function( e ) {
        if ( e == cc.KEY.right ) {
            this.player.stopRight();
        }

        if ( e == cc.KEY.left ) {
            this.player.stopLeft();
        }
    },
    update: function() {
        if ( this.player.getPositionX() >= screenWidth * 5.0 / 6 ) {
            this.map.shiftMap( 0, 1 );
            this.player.setPositionX( this.player.getPositionX() - 120 );
        } else if ( this.player.getPositionX() <= screenWidth / 5.0 ) {
            this.map.shiftMap( 0, -1 );
            this.player.setPositionX( this.player.getPositionX() + 120 );
        }
    },

});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});
