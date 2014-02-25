var Player = cc.Sprite.extend({
    ctor: function() {
        this.started = false;
        this._super();
        this.canJump = true;
        this.map = null;

        this.jumpStep = 0;
        this.maxJump = 2;
        this.decreaseSpeedRight = false;
        this.decreaseSpeedLeft = false;

        this.goingRight = false;

        this.holdRight = false;
        this.holdLeft = false;


        this.vy = Player.STARTING_VELOCITY;
        this.vx = 0;

        this.setScale(3);

        var animation = new cc.Animation.create();
        animation.addSpriteFrameWithFile( 'images/poring0.png' );
        animation.addSpriteFrameWithFile( 'images/poring1.png' );
        animation.addSpriteFrameWithFile( 'images/poring2.png' );
        animation.addSpriteFrameWithFile( 'images/poring1.png' );
        animation.addSpriteFrameWithFile( 'images/poring0.png' );
        animation.setDelayPerUnit( 0.1 );

        // var movingAction = cc.Animate.create( animation );
        var movingAction = cc.RepeatForever.create( cc.Animate.create( animation ) );
        this.runAction( movingAction );
    },

    setMap: function(map) {
        this.map = map;
    },

    goRight: function() {
        this.holdRight = true;
        this.setFlippedX( true );

        this.goingRight = true; //need this: in case, did not keyup the left BUT click right it will lag

        decreaseSpeedLeft = false;
        this.vx = Physics.WALKING_SPEED;
    },
    goLeft: function() {
        this.setFlippedX( false );
        this.holdLeft = true;

        this.goingLeft = true;
        decreaseSpeedRight = false;
        this.vx = - Physics.WALKING_SPEED;
    },
    stopRight: function() {

        this.holdRight = false;
        this.goingRight = false;
        if ( ! this.goingLeft ) {
            this.decreaseSpeedRight = true;
        }
    },
    stopLeft: function() {

        this.holdLeft = false;
        this.goingLeft = false;
        if ( ! this.goingRight ) {
            this.decreaseSpeedLeft = true;
        }
    },

    convertPixelToBlock: function( coordinate, isFloor ) {
        if ( isFloor ) {
            return Math.floor( coordinate / 3 / 40 );
        }

        return Math.ceil( coordinate / 3 / 40 );
    },

    convertBlockToPixel: function( coordinate ) {
        return coordinate * 3 * 40;
    },

    isInTheAir: function() {
        var posX = this.convertPixelToBlock( this.getPositionX(), false );
        var posY = this.convertPixelToBlock( this.getPositionY(), false ) - 1;
        return ! this.map.isGround( posX, posY );
    },

    canWalkTo: function( dt ) {
        var isFloor = dt < 0;
        var posX = this.convertPixelToBlock( this.getPositionX() + dt, isFloor );
        var posY = this.convertPixelToBlock( this.getPositionY(), isFloor );
        return ! this.map.isGround( posX, posY );
    },
    update: function() {

        if ( this.holdLeft && ( ! this.holdRight ) ) {
            this.goLeft();
        }

        if ( this.holdRight && ( ! this.holdLeft ) ) {
            this.goRight();
        }


        // friction
        if ( this.decreaseSpeedRight && this.vx >= 0 ) {

            if ( this.isInTheAir() ) {
                // console.log("glide");
                this.vx -= Physics.AIR_FRICTION;
            } else {
                this.vx -= Physics.FLOOR_FRICTION;
            }
            if ( this.vx <= 0) {
                this.decreaseSpeedRight = false;
                this.vx = 0;
            }
        }

        if ( this.decreaseSpeedLeft && this.vx <= 0 ) {

            if ( this.isInTheAir() ) {
                // console.log("glide");
                this.vx += Physics.AIR_FRICTION;
            } else {
                this.vx += Physics.FLOOR_FRICTION;
            }

            if ( this.vx >= 0) {
                this.decreaseSpeedLeft = false;
                this.vx = 0;
            }
        }

        var pos = this.getPosition();
        var newPosX = pos.x;
        if ( this.canWalkTo( this.vx ) ) {
            newPosX += this.vx;
        }

        var floor = this.convertBlockToPixel( this.convertPixelToBlock( this.getPositionY() ) );
        if ( ! this.isInTheAir() ) {
            this.jumpStep = 0;
            this.setPosition( new cc.Point( newPosX , floor ) );

            // console.log(1)
        } else if ( this.started ) {
            // console.log(2)
            this.vy += Player.G;
            var newPosY = pos.y + this.vy;
            pos.x + this.vx
            // if ( newPosY <= floor ) {
                // newPosY = floor;
            // }
            this.setPosition( new cc.Point( newPosX , newPosY ) );
        }
        
    },
    jump: function() {
        // var floor = this.convertBlockToPixel( this.convertPixelToBlock( this.getPositionY() ) );
        
        if ( this.jumpStep < this.maxJump ) {

            this.vy = Physics.JUMPING_VELOCITY[ this.jumpStep ];
            console.log( ! this.isInTheAir() );  
            if ( ! this.isInTheAir() ) {
                this.setPositionY( this.getPositionY() + (120) );
            }
            this.jumpStep += 1;
        }
    },
    start: function() {
        this.started = true;
    },
    stop: function() {
        this.started = false;
    }
});

Player.STARTING_VELOCITY = 3;
Player.G = Physics.G;