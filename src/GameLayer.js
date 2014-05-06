var GameLayer = cc.LayerColor.extend({
	
	init: function() {
		this._super();

		this.playerStartingPosition = new cc.Point( 120, 120 );
		this.setPosition( new cc.Point( 0, 0 ) );

		this.allRigidBodies = [];
		this.allShiftableObjects = [];

		// this.initTutorialLayer();

		this.initMinimapController();

		this.initShiftedLayer();
		this.initMap();
		this.initBackground();
		this.initPlayer();
		// this.initMonster();

		this.initHelperUI();

		this.scheduleUpdate();
		this.player.scheduleUpdate();

		this.setKeyboardEnabled( true );
		this.state = GameLayer.STATE.STARTED;

		// this.scheduleOnce(function(){
			// this.shiftedLayer.addChild( this.monster, 1 );
			// this.monster.scheduleUpdate();
		// }, 1);

		return true;
	},

	initTutorialLayer: function() {
		this.tutorialLayer = new TutorialLayer();
		this.tutorialLayer.init();
		this.addChild( this.tutorialLayer, 20 );
	},

	initMinimapController: function() {
		this.minimap = new MinimapController( MAXIMUM_MINIMAP_SIZE, MAXIMUM_MINIMAP_SIZE );
		this.addChild( this.minimap, 3 );

		this.cursor = new Cursor();
		this.addChild( this.cursor, 5 );
		this.minimap.setCursor( this.cursor );
	},

	initPlayer: function() {
		this.player = new Player();
		this.player.setStatusBar( new StatusBar() );
		this.player.setPosition( this.playerStartingPosition );
		this.addChild( this.player, 2 );
		this.player.setMap( this.map );
		// this.allRigidBodies.push( this.player );
		// this.allShiftableObjects.push( this.player );
		this.player.setAllRigidBodies( this.allRigidBodies );

		this.crosshair = new cc.Sprite.create( 'images/crosshair/0.png' );
		this.crosshair.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
		this.crosshair.setScale( GLOBAL_SCALE );
		// this.allShiftableObjects.push( this.crosshair );
		this.addChild( this.crosshair, 3 );

		var cAnimation = new cc.Animation.create();
		// cAnimation.addSpriteFrameWithFile( 'images/crosshair/0.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/1.png' );
		// cAnimation.addSpriteFrameWithFile( 'images/crosshair/1.png' );
		// cAnimation.addSpriteFrameWithFile( 'images/crosshair/1.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/2.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/2.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/3.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/3.png' );
		cAnimation.addSpriteFrameWithFile( 'images/crosshair/3.png' );
		cAnimation.setDelayPerUnit( 0.1 );
		var cAction = cc.RepeatForever.create( cc.Animate.create( cAnimation ) );
		this.crosshair.runAction( cAction );


		this.player.setCrosshair( this.crosshair );

		// var flash = cc.Sprite.create ( 'images/blocks/dirt.png' );
		// flash.setScale(30);
		var flash = cc.Sprite.create( 'images/sky.png' );
		flash.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( flash, 10 );
		flash.setOpacity( 0 );
		this.player.setFlash( flash );

		this.player.setShiftedLayer( this.shiftedLayer );

		// this.player.toggleSight();
	},

	initMonster: function() {
		this.monster = new PatrolMonster( Monster.SIZE.MEDIUM );
		this.monster.setPosition( new cc.Point( 550, 300 ) );
		this.monster.setAnchorPoint( new cc.Point( 0, -0.2 ) )
		this.monster.setMap( this.map );
		this.allRigidBodies.push( this.monster );
		this.allShiftableObjects.push( this.monster );
		this.monster.setAllRigidBodies( this.allRigidBodies );
	},

	showCollectedCoin: function() {
		this.coinLabel.setString( this.map.collectedCoin );
	},

	initHelperUI: function() {
		this.coinIcon = cc.Sprite.create( 'images/blocks/coin.png' );
		this.coinIcon.setScale( 0.5 );
		this.coinIcon.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.coinIcon.setPosition( new cc.Point( 20, SCREEN_HEIGHT - 90 ) );
		this.addChild( this.coinIcon, 4 );

		var xLabel = cc.LabelTTF.create( 'x', 'Arial', 30 );
		xLabel.setPosition( new cc.Point( 85, SCREEN_HEIGHT - 70 ) );
		xLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.addChild( xLabel, 4 );

		this.coinLabel = cc.LabelTTF.create( '', 'Arial', 30 );
		this.coinLabel.setPosition( new cc.Point( 120, SCREEN_HEIGHT - 70 ) );
		this.coinLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.addChild( this.coinLabel, 4 );

		// this.headLabel = cc.LabelTTF.create( 'JumpZ Puzzle: Alpha Test', 'Arial', 20 );
		// this.headLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2,
		// 		SCREEN_HEIGHT - 30 ) );
		// this.addChild( this.headLabel, 4 );
	},
	
	initMap: function() {
		this.map = new Map( this.minimap, this.shiftedLayer, FIRST_LEVEL );
		this.map.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.map, 1 );

		Corner.map = this.map;
	},

	initBackground: function() {
		this.background = cc.Sprite.create( 'images/sky.png' );
		this.background.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( this.background, 0 );

		this.tree1 = cc.Sprite.create( 'images/tree1.png' );
		// this.tree1.setPosition( new cc.Point( 500 , 200 ) );
		this.tree1.setScale( 2.5 );
		this.tree1.setOpacity( 100 );
		this.addChild( this.tree1, 0 );

		this.tree2 = cc.Sprite.create( 'images/tree2.png' );
		// this.tree2.setPosition( new cc.Point( 900 , 300 ) );
		this.tree2.setScale( 5 );
		this.tree2.setOpacity( 130 );
		this.tree2.setScaleY( 7 );
		this.addChild( this.tree2, 0 );

		// this.tree3 = cc.Sprite.create( 'images/tree1.png' );
		// this.tree3.setOpacity( 10 );
		// // this.tree2.setPosition( new cc.Point( 900 , 300 ) );
		// this.tree3.setScaleX( 6 );
		// this.tree3.setPosition( 1000, 600 );
		// this.shiftedLayer.addChild( this.tree3, 0 );
	},

	initShiftedLayer: function() {
		this.shiftedLayer = new cc.LayerColor();
		this.addChild( this.shiftedLayer, 9 )
	},

	onKeyDown: function( e ) {
		switch ( e ) {

		case cc.KEY.q:
			// this.player.unscheduleUpdate();
			this.map.resetMap();
			this.map.level = 1;
			this.map.initMap( this.map.level );
			this.map.plotMap();
			this.player.setPosition( this.playerStartingPosition );
			// this.player.scheduleUpdate();
							
		break;

		case cc.KEY.enter:
			if ( this.state == GameLayer.STATE.STOPPED ) {
				// console.log("DELETE")
				this.player.nextLevelLayer.removeFromParent();
			this.map.resetMap();
				// console.log( this.player.nextLevelLayer.removeFromParent );
				this.map.level += 1;
				this.map.initMap( this.map.level );
				this.map.plotMap();
				this.player.setPosition( this.playerStartingPosition );

				// this.removeChild( this.player.nextLevelLayer );
				this.player.scheduleUpdate();
				this.state = GameLayer.STATE.STARTED;
			}
							
			break;

		case cc.KEY.space:
		case cc.KEY.up:
			this.player.jump();
			break;

		case cc.KEY.right:
			this.player.goRight();
			// this.tutorialLayer.glowArrowRight();
			break

		case cc.KEY.left:
			this.player.goLeft();
			// this.tutorialLayer.glowArrowLeft();
			break;

		case cc.KEY.z:
			this.player.dragBlock();
			// this.tutorialLayer.glowArrowDown();
			break;

		case cc.KEY.x:
			this.player.toggleSight();
			// this.tutorialLayer.glowArrowUp();
			break;

		case cc.KEY.r:
			this.player.increaseEnergy( 100 );
			break

		case cc.KEY.a:
			console.log( cc.DimLabel.create )

		default:
			break;
		}
	},

	onKeyUp: function( e ) {
		switch ( e ) {

			
		// case cc.KEY.space:
			// break;

		case cc.KEY.right:
			this.player.stopRight();
			// this.tutorialLayer.unGlowArrowRight();
			break

		case cc.KEY.left:
			this.player.stopLeft();
			// this.tutorialLayer.unGlowArrowLeft();
			break;

		case cc.KEY.down:
			// this.tutorialLayer.unGlowArrowDown();
			break;

		case cc.KEY.up:
			// this.tutorialLayer.unGlowArrowUp();
			break;
		}
	},

	update: function() {
		this.showCollectedCoin();

		this.tree1.setPositionX( this.shiftedLayer.getPositionX() * 0.3 + 300 );
		this.tree1.setPositionY( this.shiftedLayer.getPositionY() * 0.5 + 120 );

		this.tree2.setPositionX( this.shiftedLayer.getPositionX() * 0.8 + 900 );
		this.tree2.setPositionY( this.shiftedLayer.getPositionY() * 0.5 + 110 );
	},

	// shiftMap: function( row , column, compensatedPixel ) {
		// this.allShiftableObjects.forEach(function( o ){
			// o.setPosition( new cc.Point( o.getPositionX() + 120 * -column + compensatedPixel , o.getPositionY() + 120 * row ) );
		// }, this);
	// },

});

var StartScene = cc.Scene.extend({

	onEnter: function() {
		this._super();
		document.getElementById('gameCanvas').style.cursor = 'none';
		var layer = new GameLayer();
		layer.init();
		this.addChild( layer );
	},
	
});

GameLayer.STATE = {
	STOPPED: 0,
	STARTED: 1,
}
