var Map = cc.Node.extend({

	ctor: function() {
		this._super();
		// beware BUG here.. "DO NOT" use this value for array range.
		// this value is numbers of blocks shown in the screen.
		this.SCREEN_WIDTH = 10;
		this.SCREEN_HEIGHT = 8;
		
		this.readableMap = [
			'#______________________________________#',
			'#___________##_________________________#',
			'#___________###________________________#',
			'#__________###_########________________#',
			'###_________##_________________________#',
			'#___________##############_____________#',
			'#_______________________________#####__#',
			'#_____######___________________________#',
			'########################################', ];

		// convert array of string to 2D char, in order to be mutable object.

		this.map = [];
		for ( var i = 0; i < this.readableMap.length; i++ ) {
			var line = [];
			for ( var j = 0 ; j < this.readableMap[i].length; j++ ) {
				line.push( this.readableMap[i][j] );
			}
			this.map.push( line );
			// console.log(line[0])
		}
		

		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.childrenHash = {};

		// this.scale = 120.0 / 512;

		this.shiftValueRow = 0;
		this.shiftValueColumn = 0;
		this.children = [];
		// this.blocks = [];
		this.plotMap();

	},

	setBlock: function( r, c, value ) {
		// var newRow = "";

		// for ( var k = 0; k < this.map[0].length; k++ ) {
		// 	if ( k == c ) {
		// 		newRow += value;
		// 	} else {
		// 		newRow += this.map[ r ][ k ];
		// 	}
		// }

		this.map[ r ][ c ] = value;
	},

	hitBlock: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		// console.log( r + ",," + c );

		// r and c is for the real array index access
		this.setBlock( r, c, '_' );

		var newPosition = null;
		// console.log("r="+  );
		for ( var l = r; l < this.map.length ; l++ ) {
			if ( this.map[ l ][ c ] == '#' ) {
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
		// this.blocks = [];

		for ( var r = this.shiftValueRow; r < this.SCREEN_HEIGHT + this.shiftValueRow; r++ ) {
			for ( var c = this.shiftValueColumn; c < this.SCREEN_WIDTH + this.shiftValueColumn; c++ ) {

				var type = null;
				// console.log( "r"+r +"...c"+c);
				if ( this.isOutOfBound( r, c ) ) {
					type = Block.TYPE.DIRT;
				} else if ( this.map[ r ][ c ] == '#' ) {

					// if ( r + 1 < this.map.length && this.map[r + 1][c] == "_" ) {
						// type = Block.TYPE.DIRT_FLOAT;
					// } else {
						type = Block.TYPE.DIRT;	
					// }

					// if ( r == 0 ) { // prevent from r - 1
					// } else if ( this.map[r - 1][c] == "#" ) {
					// 	type = Block.TYPE.DIRT;
					// } else {
					// 	type = Block.TYPE.DIRT;
					// }

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
					// if ( s.type == Block.TYPE.DIRT ) {
					// 	this.blocks.push( s );
					// }
					this.childrenHash[ name ] = s;
				}

				type = null;
				
			}
		}
	},

	walk: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		
		// this.childrenHash[ (r - 1) + "," + c ].walk();
	},

	isGround: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return true;
		}
		// console.log(r);
		var isGround = this.map[ r ][ c ] == '#';
		if ( isGround ) {
			this.childrenHash[ (r - 1) + "," + c ].touched();
		}
		return isGround;
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