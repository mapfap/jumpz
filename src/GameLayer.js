var GameLayer = cc.LayerColor.extend({
	
	init: function() {
		this._super();
		this.setPosition( new cc.Point( 0, 0 ) );

		this.allRigidBodies = [];
		this.allShiftableObjects = [];

		this.initShiftedLayer();
		this.initMap();
		this.initBackground();
		this.initPlayer();
		// this.initMonster();

		this.initHelperUI();
		// this.initInventory();

		this.scheduleUpdate();
		this.player.scheduleUpdate();

		this.setKeyboardEnabled(true);

		// this.scheduleOnce(function(){
			// this.addChild( this.monster, 1 );
			// this.monster.scheduleUpdate();
		// }, 1);

		return true;
	},

	initInventory: function() {
		this.inventory = new Inventory();
		this.addChild( this.inventory, 3 );

		this.cursor = new Cursor();
		this.addChild( this.cursor, 5 );
		this.inventory.setCursor( this.cursor );

	},

	initPlayer: function() {
		this.player = new Player();
		this.player.setStatusBar( new StatusBar() );
		this.player.setPosition( new cc.Point( 200, 240 ) );
		this.addChild( this.player, 2 );
		this.player.setMap( this.map );
		this.allRigidBodies.push( this.player );
		this.allShiftableObjects.push( this.player );
		this.player.setAllRigidBodies( this.allRigidBodies );

		this.crosshair = new cc.Sprite.create( 'images/crosshair.png' );
		this.crosshair.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
		this.allShiftableObjects.push( this.crosshair );
		this.addChild( this.crosshair, 3 );
		this.player.setCrosshair( this.crosshair );

		// var flash = cc.Sprite.create ( 'images/blocks/dirt.png' );
		// flash.setScale(30);
		var flash = cc.Sprite.create( 'images/sky.png' );
		flash.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( flash, 10 );
		flash.setOpacity( 0 );
		this.player.setFlash( flash );

		this.player.setShiftedLayer( this.shiftedLayer );

	},

	initMonster: function() {
		this.monster = new PatrolMonster( Monster.SIZE.MEDIUM );
		this.monster.setPosition( new cc.Point( 550, 100 ) );
		this.monster.setAnchorPoint( new cc.Point( 0, -0.2 ) )
		this.monster.setMap( this.map );
		this.allRigidBodies.push( this.monster );
		this.allShiftableObjects.push( this.monster );
		this.monster.setAllRigidBodies( this.allRigidBodies );

	},
	initHelperUI: function() {
		this.guideLabel = cc.LabelTTF.create( 'Space: jump\nUp: toggle sight\nDown: drag\n', 'Arial', 20 );
		this.guideLabel.setPosition( new cc.Point( 100, 500 ) );
		this.guideLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.addChild( this.guideLabel, 4 );

		this.headLabel = cc.LabelTTF.create( 'JumpZ Puzzle: Alpha Test', 'Arial', 20 );
		this.headLabel.setPosition( new cc.Point( SCREEN_WIDTH / 2,
				SCREEN_HEIGHT - 30 ) );
		this.addChild( this.headLabel, 4 );
	},
	
	initMap: function() {
		this.map = new Map( this.shiftedLayer );
		this.map.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.map, 1 );

		Corner.map = this.map;
	},

	initBackground: function() {
		this.background = cc.Sprite.create( 'images/sky.png' );
		this.background.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.background.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( this.background, 0 );

		this.tree1 = cc.Sprite.create( 'images/tree1.png' );
		// this.tree1.setPosition( new cc.Point( 500 , 200 ) );
		this.tree1.setScale( 2.5 );
		this.addChild( this.tree1, 0 );

		this.tree2 = cc.Sprite.create( 'images/tree2.png' );
		// this.tree2.setPosition( new cc.Point( 900 , 300 ) );
		this.tree2.setScale( 5 );
		this.tree2.setScaleY( 7 );
		this.addChild( this.tree2, 0 );

		this.tree3 = cc.Sprite.create( 'images/tree1.png' );
		this.tree3.setOpacity( 50 );
		// this.tree2.setPosition( new cc.Point( 900 , 300 ) );
		this.tree3.setScaleX( 6 );
		this.tree3.setPosition( 1000, 600 );
		this.shiftedLayer.addChild( this.tree3, 0 );
	},

	initShiftedLayer: function() {
		this.shiftedLayer = new cc.LayerColor();
		this.addChild( this.shiftedLayer, 9 )
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

		case cc.KEY.down:
			this.player.dragBlock();
			break;

		case cc.KEY.up:
			this.player.toggleSight();
			break;

		case cc.KEY.r:
			this.player.increaseEnergy( 100 );
			break

		case cc.KEY.a:
			// console.log( this.player.accumulatedX, this.player.accumulatedY )
			console.log( this.shiftedLayer.getPosition() )

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

	update: function() {
		this.tree1.setPositionX( this.shiftedLayer.getPositionX() / 30 + 300 );
		this.tree1.setPositionY( this.shiftedLayer.getPositionY() / 100 + 120 );

		this.tree2.setPositionX( this.shiftedLayer.getPositionX() / 10 + 900 );
		this.tree2.setPositionY( this.shiftedLayer.getPositionY() / 100 + 110 );

		// this.tree1.setPositionY( this.tree1.getPositionY() + row * 40 );
		// this.tree1.setPositionX( this.tree1.getPositionX() - column * 10 );
	
		// this.tree2.setPositionY( this.tree2.getPositionY() + row * 40 );
		// this.tree2.setPositionX( this.tree2.getPositionX() - column * 20 );
	},

	// shiftMap: function( row , column, compensatedPixel ) {
		// this.tree1.setPositionY( this.tree1.getPositionY() + row * 40 );
		// this.tree1.setPositionX( this.tree1.getPositionX() - column * 10 );
		// this.tree2.setPositionY( this.tree2.getPositionY() + row * 40 );
		// this.tree2.setPositionX( this.tree2.getPositionX() - column * 20 );
		// this.map.shiftMap( row, column );

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
