// Copyright 2016-2019, University of Colorado Boulder

/**
 * // REVIEW documentation
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ModelSceneFactory = require( 'GRAVITY_AND_ORBITS/model/module/ModelSceneFactory' );
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const GravityAndOrbitsModel = require( 'GRAVITY_AND_ORBITS/common/module/GravityAndOrbitsModel' );

  class ModelModel extends GravityAndOrbitsModel {
    constructor( tandem, viewTandem ) {
      super( false, p => new ModelSceneFactory(
        p.isPlayingProperty,
        p.gravityEnabledProperty,
        p.steppingProperty,
        p.rewindingProperty,
        p.speedTypeProperty,
        tandem.createTandem( 'sceneList' ) // TODO(phet-io design): tandem sharing is risky, is it warranted here to avoid extra nodes?
      ), 0, false, tandem, viewTandem );// TODO: how to deal with viewTandem
    }
  }

  return gravityAndOrbits.register( 'ModelModel', ModelModel );
} );