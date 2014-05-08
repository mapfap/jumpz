var Map = cc.Node.extend({

	ctor: function( minimapController, shiftedLayer, level ) {
		this._super();
		this.minimapController = minimapController;
		this.shiftedLayer = shiftedLayer;

		this.schedule(function(){
				this.timeUsed += 1;
		}, 1 );
		
		// beware BUG here.. "DO NOT" use this value for array range.
		// this value is numbers of blocks shown in the screen.
		//BLOCK_WIDTH_NUMBER BLOCK_HEIGHT_NUMBER

		
		this.readableMaps = [
		

		[ // Level 1
			'___________________*___',
			'^__________________o*__',
			'***_##_____________****',
			'______######___________',
			'____________####_______',
			'__**__________###______',
			'_________________##____',
			'_______o####__**__##___',
			'_______#####___________',
			'#######################',
		],

		[ // Level 1
			'_________#_______#_____',
			'_________#_______#_____',
			'_________#_______#_____',
			'_________#_______#_____',
			'________*#_______#_____',
			'_________#_____________',
			'______***________#_____',
			'__#_#____#_______#_____',
			'###_#################_#',
			'___#_________########__',
			'_______#_____###_______',
			'____#____###______#####',
			'_#____________#####____',
			'#*x^___________________',
			'##xxx##################',
		],


		


		[ // Level 1
			'_____________________*',
			'___________________^_*',
			'_________________##x#*',
			'_____*_______________*',
			'____*_########________',
			'___*_#________________',
			'_________________#____',
			'##___#__####__________',
			'____________*_*_**____',
			'______________________',
			'######################',
		],

		[ // Level 2
			'_________*',
			'_____*___*',
			'____*_____',
			'___*_#_^__',
			'_____#____',
			'##___#____',
			'_____#____',
			'_____#___*',
			'##########',
		],

		[ // Level 1
		
			'______________****____^',
			'________________xxxxxxx',
			'________________#######',
			'______________######___',
			'_________######________',
			'_________####__________',
			'_________####__________',
			'_________####__________',
			'_____*___####__________',
			'_____**________________',
			'_____***_______________',
			'_______________________',
			'#######################',

		],

		[ // Level 5
			'_________^',
			'__________',
			'_______xxx',
			'__________',
			'###_______',
			'__________',
			'______**__',
			'____#*####',
			'___****___',
			'____******',
			'##__**____',
			'____**####',
			'____**____',
			'####**____',
			'____**____',
			'____**####',
			'____**____',
			'###_**____',
			'____**____',
			'____**__##',
			'____**____',
			'____****__',
			'###_______',
			'__________',
			'__________',
			'____##_###',
			'__________',
			'__________',
			'###_______',
			'__________',
			'____xxxx__',
			'_____#____',
			'___#**##_#',
			'___#######',
			'#__#__##_#',
			'##########',
		],


		[
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'xxx__________________xxxxx_____________________#_________xx',
			'xx___**_________________x______________________#_________xx',
			'x____##_________###_________***__##__****___#######______xx',
			'x___xxxxxxxxxxxxxxxx_____**xxxxxxxxxxxxxxxxxxxxxxxx______xx',
			'x___xxxxxx________xxx_**_xxx***###__##########___________xx',
			'x__xxxxxxx________xxxxxxxx******_____#########_____######xx',
			'x_xxxxxxx_________xxxxxxxxxxxxxxxx___#########_________**xx',
			'xxx###############################_________________######xx',
			'xxx__##_*******___#_#________##**___________________****_xx',
			'xxx__##_*******___#*#________#_**___###############_****_xx',
			'xxx__####################____xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'xxx__#####__________######____#######_________###########xx',
			'xxx__#####__________#######____####__________***____#####xx',
			'xxx__#####__________########________******___###_______#xxx',
			'xxx__xxxxxxxxxxxxxxxxxxxxxxxx_______******__#####_______xxx',
			'xxx___***_**______xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx___xxx',
			'xxx__********_____############################_____##___xxx',
			'xxx___******__##############         #########*******__#xxx',
			'xxx____****_______###################################___xxx',
			'xxx_____**______________________________________________xxx',
			'xxx############_________________________________________xxx',
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx__xxxxxxxxxxxxxxxxxxxxxxxxx',
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx^_____xxxxxxxxxxxxxxxxxxxxxxx',
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		],

		[ // Level 3
			'**********',
			'__________',
			'^____#____',
			'xx___#____',
			'*____#####',
			'____#_____',
			'___#**____',
			'##########',
		],

		[ // Level 4
			'__________',
			'__________',
			'___^xxxx__',
			'_____#____',
			'___***##_#',
			'____#_####',
			'#__#_____#',
			'##########',
		],


		

		
		// [ // Free Roam: Level 0
		// 	'#############################################################',
		// 	'#_________________________________##___#_#__##__________#####',
		// 	'#____****___##________***___________#____#__##______________#',
		// 	'#___*_____*_###_______###__________##__#_###________________#',
		// 	'#_____*___________*_________________________________________#',
		// 	'#__________###_########______*____###__#_#####______________#',
		// 	'###__#__######_________________##########________##_________#',
		// 	'#####___#####################################################',
		// 	'#___________##############_________*__________#########_____#',
		// 	'#___________#______________________________*________________#',
		// 	'#___********___________*******_____##__________________####_#',
		// 	'#______##########_____________*__________________#########__#',
		// 	'####__############_#######_____############______############',
		// 	'#_#____#_________________#####____________###########___#####',
		// 	'#_#____#____#####____________#________________###########___#',
		// 	'#_#____#_____________________###________________*****___#___#',
		// 	'#_#____#________******_______#############______________#___#',
		// 	'#_#____#_____________________###_____________****_______#___#',
		// 	'#__################_____###############______###########____#',
		// 	'#_#____#_____________________###________________________#___#',
		// 	'#_#____#_________**_*_*________________####_________________#',
		// 	'#___________________________#####____________###########____#',
		// 	'#___________********____________******************__________#',
		// 	'#___________________________________________________________#',
		// 	'#############################################################',
		// ],

		// [
		// 	'###############################################################################################',
		// 	'#_________#___#____#_____#____#___#_##________________________________________________________#',
		// 	'#_______#######################################################################################',
		// 	'#__##_________________xXXXXXXXXX____**_________________##________###########_________________^#',
		// 	'#####_______________________________xx__*______________##_______*************_________________#',
		// 	'#####___#########___x#####x_____________#______________##______****#**#**#****______####______#',
		// 	'#*******#*******_______****x__#_________#______________##_____*****************_____####______#',
		// 	'#*******#*x#x#x#***#___x###x***********###_____________##____****#****#****#****____XXXXXX#####',
		// 	'#*******#*x##x##***x___xxxxxxx##########xx###############___*********************_____________#',
		// 	'#*******#xxxxx#x***#______________________***************_____________________________________#',
		// 	'###############################################################################################',
		// ],

		[
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'x________________________________________x',
			'x________________________________________x',
			'x________________xx____xx________________x',
			'x_________#########****############______x',
			'x**______________xxxxxxxx________________x',
			'xxxxxxxx_________##____xx____________****x',
			'x______________**xx____xx_______xxxxxxxxxx',
			'x________xxxxxxxxxxx___xx*****___________x',
			'x______xxxxxxxxxxxxx___xxxxxxxx______****x',
			'x____xxxxx****_________xx___________xxxxxx',
			'xxxxxxxxx____________xxxx________________x',
			'xxxx___________________xx______##########x',
			'xx_______xxxxxxxxxxxxxxxx***____#########x',
			'xx______xxx______###########*____####***#x',
			'xx******xx________###########*____###___#x',
			'xxxxxxxxx_____*____###########*_________#x',
			'x_____________#*____###########*____#####x',
			'x____________###*____###########*____####x',
			'x___xxxxxxxxx####*____###########*____###x',
			'x___xxx_____x#####*____###########*____##x',
			'x___xx___xx_xx#####*____xxxxxxxxxxx_____#x',
			'x___x___xxx_xxx#####*____________________x',
			'x______xxxx___^xx####*___________________x',
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		],

		[
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'x______##_________###____#_______________________#x______________________________x',
			'x_________________##_____________________________#x__________________****________x',
			'x___________###________#####_____________________#x___xxxxxxxxxxxxxxxxxxxx_______x',
			'x____xxxxxxxxxxxxxxxxxxxxxxxxxxx___**____________#x____________________xxx_______x',
			'xxxxxx_____________________________##___*________#x____*************___xxx#_#____x',
			'xxxxx___________________________________##_______#xxxxxxxxxxxxxx#****__xxx_#_#___x',
			'x*******xxxxxxxxxxxx____***x_____******_xx_______#x_____________****___xxx#_#_#__x',
			'x*******xxx#____***x___xxxxxxxxxxxxxxxxxxxxxxxxxxxx_****#****#****#****xxx_xxxxxxx',
			'x##*****#xx_#_##***x______________________________x__**xxxxxxxxxxxxxxxxxxx_______x',
			'x*******#____#x***#___________________**********__________________**####x#______^x',
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		],


		];

		// convert array of string to 2D char, in order to be mutable object.
		
		
		this.initStaticColor();
		this.miniChildren = [];
		this.level = level;

		this.initMap( this.level );
		
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.childrenHash = {};

		this.shiftValueRow = 0;
		this.shiftValueColumn = 0;
		this.children = [];
		this.plotMap();

		this.initPlayerMarker();
		
	},

	initPlayerMarker: function() {

		// this.playerMarkerPoint = new cc.LayerColor();
		// this.playerMarkerPoint.init( Map.COLOR.RED, this.minimapSize, this.minimapSize );
		
		this.playerMarkerPoint = new cc.Sprite.create('images/marker.png');
		this.playerMarkerPoint.setScale( this.playerMarkerPointScale );
		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/marker.png' );
		animation.addSpriteFrameWithFile( 'images/marker_none.png' );
		animation.addSpriteFrameWithFile( 'images/marker.png' );
		animation.setDelayPerUnit( 0.3 );
		// var movingAction = cc.Animate.create( animation );

		var movingAction = cc.RepeatForever.create( cc.Animate
				.create( animation ) );
		this.playerMarkerPoint.runAction( movingAction );
		this.playerMarkerPoint.setAnchorPoint( new cc.Point( 0, 0 ) );
		this.minimapController.addChild( this.playerMarkerPoint, 3 );
	},

	resetMap: function() {
		this.setPosition( new cc.Point( 0, 0 ) );
		this.shiftValueRow = 0;
		this.shiftValueColumn = 0;
	},

	setPlayerMarker: function( blockX, blockY ) {
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;

		var posX = c * this.minimapSize;
		var posY = ( this.map.length - r - 1 ) * this.minimapSize;
		
		this.playerMarkerPoint.setPosition( new cc.Point( posX, posY ) );
	},

	initStaticColor: function() {
		var opacity = 100;
		Map.COLOR.RED = new cc.Color4B( 255, 0, 0, opacity * 2 );
		Map.COLOR.BLUE = new cc.Color4B( 0, 0, 255, opacity );
		Map.COLOR.GREEN = new cc.Color4B( 0, 255, 0, opacity * 2 );
		Map.COLOR.BLACK = new cc.Color4B( 0, 0, 0, opacity );
		Map.COLOR.GRAY = new cc.Color4B( 100, 100, 100, opacity );
		Map.COLOR.YELLOW = new cc.Color4B( 255, 255, 0, opacity );
		Map.COLOR.WHITE = new cc.Color4B( 255, 255, 255, opacity );

	},

	initMap: function( level ) {
		this.map = [];
		for ( var i = 0; i < this.readableMaps[level].length; i++ ) {
			var line = [];
			for ( var j = 0 ; j < this.readableMaps[level][i].length; j++ ) {
				line.push( this.readableMaps[level][i][j] );
			}
			this.map.push( line );
		}

		this.initMinimap( true );
	},

	initMinimap: function( isFirstTime ) {
		
		if ( isFirstTime ) {
			this.monsterFirstTime = {};
			this.collectedCoin = 0;
			this.availableCoin = 0;
			this.timeUsed = 0; // seconds

			
		}

		var max = Math.max( this.map.length, this.map[0].length );
		this.minimapSize = Math.floor( MAXIMUM_MINIMAP_SIZE / max );
		this.minimapController.resize( this.minimapSize * this.map[0].length, this.minimapSize * this.map.length );
		this.minimapController.setText( this.level );
		this.playerMarkerPointScale = Math.ceil( this.minimapSize / 40 );

		for ( var i = 0; i < this.miniChildren.length; i++ ) {
			this.minimapController.removeChild( this.miniChildren[i] );
		}
		this.miniChildren = [];

		for ( var r = 0; r < this.map.length; r++ ) {
			for ( var c = 0; c < this.map[0].length; c++ ) {

				var color = null;

				if ( this.map[ r ][ c ] == '*' ) {
					// color = Map.COLOR.YELLOW;
					if ( isFirstTime ) {
						this.availableCoin += 1;
					}
					color = Map.COLOR.WHITE;
				} else if ( this.map[ r ][ c ] == '^' ) {
					color = Map.COLOR.GREEN;
				} else if ( this.map[ r ][ c ] == 'x' ) {
					color = Map.COLOR.BLACK;
				} else if ( this.map[ r ][ c ] == '#' ) {
					color = Map.COLOR.BLACK;
				} else if ( this.map[ r ][ c ] == '_' ) {
					color = Map.COLOR.WHITE;
				} else if ( this.map[ r ][ c ] == 'o' ) {
					color = Map.COLOR.WHITE;
				}

				if ( color != null ) {
					// console.log(color)
					var posX = c * this.minimapSize;
					var posY = ( this.map.length - r - 1 ) * this.minimapSize;
					var s = new cc.LayerColor();
					s.init( color, this.minimapSize, this.minimapSize );
					s.setPosition( new cc.Point( posX, posY ) );
					this.minimapController.addChild( s );
					this.miniChildren.push( s );
				}

				color = null;
				
			}
		}
		// console.log( this.availableCoin )
	},

	setPositionX: function( positionX ) {
		this._super( positionX );
		this.shiftedLayer.setPosition( this.shiftValueColumn * -BLOCK_PIXEL + this.getPositionX(), this.shiftValueRow * BLOCK_PIXEL + this.getPositionY() );
	},

	setPositionY: function( positionY ) {
		this._super( positionY );
		this.shiftedLayer.setPosition( this.shiftValueColumn * -BLOCK_PIXEL + this.getPositionX(), this.shiftValueRow * BLOCK_PIXEL + this.getPositionY() );
	},

	setBlock: function( r, c, value ) {
		this.map[ r ][ c ] = value;
		this.initMinimap( false );
	},

	getBlockDirection: function( blockX, blockY, headingDirection ) {
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;

		if ( this.map[ r + 1 ][ c ] != '_' && this.map[ r + 1 ][ c ] != 'o' ) {
			if ( this.map[ r ][ c - headingDirection ] == '_' || this.map[ r ][ c - headingDirection ] == 'o' ) {
				return Player.BLOCK_DIRECTION.SLIDE;
			} else {
				return Player.BLOCK_DIRECTION.NONE;
			}
		} else if ( this.map[ r + 1 ][ c ] == '_' || this.map[ r + 1 ][ c ] == 'o' ) {
			return Player.BLOCK_DIRECTION.FALL;
		}

		return Player.BLOCK_DIRECTION.NONE;
	},

	dragBlock: function( blockX, blockY, headingDirection ) {
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;

		if ( this.map[ r + 1 ][ c ] != '_' && this.map[ r + 1 ][ c ] != 'o') {
			// console.log("PULL");

			if ( this.map[ r ][ c - headingDirection ] == '_' || this.map[ r ][ c - headingDirection ] == 'o' ) {
				this.map[ r ][ c - headingDirection ] = '#'
				this.map[ r ][ c ] = '_'
				this.plotMap();
			}

			return 0;
		}
		// r and c is for the real array index access
		this.setBlock( r, c, '_' );

		var newPosition = null;
		// console.log("r="+  );
		for ( var l = r; l < this.map.length ; l++ ) {
			if ( this.map[ l ][ c ] == '#' || this.map[ l ][ c ] == 'x' ) {
				newPosition = l - 1;
				// console.log("n="+ newPosition) ;
				break;
			}
		}

		this.setBlock( newPosition, c, '#' );

		this.plotMap();
	},

	shiftMap: function( diffRow, diffColumn ) {
		this.shiftValueRow += diffRow;
		this.shiftValueColumn += diffColumn;
		this.plotMap();
		// console.log(this.shiftValueRow+","+this.shiftValueColumn)
	},

	isOutOfBound: function( row, column ) {
		return row < 0 || row >= this.map.length || column < 0 || column >= this.map[0].length;
	},

	plotMap: function() {
		for ( var i = 0; i < this.children.length; i++ ) {
			this.removeChild( this.children[i] );
		}
		this.children = [];

		for ( var r = this.shiftValueRow - 1; r < BLOCK_HEIGHT_NUMBER + this.shiftValueRow + 1; r++ ) {
			for ( var c = this.shiftValueColumn - 1; c < BLOCK_WIDTH_NUMBER + this.shiftValueColumn + 1; c++ ) {

				var type = null;
				// console.log( "r"+r +"...c"+c);


				if ( this.isOutOfBound( r, c ) ) {
					type = Block.TYPE.DIRT;
				} else {
					switch ( this.map[ r ][ c ] ) {
					case 'o':
						if ( this.monsterFirstTime[r + "," + c] == null ) {
							var x = ( c - this.shiftValueColumn ) * BLOCK_PIXEL;
							var y = ( BLOCK_HEIGHT_NUMBER - ( r - this.shiftValueRow ) - 1 ) * BLOCK_PIXEL;
							this.getParent().spawnMonster(x, y);
							this.monsterFirstTime[r + "," + c] = true;
						}
					case '_':
						if ( this.map[ r + 1 ][ c ] == '#' ) {
							type = Block.TYPE.GRASS;
						}
						break;
					case '#':
						type = Block.TYPE.DIRT;
						break;
					case '*':
						type = Block.TYPE.COIN;
						break;
					case 'x':
						type = Block.TYPE.METAL;
						break;				
					case '^':
						type = Block.TYPE.CHECKPOINT;
						break;
					}
				}

				if ( type != null ) {
					var name = r + "," + c;
					var s = new Block( type, name );
					var posX = ( c - this.shiftValueColumn ) * BLOCK_PIXEL;
					var posY = ( BLOCK_HEIGHT_NUMBER - ( r - this.shiftValueRow ) - 1 ) * BLOCK_PIXEL;
					s.setPosition( new cc.Point( posX, posY ) );
					this.addChild( s );
					this.children.push( s );
					this.childrenHash[ name ] = s;
				}

				type = null;
				
			}
		}
	},

	touch: function( corners ) {

		for ( var i = 0; i < corners.length; i++ ) {
			if ( corners[i].isAThing() ) {
				var blockX = corners[i].getBlockX();
				var blockY = corners[i].getBlockY();

				var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
				r += this.shiftValueRow;
				var c = blockX;
				c += this.shiftValueColumn;
				
				if ( ! this.isOutOfBound( r, c ) ) {
					// console.log((r - 1) + "," + c )

					// console.log(  this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.CHECKPOINT  );
					// console.log( r + "," + c )

					if ( this.childrenHash[ (r) + "," + c ] == null ) {
						return -1;
					}

					if ( this.childrenHash[ (r) + "," + c ].type == Block.TYPE.DIRT ) {
						this.childrenHash[ (r - 1) + "," + c ].touched();
					} else if ( this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.COIN ) {
							this.setBlock( r, c, "_" );
							this.collectedCoin += 1;
							this.getParent().player.collectACoin();
							this.plotMap();
					} else if ( this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.CHECKPOINT ) {
						if ( this.getParent().state == GameLayer.STATE.STARTED ) {

							this.getParent().player.showNextLevelPopup();
						}

					} else {
						// this.childrenHash[ (r) + "," + c ].touched();
					}
					
				}
			}
		}
	},

	isAThing: function( blockX, blockY ) {
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return false;
		}

		// return this.map[ r ][ c ] == '#' || this.map[ r ][ c ] == '*';
		return this.map[ r ][ c ] != '_' && this.map[ r ][ c ] != 'o';
	},

	isBlock: function( blockX, blockY ) {
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return true;
		}

		return this.map[ r ][ c ] == '#' || this.map[ r ][ c ] == 'x';
	},

	isAimable: function( blockX, blockY ) {
		// console.log( blockX, blockY )
		var r = BLOCK_HEIGHT_NUMBER - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return false;
		}
		// console.log(r, c)
		return this.map[ r ][ c ] == '#';
	},

	getBlocks: function() {
		return this.blocks;
	},

});

Map.COLOR = {
	RED: null,
	BLUE: null,
	GREEN: null,
	BLACK: null,
	GRAY: null,
	YELLOW: null,
	WHITE: null,
}