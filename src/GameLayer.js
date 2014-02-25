var GameLayer = cc.LayerColor.extend({
    init: function() {
        this.state = GameLayer.STATES.STARTED;


        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.player = new Player();
        this.player.setPosition( new cc.Point( 100, 100 ) );
        this.addChild( this.player, 1 );
        this.player.scheduleUpdate();

        // this.scheduleUpdate();
        this.setKeyboardEnabled( true );
        this.startGame();
        return true;
    },
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
        // if ( this.state == GameLayer.STATES.FRONT ) {
            // this.startGame();
            // this.state = GameLayer.STATES.STARTED;
            // <--- some code to tell the player to start falling (TO BE ADDED LATER)
        // } else
         if ( this.state == GameLayer.STATES.STARTED ) {
            if ( e == cc.KEY.space ) {
                this.player.jump();
            }

            if ( e == cc.KEY.right ) {
                this.player.goRight();
            }

            if ( e == cc.KEY.left ) {
                this.player.goLeft();
            }
        }
    },
    onKeyUp: function( e ) {
        if ( this.state == GameLayer.STATES.STARTED ) {

            if ( e == cc.KEY.right ) {
                this.player.stopRight();
            }

            if ( e == cc.KEY.left ) {
                this.player.stopLeft();
            }
        }
    },
    update: function( dt ) {
        // if ( this.state == GameLayer.STATES.STARTED ) {
        //     // console.log(this.pillarPair.hit( this.player ));
        //     // console.log(this.pillarPair);
        //     // if ( this.pillarPair && this.pillarPair.hit( this.player ) ) {
        //     //     console.log("HIT!");
        //     //     this.endGame();
        //     //     this.state = GameLayer.STATES.DEAD;
        //     // }
        // }
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

GameLayer.STATES = {
    FRONT: 1,
    STARTED: 2,
    DEAD: 3
};
