var GameLayer = cc.LayerColor.extend({
	
	init: function() {
		this._super();

		this.state = GameLayer.STATE.GUIDE;
		this.showGuide();
		this.setKeyboardEnabled( true );
		this.setPosition( new cc.Point( 0, 0 ) );
		
		return true;
	},

	showGuide: function() {
		this.guide = cc.Sprite.create( 'images/guide.png' );
		this.guide.setPosition( new cc.Point( 0 , 0 ) );
		this.guide.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( this.guide, 0 );
	},

	startGame: function() {
		this.playerStartingPosition = new cc.Point( 120, 120 );
		this.initMinimapController();

		this.initShiftedLayer();
		this.initMap();
		this.initBackground();
		this.initPlayer();

		this.initHelperUI();

		this.scheduleUpdate();
		this.player.scheduleUpdate();

		this.state = GameLayer.STATE.STARTED;

		cc.AudioEngine.getInstance().playMusic( 'sounds/Old Souls.mp3', true );
		this.monsters = [];

		this.guide.removeFromParent();
		this.state = GameLayer.STATE.STARTED;

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
		this.player = new Player( true );
		this.player.setStatusBar( new StatusBar() );
		this.player.setPosition( this.playerStartingPosition );
		this.addChild( this.player, 2 );
		this.player.setMap( this.map );
		// this.allRigidBodies.push( this.player );
		// this.allShiftableObjects.push( this.player );
		// this.player.setAllRigidBodies( this.allRigidBodies );

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

	spawnMonster: function( x, y ) {
		var monster = new PatrolMonster( false, Monster.SIZE.MEDIUM );
		// monster.setMap( this.map );
		// monster.setShiftedLayer( this.shiftedLayer );
		monster.setPosition( new cc.Point( x - this.shiftedLayer.getPositionX() - 20 , 100 + y - this.shiftedLayer.getPositionY() ) );
		this.shiftedLayer.addChild( monster );
		this.monsters.push( monster );
	},

	removeMonsters: function() {
		for ( var i = 0; i < this.monsters.length; i++ ) {
			this.shiftedLayer.removeChild( this.monsters[i] );
			// console.log("clear")
		}
		this.monsters = [];
	},

	showCollectedCoin: function() {
		this.coinLabel.setString( this.player.totalCoin );
		this.coinIconColored.setOpacity( 255 );
		this.scheduleOnce(function(){
			this.coinIconColored.setOpacity( 0 );
		}, 0.1);
	},

	initHelperUI: function() {
		this.coinIcon = cc.Sprite.create( 'images/blocks/coin.png' );
		this.coinIcon.setScale( 0.5 );
		this.coinIcon.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.coinIcon.setPosition( new cc.Point( 20, SCREEN_HEIGHT - 90 ) );
		this.addChild( this.coinIcon, 4 );

		this.coinIconColored = cc.Sprite.create( 'images/blocks/coin_colored.png' );
		this.coinIconColored.setScale( 0.5 );
		this.coinIconColored.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.coinIconColored.setPosition( new cc.Point( 20, SCREEN_HEIGHT - 90 ) );
		this.addChild( this.coinIconColored, 5 );
		this.coinIconColored.setOpacity( 0 );



		// console.log( (new Date()) this.map.startTime)

		var xLabel = cc.LabelTTF.create( 'x', 'Arial', 30 );
		xLabel.setPosition( new cc.Point( 85, SCREEN_HEIGHT - 70 ) );
		xLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.addChild( xLabel, 4 );

		this.coinLabel = cc.LabelTTF.create( '0', 'Arial', 30 );
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
		this.shiftedLayer.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.shiftedLayer, 9 );
		Corner.shiftedLayer = this.shiftedLayer;
	},

	onKeyDown: function( e ) {
		switch ( e ) {

		case cc.KEY.q:
			this.removeMonsters();
			// this.player.unscheduleUpdate();
			this.map.resetMap();
			this.map.level = 0;
			this.map.initMap( this.map.level );
			this.map.plotMap();
			this.player.setPosition( this.playerStartingPosition );
			// this.player.scheduleUpdate();
							
		break;

		case cc.KEY.y:
			this.removeMonsters();
			// this.player.unscheduleUpdate();
			this.map.resetMap();
			this.map.initMap( this.map.level );
			this.map.plotMap();
			this.player.setPosition( this.playerStartingPosition );
			// this.player.scheduleUpdate();
							
		break;

		case cc.KEY.t:
			this.removeMonsters();
			// this.player.unscheduleUpdate();
			this.map.resetMap();
			this.map.level += 1;
			this.map.initMap( this.map.level );
			this.map.plotMap();
			this.player.setPosition( this.playerStartingPosition );
			// this.player.scheduleUpdate();
							
		break;

		case cc.KEY.enter:
			if ( this.state == GameLayer.STATE.STOPPED ) {
				this.removeMonsters();
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
			if ( this.state == GameLayer.STATE.OVER ) {

				this.removeMonsters();
				this.player.gameoverLayer.removeFromParent();
				this.map.resetMap();
				this.map.level = 0;
				this.map.initMap( this.map.level );
				this.map.plotMap();
				this.player.totalCoin = 0;
				this.player.increaseHealth( this.player.MAXIMUM_HEALTH ); 
				this.player.increaseEnergy( this.player.MAXIMUM_ENERGY, true );
				this.player.setPosition( this.playerStartingPosition );

				// this.removeChild( this.player.nextLevelLayer );
				this.player.scheduleUpdate();
				this.scheduleUpdate();
				this.state = GameLayer.STATE.STARTED;
				// console.log("")
			}

			if ( this.state == GameLayer.STATE.GUIDE ) {
				this.startGame();
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
			this.player.buyEnergy();
			break

		case cc.KEY.a:
			console.log( cc.DimLabel.create )

		default:
			break;
		}
	},

	onKeyUp: function( e ) {
		switch ( e ) {

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

	checkMonstersAttack: function() {
		for ( var i = 0; i < this.monsters.length; i++ ) {
			if ( this.isHit( this.player, this.monsters[i] ) ) {
				this.player.takeDamage();
				// this.shiftedLayer.removeChild( this.monsters[i] );
			}
		}
	},

	isHit: function( obj1, obj2 ) {
		var rect1 = obj1.getBoundingBoxToWorld();
		var rect2 = obj2.getBoundingBoxToWorld();
		rect1.width = 120;
		rect1.height = 120;

		// var rect2 = cc.rect( obj2.x + 50, obj2.y + 50, obj2.width - 50, obj2.height - 50 );
		// var obj2 = obj2.getBoundingBoxToWorld();
		// console.log( rect1.x, rect1.y, rect1.width, rect1.height )
		// console.log( rect2.x, rect2.y, rect2.width, rect2.height )
		// console.log( obj2.x, obj2.y, obj2.width, obj2.height )
		// console.log( "-----------------------")
		// rect2 = cc.rect( obj2.x + 60, obj2.y + 60, obj2.width - 20, obj2.height - 20 );

		return cc.rectOverlapsRect( rect1, rect2 );
	},

	update: function() {

		this.checkMonstersAttack();

		this.tree1.setPositionX( this.shiftedLayer.getPositionX() * 0.3 + 300 );
		this.tree1.setPositionY( this.shiftedLayer.getPositionY() * 0.5 + 120 );

		this.tree2.setPositionX( this.shiftedLayer.getPositionX() * 0.8 + 900 );
		this.tree2.setPositionY( this.shiftedLayer.getPositionY() * 0.5 + 110 );
	},

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
	OVER: 2,
	GUIDE: 3,
}
