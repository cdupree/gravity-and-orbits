// Copyright 2013-2019, University of Colorado Boulder

/**
 * Visual representation of speed control buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );

  class TimeControlPanel extends HBox {

    /**
     * @param {Property.<GravityAndOrbitsMode>} modeProperty
     * @param {Property.<boolean>} playButtonPressedProperty
     * @param {Array.<Body>} bodies
     * @param {Object} [options]
     */
    constructor( modeProperty, playButtonPressedProperty, bodies, options ) {
      const playProperty = playButtonPressedProperty;

      const playPauseButton = new PlayPauseButton( playProperty );

      const stepButton = new StepForwardButton( {
        isPlayingProperty: playProperty,
        listener: () => modeProperty.get().getClock().stepClockWhilePaused()
      } );

      const rewindButton = new RewindButton( {
        enabled: false,
        listener: () => modeProperty.get().rewind()
      } );

      const anyPropertyDifferentProperties = [];
      for ( let i = 0; i < bodies.length; i++ ) {
        anyPropertyDifferentProperties.push( bodies[ i ].anyPropertyDifferent() );
      }

      super( _.extend( {
        resize: false,
        spacing: 10,
        children: [ rewindButton, playPauseButton, stepButton ]
      }, options ) );

      // REVIEW this seems duplicated elsewhere.  Also, what is happening here?
      const anyPropertyChanged = DerivedProperty.or( anyPropertyDifferentProperties );

      // @private
      this.propertyChangedListener = changed => rewindButton.setEnabled( changed );
      anyPropertyChanged.link( this.propertyChangedListener );
    }
  }

  return gravityAndOrbits.register( 'TimeControlPanel', TimeControlPanel );
} );