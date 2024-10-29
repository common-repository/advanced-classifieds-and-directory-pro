'use strict';

/**
 * Load script files.
 */
if ( ! window.ACADPLoadScript ) { 	
	var ACADPLoadScript = ( url, type = null ) => {
		return new Promise(( resolve, reject ) => { 
			const filename = url.substring( url.lastIndexOf( '/' ) + 1, url.lastIndexOf( '.' ) );
			const id = 'acadp-script-' + filename;

			if ( document.querySelector( '#' + id ) !== null ) {
				resolve();
				return false;
			}

			const script = document.createElement( 'script' );

			script.id    = id;
			script.src   = url + '?ver=' + acadp.plugin_version;
			script.defer = true;

			if ( type !== null ) {
				script.type = type;	
			}		

			script.onload  = () => resolve();
			script.onerror = () => reject();

			document.body.appendChild( script );
		});
	}
}

/**
 * Check the form validity with the Constraint Validation API.
 */
if ( ! window.ACADPCheckValidity ) {
	var ACADPCheckValidity = ( formEl ) => {
		// Update the validation UI state for all inputs.
		formEl.querySelectorAll( '.acadp-form-validate' ).forEach( ACADPUpdateValidationStateForInput );

		// The isFormValid boolean respresents all inputs that can
		// be validated with the Constraint Validation API.
		let isFormValid = formEl.checkValidity();

		// Fields that cannot be validated with the Constraint Validation API need
		// to be validated manually.
		formEl.querySelectorAll( '.acadp-form-validate-checkboxes' ).forEach(( formGroupEl ) => {
			const isValid = ACADPValidateCheckboxGroup( formGroupEl );
			if ( ! isValid ) {
				isFormValid = isValid;
			}
		});

		return isFormValid;
	}
}

/**
 * Update the validation UI state for a given input element.
 */
if ( ! window.ACADPUpdateValidationStateForInput ) {
	var ACADPUpdateValidationStateForInput = ( inputEl ) => {
		// Check if the input is valid using the Constraint Validation API.
		// Yes, one line of code handles validation. 
		// The Constraint Validation API is cool!
		const isInputValid = inputEl.checkValidity();

		// Update the `aria-invalid` state based on the input's validity.
		// Converts the boolean to a string.
		inputEl.setAttribute( 'aria-invalid', ( ! isInputValid ).toString() );

		const formGroupEl = inputEl.closest( '.acadp-form-group' );		

		if ( formGroupEl !== null ) {
			// Handle optional fields that are empty
			if ( ! inputEl.required && inputEl.value === '' && isInputValid ) {
				// Clear validation states.
				formGroupEl.classList.remove( 'has-error' );
			} else {
				// Required fields: Toggle valid/invalid state classes.
				formGroupEl.classList.toggle( 'has-error', ! isInputValid );
			}	
		}
	}
}

/**
 * Validates the checkbox group.
 */
if ( ! window.ACADPValidateCheckboxGroup ) {
	var ACADPValidateCheckboxGroup = ( formGroupEl ) => {
		// Are any of the checkboxes checked? 
		// At least one is required.
		const isValid = formGroupEl.querySelectorAll( 'input[type=checkbox]:checked' ).length > 0;

		// Need to place the validation state classes higher up to show
		// a validation state icon (one icon for the group of checkboxes).
		formGroupEl.classList.toggle( 'has-error', ! isValid );

		// Also update aria-invalid on the fieldset (convert to a string)
		formGroupEl.setAttribute( 'aria-invalid', String( ! isValid ) );

		// Return the validation state.
		return isValid;
	}
}

