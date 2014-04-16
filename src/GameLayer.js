var GameLayer = cc.LayerColor.extend({
	
	init: function() {

		this.debugLabel = cc.LabelTTF.create( 'Space: jump\nE: shoot\nR: refill\nF: toggle sight', 'Arial', 20 );
		this.debugLabel.setPosition( new cc.Point( 100, 500 ) );
		this.debugLabel.enableStroke( new cc.Color3B( 0, 0, 0 ), 3 );
		this.addChild( this.debugLabel, 2 );

		this.debugLabel = cc.LabelTTF.create( 'JumpZ Online: Alpha Test', 'Arial', 20 );
		this.debugLabel.setPosition( new cc.Point( screenWidth / 2,
				screenHeight - 30 ) );
		this.addChild( this.debugLabel, 2 );

		this.map = new Map();
		this.map.setPosition( new cc.Point( 0, 0 ) );
		this.addChild( this.map, 1 );

		this._super();
		
		this.background = cc.Sprite.create ( 'images/sky.png' );
		this.background.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.background.setAnchorPoint( new cc.Point( 0 , 0 ) );
		this.addChild( this.background, 0 );

		this.tree1 = cc.Sprite.create ( 'images/tree1.png' );
		this.tree1.setPosition( new cc.Point( 500 , 200 ) );
		this.tree1.setScale( 2.5 );
		this.addChild( this.tree1, 0 );

		this.tree2 = cc.Sprite.create ( 'images/tree2.png' );
		this.tree2.setPosition( new cc.Point( 900 , 300 ) );
		this.tree2.setScale( 4 );
		this.tree2.setScaleY( 6 );
		this.addChild( this.tree2, 0 );

		this.setPosition( new cc.Point( 0, 0 ) );

		this.crosshair = new Block( 'images/crosshair.png' );
		this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
		this.addChild( this.crosshair, 3 );

		this.player = new Player();
		this.player.setCrosshair( this.crosshair );

		this.player.setHealthBar( new HealthBar() );
		this.player.setPosition( new cc.Point( 200, 200 ) );
		this.addChild( this.player, 2 );
		this.player.setMap( this.map );

		this.accumulateColumn = 0;
		this.accumulateRow = 0;
		
		this.monster = new Monster( Monster.SIZE.MEDIUM );
		this.monster.setPosition( new cc.Point( 300, 200 ) );
		this.monster.setAnchorPoint( new cc.Point( 0, -0.2 ) )
		this.monster.setMap( this.map );

		this.scheduleUpdate();
		this.setKeyboardEnabled( true );
		this.player.scheduleUpdate();
		this.scheduleOnce(function(){
			this.addChild( this.monster, 1 );
			this.monster.scheduleUpdate();
		}, 1);
		return true;
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
			if ( this.player.sp == 0 ) {
				this.player.alertLabel.dim( 255, 0, 8 );
				return 0;
			}

			if ( this.player.isAiming ) {
				this.player.increaseSP( -10 );
				this.crosshair.setPosition( new cc.Point( -1000, 0 ) );
				this.map.hitBlock( this.player.aimedBlockX, this.player.aimedBlockY );
				this.player.isAiming = false;
			}
			break;

		case cc.KEY.f:
			this.player.toggleSight();
			break;

		case cc.KEY.d:
			this.shiftMap( 0, 1 );
			break;

		case cc.KEY.a:
			this.shiftMap( 0, -1 );
			break;

		case cc.KEY.w:
			this.shiftMap( -1, 0 );
			break;

		case cc.KEY.s:
			this.shiftMap( 1, 0 );
			break;

		case cc.KEY.l:
			this.map.walk(
				this.player.convertPixelToBlock(this.player.getPositionX())
				,
				this.player.convertPixelToBlock(this.player.getPositionY())
				);
			break;

		case cc.KEY.r:
			this.player.amountLabel.dim( 255, 0, 8 );
			this.player.increaseSP( 40 );
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
		this.tree1.setPositionY( this.tree1.getPositionY() + row * 40 );
		this.tree1.setPositionX( this.tree1.getPositionX() - column * 10 );
		this.tree2.setPositionY( this.tree2.getPositionY() + row * 40 );
		this.tree2.setPositionX( this.tree2.getPositionX() - column * 20 );
		this.map.shiftMap( row, column );
		this.player.setPosition( new cc.Point( this.player.getPositionX() + 120 * -column,
			this.player.getPositionY() + 120 * row ) );
		this.monster.setPosition( new cc.Point( this.monster.getPositionX() + 120 * -column,
			this.monster.getPositionY() + 120 * row ) );
	},

	update: function() {
		// if ( this.player.getPositionX() >= screenWidth * 4.0 / 5 ) {
		if ( this.player.getPositionX() >= 790 ) {
			this.shiftMap( 0, 1 );
		// } else if ( this.player.getPositionX() <= screenWidth / 5.0 ) {
		} else if ( this.player.getPositionX() <= 180 ) {
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
