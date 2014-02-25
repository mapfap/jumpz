var Map = cc.Node.extend({
    ctor: function() {
        this._super();
        this.WIDTH = 10;
        this.HEIGHT = 8;
        this.MAP = [
            '__________',
            '__________',
            '__________',
            '#_________',
            '####______',
            '__________',
            '______####',
            '##########',
        ];

        // this.dMAP = [
        //     [],
        //     [],
        //     [],
        //     [],
        //     [],
        //     [],
        //     [],
        //     [],
        // ];
        this.setAnchorPoint( cc.p( 0, 0 ) );
        var scale = 120.0 / 512;
        for ( var r = 0; r < this.HEIGHT; r++ ) {
            for ( var c = 0; c < this.WIDTH; c++ ) {
                if ( this.MAP[ r ][ c ] == '#' ) {
                    var s = cc.Sprite.create( 'images/dirt1.png' );
                    s.setScale( scale );
                    s.setAnchorPoint( cc.p( 0, 0 ) );
                    s.setPosition( cc.p( c * 120, (this.HEIGHT - r - 1) * 120 ) );
                    this.addChild( s );
                } else if ( this.MAP[ r ][ c ] == '_' ) {
                    // var d = new Dot();
                    // d.setPosition( cc.p( c * 120 + 20, (this.HEIGHT -r - 1) * 120 + 20 ) );
                    // this.addChild( d );
                    // this.dMAP[ r ][ c ] = d;
                }
            }
        }
 
    },
    // getDot: function( blockX, blockY ) {
    //     var r = this.HEIGHT - blockY - 1;
    //     var c = blockX;
    //     return this.dMAP[ r ][ c ];
    // },

    // removeDot: function( blockX, blockY, dot ) {
    //     var r = this.HEIGHT - blockY - 1;
    //     var c = blockX;
    //     this.MAP[ r ][ c ] = ' ';
    //     this.removeChild( dot );
    // },
    
    isGround: function( blockX , blockY ) {
        var r = this.HEIGHT - blockY - 1;
        var c = blockX;
        if ( r < 0 || c < 0 || r >= this.HEIGHT || c >= this.WIDTH) {
            return true;
        }
        return this.MAP[ r ][ c ] == '#';
    },
});