(function( $ ) {

	/**
	 * Init Range Slider.
	 */
	const initRangeSlider = ( el ) => {
		const rangeEl  = el.querySelector( '.acadp-range-input' );
		const bubbleEl = el.querySelector( '.acadp-range-value' );

		if ( rangeEl !== null && bubbleEl !== null ) {
			const min = parseInt( rangeEl.min );
			const max = parseInt( rangeEl.max );

			const updateRange = () => {
				let value = Number( ( rangeEl.value - min ) * 100 / ( max - min ) );
				let position = 10 - ( value * 0.2 );

				bubbleEl.innerHTML = '<span>' + rangeEl.value + '</span>';
				bubbleEl.style.left = 'calc(' + value + '% + (' + position + 'px))';
			}

			rangeEl.addEventListener( 'input', updateRange );
			updateRange();
		}
	}

	/**
	 * Init Datetime Picker.
	 */
	const initDatetimePicker = ( el ) => {
		if ( typeof flatpickr === undefined ) {
			return false;
		}

		flatpickr.l10ns.default.rangeSeparator = ' ' + acadp.i18n.search_form_daterange_separator + ' ';

		let config = {
			allowInput: true
		}

		if ( el.classList.contains( 'acadp-has-daterange' ) ) {
			config.mode = 'range';
		}

		if ( el.classList.contains( 'acadp-datetime-picker' ) ) {
			config.enableTime    = true;				
			config.enableSeconds = true;
			config.time_24hr     = true;
		}

		flatpickr( el, config );
	}

	/**
     * Init video.
	 */
	const initVideo = () => {
		document.querySelectorAll( '.acadp-video' ).forEach(( el ) => {
			el.setAttribute( 'src', el.dataset.src );
		});
	}

	/**
     * Init map.
	 */
	const initMap = () => {
		document.querySelectorAll( '.acadp-map:not(.acadp-map-loaded)' ).forEach(( mapEl ) => {		
			if ( 'osm' == acadp.map_service ) {
				initOpenStreetMap( mapEl );
			} else {
				initGoogleMap( mapEl );
			}
		});
	}

	/**
     * Init OpenStreetMap.
	 */
	const initOpenStreetMap = ( mapEl ) => {
		mapEl.classList.add( 'acadp-map-loaded' );

		// Vars
		const markersEl = mapEl.querySelectorAll( '.marker' );		
		const type = mapEl.dataset.type;

		let latitude  = 0;
		let longitude = 0;
		let popupContent = '';

		if ( markersEl.length > 0 ) {
			latitude     = markersEl[0].dataset.latitude;
			longitude    = markersEl[0].dataset.longitude;
			popupContent = markersEl[0].innerHTML;
		}

		// Set a custom image path.
		L.Icon.Default.prototype.options.imagePath = acadp.plugin_url + 'vendor/leaflet/images/';

		// Creating map options.
		const mapOptions = {
			center: [ latitude, longitude ],
			zoom: acadp.zoom_level
		}

		// Creating a map object.        	
		let map = new L.map( mapEl, mapOptions );

		// Creating a Layer object.
		const layer = new L.TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});

		// Adding layer to the map.
		map.addLayer( layer );

		if ( type === 'markerclusterer' ) {
			// Creating Marker Options.
			const markerOptions = {
				clickable: true,
				draggable: false
			}

			// Creating Markers.	
			let markers = L.markerClusterGroup();

			markersEl.forEach(( markerEl ) => {	
				const latitude = markerEl.dataset.latitude;
				const longitude = markerEl.dataset.longitude;

				// Creating a marker.
				const marker = L.marker( [ latitude, longitude ], markerOptions );

				// Adding popup to the marker.
				const content = markerEl.innerHTML;
				if ( content ) {
					marker.bindPopup( content, { minWidth: 280, maxHeight: 200 } );
				}

				markers.addLayer( marker );
			});

			map.addLayer( markers );

			// Center map.
			if ( acadp.snap_to_user_location && navigator.geolocation ) {
				// Try HTML5 geolocation.
				navigator.geolocation.getCurrentPosition(function( position ) {
				  map.panTo( new L.LatLng( position.coords.latitude, position.coords.longitude ) );
				}, function() {
					// Browser doesn't support Geolocation.
					map.fitBounds(markers.getBounds(), {
						padding: [50, 50]
					});
				});
			} else {
				map.fitBounds(markers.getBounds(), {
					padding: [50, 50]
				});	
			}
		} else {
			// Creating Marker Options.
			const markerOptions = {
				clickable: true,
				draggable: ( type === 'form' ? true : false )
			}

			// Creating a Marker.
			let marker = L.marker( [ latitude, longitude ], markerOptions );

			// Adding popup to the marker.
			if ( popupContent ) {
				marker.bindPopup( popupContent, { minWidth: 280, maxHeight: 200 } );
			}

			// Adding marker to the map.
			marker.addTo( map );

			// Is the map editable?
			if ( type === 'form' ) {				
				// Update latitude and longitude values in the form when marker is moved.
				marker.addEventListener( 'dragend', function( event ) {
					const position = event.target.getLatLng();

					map.panTo( new L.LatLng( position.lat, position.lng ) );
					updateLatLng( position.lat, position.lng );
				});

				// Update map when the contact fields are edited.
				const contactDetailsEl = document.querySelector( '#acadp-contact-details' );

				const onAddressChange = () => {
					let query = [];					

					let location = '';

					if ( contactDetailsEl !== null ) {
						if ( contactDetailsEl.querySelector( 'acadp-dropdown-terms' ) !== null ) {
							const $selectedOption = $( contactDetailsEl ).find( 'input[name=acadp_location]:checked' );

							if ( $selectedOption && $selectedOption.val() > 0 ) {   
								let $parentLocations = $selectedOption.parents( '.acadp-term' );

								$parentLocations.each(function() {
									location = $( this ).find( '.acadp-term-name' ).html().trim();
									query.push( location );
								});
							}
						} else if ( contactDetailsEl.querySelector( '#acadp-form-control-location' ) !== null ) {
							const $selectedOption = $( '#acadp-form-control-location' ).find( 'option:selected' );

							if ( $selectedOption && $selectedOption.val() > 0 ) {   
								location = $selectedOption.text().trim();
								query.push( location );

								// Find the current level number
								let classNames = $selectedOption.attr( 'class' );
								classNames = classNames.split( ' ' );

								let level = 0;

								for ( let i = 0; i < classNames.length; i++ ) {
									let className = classNames[ i ].trim();

									if ( className.indexOf( 'level-' ) !== -1 ) {
										level = parseInt( className.split( 'level-' )[1] );
										break;
									}
								}

								// Loop through all levels to find the parent location names
								let $previousEl = $selectedOption.prev();

								for ( let i = level - 1; i >= 0; i-- ) {
									while ( ! $previousEl.hasClass( 'level-' + i ) ) {						
										$previousEl = $previousEl.prev();					
									}

									location = $previousEl.text().trim();
									query.push( location );
								}								
							}
						} else {				
							let locations = [];

							let defaultLocation = $( '#acadp-default-location' ).val();
							if ( defaultLocation ) {
								locations.push( defaultLocation.trim() );
							}

							$( '#acadp-contact-details select' ).each(function() {
								const defaultOption  = $( this ).find( 'option:first' ).text();
								const selectedOption = $( this ).find( 'option:selected' ).text();

								if ( selectedOption != defaultOption ) {
									locations.push( selectedOption.trim() );
								}
							});

							if ( locations.length > 0 ) {
								location = locations[0];
								locations.reverse();
								
								query.push( locations.join() );
							}
						}
					}

					const zipcode = $( '#acadp-zipcode' ).val();
					if ( zipcode ) {
						if ( location ) {
							query = [ location, zipcode ]; // Bind only the top-level location (country)
						} else {
							query.push( zipcode );
						}
					}

					if ( 0 == query.length ) {
						let address = $( '#acadp-address' ).val();

						if ( address ) {
							address = address.trim();
							address = address.replace( /(?:\r\n|\r|\n)/g, ',' );					
							address = address.replaceAll( ', ', ',' );
							address = address.replaceAll( ' ,', ',' );	
							address = address.replaceAll( ',,', ',' );

							query.push( address );
						}
					}

					query = query.filter( function( v ) { return v !== '' } );
					query = query.join();
					
					$.get( 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent( query ) +'&format=jsonv2&limit=1', function( response ) {
						if ( response.length > 0 ) {
							const latLng = new L.LatLng( response[0].lat, response[0].lon );

							marker.setLatLng( latLng );
							map.panTo( latLng );
							updateLatLng( response[0].lat, response[0].lon );
						}
					}, 'json' );
				}

				$( contactDetailsEl ).on( 'blur', '.acadp-map-field', function() {
					onAddressChange();
				});

				if ( ! latitude || ! longitude ) {
					onAddressChange();
				}
			}
		}	
	}

	/**
     * Init Google Map.
	 */
	const initGoogleMap = ( mapEl ) => {		
		mapEl.classList.add( 'acadp-map-loaded' );

		// Vars
		const markersEl = mapEl.querySelectorAll( '.marker' );		

		// Create map
		const options = {
			zoom: parseInt( acadp.zoom_level ),
			center: new google.maps.LatLng( 0, 0 ),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: true,
			scrollwheel: false
		}

		let map = new google.maps.Map( mapEl, options );

		// Set map type.
		map.type = mapEl.dataset.type;

		// Add markers.		
		map.markers = [];	

		markersEl.forEach(( markerEl ) => {							   
			addGoogleMarker( markerEl, map );			
		});

		// Center map.
		if ( map.type == 'markerclusterer' ) {
			// Try HTML5 geolocation.
			if ( acadp.snap_to_user_location && navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition(function( position ) {
					map.setCenter({
						lat: position.coords.latitude,
					  	lng: position.coords.longitude
				  });
				}, function() {
					centerMap( map );
				});
			} else {
				// Browser doesn't support Geolocation.
				centerMap( map );
			}
		} else {
			centerMap( map );
		}

		// MarkerClusterer
		if ( map.type == 'markerclusterer' ) {			
			new MarkerClusterer( map, map.markers, { imagePath: acadp.plugin_url + 'vendor/markerclusterer/images/m' } );			
		}
		
		// Update map when the contact fields are edited.
		if ( map.type === 'form' ) {			
			const contactDetailsEl = document.querySelector( '#acadp-contact-details' );			
			const geoCoder = new google.maps.Geocoder();	
			
			const onAddressChange = () => {
				let query = [];
				
				let address = $( '#acadp-address' ).val();
				if ( address ) {
					address = address.trim();
					address = address.replace( /(?:\r\n|\r|\n)/g, ',' );					
					address = address.replaceAll( ', ', ',' );
					address = address.replaceAll( ' ,', ',' );	
					address = address.replaceAll( ',,', ',' );

					query.push( address );
				}

				let location = '';

				if ( contactDetailsEl !== null ) {
					if ( contactDetailsEl.querySelector( 'acadp-dropdown-terms' ) !== null ) {
						const $selectedOption = $( contactDetailsEl ).find( 'input[name=acadp_location]:checked' );

						if ( $selectedOption && $selectedOption.val() > 0 ) {   
							let $parentLocations = $selectedOption.parents( '.acadp-term' );

							$parentLocations.each(function() {
								location = $( this ).find( '.acadp-term-name' ).html().trim();
								query.push( location );
							});
						}
					} else if ( contactDetailsEl.querySelector( '#acadp-form-control-location' ) !== null ) {
						const $selectedOption = $( '#acadp-form-control-location' ).find( 'option:selected' );

						if ( $selectedOption && $selectedOption.val() > 0 ) {   
							location = $selectedOption.text().trim();
							query.push( location );

							// Find the current level number
							let classNames = $selectedOption.attr( 'class' );
							classNames = classNames.split( ' ' );

							let level = 0;

							for ( let i = 0; i < classNames.length; i++ ) {
								let className = classNames[ i ].trim();

								if ( className.indexOf( 'level-' ) !== -1 ) {
									level = parseInt( className.split( 'level-' )[1] );
									break;
								}
							}

							// Loop through all levels to find the parent location names
							let $previousEl = $selectedOption.prev();

							for ( let i = level - 1; i >= 0; i-- ) {
								while ( ! $previousEl.hasClass( 'level-' + i ) ) {						
									$previousEl = $previousEl.prev();					
								}

								location = $previousEl.text().trim();
								query.push( location );
							}								
						}
					} else {				
						let locations = [];

						let defaultLocation = $( '#acadp-default-location' ).val();
						if ( defaultLocation ) {
							locations.push( defaultLocation.trim() );
						}

						$( '#acadp-contact-details select' ).each(function() {
							const defaultOption  = $( this ).find( 'option:first' ).text();
							const selectedOption = $( this ).find( 'option:selected' ).text();

							if ( selectedOption != defaultOption ) {
								locations.push( selectedOption.trim() );
							}
						});

						if ( locations.length > 0 ) {
							location = locations[0];
							locations.reverse();
							
							query.push( locations.join() );
						}
					}	
				}			

				const zipcode = $( '#acadp-zipcode' ).val();
				if ( zipcode ) {
					query.push( zipcode );
				}

				query = query.filter( function( v ) { return v !== '' } );
				query = query.join();
			
				geoCoder.geocode({ 'address': query }, function( results, status ) {															
					if ( status == google.maps.GeocoderStatus.OK ) {						
						const point = results[0].geometry.location;
	
						map.markers[0].setPosition( point );
						centerMap( map );
						updateLatLng( point.lat(), point.lng() );						
					}			
				});
			}
			
			$( contactDetailsEl ).on( 'blur', '.acadp-map-field', function() {
				onAddressChange();
			});
				
			if ( markersEl.length > 0 ) {
				const latitude  = markersEl[0].dataset.latitude;
				const longitude = markersEl[0].dataset.longitude;

				if ( ! latitude || ! longitude ) {
					onAddressChange();
				}
			}			
		}
	}
	
	/**
	 * Add Marker.
	 */
	const addGoogleMarker = ( markerEl, map ) => {
		// Vars
		let latLng = new google.maps.LatLng( markerEl.dataset.latitude, markerEl.dataset.longitude );

		// Check to see if any of the existing markers match the latlng of the new marker.
		if ( map.markers.length ) {
			for ( let i = 0; i < map.markers.length; i++ ) {
        		let existingMarker = map.markers[ i ];
        		let position = existingMarker.getPosition();

        		// If a marker already exists in the same position as this marker.
        		if ( latLng.equals( position ) ) {
            		// update the position of the coincident marker by applying a small multipler to its coordinates.
            		let latitude  = latLng.lat() + ( Math.random() - 0.5 ) / 1500; // * (Math.random() * (max - min) + min);
            		let longitude = latLng.lng() + ( Math.random() - 0.5 ) / 1500; // * (Math.random() * (max - min) + min);
            		
					latLng = new google.maps.LatLng( latitude, longitude );
        		}
    		}
		}
		
		// Create marker.
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			draggable: ( map.type === 'form' ) ? true : false
		});

		// Add to array.
		map.markers.push( marker );
	
		// If marker contains HTML, add it to an infoWindow.
		if ( markerEl.innerHTML ) {
			// Create info window.
			let infowindow = new google.maps.InfoWindow({
				content: markerEl.innerHTML
			});

			// Show info window when marker is clicked.
			google.maps.event.addListener( marker, 'click', function() {	
				infowindow.open( map, marker );
			});
		}

		// Update latitude and longitude values when the marker is moved.
		if ( map.type === 'form' ) {
			google.maps.event.addListener( marker, 'dragend', function() {																  
				const point = marker.getPosition();

				map.panTo( point );
				updateLatLng( point.lat(), point.lng() );			
			});	
		}
	}

	/**
	 * Center the map.
	 */
	const centerMap = ( map ) => {
		// Vars
		let bounds = new google.maps.LatLngBounds();

		// Loop through all markers and create bounds.
		map.markers.forEach(( marker ) => {
			const latLng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
			bounds.extend( latLng );
		});

		if ( map.markers.length === 1 ) {			
			// Set center of map.
	    	map.setCenter( bounds.getCenter() );
	    	map.setZoom( parseInt( acadp.zoom_level ) );			
		} else {			
			// Fit to bounds.
			map.fitBounds( bounds );			
		}
	}

	/**
	 * Update the latitude and longitude field values.
	 */
	const updateLatLng = ( latitude, longitude ) => {		
		$( '#acadp-latitude' ).val( latitude );
		$( '#acadp-longitude' ).val( longitude );
	}
	
	/**
	 *  Make images sortable.
	 */
	const sortImages = () => {		
		if ( ! $.fn.sortable ) {
			return false;
		}

		const $el = $( '#acadp-images tbody' );

		if ( $el.hasClass( 'ui-sortable' ) ) {
			$el.sortable( 'destroy' );
		}
		
		$el.sortable({ handle: '.acadp-handle' });		
		$el.disableSelection();
	}
	
	/**
	 * Check if the user has permission to upload images.
	 */
	const canUploadImage = () => {		
		const limit = maxImagesCount();
		const uploaded = numImagesUploaded();	
		
		if ( ( limit > 0 && uploaded >= limit ) || $( '#acadp-progress-image-upload' ).hasClass( 'uploading' ) ) {
			return false;
		}
		
		return true;		
	}
	
	/**
	 * Get the maximum number of images the user can upload per listing.
	 */
	const maxImagesCount = () => {		
		let limit = $( '#acadp-upload-image' ).data( 'limit' );

		if ( typeof limit !== undefined && limit !== false ) {
  			limit = parseInt( limit );
		} else {
			limit = parseInt( acadp.maximum_images_per_listing );
		}
		
		return limit;		
	}
	
	/**
	 * Get the number of images the user has uploaded to the current listing.
     *
	 *  @return {number} Number of images.
	 */
	const numImagesUploaded = () => {
		return document.querySelectorAll( '.acadp-image-field' ).length;		
	}

	/**
	 *  Enable or disable image upload button
	 */
	const toggleImageUploadBtn = () => {		
		if ( ! canUploadImage() ) {
			$( '#acadp-upload-image' ).prop( 'disabled', true );
		} else {
			$( '#acadp-upload-image' ).prop( 'disabled', false );
		}					
	}	

	/**
	 *  Toggle password fields.
	 */
	const togglePasswordFields = () => {
		const formEl = document.querySelector( '#acadp-user-account' );
		const isChecked = $( '#acadp-change-password' ).is( ':checked' );

		formEl.querySelectorAll( '.acadp-password-fields' ).forEach(( el ) => {
			el.style.display = isChecked ? '' : 'none';
			$( el ).find( 'input[type=password]' ).prop( 'disabled', ! isChecked );
		});
	}
	
	/**
	 * Called when the page has loaded.
	 */
	$(function() {	

		// Load the required script files.
		if ( document.querySelector( 'acadp-dropdown-terms' ) !== null ) {
			ACADPLoadScript( acadp.plugin_url + 'public/assets/js/select.js', 'module' );
		}

		// Init Range slider	
		document.querySelectorAll( '.acadp-range-slider' ).forEach(( el ) => {
			initRangeSlider( el );
		});	
		
		// Init Datetime picker		
		document.querySelectorAll( '.acadp-date-picker' ).forEach(( el ) => {
			initDatetimePicker( el );
		});

		document.querySelectorAll( '.acadp-datetime-picker' ).forEach(( el ) => {
			initDatetimePicker( el );
		});

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
							var current = $carousel.slick( 'slickCurrentSlide' );
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
				nextArrow: '<div class="acadp-slider-next"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>',
				prevArrow: '<div class="acadp-slider-prev"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>',
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

		// Magnific popup.
		if ( $.fn.magnificPopup ) {		
			$( '.acadp-image-popup' ).magnificPopup({
				type: 'image'
			});
		}
		
		// Cookie Consent.
		if ( acadp.show_cookie_consent ) {
			document.querySelectorAll( '.acadp-privacy-consent-button' ).forEach(( buttonEl ) => {
				buttonEl.addEventListener( 'click', ( event ) => {					
					buttonEl.innerHTML = '...';
					buttonEl.disabled = true;
					
					let data = {
						'action': 'acadp_set_cookie',
						'security': acadp.ajax_nonce
					}
		
					$.post( 
						acadp.ajax_url, 
						data, 
						function( response ) {
							if ( ! response.success ) {
								return false;
							}

							acadp.show_cookie_consent = false;

							document.querySelectorAll( '.acadp-privacy-wrapper' ).forEach(( cookieEl ) => {
								cookieEl.remove();
							});

							initVideo();
							initMap();

							document.dispatchEvent( new CustomEvent( 'acadp.cookie.consent' ) );	
						}
					);
				});
			});
		} else {
			initVideo();
			initMap();
		}	

		// Search Form: Load custom fields.
		const categoryEl = document.querySelector( '.acadp-category-search' );

		if ( categoryEl !== null ) {
			let eventName = 'change';
			if ( categoryEl.tagName.toLowerCase() == 'acadp-dropdown-terms' ) {
				eventName = 'acadp.terms.change';
			}

			$( 'body' ).on( eventName, '.acadp-category-search', ( event ) => {
				const formEl = event.target.closest( 'form' );	
				const customFieldsEl = formEl.querySelector( '.acadp-custom-fields-search' );	
				
				if ( customFieldsEl === null ) {
					return false;
				}

				let fields = {};

				customFieldsEl.innerHTML = '<div class="acadp-spinner acadp-margin-bottom"></div>';

				// Build fields input from cache
				let cached = customFieldsEl.dataset.cache;

				if ( cached ) {
					cached = JSON.parse( cached );
				}

				for ( const key in cached ) {
					if ( cached.hasOwnProperty( key ) ) {
						fields[ key ] = cached[ key ];
					}
				}
			
				// Build fields input from current visible form fields
				const current = $( formEl ).serializeArray();

				$.each( current, function() {
					if ( this.name.indexOf( 'cf' ) !== -1 ) {
						fields[ this.name ] = this.value;
					}
				});
		
				// Cache the new fields data 
				customFieldsEl.setAttribute( 'data-cache', JSON.stringify( fields ) );

				// Build query input from the fields object
				let query = [];

				for ( const key in fields ) {
					if ( fields.hasOwnProperty( key ) ) {
						query.push( encodeURIComponent( key ) + '=' + encodeURIComponent( fields[ key ] ) );
					}
				}

				query = query.join( '&' );			
				
				let data = {
					'action': 'acadp_custom_fields_search',
					'term_id': event.target.value,
					'style': customFieldsEl.dataset.style,
					'cached_meta': query,
					'security': acadp.ajax_nonce
				}
				
				$.post( acadp.ajax_url, data, function(response) {
					customFieldsEl.innerHTML = response;

					formEl.querySelectorAll( '.acadp-date-picker' ).forEach(( el ) => {
						initDatetimePicker( el );
					});

					formEl.querySelectorAll( '.acadp-datetime-picker' ).forEach(( el ) => {
						initDatetimePicker( el );
					});
				});			
			});	
		}	
		
		// Listing Form
		const listingFormEl = document.querySelector( '#acadp-post-form' );

		if ( listingFormEl !== null ) {
			// Load custom fields.
			const categoryEl = document.querySelector( '.acadp-category-listing' );

			if ( categoryEl !== null ) {
				let eventName = 'change';
				if ( categoryEl.tagName.toLowerCase() == 'acadp-dropdown-terms' ) {
					eventName = 'acadp.terms.change';
				}

				$( 'body' ).on( eventName, '.acadp-category-listing', ( event ) => {
					const customFieldsEl = listingFormEl.querySelector( '#acadp-custom-fields-listings' );	
					
					if ( customFieldsEl === null ) {
						return false;
					}

					let fields = {};

					customFieldsEl.innerHTML = '<div class="acadp-spinner acadp-margin-bottom"></div>';

					listingFormEl.querySelectorAll( '.acadp-listing-form-submit-btn' ).forEach(( buttonEl ) => {
						buttonEl.disabled = true;
					});

					// Build fields input from cache.
					let cached = customFieldsEl.getAttribute( 'data-cache' );

					if ( cached ) {
						cached = JSON.parse( cached );
					}

					for ( const key in cached ) {
						if ( cached.hasOwnProperty( key ) ) {
							fields[ key ] = cached[ key ];
						}
					}

					// Build fields input from current visible form fields.
					const current = $( listingFormEl ).serializeArray();

					$.each( current, function() {
						if ( this.name.indexOf( 'acadp_fields' ) !== -1 ) {
							fields[ this.name ] = this.value;
						}
					});

					// Cache the new fields data.
					customFieldsEl.setAttribute( 'data-cache', JSON.stringify( fields ) );

					// Build query input from the fields object.
					let query = [];

					for ( const key in fields ) {
						if ( fields.hasOwnProperty( key ) ) {
							query.push( encodeURIComponent( key ) + '=' + encodeURIComponent( fields[ key ] ) );
						}
					}

					query = query.join( '&' );			
					
					let data = {
						'action': 'acadp_public_custom_fields_listings',
						'post_id': customFieldsEl.dataset.post_id,
						'terms': event.target.value,
						'cached_meta': query,
						'security': acadp.ajax_nonce
					}
					
					$.post( acadp.ajax_url, data, function( response ) {
						customFieldsEl.innerHTML = response;

						customFieldsEl.querySelectorAll( '.acadp-date-picker' ).forEach(( el ) => {
							initDatetimePicker( el );
						});

						customFieldsEl.querySelectorAll( '.acadp-datetime-picker' ).forEach(( el ) => {
							initDatetimePicker( el );
						});

						customFieldsEl.querySelectorAll( '.acadp-range-slider' ).forEach(( el ) => {
							initRangeSlider( el );
						});

						listingFormEl.querySelectorAll( '.acadp-listing-form-submit-btn' ).forEach(( buttonEl ) => {
							buttonEl.disabled = false;
						});
					});			
				});	
			}

			// Trigger the file uploader when "Upload Image" button is clicked.
			$( '#acadp-upload-image' ).on( 'click', ( event ) => { 
				if ( ! canUploadImage() ) {
					return false;
				}

				$( '#acadp-upload-image-hidden' ).trigger('click');
			});
	
			// Upload image.
			$( '#acadp-upload-image-hidden' ).on( 'change', ( event ) => {		
				const selected = event.target.files.length;
				if ( ! selected ) {
					return false;
				}			
				
				const limit = maxImagesCount();
				const uploaded = numImagesUploaded();
				const remaining = limit - uploaded;

				if ( limit > 0 && selected > remaining ) {
					alert( acadp.i18n.alert_upload_limit.replace( /%d/gi, remaining ) );
					return false;
				}
	
				$( '#acadp-images-panel .panel-heading span' ).removeClass( 'text-danger' );

				const $uploadStatusEl = $( '#acadp-progress-image-upload' );
				$uploadStatusEl.addClass( 'uploading' ).html( '<div class="acadp-spinner acadp-margin-bottom"></div>' );

				let options = {
					dataType: 'json',
					url: acadp.ajax_url,
					success: function( json, statusText, xhr, $form ) {
						// Do extra stuff after submit.
						$uploadStatusEl.removeClass( 'uploading' ).html( '' );	
						
						$.each( json, function( key, value ) {							
							if ( ! value['error'] ) {
								let html = '<tr class="acadp-image-row">' + 
									'<td class="acadp-handle"><span class="glyphicon glyphicon-th-large"></span></td>' +          	
									'<td class="acadp-image">' + 
										'<img src="' + value['url'] + '" alt="" />' + 
										'<input type="hidden" class="acadp-image-field" name="images[]" value="' + value['id'] + '" />' + 
									'</td>' + 
									'<td>' + 
										'<span class="acadp-image-url">' + ( value['url'].split(/[\\/]/).pop() ) + '</span><br />' + 
										'<a href="javascript:;" class="acadp-delete-image" data-attachment_id="' + value['id'] + '">' + acadp.i18n.button_label_delete + '</a>' + 
									'</td>' +                 
								'</tr>';	

								$( '#acadp-images' ).append( html );
							}					
						})

						sortImages();
						toggleImageUploadBtn();
					},
					error: function( data ) {
						$uploadStatusEl.removeClass( 'uploading' ).html( '' );	
						toggleImageUploadBtn();
					}
				}

				// Submit form using 'ajaxSubmit'.
				$('#acadp-form-upload').ajaxSubmit( options );										 
			});	

			// Make images sortable.
			sortImages();
			
			// Delete the selected image.	
			$( listingFormEl ).on( 'click', 'a.acadp-delete-image', ( event ) => {														 
				event.preventDefault();
									
				const el = event.target;
				const customFieldsEl = listingFormEl.querySelector( '#acadp-custom-fields-listings' );	
				
				let data = {
					'action': 'acadp_public_delete_attachment_listings',
					'attachment_id': el.getAttribute( 'data-attachment_id' ),
					'security': acadp.ajax_nonce
				};

				if ( customFieldsEl !== null ) {
					data.post_id = customFieldsEl.dataset.post_id;
				}
				
				$.post( acadp.ajax_url, data, function( response ) {
					el.closest( 'tr' ).remove();
					$( '#acadp-upload-image-hidden' ).val( '' );

					toggleImageUploadBtn();
				});			
			});

			// Form Validation.
			if ( $.fn.validator ) {	
				let listingFormSubmitted = false;
				
				$( listingFormEl ).validator({
					'custom': {
						cb_required: function( $el ) {
							const className = $el.data( 'cb_required' );
							return $( 'input.' + className + ':checked' ).length > 0 ? true : false;
						}
					},
					errors: {
						cb_required: acadp.i18n.required_multicheckbox
					},
					disable: false
				}).on( 'submit', function( event ) {				
					if ( listingFormSubmitted ) return false;
					listingFormSubmitted = true;

					// The isFormValid boolean respresents all inputs that can
					// be validated with the Constraint Validation API.
					let isFormValid = ACADPCheckValidity( event.target );

					if ( event.isDefaultPrevented() ) {					
						isFormValid = false;			 			
					}
					
					// Fields that cannot be validated with the Constraint Validation API need
					// to be validated manually.
					if ( acadp.is_image_required > 0 ) {
						const uploaded = numImagesUploaded();
						
						if ( uploaded == 0 ) {
							$( '#acadp-images-panel .panel-heading span' ).addClass( 'text-danger' );
							isFormValid = false;
						}
					}

					let recaptchaResponse = null;
					if ( acadp.recaptcha_listing > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['listing'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$( '#acadp-listing-g-recaptcha-message' ).addClass( 'text-danger' ).html( acadp.i18n.invalid_recaptcha );

							grecaptcha.reset( acadp.recaptchas['listing'] );		
							isFormValid = false;
						} else {
							$( '#acadp-listing-g-recaptcha-message' ).removeClass( 'text-danger' ).html( '' );
						}			
					}
						
					if ( ! isFormValid ) {					
						$( '#acadp-post-errors' ).show();
						
						$( 'html, body' ).animate({
							scrollTop: $( listingFormEl ).offset().top - 50
						}, 500 );
						
						listingFormSubmitted = false; // Re-enable the submit event					
						return false;					
					} else {					
						$( '#acadp-post-errors' ).hide();				
					}		 
				});

				$( listingFormEl ).on( 'input', '.acadp-form-validate', ( event ) => {
					ACADPUpdateValidationStateForInput( event.target );
				});

				$( listingFormEl ).on( 'blur', '.acadp-form-validate', ( event ) => {
					ACADPUpdateValidationStateForInput( event.target );
				});
		
				$( listingFormEl ).on( 'change', '.acadp-form-validate-checkboxes input[type=checkbox]', ( event ) => {
					const formGroupEl = event.target.closest( '.acadp-form-group' );
					if ( formGroupEl !== null ) {
						ACADPValidateCheckboxGroup( formGroupEl );
					}
				});

				$( listingFormEl ).on( 'blur', '.acadp-form-validate-checkboxes input[type=checkbox]', ( event ) => {
					// FocusEvent.relatedTarget is the element receiving focus.
					const activeEl = event.relatedTarget;
		
					// Validate only if the focus is not going to another checkbox.
					if ( activeEl?.type !== 'checkbox' ) {
						const formGroupEl = event.target.closest( '.acadp-form-group' );
						if ( formGroupEl !== null ) {
							ACADPValidateCheckboxGroup( formGroupEl );
						}
					}
				});
			}
		}
		
		// Register Form
		const registerFormEl = document.querySelector( '#acadp-register-form' );

		if ( registerFormEl !== null ) {
			// Form Validation.
			if ( $.fn.validator ) {	
				let registerFormElSubmitted = false;

				$( registerFormEl ).validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( registerFormElSubmitted ) return false;
					registerFormElSubmitted = true;
						
					let isFormValid = true;

					if ( event.isDefaultPrevented() ) {					
						isFormValid = false;			 			
					}
					
					let recaptchaResponse = null;
					if ( acadp.recaptcha_registration > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['registration'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$( '#acadp-registration-g-recaptcha-message' ).addClass( 'text-danger' ).html( '<p>' + acadp.i18n.invalid_recaptcha + '</p>' );
			
							grecaptcha.reset( acadp.recaptchas['registration'] );		
							isFormValid = false;
						} else {
							$( '#acadp-registration-g-recaptcha-message' ).removeClass( 'text-danger' ).html( '' );
						}		
					}

					if ( ! isFormValid ) {						
						$( 'html, body' ).animate({
							scrollTop: $( registerFormEl ).offset().top - 50
						}, 500 );
						
						registerFormElSubmitted = false; // Re-enable the submit event					
						return false;					
					}
				});
			}
		}

		// User Account Form
		const userAccountFormEl = document.querySelector( '#acadp-user-account' );

		if ( userAccountFormEl !== null ) {
			// Toggle password fields.
			$( '#acadp-change-password' ).on( 'change', ( event ) => {
				togglePasswordFields( event );			
			});

			// Form Validation.
			if ( $.fn.validator ) {	
				let userAccountFormSubmitted = false;

				$( userAccountFormEl ).validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( userAccountFormSubmitted ) return false;
					userAccountFormSubmitted = true;
						
					if ( event.isDefaultPrevented() ) {				 	
						userAccountFormSubmitted = false; // Re-enable the submit event
					}			 
				});
			}
		}

		// Login Form
		const loginFormEl = document.querySelector( '#acadp-login-form' );

		if ( loginFormEl !== null ) {
			// Form Validation.
			if ( $.fn.validator ) {	
				let loginFormElSubmitted = false;

				$( loginFormEl ).validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( loginFormElSubmitted ) return false;
					loginFormElSubmitted = true;
						
					if ( event.isDefaultPrevented() ) {				 	
						loginFormElSubmitted = false; // Re-enable the submit event
					}			 
				});
			}
		}

		// Forgot Password Form
		const forgotPasswordFormEl = document.querySelector( '#acadp-forgot-password-form' );

		if ( forgotPasswordFormEl !== null ) {
			// Form Validation.
			if ( $.fn.validator ) {	
				let forgotPasswordFormElSubmitted = false;

				$( forgotPasswordFormEl ).validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( forgotPasswordFormElSubmitted ) return false;
					forgotPasswordFormElSubmitted = true;
						
					if ( event.isDefaultPrevented() ) {				 	
						forgotPasswordFormElSubmitted = false; // Re-enable the submit event
					}			 
				});
			}
		}

		// Password Reset Form
		const passwordResetFormEl = document.querySelector( '#acadp-password-reset-form' );

		if ( passwordResetFormEl !== null ) {
			// Form Validation.
			if ( $.fn.validator ) {	
				let passwordResetFormElSubmitted = false;

				$( passwordResetFormEl ).validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( passwordResetFormElSubmitted ) return false;
					passwordResetFormElSubmitted = true;
						
					if ( event.isDefaultPrevented() ) {				 	
						passwordResetFormElSubmitted = false; // Re-enable the submit event
					}			 
				});
			}
		}
		
		// ContactForm
		const contactFormEl = document.querySelector( '#acadp-contact-form' );

		if ( contactFormEl !== null ) {
			const $contactFormEl = $( contactFormEl );

			// Form Validation.
			if ( $.fn.validator ) {	
				let contactFormElSubmitted = false;

				$contactFormEl.validator({
					disable: false
				}).on( 'submit', function( event ) {
					if ( contactFormElSubmitted ) return false;
					contactFormElSubmitted = true;
						
					
					const $statusEl = $( '#acadp-contact-message-display' );

					let isFormValid = true;				

					if ( event.isDefaultPrevented() ) {		
						isFormValid = false;			 			
					}

					event.preventDefault();
					
					let recaptchaResponse = null;
					if ( acadp.recaptcha_contact > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['contact'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$statusEl.addClass( 'text-danger' ).html( acadp.i18n.invalid_recaptcha );
			
							grecaptcha.reset( acadp.recaptchas['contact'] );		
							isFormValid = false;
						} else {
							$statusEl.removeClass( 'text-danger' ).html( '' );
						}		
					}

					if ( ! isFormValid ) {	
						contactFormElSubmitted = false; // Re-enable the submit event	
						return false;					
					}					
					
			 		// Post via AJAX
					$statusEl.html( '<div class="acadp-spinner"></div>' );

					let data = {
						'action': 'acadp_public_send_contact_email',
						'post_id': parseInt( acadp.post_id ),
						'name': $( '#acadp-contact-name' ).val(),
						'email': $( '#acadp-contact-email' ).val(),
						'message': $( '#acadp-contact-message' ).val(),
						'g-recaptcha-response': recaptchaResponse,
						'security': acadp.ajax_nonce
					}

					const phoneEl = contactFormEl.querySelector( '#acadp-contact-phone' );
					if ( phoneEl !== null ) {
						data.phone = phoneEl.value;
					}

					const copyEl = contactFormEl.querySelector( '#acadp-contact-send-copy' );
					if ( copyEl !== null ) {
						data.send_copy = copyEl.checked ? 1 : 0;
					}

					if ( $contactFormEl.find( '.acadp-date-field' ).length > 0 ) {
						data.date = $contactFormEl.find( '.acadp-date-field input' ).val();
					}

					if ( $contactFormEl.find( '.acadp-magic-field' ).length > 0 ) {
						const fieldName = $contactFormEl.find( '.acadp-magic-field input' ).attr( 'name' );
						data[ fieldName ] = $contactFormEl.find( '.acadp-magic-field input' ).val();
					}
		
					$.post( acadp.ajax_url, data, function( response ) {
						if ( 1 == response.error ) {
							$statusEl.addClass( 'text-danger' ).html( response.message );
						} else {
							$statusEl.addClass( 'text-success' ).html( response.message );
							$( '#acadp-contact-message' ).val( '' );
						}
				
						if ( acadp.recaptcha_contact > 0 ) {
							grecaptcha.reset( acadp.recaptchas['contact'] );
						}
						
						contactFormElSubmitted = false; // Re-enable the submit event
					}, 'json' );					
				});
			}			
		}

		// Report Abuse Form
		const reportAbuseFormEl = document.querySelector( '#acadp-report-abuse-form' );

		if ( reportAbuseFormEl !== null ) {
			const $reportAbuseFormEl = $( reportAbuseFormEl );

			// Form Validation.
			if ( $.fn.validator ) {	
				let reportAbuseFormElSubmitted = false;

				$reportAbuseFormEl.validator({
					disable: false
				}).on( 'submit', function( event ) {				
					if ( reportAbuseFormElSubmitted ) return false;
					reportAbuseFormElSubmitted = true;
						
					const $statusEl = $( '#acadp-report-abuse-message-display' );

					let isFormValid = true;

					if ( event.isDefaultPrevented() ) {					
						isFormValid = false;			 			
					}

					event.preventDefault();	
					
					let recaptchaResponse = null;
					if ( acadp.recaptcha_report_abuse > 0 ) {	
						recaptchaResponse = grecaptcha.getResponse( acadp.recaptchas['report_abuse'] );
			
						if ( recaptchaResponse.length == 0 ) {
							$statusEl.addClass( 'text-danger' ).html( acadp.i18n.invalid_recaptcha );
			
							grecaptcha.reset( acadp.recaptchas['report_abuse'] );		
							isFormValid = false;
						} else {
							$statusEl.removeClass( 'text-danger' ).html( '' );
						}		
					}

					if ( ! isFormValid ) {
						reportAbuseFormElSubmitted = false; // Re-enable the submit event
						return false;					
					}	
					
					// Post via AJAX
					$statusEl.html( '<div class="acadp-spinner"></div>' );
					
					let data = {
						'action': 'acadp_public_report_abuse',
						'post_id': parseInt( acadp.post_id ),
						'message': $( '#acadp-report-abuse-message' ).val(),
						'g-recaptcha-response': recaptchaResponse,
						'security': acadp.ajax_nonce
					}

					if ( $reportAbuseFormEl.find( '.acadp-date-field' ).length > 0 ) {
						data.date = $reportAbuseFormEl.find( '.acadp-date-field input' ).val();
					}

					if ( $reportAbuseFormEl.find( '.acadp-magic-field' ).length > 0 ) {
						const fieldName = $reportAbuseFormEl.find( '.acadp-magic-field input' ).attr( 'name' );
						data[ fieldName ] = $reportAbuseFormEl.find( '.acadp-magic-field input' ).val();
					}

					$.post( acadp.ajax_url, data, function( response ) {
						if ( 1 == response.error ) {
							$statusEl.addClass( 'text-danger' ).html( response.message );
						} else {
							$statusEl.addClass( 'text-success' ).html( response.message );
							$( '#acadp-report-abuse-message' ).val( '' );
						}
				
						if ( acadp.recaptcha_report_abuse > 0 ) {
							grecaptcha.reset( acadp.recaptchas['report_abuse'] );
						}
						
						reportAbuseFormElSubmitted = false; // Re-enable the submit event
					}, 'json' );
				});
			}

			// On modal closed
			$( '#acadp-report-abuse-modal' ).on( 'hidden.bs.modal', ( event ) => {																	   
				$( '#acadp-report-abuse-message' ).val( '' );
				$( '#acadp-report-abuse-message-display' ).html( '' );
			});
		}		
		
		// Show phone number.
		$( '.acadp-show-phone-number' ).on( 'click', ( event ) => {
			event.target.style.display = 'none';
			$( '.acadp-phone-number' ).show();
		});	

		// Request login.
		document.querySelectorAll( '.acadp-require-login' ).forEach(( buttonEl ) => {
			buttonEl.addEventListener( 'click', () => {	
				alert( acadp.i18n.alert_required_login );			 
			});	
		});

		// Toggle favourites.
		$( '#acadp-favourites' ).on( 'click', '.acadp-favourites', function( event ) {													   
			event.preventDefault();
			 
			let data = {
				'action': 'acadp_public_add_remove_favorites',
				'post_id': parseInt( acadp.post_id ),
				'security': acadp.ajax_nonce
			}
			
			$.post( acadp.ajax_url, data, function( response ) {
				$( '#acadp-favourites' ).html( response );
			});																		   
		});
		
		// Checkout Form
		const checkoutFormEl = document.querySelector( '#acadp-checkout-form' );

		if ( checkoutFormEl !== null ) {
			// Update total amount.
			const updateAmount = () => {
				const $paymentGatewaysEl = $( '#acadp-payment-gateways' );
				const $cardDetailsEl = $( '#acadp-cc-form' );
				const $totalAmountEl = $( '#acadp-checkout-total-amount' );
				const $submitBtnEl = $( '#acadp-checkout-submit-btn' );

				let totalAmount = 0;
				let numFeeFields = 0;
					
				checkoutFormEl.querySelectorAll( '.acadp-checkout-fee-field' ).forEach(( el ) => {
					if ( el.checked ) totalAmount += parseFloat( el.dataset.price );
					++numFeeFields;
				});

				if ( numFeeFields === 0 ) {
					$totalAmountEl.html( '0.00' );	

					$paymentGatewaysEl.hide();
					$cardDetailsEl.hide();
					$submitBtnEl.hide();

					return false;
				}

				$totalAmountEl.html( '<div class="acadp-spinner" style="margin: auto;"></div>' );
				
				let data = {
					'action': 'acadp_checkout_format_total_amount',
					'amount': totalAmount,
					'security': acadp.ajax_nonce
				}
				
				$.post( acadp.ajax_url, data, function( response ) {	
					$totalAmountEl.html( response );											   
				
					let amount = parseFloat( response );					
					if ( amount > 0 ) {
						$paymentGatewaysEl.show();
						$cardDetailsEl.show();

						$submitBtnEl.val( acadp.i18n.button_label_proceed_to_payment ).show();
					} else {
						$paymentGatewaysEl.hide();
						$cardDetailsEl.hide();

						$submitBtnEl.val( acadp.i18n.button_label_finish_submission ).show();
					}				
				});	
			}

			checkoutFormEl.querySelectorAll( '.acadp-checkout-fee-field' ).forEach(( el ) => {
				el.addEventListener( 'change', ( event ) => {	
					updateAmount();
				});
			});

			updateAmount();
			
			// Form Validation.
			let checkoutFormElSubmitted = false;

			$( checkoutFormEl ).on( 'submit', function( event ) {				
				if ( checkoutFormElSubmitted ) return false;
				checkoutFormElSubmitted = true;	 
			});
		}		

		// Gutenberg: Load Map.
		if ( typeof wp !== 'undefined' && typeof wp['hooks'] !== 'undefined' ) {
			let intervalHandler;
			let retryCount;

			const loadMapBlock = () => {
				if ( retryCount > 0 ) {
					clearInterval( intervalHandler );
				}				
				retryCount = 0;

				intervalHandler = setInterval(
					function() {
						retryCount++;

						if ( document.querySelectorAll( '.acadp-map:not(.acadp-map-loaded)' ) !== null || retryCount >= 10 ) {
							clearInterval( intervalHandler );
							retryCount = 0;

							initMap();
						}
					}, 
					1000
				);
			}

			wp.hooks.addAction( 'acadp_init_listings', 'acadp/listings', function( attributes ) {
				if ( 'map' === attributes.view ) {
					loadMapBlock();
				}
			});

			wp.hooks.addAction( 'acadp_init_listing_form', 'acadp/listing-form', function() {
				loadMapBlock();
			});
		}
	});

})( jQuery );

