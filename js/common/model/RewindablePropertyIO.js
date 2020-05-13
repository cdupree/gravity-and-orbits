// Copyright 2020, University of Colorado Boulder

import PropertyIO from '../../../../axon/js/PropertyIO.js';
import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import gravityAndOrbits from '../../gravityAndOrbits.js';
import RewindableProperty from './RewindableProperty.js';

/**
 * IO type for RewindableProperty
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// {Map.<cacheKey:function(new:ObjectIO), function(new:ObjectIO)>} - Cache each parameterized RewindablePropertyIO so that it is only created once
const cache = new Map();

/**
 * An observable Property that triggers notifications when the value changes.
 * This caching implementation should be kept in sync with the other parametric IO type caching implementations.
 * @param {function(new:ObjectIO)} parameterType
 * @returns {function(new:ObjectIO)}
 */
function RewindablePropertyIO( parameterType ) {
  assert && assert( parameterType, 'RewindablePropertyIO needs parameterType' );

  const cacheKey = parameterType;

  if ( !cache.has( cacheKey ) ) {
    cache.set( cacheKey, create( parameterType ) );
  }

  return cache.get( cacheKey );
}

/**
 * Creates a RewindablePropertyIOImpl
 * @param {function(new:ObjectIO)} parameterType
 * @returns {function(new:ObjectIO)}
 */
const create = parameterType => {

  const PropertyIOImpl = PropertyIO( parameterType );

  /**
   * @param {Property} property
   * @param {string} phetioID
   * @constructor
   */
  class RewindablePropertyIOImpl extends PropertyIOImpl {

    /**
     * @param {Property} property
     * @param {string} phetioID
     */
    constructor( property, phetioID ) {
      assert && assert( !!parameterType, 'RewindablePropertyIO needs parameterType' );
      assert && assert( property, 'Property should exist' );
      assert && assert( _.endsWith( phetioID, 'Property' ), 'RewindablePropertyIO instances should end with the "Property" suffix, for ' + phetioID );

      super( property, phetioID );
    }

    /**
     * Encodes a Property phetioObject to a state.
     * @public
     *
     * @param {Object} property
     * @returns {Object} - a state object
     */
    static toStateObject( property ) {
      validate( property, this.validator );
      const stateObject = PropertyIOImpl.toStateObject( property );
      stateObject.rewindValue = parameterType.toStateObject( property.rewindValue ); // TODO: private access
      return stateObject;
    }

    /**
     * Decodes a state into a Property.
     * @public
     *
     * @param {Object} stateObject
     * @returns {Object}
     */
    static fromStateObject( stateObject ) {
      const fromStateObject = PropertyIOImpl.fromStateObject( stateObject );
      fromStateObject.rewindValue = parameterType.fromStateObject( stateObject.rewindValue );
      return fromStateObject;
    }

    /**
     * Used to set the value when loading a state
     * @param {Property} property
     * @param {Object} fromStateObject
     * @public
     */
    static setValue( property, fromStateObject ) {
      PropertyIOImpl.setValue( property, fromStateObject );
      property.rewindValue = fromStateObject.rewindValue;
    }
  }

  RewindablePropertyIOImpl.documentation = 'Observable values that send out notifications when the value changes. This differs from the ' +
                                           'traditional listener pattern in that added listeners also receive a callback with the current value ' +
                                           'when the listeners are registered. This is a widely-used pattern in PhET-iO simulations.';
  RewindablePropertyIOImpl.validator = { valueType: RewindableProperty };
  RewindablePropertyIOImpl.typeName = `RewindablePropertyIO<${parameterType.typeName}>`;
  RewindablePropertyIOImpl.parameterTypes = [ parameterType ];
  ObjectIO.validateSubtype( RewindablePropertyIOImpl );

  return RewindablePropertyIOImpl;
};

gravityAndOrbits.register( 'RewindablePropertyIO', RewindablePropertyIO );
export default RewindablePropertyIO;