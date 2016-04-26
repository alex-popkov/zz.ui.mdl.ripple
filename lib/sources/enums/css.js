/**
 * @fileoverview Provide zz.ui.mdl.ripple.enums.CSS.
 */

goog.provide( 'zz.ui.mdl.ripple.enums.CSS' );

/**
 * Store strings for class names defined by this component that are used in JavaScript. This allows us to simply change
 * it in one place should we decide to modify at a later date.
 * @enum {string}
 */
zz.ui.mdl.ripple.enums.CSS = {

    RIPPLE_CENTER: goog.getCssName( 'mdl-ripple--center' ),
    RIPPLE_EFFECT_IGNORE_EVENTS: goog.getCssName( 'mdl-js-ripple-effect--ignore-events' ),
    RIPPLE: goog.getCssName( 'mdl-ripple' ),
    IS_ANIMATING: goog.getCssName( 'is-animating' ),
    IS_VISIBLE: goog.getCssName( 'is-visible' )
};