/**
 * Deprecated
 */
(function( $ ) {

	/**
	 * Called when the page has loaded.
	 */
	$(function() {	

		// Contact form: On modal closed
		$( '#acadp-contact-modal' ).on( 'hidden.bs.modal', function( event ) {																  
			$( '#acadp-contact-message' ).val( '' );
			$( '#acadp-contact-message-display' ).html( '' );			
		});

		// Add "required" attribute to the category field in the listing form 
		// (fallback for versions prior to 1.5.5)
		const categoryEl = document.querySelector( '#acadp_category' );
		if ( categoryEl !== null ) {
			categoryEl.setAttribute( 'required', 'required' );
		}

		// Populate ACADP child terms dropdown
		$( '.acadp-terms' ).on( 'change', 'select', function( event ) {								
			event.preventDefault();
			 
			var $this    = $( this );
			var taxonomy = $this.data( 'taxonomy' );
			var parent   = $this.data( 'parent' );
			var value    = $this.val();
			var classes  = $this.attr( 'class' );
			
			$this.closest( '.acadp-terms' ).find( 'input.acadp-term-hidden' ).val( value );
			$this.parent().find( 'div:first' ).remove();
			
			if ( value && parent != value ) {
				$this.parent().append( '<div class="acadp-spinner acadp-child-terms"></div>' );
				
				var data = {
					'action': 'acadp_public_dropdown_terms',
					'taxonomy': taxonomy,
					'parent': value,
					'class': classes,
					'security': acadp.ajax_nonce
				}
				
				$.post( acadp.ajax_url, data, function( response ) {
					$this.parent().find( 'div:first' ).remove();
					$this.parent().append( response );
				});
			}		
		});

		// WhatsApp Share
		const whatsappButtonEl = document.querySelector( '.acadp-social-whatsapp' );
		if ( whatsappButtonEl !== null ) {
			whatsappButtonEl.addEventListener( 'click', ( event ) => {
				if ( /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
					event.target.removeAttribute( 'href' );

					const url = 'whatsapp://send?text=' + encodeURIComponent( event.target.dataset.text ) + ' - ' + encodeURIComponent( event.target.dataset.link );
					window.location.href = url;
				}
			});
		}

	});

})( jQuery );

