// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view for workspace.
 * Contains space objects with related entities, arrows, grids and measuring tape.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var SpaceObjects = require( 'view/workspace/components/SpaceObjects' );
  var ForceArrows = require( 'view/workspace/components/ForceArrows' );
  var VelocityArrows = require( 'view/workspace/components/VelocityArrows' );
  var PlanetPath = require( 'view/workspace/components/PlanetPath' );
  var Grid = require( 'view/workspace/components/Grid' );
  var MeasuringTape = require( 'view/workspace/components/MeasuringTape' );
  var MassText = require( 'view/workspace/components/MassText' );
  var Tooltips = require( 'view/workspace/components/Tooltips' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function Workspace( model ) {
    var self = this;
    this.toScale = new Node();
    Node.call( this );

    // add space objects
    this.toScale.addChild( new SpaceObjects( model ) );

    // add force arrows
    this.toScale.addChild( new ForceArrows( model ) );

    // add velocity arrows
    this.toScale.addChild( new VelocityArrows( model ) );

    // add planet path
    this.toScale.addChild( new PlanetPath( model ) );

    // add grids
    this.toScale.addChild( new Grid( model ) );

    // add tooltips
    this.toScale.addChild( new Tooltips( model ) );
    this.addChild( this.toScale );

    // add measuring tape
    this.addChild( new MeasuringTape( model ) );

    // add mass text
    this.addChild( new MassText( model ) );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      self.toScale.scale( 1 / (oldScale || 1) );
      self.toScale.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.link( function( vect ) {
      self.x = vect.x;
      self.y = vect.y;
    } );
  }

  return inherit( Node, Workspace );
} );