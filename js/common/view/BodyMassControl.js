// Copyright 2014-2019, University of Colorado Boulder

/**
 * This control allows the user to view and change the mass of certain Body instances, which also changes the radius.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsColorProfile = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsColorProfile' );
  const HSlider = require( 'SUN/HSlider' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const SNAP_TOLERANCE = 0.03;
  const THUMB_SIZE = new Dimension2( 14, 24 );
  const NUM_TICKS = 4;
  const WIDTH = 180;
  const SPACING = ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 );

  class BodyMassControl extends HSlider {
    /**
     *
     * @param {Body} body
     * @param {number} min
     * @param {number} max
     * @param {number} defaultLabelValue
     * @param {string} valueLabel
     * @param {Tandem} tandem
     */
    constructor( body, min, max, defaultLabelValue, valueLabel, tandem ) {

      super( body.massProperty, new Range( min, max ), {
        trackSize: new Dimension2( WIDTH, 1 ),
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: THUMB_SIZE.width,
        thumbTouchAreaYDilation: THUMB_SIZE.height,
        trackStroke: GravityAndOrbitsColorProfile.panelTextProperty,

        // ticks
        tickLabelSpacing: 3,
        majorTickLength: 13,
        majorTickStroke: GravityAndOrbitsColorProfile.panelTextProperty,

        // custom thumb
        thumbFill: '#98BECF',
        thumbFillHighlighted: '#B3D3E2',

        // snap to default value if close
        constrainValue: mass => Math.abs( mass - defaultLabelValue ) / defaultLabelValue < SNAP_TOLERANCE ? defaultLabelValue : mass,
        tandem: tandem
      } );

      // add ticks and labels
      const defaultLabel = new Text( valueLabel, {
        top: 10,
        centerX: SPACING,
        font: new PhetFont( 13 ),
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 80
      } );

      // create a label for the default value
      // @param {string} - string for the label text
      const createNumberLabel = value => new Text( value, {
        font: new PhetFont( 13 ),
        fill: GravityAndOrbitsColorProfile.panelTextProperty,
        maxWidth: 110
      } );

      const labels = [ createNumberLabel( '0.5' ), defaultLabel, createNumberLabel( '1.5' ), createNumberLabel( '2.0' ) ];
      for ( let i = 0; i < labels.length; i++ ) {
        const tickValue = ( i + 1 ) / labels.length * max;
        this.addMajorTick( tickValue, labels[ i ] );
      }

      // setting the diameter property took place in Body.setMass() in the Java version, but doesn't work here since
      // the mass itself is set by the slider in this case.
      // derived from: density = mass/volume, and volume = 4/3 pi r r r
      const massListener = mass => {
        const radius = Math.pow( 3 * mass / 4 / Math.PI / body.density, 1 / 3 );
        body.diameterProperty.set( 2 * radius );
      };
      body.massProperty.link( massListener );
    }
  }

  return gravityAndOrbits.register( 'BodyMassControl', BodyMassControl );
} );