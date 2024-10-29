(function( $ ) {
	'use strict';	

	const toggleFields = () => {
		const type = $( '#acadp-form-control-type' ).val();

		document.querySelectorAll( '.acadp-conditional-fields' ).forEach(( el ) => {
			if ( el.classList.contains( 'acadp-field-type-' + type ) ) {
				el.hidden = false;
			} else {
				el.hidden = true;
			}
		});
	}

	/**
	 * Called when the page has loaded.
	 */
	$(function() {

		// Toggle Fields.
		$( '#acadp-form-control-type' ).on( 'change', ( event ) => {	
			toggleFields();
		}).trigger( 'change' );			
		
	});
	
})( jQuery );
