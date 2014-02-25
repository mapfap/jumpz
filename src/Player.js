var Player = cc.Sprite.extend({
    ctor: function() {
        this.started = false;
        this._super();
        this.initWithFile( img_dot );
        this.canJump = true;
        // this.delayTime = 10; //frames
        // this.waitToJump = 0; //frames
        this.jumpStep = 0;
        this.maxJump = 2;
        this.decreaseSpeedRight = false;
        this.decreaseSpeedLeft = false;

        this.goingRight = false;
        // this.DIRECTION = {
        //     RIGHT: 1,
        //     LEFT: -1
        // };
        // this.directionStack = [];

        this.holdRight = false;
        this.holdLeft = false;


        this.vy = Player.STARTING_VELOCITY;
        this.vx = 0;
    },

    goRight: function() {
        this.holdRight = true;
        // this.directionStack.push( this.DIRECTION.RIGHT );
        // console.log( directionStack );

        this.goingRight = true; //need this: in case, did not keyup the left BUT click right it will lag
        // if ( this.goingLeft ) {
        //     this.goingLeft = false;
        // }
        decreaseSpeedLeft = false;
        this.vx = Physics.WALKING_SPEED;
    },
    goLeft: function() {
        this.holdLeft = true;
        // this.directionStack.push( this.DIRECTION.LEFT );
        // console.log( directionStack );

        this.goingLeft = true;
        decreaseSpeedRight = false;
        this.vx = - Physics.WALKING_SPEED;
    },
    stopRight: function() {

        this.holdRight = false;

        // this.directionStack.push( this.DIRECTION.LEFT );
        // console.log( directionStack );
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
    update: function() {

        if ( this.holdLeft && ( ! this.holdRight ) ) {
            this.goLeft();
        }

        if ( this.holdRight && ( ! this.holdLeft ) ) {
            this.goRight();
        }


        if ( this.decreaseSpeedRight && this.vx >= 0 ) {
            this.vx -= 5;
            if ( this.vx <= 0) {
                this.decreaseSpeedRight = false;
                this.vx = 0;
            }
        }

        if ( this.decreaseSpeedLeft && this.vx <= 0 ) {
            this.vx += 5;
            if ( this.vx >= 0) {
                this.decreaseSpeedLeft = false;
                this.vx = 0;
            }
        }

        // if ( this.waitToJump ) {
        //     this.waitToJump -= 1;
        // }
        // var posX = this.getPositionX();

        // if ( ( ! this.goLeft ) && ( ! this.vx ) ) {

        // }


        // if ( this.goRight && ( ! this.goLeft ) ) {
        //     this.vx += 1;
        //     // this.setPositionX( posX + Physics.WALKING_SPEED );
        // }


        // if ( this.goLeft && ( ! this.goRight ) ) {
        //     this.vx -= 1;
        //     // this.setPositionX( posX - Physics.WALKING_SPEED );
        // }

        var pos = this.getPosition();

        if ( this.getPositionY() <= Physics.FLOOR ) {
            this.jumpStep = 0;
            this.setPosition( new cc.Point( pos.x + this.vx , Physics.FLOOR ) );

        } else if ( this.started ) {
            this.vy += Player.G;
            this.setPosition( new cc.Point( pos.x + this.vx , pos.y + this.vy ) );
        }
        
    },
    jump: function() {
        // if ( ! this.waitToJump ) {
        if ( this.jumpStep < this.maxJump ) {
            this.vy = Physics.JUMPING_VELOCITY[ this.jumpStep ];
            console.log(this.vy);
            if ( this.getPositionY() == Physics.FLOOR ) {
                this.setPositionY( Physics.FLOOR + 0.1 );
            }
            this.jumpStep += 1;
            // this.waitToJump = this.delayTime;
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