var Monster = RigidBody.extend({

	ctor: function( isOnFocus, size ) {

		this._super( isOnFocus );
		this.setScale( size );

		this.walkingSpeed = 3;

		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/monsters/soul0.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul1.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul2.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul3.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul4.png' );
		animation.addSpriteFrameWithFile( 'images/monsters/soul5.png' );
		animation.setDelayPerUnit( 0.15 );

		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.runAction( movingAction );

		this.ground = null;
		this.map = null;

		this.offset = {

			bottomLeft: {
				x: 0,
				y: 0,
			},

			bottomRight: {
				x: 0,
				y: 0,
			},

			topRight: {
				x: 0,
				y: 0,
			},

			topLeft: {
				x: 0,
				y: 0,
			},

		};

	},

	update: function() {
		this.calculateNextPosition();
		this.applyNextPosition();
	},


});

Monster.SIZE = {
	SMALL: 0.25,
	MEDIUM: 0.50,
	LARGE: 0.75,
	XLARGE: 1,
};