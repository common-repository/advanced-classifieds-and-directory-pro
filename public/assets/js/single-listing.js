'use strict';

(function( $ ) {

	/**
     * Initialize ReCaptcha.
	 */
	const initReCaptcha = () => {
		// Contact form.
		if ( document.querySelector( '#acadp-contact-form-control-recaptcha' ) !== null ) {			
			if ( acadp.recaptcha_contact > 0 ) {
				acadp.recaptchas['contact'] = grecaptcha.render( 'acadp-contact-form-control-recaptcha', {
					'sitekey': acadp.recaptcha_site_key
				});
			}		
		} else {			
			acadp.recaptcha_contact = 0;			
		}

		// Report form.
		if ( document.querySelector( '#acadp-report-abuse-form-control-recaptcha' ) !== null ) {			
			if ( acadp.recaptcha_report_abuse > 0 ) {
				acadp.recaptchas['report_abuse'] = grecaptcha.render( 'acadp-report-abuse-form-control-recaptcha', {
					'sitekey': acadp.recaptcha_site_key
				});
			}		
		} else {			
			acadp.recaptcha_report_abuse = 0;			
		}
	}

	/**
     * Init video.
	 */
	const initVideo = () => {
		document.querySelectorAll( '.acadp-iframe-video' ).forEach(( el ) => {
			el.setAttribute( 'src', el.dataset.src );
		});
	}

	/**
     * Toggle favourites.
	 */
	const toggleFavourites = ( buttonEl ) => {
		const $buttonEl = $( buttonEl );

		$buttonEl.find( 'svg' ).addClass( 'acadp-animate-spin' );
		$buttonEl.prop( 'disabled', true );

		let data = {
			'action': 'acadp_public_add_remove_favorites',
			'post_id': parseInt( acadp.post_id ),
			'security': acadp.ajax_nonce
		}
		
		$.post( acadp.ajax_url, data, function( response ) {
			$( '.acadp-button-add-to-favourites' ).toggleClass( 'acadp-hidden' );
			$( '.acadp-button-remove-from-favourites' ).toggleClass( 'acadp-hidden' );	
			
			$buttonEl.find( 'svg' ).removeClass( 'acadp-animate-spin' );
			$buttonEl.prop( 'disabled', false );
		});
	}
	
	/**
	 * Called when the page has loaded.
	 */
	$(function() {			
		
		// Slick slider
		if ( $.fn.slick ) {			
			let $carousel = $( '.acadp-slider-for' ).slick({
				rtl: ( parseInt( acadp.is_rtl ) ? true : false ),
  				asNavFor: '.acadp-slider-nav',
				arrows: false,
  				fade: true,
				slidesToShow: 1,
  				slidesToScroll: 1,
				adaptiveHeight: true
			});

			// Magnific popup
			if ( $.fn.magnificPopup ) { 
				$carousel.magnificPopup({
					type: 'image',
					delegate: 'div:not(.slick-cloned) img',
					gallery: {
						enabled: true
					},
					callbacks: {
						elementParse: function( item ) {
							item.src = item.el.attr( 'src' );
						},
						open: function() {
							const current = $carousel.slick( 'slickCurrentSlide' );
							$carousel.magnificPopup( 'goTo', current );
						},
						beforeClose: function() {
							$carousel.slick( 'slickGoTo', parseInt( this.index ) );
						}
					}
				});
			}
		
			// Slick
			$( '.acadp-slider-nav' ).slick({
				rtl: ( parseInt( acadp.is_rtl ) ? true : false ),
				asNavFor: '.acadp-slider-for',
				nextArrow: '<div class="acadp-slider-next"><span aria-hidden="true">&#10095;</span></div>',
				prevArrow: '<div class="acadp-slider-prev"><span aria-hidden="true">&#10094;</span></div>',
  				focusOnSelect: true,
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: false,
				responsive: [{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
					}
				}, {
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				}]
			});		
		}

		// Magnific popup
		if ( $.fn.magnificPopup ) {		
			$( '.acadp-image-popup' ).magnificPopup({
				type: 'image'
			}); 
		}
		
		// Init ReCaptcha.
		if ( window.isACADPReCaptchaLoaded ) {
			initReCaptcha();
		} else {
			document.addEventListener( 'acadp.recaptcha.loaded', initReCaptcha );
		}

		// Init map.
		if ( acadp.map_service === 'osm' ) {
			ACADPLoadScript( acadp.plugin_url + 'public/assets/js/openstreetmap.js' );
		} else {
			ACADPLoadScript( acadp.plugin_url + 'public/assets/js/googlemap.js' );
		}

		// Init video.
		if ( acadp.show_cookie_consent ) {
			document.addEventListener( 'acadp.cookie.consent', initVideo );
		} else {
			initVideo();
		}	

		// Request login.
		document.querySelectorAll( '.acadp-button-require-login' ).forEach(( buttonEl ) => {
			buttonEl.addEventListener( 'click', () => {	
				alert( acadp.i18n.alert_required_login );			 
			});	
		});

	   	// Toggle favourites.
		$( '.acadp-button-add-to-favourites' ).on( 'click', ( event ) => {
			toggleFavourites( event.target );											   
		});
		
		$( '.acadp-button-remove-from-favourites' ).on( 'click', ( event ) => {
			toggleFavourites( event.target );											   
		});
		
		// Form Validation.
		ACADPLoadScript( acadp.plugin_url + 'public/assets/js/validate.js' ).then(() => {
			// Report form
			const reportFormEl = document.querySelector( '#acadp-report-abuse-form' );

			if ( reportFormEl !== null ) {
				ACADPInitForm( '#acadp-report-abuse-form' );

				// Handle form submit validation via JS instead.
				reportFormEl.addEventListener( 'submit', ( event ) => {
					event.preventDefault();

					// Get the form element that was submitted.
					const formEl  = event.target;
					const $formEl = $( formEl );

					// Reset error fields
					const $statusEl = $formEl.find( '.acadp-form-status' );
					$statusEl.html( '' );

					// The isFormValid boolean respresents all inputs that can
					// be validated with the Constraint Validation API.
					let isFormValid = ACADPCheckValidity( formEl );
				
					// Fields that cannot be validated with the Constraint Validation API need
					// to be validated manually.
					let recaptchaResponse = null;
					if ( acadp.recaptcha_report_abuse > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['report_abuse'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$( '#acadp-report-abuse-form-control-recaptcha' ).addClass( 'is-invalid' );
							$( '#acadp-report-abuse-form-error-recaptcha' ).html( acadp.i18n.invalid_recaptcha ).prop( 'hidden', false );

							grecaptcha.reset( acadp.recaptchas['report_abuse'] );		
							isFormValid = false;
						} else {
							$( '#acadp-report-abuse-form-control-recaptcha' ).removeClass( 'is-invalid' );
							$( '#acadp-report-abuse-form-error-recaptcha' ).html( '' ).prop( 'hidden', true );
						}		
					}

					// Prevent form submission if any of the validation checks fail.
					if ( ! isFormValid ) {
						return false;
					}

					// Validation success. Post via AJAX.
					const $submitButtonEl = $formEl.find( '.acadp-button-submit' );					
					$submitButtonEl.prepend( '<div class="acadp-spinner"></div>' );
					$submitButtonEl.prop( 'disabled', true );
							
					let data = {
						'action': 'acadp_public_report_abuse',
						'post_id': parseInt( acadp.post_id ),
						'message': $( '#acadp-report-abuse-form-control-message' ).val(),
						'g-recaptcha-response': recaptchaResponse,
						'security': acadp.ajax_nonce
					}

					if ( $formEl.find( '.acadp-date-field' ).length > 0 ) {
						data.date = $formEl.find( '.acadp-date-field input' ).val();
					}

					if ( $formEl.find( '.acadp-magic-field' ).length > 0 ) {
						const fieldName = $formEl.find( '.acadp-magic-field input' ).attr( 'name' );
						data[ fieldName ] = $formEl.find( '.acadp-magic-field input' ).val();
					}

					$.post( acadp.ajax_url, data, function( response ) {
						if ( 1 == response.error ) {
							$statusEl.html( '<div class="acadp-text-error">' + response.message + '</div>' );
						} else {
							$( '#acadp-report-abuse-form-control-message' ).html( '' );
							$statusEl.html( '<div class="acadp-text-success">' + response.message + '</div>' );
						}
				
						if ( acadp.recaptcha_report_abuse > 0 ) {
							grecaptcha.reset( acadp.recaptchas['report_abuse'] );
						}					
						
						$submitButtonEl.find( '.acadp-spinner' ).remove();
						$submitButtonEl.prop( 'disabled', false );
					}, 'json' );																			  
				});	
			}	

			// Contact form
			const contactFormEl = document.querySelector( '#acadp-contact-form' );

			if ( contactFormEl !== null ) {			
				ACADPInitForm( '#acadp-contact-form' );

				// Handle form submit validation via JS instead.
				contactFormEl.addEventListener( 'submit', ( event ) => {
					event.preventDefault();

					// Get the form element that was submitted.
					const formEl  = event.target;
					const $formEl = $( formEl );

					// Reset error fields
					const $statusEl = $formEl.find( '.acadp-form-status' );
					$statusEl.html( '' );	

					// The isFormValid boolean respresents all inputs that can
					// be validated with the Constraint Validation API.
					let isFormValid = ACADPCheckValidity( formEl );
				
					let recaptchaResponse = null;
					if ( acadp.recaptcha_contact > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['contact'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$( '#acadp-contact-form-control-recaptcha' ).addClass( 'is-invalid' );
							$( '#acadp-contact-form-error-recaptcha' ).html( acadp.i18n.invalid_recaptcha ).prop( 'hidden', false );

							grecaptcha.reset( acadp.recaptchas['contact'] );		
							isFormValid = false;
						} else {
							$( '#acadp-contact-form-control-recaptcha' ).removeClass( 'is-invalid' );
							$( '#acadp-contact-form-error-recaptcha' ).html( '' ).prop( 'hidden', true );
						}			
					}

					// Prevent form submission if any of the validation checks fail.
					if ( ! isFormValid ) {					
						// Set the focus to the first invalid input.
						const firstInvalidInputEl = formEl.querySelector( '.is-invalid' );
						if ( firstInvalidInputEl !== null ) {
							$( 'html, body' ).animate({
								scrollTop: $( firstInvalidInputEl ).offset().top - 50
							}, 500 );				
						}	

						return false;
					}
					
					// Validation success. Post via AJAX.
					const $submitButtonEl = $formEl.find( '.acadp-button-submit' );	
					$submitButtonEl.prepend( '<div class="acadp-spinner"></div>' );					
					$submitButtonEl.prop( 'disabled', true );

					let data = {
						'action': 'acadp_public_send_contact_email',
						'post_id': parseInt( acadp.post_id ),
						'name': $( '#acadp-contact-form-control-name' ).val(),
						'email': $( '#acadp-contact-form-control-email' ).val(),
						'message': $( '#acadp-contact-form-control-message' ).val(),
						'g-recaptcha-response': recaptchaResponse,
						'security': acadp.ajax_nonce
					}

					const phoneEl = formEl.querySelector( '#acadp-contact-form-control-phone' );
					if ( phoneEl !== null ) {
						data.phone = phoneEl.value;
					}

					const copyEl = formEl.querySelector( '#acadp-contact-form-control-send_copy' );
					if ( copyEl !== null ) {
						data.send_copy = copyEl.checked ? 1 : 0;
					}

					if ( $formEl.find( '.acadp-date-field' ).length > 0 ) {
						data.date = $formEl.find( '.acadp-date-field input' ).val();
					}

					if ( $formEl.find( '.acadp-magic-field' ).length > 0 ) {
						const fieldName = $formEl.find( '.acadp-magic-field input' ).attr( 'name' );
						data[ fieldName ] = $formEl.find( '.acadp-magic-field input' ).val();
					}

					$.post( acadp.ajax_url, data, function( response ) {
						if ( 1 == response.error ) {
							$statusEl.html( '<div class="acadp-text-error">' + response.message + '</div>' );
						} else {
							$( '#acadp-contact-form-control-message' ).html( '' );
							$statusEl.html( '<div class="acadp-text-success">' + response.message + '</div>' );
						}
				
						if ( acadp.recaptcha_contact > 0 ) {
							grecaptcha.reset( acadp.recaptchas['contact'] );
						}						
						
						$submitButtonEl.find( '.acadp-spinner' ).remove();
						$submitButtonEl.prop( 'disabled', false );
					}, 'json' );
				});					
			}
		});		
		
		// Show phone number.
		$( '.acadp-link-show-phone-number' ).on( 'click', ( event ) => {
			event.target.style.display = 'none';
			$( '.acadp-phone-number' ).show();
		});	

	});

})( jQuery );
  