(function( $ ) {
	'use strict';	

	const resetImageField = () => {
		$( '#acadp-categories-image-id' ).val( '' );
		$( '#acadp-categories-image-wrapper' ).html( '' );					
		
		$( '#acadp-button-categories-remove-image' ).prop( 'hidden', true );
		$( '#acadp-button-categories-upload-image' ).prop( 'hidden', false );
	}

	/**
	 * Called when the page has loaded.
	 */
	$(function() {
		
		// Upload Image.
		$( '#acadp-button-categories-upload-image' ).on( 'click', ( event ) => { 
            event.preventDefault(); 

            ACADPMediaUploader(( json ) => {
				$( '#acadp-categories-image-id' ).val( json.id );
				$( '#acadp-categories-image-wrapper' ).html( '<img src="' + json.url + '" alt="" />' );
				
				$( '#acadp-button-categories-upload-image' ).prop( 'hidden', true );
				$( '#acadp-button-categories-remove-image' ).prop( 'hidden', false );
			}); 
        });
		
		// Delete Image.	
		$( '#acadp-button-categories-remove-image' ).on( 'click', ( event ) => {														 
            event.preventDefault();
			
			const id = parseInt( $( '#acadp-categories-image-id' ).val() );			
			if ( id > 0 ) {				
				let data = {
					'action': 'acadp_delete_attachment',
					'attachment_id': id,
					'security': acadp_admin.ajax_nonce
				};
				
				resetImageField();

				$.post( ajaxurl, data, function( response ) {
					// console.log( response );
				});				
			};			
		});
		
		// Reset Image Field.
		$( document ).ajaxComplete(function( event, xhr, settings ) {			
			if ( document.querySelector( '#acadp-categories-image-id' ) !== null ) {				
				const queryStringArr = settings.data.split( '&' );
			   
				if ( $.inArray( 'action=add-tag', queryStringArr ) !== -1 ) {
					const response = $( xhr.responseXML ).find( 'term_id' ).text();
					if ( '' != response ) {
						resetImageField();
					}
				};			
			};			
		});	
		
	});

})( jQuery );
