// Copyright 2014-2019, University of Colorado Boulder

/**
 * This is the model for Gravity and Orbits; there is one GravityAndOrbitsPhysicsEngine per each GravityAndOrbitsScene, and it
 * uses ModelState to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );
  const ModelState = require( 'GRAVITY_AND_ORBITS/common/model/ModelState' );
  const SpeedType = require( 'GRAVITY_AND_ORBITS/common/model/SpeedType' );

  /**
   * Return the smaller of two Body instances, for determining which survives a collision.
   * @param {Body} other
   * @param {Body} body
   * @returns {Body} the smaller body
   */
  const getSmaller = ( other, body ) => other.massProperty.get() < body.massProperty.get() ? other : body;
  /**
   * For use inside a map call, factored out here for performance
   * @param body
   * @returns {BodyState}
   */
  const getBodyState = body => body.toBodyState();

  class GravityAndOrbitsPhysicsEngine {

    /**
     * @param {GravityAndOrbitsClock} clock
     * @param {Property.<boolean>} gravityEnabledProperty flag to indicate whether gravity is on or off.
     */
    constructor( clock, gravityEnabledProperty ) {

      // @private
      this.gravityEnabledProperty = gravityEnabledProperty;

      this.clock = clock; // @public
      this.bodies = []; // @public - contains the sun, moon, earth, satellite

      // TODO: What is dt doing here?
      this.clock.addEventTimer( dt => {

        // NOTE: replacing step with stepModel fixes https://github.com/phetsims/gravity-and-orbits/issues/253
        // but introduces performance issues
        const elapsedTime = this.stepModel();
        this.clock.setSimulationTime( this.clock.getSimulationTime() + elapsedTime );
      } );

      // Have to update force vectors when gravity gets toggled on and off, otherwise displayed value won't update
      this.gravityEnabledProperty.link( this.updateForceVectors.bind( this ) );
    }

    /**
     * Standardize the time step so that the play speed has no impact on the model. For a large time step, we break
     * apart the change in time into a series of time steps.  This ensures that this.step and the next model state is
     * calculated with consistent changes in time.
     *
     * @returns {number} elapsed time
     * @private
     */
    stepModel() {

      // standardized time step - based on the slowest time step for the given orbital mode
      const smallestTimeStep = this.clock.baseDTValue * 0.13125;

      // get the number of times we will need to step the model based on the dt passed in
      const numberOfSteps = this.clock.speedTypeProperty.value === SpeedType.SLOW_MOTION ? 1 :
                            this.clock.speedTypeProperty.value === SpeedType.NORMAL ? 4 :
                            this.clock.speedTypeProperty.value === SpeedType.FAST_FORWARD ? 7 :
                            null;

      // step the model by the smallest standard time step for the orbital mode
      for ( let i = 0; i < numberOfSteps; i++ ) {
        this.step( smallestTimeStep );
      }

      // Signify that the model completed an entire step so that any batch operations may be invoked
      for ( let i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].allBodiesUpdated();
      }

      return smallestTimeStep * numberOfSteps;
    }

    /**
     * Moves the model forward in time.  This function creates temporary state objects and calculates state values
     * based on the current state of the entire model. Afterwards, it applies the updated values to the body objects.
     * Finally, it checks for collisions between bodies.
     *
     * @param {number} dt
     */
    step( dt ) {

      // Compute the next state for each body based on the current state of all bodies in the system.
      const bodyStates = this.bodies.map( getBodyState );
      const newState = new ModelState( bodyStates, this.clock ).getNextState( dt, this.gravityEnabledProperty );

      // Set each body to its computed next state.
      // assumes that ModelState.getBodyState returns states in the same order as the container (ArrayList) used for
      // bodies. A possible future improvement would be
      // to switch to use ModelState.getState(Body), which would be safer.
      for ( let i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].updateBodyStateFromModel( newState.getBodyState( i ) );
      }
      // when two bodies collide, destroy the smaller
      for ( let j = 0; j < this.bodies.length; j++ ) {
        const body = this.bodies[ j ];
        for ( let k = 0; k < this.bodies.length; k++ ) {
          const other = this.bodies[ k ];
          if ( other !== body ) {
            if ( other.collidesWidth( body ) ) {
              getSmaller( other, body ).isCollidedProperty.set( true );
            }
          }
        }
      }
    }

    // @public
    resetAll() {
      this.resetBodies();
      this.clock.resetSimulationTime();
      this.updateForceVectors();
    }

    /**
     * Adds a body and updates the body's force vectors
     *
     * @public
     * @param body
     */
    addBody( body ) {
      this.bodies.push( body );

      // update the force vectors when the position or mass changes
      body.userModifiedPositionEmitter.addListener( () => this.updateForceVectors() );
      body.massProperty.link( () => this.updateForceVectors() );
      this.updateForceVectors();
    }

    /**
     * Since we haven't (yet?) rewritten the gravity forces to auto-update when dependencies change, we update when
     * necessary:
     * (1) when a new body is added or
     * (2) when reset is pressed
     * This update is done by running the physics engine for dt=0.0 then applying the computed forces to the bodies.
     * Without this block of code, the force vectors would be zero on sim startup until the clock is started.
     *
     * @private
     */
    updateForceVectors() {
      this.step( 0 );
    }

    /**
     * Returns a defensive copy of the bodies.
     *
     * @returns {Array<Body>}
     * @public
     */
    getBodies() {
      return this.bodies.slice( 0 ); // operate on a copy, firing could result in the listeners changing
    }

    // @public
    resetBodies() {
      for ( let i = 0; i < this.bodies.length; i++ ) {
        this.bodies[ i ].resetAll();
      }
      this.updateForceVectors(); // has to be done separately since physics is computed as a batch
    }

    /**
     * Get the body associated with the name.  The name must be one of GravityAndOrbitsBodies.
     *
     * @param  {string} name
     * @returns {Body|null}
     */
    getBody( name ) {
      for ( let i = 0; i < this.bodies.length; i++ ) {
        const body = this.bodies[ i ];

        if ( body.name === name ) {
          return body;
        }
      }
      return null;
    }
  }

  return gravityAndOrbits.register( 'GravityAndOrbitsPhysicsEngine', GravityAndOrbitsPhysicsEngine );
} );