var Inventory = cc.LayerColor.extend({

	ctor: function() {
		this._super();
		this.init();
	},
	
	init: function() {

		// MOUSE IS DISABLE UNTIL CURSOR IS SET.

		this.width = 300;
		this.height = 200;

		this._super( new cc.Color4B(100, 100, 100, 127), this.width, this.height );
		this.setAnchorPoint( new cc.Point( 0, 0 ) );
		// this.setPosition( new cc.Point( 800, 100 ) );
		this.setPosition( new cc.Point( 10000, 100 ) );

		this.label = cc.LabelTTF.create( 'UI จ้า', 'Arial', 25 );
		this.label.setPosition( 35, this.height - 25 );
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
			console.log("CLICK!");
			this.onDrag = true;
			this.offsetPosition = new cc.Point( mousePosition.x - uiPosition.x, mousePosition.y - uiPosition.y );
		}
	},
});