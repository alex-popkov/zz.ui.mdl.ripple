/**
 * @fileoverview Provide zz.ui.mdl.ripple.controllers.Ripple class.
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.ui.mdl.ripple.controllers.Ripple' );

goog.require( 'goog.Timer' );
goog.require( 'goog.style' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.events.EventType' );
goog.require( 'goog.ui.Component' );

/**
 * Material ripple fx class.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {goog.ui.Control}
 * @constructor
 */
zz.ui.mdl.ripple.controllers.Ripple = function( opt_domHelper ){

	goog.ui.Component.call( this, opt_domHelper );
};
goog.inherits( zz.ui.mdl.ripple.controllers.Ripple, goog.ui.Component );
goog.tagUnsealableClass( zz.ui.mdl.ripple.controllers.Ripple );

/**
 * Store constants in one place so they can be updated easily.
 * @enum {string | number}
 */
zz.ui.mdl.ripple.controllers.Ripple.CONST = {

	INITIAL_SCALE: 'scale(0.0001, 0.0001)',
	INITIAL_SIZE: '1px',
	INITIAL_OPACITY: '0.4',
	FINAL_OPACITY: '0',
	FINAL_SCALE: ''
};

/**
 * Store strings for class names defined by this component that are used in JavaScript. This allows us to simply change
 * it in one place should we decide to modify at a later date.
 * @enum {string}
 */
zz.ui.mdl.ripple.controllers.Ripple.CSS = {

	RIPPLE_CENTER: goog.getCssName( 'mdl-ripple--center' ),
	RIPPLE_EFFECT_IGNORE_EVENTS: goog.getCssName( 'mdl-js-ripple-effect--ignore-events' ),
	RIPPLE: goog.getCssName( 'mdl-ripple' ),
	IS_ANIMATING: goog.getCssName( 'is-animating' ),
	IS_VISIBLE: goog.getCssName( 'is-visible' )
};

/**
 * @override
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.createDom = function( ){

	// TODO (buntarb): Maybe throw exception here?
};

/**
 * @override
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.decorateInternal = function( element ){

	goog.base( this, 'decorateInternal', element );

	/**
	 * Centering flag.
	 * @type {boolean}
	 * @private
	 */
	this.centeringFlag_ = goog.dom.classlist.contains( this.getElement( ), zz.ui.mdl.ripple.controllers.Ripple.CSS.RIPPLE_CENTER );

	/**
	 * Ripple element.
	 * @type {Element}
	 * @private
	 */
	this.rippleElement_ = goog.dom.getElementByClass( zz.ui.mdl.ripple.controllers.Ripple.CSS.RIPPLE, this.getElement( ) );

	/**
	 * Frame count.
	 * @type {number}
	 * @private
	 */
	this.frameCount_ = 0;

	/**
	 * Ripple size.
	 * @type {number}
	 * @private
	 */
	this.rippleSize_ = 0;

	/**
	 * X-coordinate.
	 * @type {number}
	 * @private
	 */
	this.x_ = 0;

	/**
	 * Y-coordinate.
	 * @type {number}
	 * @private
	 */
	this.y_ = 0;

	/**
	 * Ignoring mouse event for touch devices.
	 * @type {boolean}
	 * @private
	 */
	this.ignoringMouseDown_ = false;
};

/**
 * Called when the component's element is known to be in the document. Anything using document.getElementById etc.
 * should be done at this stage. If the component contains child components, this call is propagated to its children.
 * @override
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.enterDocument = function( ){

	goog.base( this, 'enterDocument' );

	// Dispose object if find ignore class.
	if( goog.dom.classlist.contains( this.getElement( ), zz.ui.mdl.ripple.controllers.Ripple.CSS.RIPPLE_EFFECT_IGNORE_EVENTS ) ){

		this.dispose( );

	}else{

		this.getHandler( ).listenWithScope( this.getElement( ), [
			goog.events.EventType.MOUSEDOWN,
			goog.events.EventType.TOUCHSTART ],
			this.downHandler_,
			false,
			this
		);
		this.getHandler( ).listenWithScope( this.getElement( ), [
			goog.events.EventType.MOUSEUP,
			goog.events.EventType.MOUSELEAVE,
			goog.events.EventType.TOUCHEND,
			goog.events.EventType.BLUR ],
			this.upHandler_,
			false,
			this
		);
	}
};

/**
 * Deletes or nulls out any references to COM objects, DOM nodes, or other disposable objects. Classes that extend
 * {@code goog.Disposable} should override this method. Not reentrant. To avoid calling it twice, it must only be
 * called from the subclass' {@code disposeInternal} method. Everywhere else the public {@code dispose} method must
 * be used.
 * @inheritDoc
 **/
zz.ui.mdl.ripple.controllers.Ripple.prototype.disposeInternal = function( ){

	goog.base( this, 'disposeInternal' );

	this.getHandler( ).dispose( );
	this.rippleElement_ = null;
};

