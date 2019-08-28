// Copyright 2014-2019, University of Colorado Boulder

/**
 * Cartoon mode list makes the radii of all objects much larger than the true physical values to make them visible on
 * the same scale. Configuration file for setting up the cartoon mode parameters. This is typically done by
 * multiplying the real values by the desired scales. SunEarth and SunEarthMoon should be as similar as possible
 * (aside from the addition of the moon).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModeList = require( 'GRAVITY_AND_ORBITS/common/module/ModeList' );
  const ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );

  // constants
  const SUN_RADIUS_MULTIPLIER = 50; // sun radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
  const EARTH_MOON_RADIUS_MULTIPLIER = 800; // earth and moon radius multiplier for SunEarthMode and SunEarthMoonMode, tuned by hand
  const EARTH_MASS_SCALE_FACTOR = 10200; // tuned by hand so there are 12 cartoon lunar orbits in one cartoon earth orbit

  // in days - actual period is 27.322 days, but this sim's model produces a period of 27.6 days (by inspection)
  const MOON_ORBITAL_PERIOD = 27.6;

  /*
   * force scale for SunEarthMode and SunEarthMoonMode.
   * balances increased mass and so that forces are 1/2 grid cell in default conditions, hand tuned by checking
   * that reducing the distance by a factor of 2 increases the force arrow by a factor of 4
   */
  const FORCE_SCALE = 0.573 / EARTH_MASS_SCALE_FACTOR;

  /*
   * Have to artificially scale up the time readout so that SunEarthMode and SunEarthMoonMode modes have a stable
   * orbits with correct periods since masses are nonphysical. 365 is days in a year.
   */
  const SUN_EARTH_MODE_TIME_SCALE = 365.0 / 334.0;

  /**
   * Convenience function that converts days to seconds, using
   *   days * hoursPerDay * minutesPerHour * secondsPerMinue
   *   
   * @param  {number} days
   * @returns {number}
   */
  function daysToSeconds( days ) {
    return days * 24 * 60 * 60;
  }

  /**
   * @param {Property.<boolean>} playButtonPressedProperty
   * @param {Property.<boolean>} gravityEnabledProperty
   * @param {Property.<boolean>} steppingProperty
   * @param {Property.<boolean>} rewindingProperty
   * @param {Property.<number>} timeSpeedScaleProperty
   * @constructor
   */
  function CartoonModeList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ) {
    ModeList.ModeList.call( this,
      new ModeListParameterList( playButtonPressedProperty, gravityEnabledProperty, steppingProperty, rewindingProperty, timeSpeedScaleProperty ),
      new SunEarthModeConfig(),
      new SunEarthMoonModeConfig(),
      new EarthMoonModeConfig(),
      new EarthSpaceStationModeConfig(), {
        adjustMoonPathLength: true // adjust the moon path length in cartoon mode
      } );
  }

  gravityAndOrbits.register( 'CartoonModeList', CartoonModeList );

  inherit( ModeList.ModeList, CartoonModeList );

  /**
   * Model configuration for a system with the sun and the earth.
   *
   * @constructor
   */
  function SunEarthModeConfig() {

    ModeList.SunEarthModeConfig.call( this );

    this.sun.radius *= SUN_RADIUS_MULTIPLIER;
    this.earth.radius *= EARTH_MOON_RADIUS_MULTIPLIER;
    this.earth.mass *= EARTH_MASS_SCALE_FACTOR;
    this.forceScale *= FORCE_SCALE;
    this.timeScale = SUN_EARTH_MODE_TIME_SCALE;

    // Sun shouldn't move in cartoon modes
    this.sun.fixed = true;
  }

  gravityAndOrbits.register( 'SunEarthModeConfig', SunEarthModeConfig );

  inherit( ModeList.SunEarthModeConfig, SunEarthModeConfig );
  /**
   * Model configuration for a system with the sun, earth and moon.
   *
   * @constructor
   */
  function SunEarthMoonModeConfig() {

    ModeList.SunEarthMoonModeConfig.call( this );

    this.sun.radius *= SUN_RADIUS_MULTIPLIER;
    this.earth.radius *= EARTH_MOON_RADIUS_MULTIPLIER;
    this.moon.radius *= EARTH_MOON_RADIUS_MULTIPLIER;

    this.earth.mass *= EARTH_MASS_SCALE_FACTOR;
    this.moon.vx *= 21;
    this.moon.y = this.earth.radius * 1.7;

    this.forceScale *= FORCE_SCALE;
    this.timeScale = SUN_EARTH_MODE_TIME_SCALE;

    // Sun shouldn't move in cartoon modes
    this.sun.fixed = true;
  }

  gravityAndOrbits.register( 'SunEarthMoonModeConfig', SunEarthMoonModeConfig );

  inherit( ModeList.SunEarthMoonModeConfig, SunEarthMoonModeConfig );

  function EarthMoonModeConfig() {

    const moonRotationPeriod = daysToSeconds( MOON_ORBITAL_PERIOD );
    ModeList.EarthMoonModeConfig.call( this, {
      moonRotationPeriod: moonRotationPeriod
    } );

    const radiusMultiplier = 15; // tuned by hand
    this.earth.radius *= radiusMultiplier;
    this.moon.radius *= radiusMultiplier;

    // so that default gravity force takes up 1/2 cell in grid
    this.forceScale *= 0.77;
  }

  gravityAndOrbits.register( 'EarthMoonModeConfig', EarthMoonModeConfig );

  inherit( ModeList.EarthMoonModeConfig, EarthMoonModeConfig );

  /**
   * Model configuration for a system with the earth and a space station.
   *
   * @constructor
   */
  function EarthSpaceStationModeConfig() {

    ModeList.EarthSpaceStationModeConfig.call( this );

    // tuned by hand
    this.earth.radius *= 0.8;
    this.spaceStation.radius *= 8;
  }

  gravityAndOrbits.register( 'EarthSpaceStationModeConfig', EarthSpaceStationModeConfig );

  inherit( ModeList.EarthSpaceStationModeConfig, EarthSpaceStationModeConfig );

  return CartoonModeList;

} );