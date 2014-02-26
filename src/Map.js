var Map = cc.Node.extend({
    ctor: function() {
        this._super();
        this.WIDTH = 10;
        this.HEIGHT = 8;
        this.MAP = [
            '__________#________##',
            '___________________##',
            '_______###_________##',
            '#_____________##___##',
            '####_______________##',
            '_______________######',
            '______####_______####',
            '###########________##',
        ];
        this.setAnchorPoint( cc.p( 0, 0 ) );
        
        this.scale = 120.0 / 512;

        this.shiftValueRow = 0;
        this.shiftValueColumn = 0;
        this.children = [];
        this.plotMap();

 
    },

    shiftMap: function( diffRow, diffColumn ) {
        
        for ( var i = 0; i < this.children.length; i++ ) {
            // console.log( child );
            this.removeChild( this.children[ i ] );
            // console.log("rm");
        }
        this.children = [];
        this.shiftValueRow += diffRow;
        this.shiftValueColumn += diffColumn;
        this.plotMap();
    },

    plotMap: function() {
        for ( var r = this.shiftValueRow; r < this.HEIGHT + this.shiftValueRow; r++ ) {
            for ( var c = this.shiftValueColumn; c < this.WIDTH + this.shiftValueColumn; c++ ) {
                if ( this.MAP[ r ][ c ] == '#' ) {
                    var source;

                    if ( r == 0 ) {
                        source = 'images/block_grass.png';
                    } else if ( this.MAP[ r - 1 ][ c ] == "#" ) {
                        source = 'images/block_dirt.png';
                    } else {
                        source = 'images/block_grass.png';
                    }

                    var s = new Block( source );
                    var posX = ( c - this.shiftValueColumn ) * 120; 
                    var posY = ( this.HEIGHT - (r - this.shiftValueRow ) - 1 ) * 120; 
                    s.setPosition( new cc.Point( posX, posY) );
                    this.addChild( s );
                    this.children.push ( s );
                }
            }
        }
    },
    
    isGround: function( blockX , blockY ) {
        var r = this.HEIGHT - blockY - 1;
        r += this.shiftValueRow;
        var c = blockX;
        c += this.shiftValueColumn;
        if ( r < this.shiftValueRow || c < this.shiftValueColumn || r >= ( this.HEIGHT + this.shiftValueRow ) || c >= ( this.WIDTH + this.shiftValueColumn ) ) {
            return true;
        }
        return this.MAP[ r ][ c ] == '#';
    },
});