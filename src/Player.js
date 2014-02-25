var Player = cc.Sprite.extend({
    ctor: function() {
        this.started = false;
        this._super();
        this.canJump = true;
        
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
    isInTheAir: function() {
        return this.getPositionY() > Physics.FLOOR;
    },
    update: function() {

        if ( this.holdLeft && ( ! this.holdRight ) ) {
            this.goLeft();
        }

        if ( this.holdRight && ( ! this.holdLeft ) ) {
            this.goRight();
        }


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
        var newPosX = pos.x + this.vx;

        if ( ! this.isInTheAir() ) {
            this.jumpStep = 0;
            this.setPosition( new cc.Point( newPosX , Physics.FLOOR ) );

        } else if ( this.started ) {
            this.vy += Player.G;
            var newPosY = pos.y + this.vy;
            pos.x + this.vx
            if ( newPosY <= Physics.FLOOR ) {
                newPosY = Physics.FLOOR;
            }
            this.setPosition( new cc.Point( newPosX , newPosY ) );
        }
        
    },
    jump: function() {
        if ( this.jumpStep < this.maxJump ) {
            this.vy = Physics.JUMPING_VELOCITY[ this.jumpStep ];
            if ( this.getPositionY() == Physics.FLOOR ) {
                this.setPositionY( Physics.FLOOR + 0.1 );
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