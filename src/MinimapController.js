var MinimapController = cc.LayerColor.extend({

	ctor: function( width, height ) {
		this._super();
		this.width = width;
		this.height = height;
		this.init();
		this.padding = 10;
	},

	resize: function( width, height ) {
		this.width = width;
		this.height = height;
		this.setPosition( new cc.Point( SCREEN_WIDTH - width - this.padding, SCREEN_HEIGHT - height - this.padding ) );
		this.label.setPosition( 30, -15 );
	},

	setText: function( text ) {
		this.label.setString( 'Level: ' + text );
	},
	
	init: function() {

		// MOUSE IS DISABLE UNTIL CURSOR IS SET.
		this._super( new cc.Color4B(100, 100, 100, 0), this.width, this.height );
		this.setAnchorPoint( new cc.Point( 0, 0 ) );
		// this.setPosition( new cc.Point( 800, 100 ) );
		this.setPosition( new cc.Point( SCREEN_WIDTH - MAXIMUM_MINIMAP_SIZE - this.padding, SCREEN_HEIGHT - MAXIMUM_MINIMAP_SIZE - this.padding ) );

		this.label = cc.LabelTTF.create( 'Level: ', 'Arial', 18 );
		this.addChild( this.label );
		
		return true;
	},

	setCursor: function( cursor ) {
		this.cursor = cursor;
		this.setMouseEnabled(true);
	},

	isEventHappenInArea: function( mousePosition, uiPosition ) {
		return ( mousePosition.x >= uiPosition.x && mousePosition.x <= uiPosition.x + this.width ) && ( mousePosition.y >= uiPosition.y && mousePosition.y <= uiPosition.y + this.height )
	},

	onMouseDragged: function( e ) {
		this.onMouseMoved( e );
		
		if ( this.onDrag ) {
			var mousePosition = e.getLocation();
			this.setPosition( new cc.Point( mousePosition.x - this.offsetPosition.x , mousePosition.y - this.offsetPosition.y )  );
		}
	},

	onMouseMoved: function( e ) {
		this.cursor.setPosition( e.getLocation() );
    },

    onMouseUp: function( e ) {
    	this.onDrag = false;
    },

	onMouseDown: function( e ) {

		var mousePosition = e.getLocation();
		var uiPosition = this.getPosition();
		if ( this.isEventHappenInArea( mousePosition, uiPosition ) ) {
			// console.log("CLICK!");
			this.onDrag = true;
			this.offsetPosition = new cc.Point( mousePosition.x - uiPosition.x, mousePosition.y - uiPosition.y );
		}
	},
});