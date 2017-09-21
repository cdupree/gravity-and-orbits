// Copyright 2015-2017, University of Colorado Boulder

/**
 * Container for gravity mode menu.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  var GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  var gravityString = require( 'string!GRAVITY_AND_ORBITS/gravity' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var offString = require( 'string!GRAVITY_AND_ORBITS/off' );
  var onString = require( 'string!GRAVITY_AND_ORBITS/on' );

  // constants
  var FONT = new PhetFont( 14 );
  var TEXT_OPTIONS = { font: FONT, fill: GravityAndOrbitsColorProfile.panelTextProperty, maxWidth: 50 };
  var RADIO_OPTIONS = { radius: 7 };

  /**
   * @param {Property.<boolean>} gravityEnabledProperty
   * @param {Object} [options] - This object contains options for main node of gravity mode menu.
   * @constructor
   */
  function GravityControl( gravityEnabledProperty, options ) {
    Node.call( this, options );

    var gravityTextNode = new Text( gravityString, TEXT_OPTIONS );
    var onTextNode = new Text( onString, TEXT_OPTIONS );
    var offTextNode = new Text( offString, TEXT_OPTIONS );

    this.addChild( new HBox( {
      spacing: 10, bottom: 2, resize: false, children: [
        gravityTextNode,
        new AquaRadioButton( gravityEnabledProperty, true, onTextNode, RADIO_OPTIONS ),
        new AquaRadioButton( gravityEnabledProperty, false, offTextNode, RADIO_OPTIONS )
      ]
    } ) );
  }

  gravityAndOrbits.register( 'GravityControl', GravityControl );

  return inherit( Node, GravityControl );
} );