// Load reCAPTCHA explicitly.
var acadp_on_recaptcha_load = function() {
	if ( ! acadp.recaptcha_site_key ) {	
		return false;
	}

	// Registration form
	if ( document.querySelector( '#acadp-registration-g-recaptcha' ) !== null ) {
		if ( acadp.recaptcha_registration > 0 ) {
			acadp.recaptchas['registration'] = grecaptcha.render( 'acadp-registration-g-recaptcha', {
				'sitekey': acadp.recaptcha_site_key
			});		
			
			document.querySelector( '#acadp-registration-g-recaptcha' ).classList.add( 'acadp-margin-bottom' );
		}		
	} else {			
		acadp.recaptcha_registration = 0;			
	}
	
	// Listing form
	if ( document.querySelector( '#acadp-listing-g-recaptcha' ) !== null ) {			
		if ( acadp.recaptcha_listing > 0 ) {
			acadp.recaptchas['listing'] = grecaptcha.render( 'acadp-listing-g-recaptcha', {
				'sitekey': acadp.recaptcha_site_key
			});	
			
			document.querySelector( '#acadp-listing-g-recaptcha' ).classList.add( 'acadp-margin-bottom' );
		}		
	} else {			
		acadp.recaptcha_listing = 0;			
	}
	
	// Contact form
	if ( document.querySelector( '#acadp-contact-g-recaptcha' ) !== null ) {		
		if ( acadp.recaptcha_contact > 0 ) {
			acadp.recaptchas['contact'] = grecaptcha.render( 'acadp-contact-g-recaptcha', {
				'sitekey': acadp.recaptcha_site_key
			});

			document.querySelector( '#acadp-contact-g-recaptcha' ).classList.add( 'acadp-margin-bottom' );
		}	
	} else {			
		acadp.recaptcha_contact = 0;			
	}
	
	// Report Abuse form
	if ( document.querySelector( '#acadp-report-abuse-g-recaptcha' ) !== null ) {		
		if ( acadp.recaptcha_report_abuse > 0 ) {
			acadp.recaptchas['report_abuse'] = grecaptcha.render( 'acadp-report-abuse-g-recaptcha', {
				'sitekey': acadp.recaptcha_site_key
			});

			document.querySelector( '#acadp-report-abuse-g-recaptcha' ).classList.add( 'acadp-margin-bottom' );
		}		
	} else {			
		acadp.recaptcha_report_abuse = 0;			
	}

	// Custom Event for developers.
	document.dispatchEvent( new CustomEvent( 'acadp_on_recaptcha_load' ) );
}