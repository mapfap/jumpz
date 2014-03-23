var Map = cc.Node.extend({

	ctor: function() {
		this._super();
		this.SCREEN_WIDTH = 10; // avoid BUG here.. "DO NOT" use this value for array range. 
		this.SCREEN_HEIGHT = 8;
		this.MAP = [
			'________________________________________',
			'________________________________________',
			'________________________________________',
			'_______________________#################',
			'________________________________________',
			'________________________________________',
			'__________#________##________________###',
			'________________________________########',
			'_______###_______________###############',
			'#_____________##___##___________________',
			'####_______________##___________________',
			'_______________######___________________',
			'#_____####_______##########_____________',
			'########################################', ];
		this.setAnchorPoint( cc.p( 0, 0 ) );

		// this.scale = 120.0 / 512;

		this.shiftValueRow = 0;
		this.shiftValueColumn = 0;
		this.children = [];
		this.plotMap();

	},

	setBlock: function( r, c, value ) {
		var newRow = "";

		for ( var k = 0; k < this.MAP[0].length; k++ ) {
			if ( k == c ) {
				newRow += value;
			} else {
				newRow += this.MAP[ r ][ k ];
			}
		}

		this.MAP[ r ] = newRow;
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
		for ( var l = r; l < this.MAP.length ; l++ ) {
			if ( this.MAP[ l ][ c ] == '#' ) {
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
		return row < 0 || row >= this.MAP.length || column < 0 || column >= this.MAP[0].length;
	},

	plotMap: function() {
		for ( var i = 0; i < this.children.length; i++ ) {
			this.removeChild( this.children[i] );
		}
		this.children = [];

		for ( var r = this.shiftValueRow; r < this.SCREEN_HEIGHT + this.shiftValueRow; r++ ) {
			for ( var c = this.shiftValueColumn; c < this.SCREEN_WIDTH
			+ this.shiftValueColumn; c++ ) {

				var source = null;
				// console.log( "r"+r +"...c"+c);
				if ( this.isOutOfBound( r, c ) ) {
					source = 'images/block_dirt.png';
				} else if ( this.MAP[ r ][ c ] == '#' ) {

					if ( r == 0 ) { // prevent from r - 1
						source = 'images/block_grass.png';
					} else if ( this.MAP[r - 1][c] == "#" ) {
						source = 'images/block_dirt.png';
					} else {
						source = 'images/block_grass.png';
					}
				}

				if ( source != null ) {
					var s = new Block( source );
					var posX = ( c - this.shiftValueColumn ) * 120;
					var posY = ( this.SCREEN_HEIGHT - ( r - this.shiftValueRow ) - 1 ) * 120;
					s.setPosition( new cc.Point( posX, posY ) );
					this.addChild( s );
					this.children.push( s );
				}

				source = null;
				
			}
		}
	},

	isGround: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return true;
		}
		return this.MAP[ r ][ c ] == '#';
	},

	isAimable: function( blockX, blockY ) {
		var r = this.SCREEN_HEIGHT - blockY - 1;
		r += this.shiftValueRow;
		var c = blockX;
		c += this.shiftValueColumn;
		if ( this.isOutOfBound( r, c ) ) {
			return false;
		}
		return this.MAP[ r ][ c ] == '#';
	},

});