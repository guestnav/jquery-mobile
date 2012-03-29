
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Page change transition core
//>>label: Transition Core
//>>group: Transitions
//>>css: ../css/themes/default/jquery.mobile.theme.css, ../css/structure/jquery.mobile.transitions.css

define( [ "jquery", "./jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, window, undefined ) {

var createHandler = function( sequential ){
	
	// Default to sequential
	if( sequential === undefined ){
		sequential = true;
	}
	
	return function( name, reverse, $to, $from ) {

		var deferred = new $.Deferred(),
			reverseClass = reverse ? " reverse" : "",
			active	= $.mobile.urlHistory.getActive(),
			toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
			screenHeight = $.mobile.getScreenHeight(),
			maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $( window ).width() > $.mobile.maxTransitionWidth,
			none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none",
			toggleViewportClass = function(){
				$.mobile.pageContainer.toggleClass( "ui-mobile-viewport-transitioning viewport-" + name );
			},
			cleanFrom = function(){
				$from
					.removeClass( $.mobile.activePageClass + " out in reverse " + name )
					.height( "" );
			},
			doneOut = function() {

				if ( $from && sequential ) {
					cleanFrom();
				}
			
				$to.addClass( $.mobile.activePageClass );
			
				if( !none ){
					$to.animationComplete( doneIn );
				}
			
				// Send focus to page as it is now display: block
				$.mobile.focusPage( $to );

				// Jump to top or prev scroll, sometimes on iOS the page has not rendered yet.
				$to.height( screenHeight + toScroll );
				
				$.mobile.silentScroll( toScroll );
			
				$to.addClass( name + " in" + reverseClass );
			
				if( none ){
					doneIn();
				}
			
			},
		
			doneIn = function() {
			
				if ( !sequential ) {
					
					$.mobile.silentScroll( toScroll );
					
					if( $from ){
						cleanFrom();
					}
				}
			
				$to
					.removeClass( "out in reverse " + name )
					.height( "" );
				
				toggleViewportClass();
				
				// In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
				// This ensures we jump to that spot after the fact, if we aren't there already.
				if( $( window ).scrollTop() !== toScroll ){
					$.mobile.silentScroll( toScroll );
				}

				deferred.resolve( name, reverse, $to, $from, true );
			};

		toggleViewportClass();
	
		if ( $from && !none ) {
		
			// if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
			if( !sequential ){
				doneOut();
			}
			else {
				$from.animationComplete( doneOut );	
			}
		
			$from
				.height( screenHeight + $(window ).scrollTop() )
				.addClass( name + " out" + reverseClass );
		}
		else {	
			doneOut();
		}

		return deferred.promise();
	};
}

// generate the handlers from the above
var sequentialHandler = createHandler(),
	simultaneousHandler = createHandler( false );

// Make our transition handler the public default.
$.mobile.defaultTransitionHandler = sequentialHandler;

//transition handler dictionary for 3rd party transitions
$.mobile.transitionHandlers = {
	"default": $.mobile.defaultTransitionHandler,
	"sequential": sequentialHandler,
	"simultaneous": simultaneousHandler
};

$.mobile.transitionFallbacks = {};

})( jQuery, this );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");