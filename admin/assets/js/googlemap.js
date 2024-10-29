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

		// Create map
		const options = {
			zoom: parseInt( acadp_admin.zoom_level ),
			center: new google.maps.LatLng( 0, 0 ),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: true,
			scrollwheel: false
		};

		let map = new google.maps.Map( mapEl, options );
	
		// Add marker.
		map.marker = null;

		addMarker( map, latitude, longitude );			

		// Center map.
		centerMap( map );
		
		// Update map when the contact fields are edited.
		const geoCoder = new google.maps.Geocoder();
		
		const onAddressChange = () => {
			let query = [];
			
			let address = $( '#acadp-form-control-address' ).val();
			if ( address ) {
				address = address.trim();
				address = address.replace( /(?:\r\n|\r|\n)/g, ',' );
				address = address.replaceAll( ', ', ',' );
				address = address.replaceAll( ' ,', ',' );	
				address = address.replaceAll( ',,', ',' );	

				query.push( address );
			}

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
				query.push( zipcode );
			}

			query = query.filter( function( v ) { return v !== '' } );
			query = query.join();
		
			geoCoder.geocode({ 'address': query }, function( results, status ) {															
				if ( status == google.maps.GeocoderStatus.OK ) {						
					const point = results[0].geometry.location;

					map.marker.setPosition( point );
					centerMap( map );
					updateLatLng( point.lat(), point.lng() );						
				};				
			});
		}
		
		$( '#acadp-contact-details' ).on( 'blur', '.acadp-form-control-map', function() {
			onAddressChange();
		});
			
		if ( ! latitude || ! longitude ) {
			onAddressChange();
		}
	}	
	
	/**
	 * Add Marker.
	 */
	const addMarker = ( map, latitude, longitude ) => {
		// Vars
		let latLng = new google.maps.LatLng( latitude, longitude );

		// Create marker.
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			draggable: true
		});

		map.marker = marker;
		
		// Update latitude and longitude values when the marker is moved.
		google.maps.event.addListener( marker, 'dragend', function() {																  
			const point = marker.getPosition();

			map.panTo( point );
			updateLatLng( point.lat(), point.lng() );			
		});	
	}

	/**
	 * Center the map.
	 */
	const centerMap = ( map ) => {
		// Vars
		let bounds = new google.maps.LatLngBounds();

		// Create bounds.
		if ( map.marker != null ) {	
			const latLng = new google.maps.LatLng( map.marker.position.lat(), map.marker.position.lng() );
			bounds.extend( latLng );
		}
		
		// Set center of map.
		map.setCenter( bounds.getCenter() );
		map.setZoom( parseInt( acadp_admin.zoom_level ) );			
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
