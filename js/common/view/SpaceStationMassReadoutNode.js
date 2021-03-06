// Copyright 2014-2019, University of Colorado Boulder

/**
 * Shows the mass of a Body in terms of space station masses.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  const MassReadoutNode = require( 'GRAVITY_AND_ORBITS/common/view/MassReadoutNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utils = require( 'DOT/Utils' );

  // strings
  const billionBillionSpaceStationMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSpaceStationMasses' );
  const pattern0Value1UnitsString = require( 'string!GRAVITY_AND_ORBITS/pattern.0value.1units' );
  const spaceStationMassString = require( 'string!GRAVITY_AND_ORBITS/spaceStationMass' );

  class SpaceStationMassReadoutNode extends MassReadoutNode {

    /**
     * Create a text label for the space station, modified so that it will be quantitative
     * or qualitative depending on the mass of the station.  For instance, if larger than
     * a specific mass, the label will be in something like 'billions of station masses'.
     *
     * @returns {string} - formatted string
     * REVIEW public/private
     */
    createText() {
      const massKG = this.bodyNode.body.massProperty.get();
      const spaceStationMasses = massKG / GravityAndOrbitsConstants.SPACE_STATION_MASS;

      // Show the readout in terms of space station masses (or billions of billions of space station masses)
      let value;
      let units = spaceStationMassString;
      if ( spaceStationMasses > 1E18 ) {
        value = Utils.toFixed( spaceStationMasses / 1E18, 0 );
        units = billionBillionSpaceStationMassesString;
      }
      else if ( Math.abs( spaceStationMasses - 1 ) < 1E-2 ) {
        value = '1';
      }
      else if ( spaceStationMasses < 1 ) {
        value = Utils.toFixed( spaceStationMasses, 3 );
      }
      else {
        value = Utils.toFixed( spaceStationMasses, 2 ); // use one less decimal point here
      }
      return StringUtils.format( pattern0Value1UnitsString, value, units );
    }
  }

  return gravityAndOrbits.register( 'SpaceStationMassReadoutNode', SpaceStationMassReadoutNode );
} );