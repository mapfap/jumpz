var cocos2dApp = cc.Application.extend({
    config: document[ 'ccConfig' ],

    ctor: function( scene ) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup( this.config[ 'tag' ] );
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching: function() {
        // initialize director
        var director = cc.Director.getInstance();

        //cc.EGLView.getInstance()._adjustSizeToBrowser();

        // turn on display FPS
        director.setDisplayStats( this.config[ 'showFPS' ] );


        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval( 1.0 / this.config[ 'frameRate' ] );

        cc.LoaderScene.preload(g_resources, function () {
            director.replaceScene( new this.startScene() );
        }, this );

        return true;
    }
});

var GLOBAL_SCALE = 0.8;
var BLOCK_PIXEL = 120 * GLOBAL_SCALE; // 96

var BLOCK_WIDTH_NUMBER = 10;
var BLOCK_HEIGHT_NUMBER = 5;

var SCREEN_WIDTH = BLOCK_PIXEL * BLOCK_WIDTH_NUMBER; // 960
var SCREEN_HEIGHT = BLOCK_PIXEL * BLOCK_HEIGHT_NUMBER; // 480

var LEFT_FOCUS_BOUND = BLOCK_PIXEL * 5;
var RIGHT_FOCUS_BOUND = SCREEN_WIDTH  - LEFT_FOCUS_BOUND;

var LOWER_FOCUS_BOUND = BLOCK_PIXEL;
var UPPER_FOCUS_BOUND = SCREEN_HEIGHT - ( LOWER_FOCUS_BOUND * 2 );

var MAXIMUM_MINIMAP_SIZE = 200;
var FIRST_LEVEL = 0;

var myApp = new cocos2dApp( StartScene );
