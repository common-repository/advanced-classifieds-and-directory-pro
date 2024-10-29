(function( $ ) {
	'use strict';	

	const toggleShortcodeForm = () => {
		const shortcode = $( '#acadp-shortcode-selector input[type=radio]:checked' ).val();

		document.querySelectorAll( '.acadp-shortcode-form' ).forEach(( el ) => {
			if ( el.dataset.shortcode === shortcode ) {
				el.hidden = false;
			} else {
				el.hidden = true;
			}
		});
	}

	const copyShortcode = () => {
		$( '#acadp-shortcode' ).select();
		document.execCommand( 'copy' );	

		$( '#acadp-shortcode-copied-status' ).prop( 'hidden', false );	
	}

	/**
	 * Called when the page has loaded.
	 */
	$(function() {				

		// Accordion
		document.querySelectorAll( '.acadp-accordion-header' ).forEach(( el ) => {
			const accordionEl = el.closest( '.acadp-accordion' );

			if ( accordionEl !== null ) {
				el.addEventListener( 'click', ( event ) => {
					accordionEl.querySelectorAll( '.acadp-accordion-panel' ).forEach(( el ) => {
						el.classList.toggle( 'open' );
					});
				});	
			}		
		});

		// Modal
		document.querySelectorAll( '.acadp-button-modal' ).forEach(( buttonEl ) => {
			const modal = buttonEl.getAttribute( 'data-target' );

			let backdropEl = document.createElement( 'div' );
			backdropEl.id = 'acadp-backdrop';
			backdropEl.className = 'acadp';
			backdropEl.innerHTML = '<div class="acadp-modal-backdrop"></div>';

			buttonEl.addEventListener( 'click', () => {		
				document.body.appendChild( backdropEl );				
				$( modal ).addClass( 'open' );
			});
		});

		document.querySelectorAll( '.acadp-modal .acadp-button-close' ).forEach(( buttonEl ) => {
			buttonEl.addEventListener( 'click', () => {	
				$( '#acadp-backdrop' ).remove();
				$( '.acadp-modal.open' ).removeClass( 'open' );
			});
		});
		
		// Tab: Shortcode Builder
		const shortcodeSelectorEl = document.querySelector( '#acadp-shortcode-selector' );

		if ( shortcodeSelectorEl !== null ) {
			// Toggle Shortcode Form
			shortcodeSelectorEl.querySelectorAll( 'input[type=radio]' ).forEach(( el ) => {
				el.addEventListener( 'change', ( event ) => {
					toggleShortcodeForm();
				});
			});

			toggleShortcodeForm();
		
			// Generate shortcode
			$( '#acadp-button-shortcode-generate' ).on( 'click', ( event ) => { 
				event.preventDefault();			

				// Reset
				$( '#acadp-shortcode-copied-status' ).prop( 'hidden', true );

				// Shortcode
				const shortcode = $( '#acadp-shortcode-selector input[type=radio]:checked' ).val();

				// Attributes
				let obj = {};

				const formEl = document.querySelector( '#acadp-shortcode-form-' + shortcode );

				if ( formEl !== null ) {
					formEl.querySelectorAll( '.acadp-shortcode-field' ).forEach(( el ) => {
						let type  = el.getAttribute( 'type' ) || el.type;
						let key   = el.getAttribute( 'name' ) || el.name;				
						let value = el.value;	

						let def = 0;
						if ( el.hasAttribute( 'data-default' ) ) {
							def = el.dataset.default;
						}

						// Is a Checkbox?
						if ( 'checkbox' == type ) {
							value = el.checked ? 1 : 0;
						}

						// Add only if the user input differ from the global configuration
						if ( value != def ) {
							obj[ key ] = value;
						}
					});
				}
				
				let attributes = shortcode;
				for ( let key in obj ) {
					if ( obj.hasOwnProperty( key ) ) {
						attributes += ( ' ' + key + '="' + obj[ key ] + '"' );
					}
				}

				// Insert Shortcode
				$( '#acadp-shortcode' ).val( '[acadp_' + attributes + ']' );
			});

			// Copy Shortcode
			$( '#acadp-button-shortcode-copy' ).on( 'click', copyShortcode );
			$( '#acadp-shortcode' ).on( 'focus', copyShortcode );
		}

		// Tab: Issues
		const issuesFormEl = document.querySelector( '#acadp-issues-form' );

		if ( issuesFormEl !== null ) {
			// Toggle checkboxes in the issues table list.
			$( '#acadp-issues-toggle-all' ).on( 'change', ( event ) => {
				const isChecked = event.target.checked ? true : false;	

				issuesFormEl.querySelectorAll( '.acadp-form-checkbox' ).forEach(( el ) => {
					el.checked = isChecked;
				});
			});	

			// Validate the form.	
			issuesFormEl.addEventListener( 'submit', ( event ) => {
				let isChecked = issuesFormEl.querySelectorAll( '.acadp-form-checkbox:checked' ).length > 0;	

				if ( ! isChecked ) {
					alert( acadp_admin.i18n.alert_required_issues );
					event.preventDefault();
					return false;
				}			
			});	
		}	
		
	});

})( jQuery );