/**
 * Handles an animation frame.
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.animationFrameHandler = function( ){

	if( this.frameCount_-- > 0 ){

		window.requestAnimationFrame( goog.bind( this.animationFrameHandler, this ) );

	}else{

		this.setRippleStyles( false );
	}
};

/**
 * Handle mouse/finger down on element.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.downHandler_ = function( event ){

	if( !goog.style.getStyle( this.rippleElement_ ).width &&
		!goog.style.getStyle( this.rippleElement_ ).height ){

		var rect = goog.style.getBounds( this.element_ );
		this.boundHeight = rect.height;
		this.boundWidth = rect.width;
		this.rippleSize_ = Math.sqrt( rect.width * rect.width + rect.height * rect.height ) * 2 + 2;
		goog.style.setStyle( this.rippleElement_, {

			'width': this.rippleSize_ + 'px',
			'height': this.rippleSize_ + 'px'
		} );
	}
	//noinspection JSValidateTypes
	goog.dom.classlist.add( this.rippleElement_, zz.ui.mdl.ripple.controllers.Ripple.CSS.IS_VISIBLE );
	if( event.type === goog.events.EventType.MOUSEDOWN && this.ignoringMouseDown_ ){

		this.ignoringMouseDown_ = false;

	}else{

		if( event.type === goog.events.EventType.TOUCHSTART ){

			this.ignoringMouseDown_ = true;
		}
		var frameCount = this.getFrameCount( );
		if( frameCount > 0 ){

			return;
		}
		this.setFrameCount( 1 );
		//var bound = event.currentTarget.getBoundingClientRect( );
		var bound = goog.style.getBounds( event.currentTarget );
		var x;
		var y;
		// Check if we are handling a keyboard click.
		if( event.clientX === 0 && event.clientY === 0 ){

			x = Math.round( bound.width / 2 );
			y = Math.round( bound.height / 2 );

		}else{

			// TODO (buntarb): Test this code.
			var clientX = event.clientX ? event.clientX : event.getBrowserEvent( ).touches[ 0 ].clientX;
			var clientY = event.clientY ? event.clientY : event.getBrowserEvent( ).touches[ 0 ].clientY;
			x = Math.round( clientX - bound.left );
			y = Math.round( clientY - bound.top );
		}
		this.setRippleXY( x, y );
		this.setRippleStyles( true );
		window.requestAnimationFrame( goog.bind( this.animationFrameHandler, this ) );
	}
};

/**
 * Handle mouse / finger up on element.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.upHandler_ = function( event ){

	// Don't fire for the artificial "mouseup" generated by a double-click.
	if( event && event.getBrowserEvent( ).detail !== 2 ){

		//noinspection JSValidateTypes
		goog.dom.classlist.remove( this.rippleElement_, zz.ui.mdl.ripple.controllers.Ripple.CSS.IS_VISIBLE );
	}
	// Allow a repaint to occur before removing this class, so the animation
	// shows for tap events, which seem to trigger a mouseup too soon after
	// mousedown.
	goog.Timer.callOnce( function( ){

		//noinspection JSPotentiallyInvalidUsageOfThis,JSValidateTypes
		goog.dom.classlist.remove( this.rippleElement_, zz.ui.mdl.ripple.controllers.Ripple.CSS.IS_VISIBLE );

	}, 0, this );
};

/**
 * Downgrade the component.
 * @private
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.mdlDowngrade = function( ){

	this.dispose( );
};

/**
 * Returns the CSS class name to be applied to the root element of all sub-views rendered or decorated using this view.
 * The class name is expected to uniquely identify the view class, i.e. no two view classes are expected to share the
 * same CSS class name.
 * @override
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.getCssClass = function( ){

	return zz.ui.mdl.ripple.controllers.Ripple.CSS_CLASS;
};

/**
 * Sets the ripple styles.
 * @param  {boolean} start whether or not this is the start frame.
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.setRippleStyles = function( start ){

	if( this.rippleElement_ !== null ){

		var transformString;
		var scale;
		var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';
		if( start ){

			scale = zz.ui.mdl.ripple.controllers.Ripple.CONST.INITIAL_SCALE;

		}else{

			scale = zz.ui.mdl.ripple.controllers.Ripple.CONST.FINAL_SCALE;
			if( this.centeringFlag_ ){

				offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
			}
		}mdlDowngrade( this.rippleElement_, {

			'webkitTransform': transformString,
			'msTransform': transformString,
			'transform': transformString
		} );
		if( start ){

			goog.dom.classlist.remove( /** @type {Element} */( this.rippleElement_ ), zz.ui.mdl.ripple.controllers.Ripple.CSS.IS_ANIMATING );

		}else{

			this.rippleElement_.classList.add(zz.ui.mdl.ripple.controllers.Ripple.CSS.IS_ANIMATING);
		}
	}
};

/**
 * Getter for frame count.
 * @return {number}.
 * @private
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.getFrameCount = function( ){

	return this.frameCount_;
};

/**
 * Setter for frame count.
 * @param {number} fc
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.setFrameCount = function( fc ){

	this.frameCount_ = fc;
};

/**
 * Sets the ripple X and Y coordinates.
 * @param  {number} newX
 * @param  {number} newY
 */
zz.ui.mdl.ripple.controllers.Ripple.prototype.setRippleXY = function( newX, newY ){

	this.x_ = newX;
	this.y_ = newY;
};