var Map = cc.Node.extend({

	ctor: function( shiftedLayer, level ) {
		this._super();
		this.shiftedLayer = shiftedLayer;
		this.collectedCoin = 0;
		// beware BUG here.. "DO NOT" use this value for array range.
		// this value is numbers of blocks shown in the screen.
		this.SCREEN_WIDTH = 10;
		this.SCREEN_HEIGHT = 8;
		
		this.readableMaps = [

		[ // Free Roam: Level 0
			'#############################################################',
			'#_________________________________##___#_#__##__________#####',
			'#____****___##________***___________#____#__##______________#',
			'#___*_____*_###_______###__________##__#_###________________#',
			'#_____*___________*_________________________________________#',
			'#__________###_########______*____###__#_#####______________#',
			'###__#__######_________________##########________##_________#',
			'#####___#####################################################',
			'#___________##############____________________#########_____#',
			'#___________#_______________________________________________#',
			'#______________________*******_____##__________________####_#',
			'#______##########________________________________#########__#',
			'####__############_#######_____############______############',
			'#_#____#_________________#####____________###########___#####',
			'#_#____#____#####____________#________________###########___#',
			'#_#____#_____________________###________________________#___#',
			'#_#____#________******_______#############______________#___#',
			'#_#____#_____________________###________________________#___#',
			'#__################_____###############______###########____#',
			'#_#____#_____________________###________________________#___#',
			'#_#____#_________**_*_*________________####_________________#',
			'#___________________________#####____________###########____#',
			'#___________********________________________________________#',
			'#___________________________________________________________#',
			'#############################################################',
		],

		[ // Level 1
			'_________*',
			'_____*___*',
			'____*_____',
			'___*_#_^__',
			'_____#____',
			'##___#____',
			'_____#___',
			'_____#___*',
			'##########',
		],

		[ // Level 2
			'**********',
			'__________',
			'^____#____',
			'xx___#____',
			'*____#####',
			'____#_____',
			'___#**____',
			'##########',
		],

		[ // Level 3
			'__________',
			'__________',
			'____xxxx__',
			'_____#____',
			'___***##_#',
			'____#_####',
			'#__#__##^#',
			'##########',
		],
		
		];

		// convert array of string to 2D char, in order to be mutable object.
		this.level = level;
		this.initMap( this.level );
		

		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.childrenHash = {};

		this.shiftValueRow = 0;
		this.shiftValueColumn = 0;
		this.children = [];
		this.plotMap();

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
	},

	setPositionX: function( positionX ) {
		this._super( positionX );
		this.shiftedLayer.setPosition( this.shiftValueColumn * -120 + this.getPositionX(), this.shiftValueRow * 120 + this.getPositionY() );
	},

	setPositionY: function( positionY ) {
		this._super( positionY );
		this.shiftedLayer.setPosition( this.shiftValueColumn * -120 + this.getPositionX(), this.shiftValueRow * 120 + this.getPositionY() );
	},

	setBlock: function( r, c, value ) {
		this.map[ r ][ c ] = value;
	},

	dragBlock: function( blockX, blockY, headingDirection ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;

		if ( this.map[ r + 1 ][ c ] != '_' ) {
			console.log("PULL");

			if ( this.map[ r ][ c - headingDirection ] == '_' ) {
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

		for ( var r = this.shiftValueRow - 1; r < this.SCREEN_HEIGHT + this.shiftValueRow + 1; r++ ) {
			for ( var c = this.shiftValueColumn - 1; c < this.SCREEN_WIDTH + this.shiftValueColumn + 1; c++ ) {

				var type = null;
				// console.log( "r"+r +"...c"+c);
				if ( this.isOutOfBound( r, c ) ) {
					type = Block.TYPE.DIRT;
				} else if ( this.map[ r ][ c ] == '*' ) {
					type = Block.TYPE.COIN;
				} else if ( this.map[ r ][ c ] == '^' ) {
					type = Block.TYPE.CHECKPOINT;
				} else if ( this.map[ r ][ c ] == 'x' ) {
					type = Block.TYPE.METAL;
				} else if ( this.map[ r ][ c ] == '#' ) {
					type = Block.TYPE.DIRT;
				} else if ( this.map[ r ][ c ] == '_' ) {
					if ( this.map[ r + 1 ][ c ] == '#' ) {
						type = Block.TYPE.GRASS;
					}
				}

				if ( type != null ) {
					var name = r + "," + c;
					var s = new Block( type, name );
					var posX = ( c - this.shiftValueColumn ) * 120;
					var posY = ( this.SCREEN_HEIGHT - ( r - this.shiftValueRow ) - 1 ) * 120;
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

				var r = this.SCREEN_HEIGHT - blockY - 1;
				r += this.shiftValueRow;
				var c = blockX;
				c += this.shiftValueColumn;
				
				if ( ! this.isOutOfBound( r, c ) ) {
					// console.log((r - 1) + "," + c )

					// console.log(  this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.CHECKPOINT  );
					if ( this.childrenHash[ (r) + "," + c ].type == Block.TYPE.DIRT ) {
						this.childrenHash[ (r - 1) + "," + c ].touched();
					} else if ( this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.COIN ) {
							this.setBlock( r, c, "_" );
							this.collectedCoin++;
							this.plotMap();
					} else if ( this.childrenHash[ (r) + "," + c ].type  == Block.TYPE.CHECKPOINT ) {
						if ( this.getParent().state == GameLayer.STATE.STARTED ) {
							this.getParent().player.showNextLevelPopup();
						}

					} else {
						this.childrenHash[ (r) + "," + c ].touched();	
					}
					
				}
			}
		}
	},

	isAThing: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return true;
		}

		// return this.map[ r ][ c ] == '#' || this.map[ r ][ c ] == '*';
		return this.map[ r ][ c ] != '_';
	},

	isBlock: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return true;
		}

		return this.map[ r ][ c ] == '#' || this.map[ r ][ c ] == 'x';
	},

	isAimable: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return false;
		}
		return this.map[ r ][ c ] == '#';
	},

	getBlocks: function() {
		return this.blocks;
	},

});