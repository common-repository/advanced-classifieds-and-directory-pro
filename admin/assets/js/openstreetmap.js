(function( $ ) {
	'use strict';	

	/**
     * Init map.
	 */
	const initMap = () => {
		document.querySelectorAll( '.acadp-map:not(.acadp-map-loaded)' ).forEach(( mapEl ) => {		
			createMap( mapEl );
		});
	}

	/**
     * Create map.
	 */
	const createMap = ( mapEl ) => {
		mapEl.classList.add( 'acadp-map-loaded' );

		// Vars
		let latitude  = $( '#acadp-form-control-latitude' ).val();
		let longitude = $( '#acadp-form-control-longitude' ).val();

		// Creating map options.
		const mapOptions = {
			center: [ latitude, longitude ],
			zoom: acadp_admin.zoom_level
		}

		// Creating a map object.        	
		let map = new L.map( mapEl, mapOptions );	

		// Creating a Layer object.
		const layer = new L.TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});

		// Adding layer to the map.
		map.addLayer( layer );

		// Creating marker options.
		const markerOptions = {
			clickable: true,
			draggable: true
		}

		// Creating a marker.
		let marker = L.marker( [ latitude, longitude ], markerOptions );

		// Adding marker to the map.
		marker.addTo( map );
				
		// Update latitude and longitude values in the form when marker is moved
		marker.addEventListener( 'dragend', function( event ) {
			const position = event.target.getLatLng();

			map.panTo( new L.LatLng( position.lat, position.lng ) );
			updateLatLng( position.lat, position.lng );
		});

		// Update map when the contact fields are edited.
		const onAddressChange = () => {
			let query = [];					

			const $locationEl = $( '#acadp-form-control-location' );
			let location = '';

			if ( $locationEl.is( 'select' ) ) {
				const $selectedOption = $locationEl.find( 'option:selected' );

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
				const $selectedOption = $locationEl.find( 'input[name=acadp_location]:checked' );

				if ( $selectedOption && $selectedOption.val() > 0 ) {   
					let $parentLocations = $selectedOption.parents( '.acadp-term' );

					$parentLocations.each(function() {
						location = $( this ).find( '.acadp-term-name' ).html().trim();
						query.push( location );
					});
				}	
			}		

			const zipcode = $( '#acadp-form-control-zipcode' ).val();
			if ( zipcode ) {
				if ( location ) {
					query = [ location, zipcode ]; // Bind only the top-level location (country)
				} else {
					query.push( zipcode );
				}
			}

			if ( 0 == query.length ) {
				let address = $( '#acadp-form-control-address' ).val();

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
			
			$.get( 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent( query ) + '&format=jsonv2&limit=1', function( response ) {
				if ( response.length > 0 ) {
					const latLng = new L.LatLng( response[0].lat, response[0].lon );

					marker.setLatLng( latLng );
					map.panTo( latLng );
					updateLatLng( response[0].lat, response[0].lon );
				}
			}, 'json' );
		}

		$( '#acadp-contact-details' ).on( 'blur', '.acadp-form-control-map', function() {
			onAddressChange();
		});

		if ( ! latitude || ! longitude ) {
			onAddressChange();
		}
	}
	
	/**
	 * Update the latitude and longitude field values.
	 */
	const updateLatLng = ( latitude, longitude ) => {		
		$( '#acadp-form-control-latitude' ).val( latitude );
		$( '#acadp-form-control-longitude' ).val( longitude );
	}

	/**
	 * Called when the page has loaded.
	 */
	$(function() {			
		
		// Init map.
		initMap();			
		
	});

})( jQuery );
