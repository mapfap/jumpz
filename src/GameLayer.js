var GameLayer = cc.LayerColor.extend({
	
	init: function() {

		this.debugLabel = cc.LabelTTF.create( '0', 'Arial', 40 );
		this.debugLabel.setPosition( new cc.Point( screenWidth / 2,
				screenHeight - 30 ) );
		this.addChild( this.debugLabel, 2 );

		this.map = new Map();
		this.map.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.map );

		this._super( new cc.Color4B( 127, 127, 127, 255 ) );
		this.setPosition( new cc.Point( 0, 0 ) );

		this.crosshair = new Block( 'images/crosshair.png' );
		this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
		this.addChild( this.crosshair );

		this.player = new Player();
		this.player.setCrosshair( this.crosshair );

		this.player.setHealthBar( new HealthBar() );
		this.player.setPosition( new cc.Point( 200, 200 ) );
		this.addChild( this.player, 1 );
		this.player.setMap( this.map );

		this.highLightBlock = new Block( 'images/green.png' );
		this.highLightBlock.setPosition( new cc.Point( 300, 300 ) );
		this.addChild( this.highLightBlock );

		this.accumulateColumn = 0;
		this.accumulateRow = 0;


		// this.player2 = new Player();
		// this.player2.setHealthBar( new HealthBar() );
		// this.player2.setPosition( new cc.Point( 300, 120 ) );
		// this.addChild( this.player2, 1 );
		// this.player2.setMap( this.map );

		this.scheduleUpdate();
		this.startGame();
		this.setKeyboardEnabled( true );
		this.player.scheduleUpdate();
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
		switch ( e ) {
		case cc.KEY.space:
			this.player.jump();
			break;

		case cc.KEY.right:
			this.player.goRight();
			break

		case cc.KEY.left:
			this.player.goLeft();
			break;

		case cc.KEY.e:
			// this.player.
			// this.debugLabel.setString( Math
					// .round( this.player.getPositionX() / 3 / 40 )
					// + ", " + ( Math.round( this.player.getPositionY() / 3 / 40 ) - 1 ) );
			// break;

		case cc.KEY.d:
			this.shiftMap( 0, 1 );
			break;

		case cc.KEY.a:
			this.shiftMap( 0, -1 );
			break;

		case cc.KEY.w:
			this.shiftMap( 1, 0 );
			break;

		case cc.KEY.s:
			this.shiftMap( -1, 0 );
			break;

		case cc.KEY.r:
			this.player.amountLabel.dim( 255, 0, 8 );
			this.player.increaseSP( 20 );
			break

		default:
			break;
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


	shiftMap: function( row , column ) {
		// this.accumulateColumn += column;
		// if ( Math.abs( this.accumulateColumn ) > 12 ) {
		// 	this.accumulateColumn = 0;
			this.map.shiftMap( row, column );
			this.player.setPosition( new cc.Point( this.player.getPositionX() + 120 * -column,
				this.player.getPositionY() + 120 * row ) );
		// 	this.map.setPositionX( 0 );
		// } else {
		// 	this.map.setPositionX( this.getPositionX() + 10 * -column );
		// }
		
	},

	update: function() {

		this.highLightBlock.setPosition( this.player.getCoordinate() );

		if ( this.player.getPositionX() >= screenWidth * 4.0 / 5 ) {
			this.shiftMap( 0, 1 );
		} else if ( this.player.getPositionX() <= screenWidth / 5.0 ) {
			this.shiftMap( 0, -1 );
		}

		if ( this.player.getPositionY() >= screenHeight * 4.0 / 5 ) {
			this.shiftMap( -1, 0 );
		} else if ( this.player.getPositionY() <= screenHeight / 9.0 ) {
			this.shiftMap( 1, 0 );
		}  
	},

});

var StartScene = cc.Scene.extend({

	onEnter: function() {
		this._super();
		var layer = new GameLayer();
		layer.init();
		this.addChild( layer );
	},
	
});
