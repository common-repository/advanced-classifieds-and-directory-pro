'use strict';

(function( $ ) {

	const updateAmount = () => {
		const formEl = document.querySelector( '#acadp-checkout-form' );		
		const $paymentGatewaysEl = $( '#acadp-checkout-payment-gateways' );
		const $cardDetailsEl = $( '#acadp-checkout-card-details' );
		const $totalAmountEl = $( '#acadp-checkout-total-amount' );
		const $submitBtnEl = $( '#acadp-checkout-form .acadp-button-submit' );	
		
		let totalAmount = 0;
		let numFeeFields = 0;

		formEl.querySelectorAll( '.acadp-form-control-amount' ).forEach(( el ) => {
			if ( el.checked ) totalAmount += parseFloat( el.dataset.price );
			++numFeeFields;
		});

		if ( numFeeFields === 0 ) {
			$totalAmountEl.html( '0.00' );	

			$paymentGatewaysEl.prop( 'hidden', true );
			$cardDetailsEl.prop( 'hidden', true );
			$submitBtnEl.prop( 'hidden', true );

			return false;
		}

		$totalAmountEl.html( '<div class="acadp-spinner"></div>' );
	
		let data = {
			'action': 'acadp_checkout_format_total_amount',
			'amount': totalAmount,
			'security': acadp.ajax_nonce
		}
		
		$.post( acadp.ajax_url, data, function( response ) {												   
			$totalAmountEl.html( response );

			let amount = parseFloat( response );	
			if ( amount > 0 ) {
				$paymentGatewaysEl.prop( 'hidden', false );
				$cardDetailsEl.prop( 'hidden', false );

				$submitBtnEl.val( acadp.i18n.button_label_proceed_to_payment ).prop( 'hidden', false );
			} else {
				$paymentGatewaysEl.prop( 'hidden', true );
				$cardDetailsEl.prop( 'hidden', true );
				
				$submitBtnEl.val( acadp.i18n.button_label_finish_submission ).prop( 'hidden', false );
			}
		});	
	}
	
	/**
	 * Called when the page has loaded.
	 */
	$(function() {	

		const formEl = document.querySelector( '#acadp-checkout-form' );		

		if ( formEl !== null ) {
			// Update total amount.
			formEl.querySelectorAll( '.acadp-form-control-amount' ).forEach(( el ) => {
				el.addEventListener( 'change', ( event ) => {	
					updateAmount();
				});
			});

			updateAmount();
			
			// Form Validation.
			let formSubmitted = false;
			
			formEl.addEventListener( 'submit', ( event ) => {					
				if ( formSubmitted ) {
					return false;
				}

				formSubmitted = true;
			});	
		}	
		
	});

})( jQuery );
