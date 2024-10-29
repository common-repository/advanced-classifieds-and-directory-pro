'use strict';

export class ACADPDropdownTermsElement extends HTMLElement {

    /**
     * Element created.
     */
    constructor() {
        super();

        // Set references to the DOM elements used by the component
        this._dropdownInputEl  = null;
        this._dropdownResetBtn = null; 
        this._dropdownEl       = null;
        this._searchInputEl    = null;        
        this._searchResetBtn   = null; 
        this._dropdownStatusEl = null;        

        // Set references to the private properties used by the component
        this._isRendered = false;
    }

	/**
     * Browser calls this method when the element is added to the document.
     * (can be called many times if an element is repeatedly added/removed)
     */
	connectedCallback() { 
        if ( this._isRendered ) true;   
        this._isRendered = true; 

        this._dropdownInputEl  = this.querySelector( '.acadp-dropdown-select input[type=text]' );  
        this._dropdownResetBtn = this.querySelector( '.acadp-dropdown-select button' ); 
        this._dropdownEl       = this.querySelector( '.acadp-dropdown' ); 
        this._searchInputEl    = this.querySelector( '.acadp-dropdown-header input[type=text]' );       
        this._searchResetBtn   = this.querySelector( '.acadp-dropdown-header button' ); 
        this._dropdownStatusEl = this.querySelector( '.acadp-dropdown-status' );  
        this._dropdownCloseBtn = this.querySelector( '.acadp-dropdown-close' );    
        
        if ( this.type == 'checkbox' && this.required ) {
            this.closest( '.acadp-form-group' ).classList.add( 'acadp-form-validate-checkboxes' );
        }  
        
        this._toggleSelectedTermNames();

        jQuery( this ).on( 'change', '.acadp-term-input', ( event ) => this._loadTermsList( event ) ); 

        this._dropdownInputEl.addEventListener( 'click', ( event ) => this._toggleDropdown( event ) );
        this._dropdownCloseBtn.addEventListener( 'click', ( event ) => this._closeDropdown( event ) ); 
        this._dropdownResetBtn.addEventListener( 'click', ( event ) => this._resetDropdown( event ) );
                  
        this._searchInputEl.addEventListener( 'input', ( event ) => this._searchTerms( event.target.value ) ); 
        this._searchResetBtn.addEventListener( 'click', ( event ) => this._resetSearch( event ) );
	}

     /**
     * Browser calls this method when the element is removed from the document.
     * (can be called many times if an element is repeatedly added/removed)
     */
    disconnectedCallback() {
        jQuery( this ).off( 'change', '.acadp-term-input', ( event ) => this._loadTermsList( event ) );
        
        this._dropdownInputEl.removeEventListener( 'click', ( event ) => this._toggleDropdown( event ) );
        this._dropdownCloseBtn.removeEventListener( 'click', ( event ) => this._closeDropdown( event ) );
        this._dropdownResetBtn.removeEventListener( 'click', ( event ) => this._resetDropdown( event ) );

        this._searchInputEl.removeEventListener( 'input', ( event ) => this._searchTerms( event.target.value ) );
        this._searchResetBtn.removeEventListener( 'click', ( event ) => this._resetSearch( event ) );
    }

    /**
     * Define getters and setters for attributes.
     */   

    get type() {
        return this.getAttribute( 'data-type' ) || 'radio';
    }

    get name() {
        return this.getAttribute( 'data-name' ) || 'acadp_category';
    }

    get taxonomy() {
        return this.getAttribute( 'data-taxonomy' ) || 'acadp_categories';
    }

    get required() {
        return this.getAttribute( 'data-required' ) || false;
    }

    get closeOnSelect() {
        return this.getAttribute( 'data-close_on_select' ) || false;
    }

    get ajaxUrl() {
        return ( typeof acadp_admin !== 'undefined' ) ? ajaxurl : acadp.ajax_url;
    }

    get ajaxNonce() {
        return ( typeof acadp_admin !== 'undefined' ) ? acadp_admin.ajax_nonce : acadp.ajax_nonce;
    }

    get value() {
        if ( this.type == 'radio' ) {
            let checkedEl = this.querySelector( 'input[type=radio]:checked' );
            return ( checkedEl !== null ) ? checkedEl.value : 0;
        }

        if ( this.type == 'checkbox' ) {
            let values = [];
            this.querySelectorAll( 'input[type=checkbox]:checked' ).forEach(( el ) => {
                values.push( el.value );
            });

            return values;
        }

        return null;
    }

    /**
     * Define private methods.
     */      

    _toggleDropdown( event ) {
        this._dropdownEl.hidden = ! this._dropdownEl.hidden;
    }

    _closeDropdown( event ) {
        this._dropdownEl.hidden = true;
    }

    _resetDropdown( event ) {
        this.querySelectorAll( '.acadp-term-input:checked' ).forEach(( el ) => {
            el.checked = false;
        });

        this.removeAttribute( 'has-value' ); 

        this._dropdownInputEl.value   = '';
        this._dropdownResetBtn.hidden = true;          
        this._dropdownEl.hidden = true;

        this._trigger( 'acadp.terms.change' );
        jQuery( this ).trigger( 'change' ); // An ugly hack for jQuery based event listeners
    }

    _searchTerms( value ) {  
        let matchesFound = false;

        if ( value ) {
            this.setAttribute( 'is-searching', true );   
            
            this._searchResetBtn.hidden = false;

            value = value.trim().toLowerCase();

            this.querySelectorAll( '.acadp-term-label' ).forEach(( el ) => {
                const termName = el.querySelector( '.acadp-term-name' ).innerHTML;
    
                if ( el.hasAttribute( 'disabled' ) || termName.toLowerCase().indexOf( value.toString() ) === -1 ) {
                    el.hidden = true;
                } else {
                    el.hidden = false;
                    matchesFound = true;
                }            
            });
        } else {
            this.removeAttribute( 'is-searching' );

            this._searchResetBtn.hidden = true;

            this.querySelectorAll( '.acadp-term-label' ).forEach(( el ) => {
                el.hidden = false;
                matchesFound = true;
            });
        }

        this._dropdownStatusEl.hidden = matchesFound;
    }

    _resetSearch( event ) {    
        this.removeAttribute( 'is-searching' );

        this._searchInputEl.value = '';
        this._searchResetBtn.hidden   = true;
        this._dropdownStatusEl.hidden = true;

        this.querySelectorAll( '.acadp-term-label' ).forEach(( el ) => {
            el.hidden = false;
        });
    }

    _toggleSelectedTermNames() {
		let names = [];

        this.querySelectorAll( '.acadp-term-input:checked' ).forEach(( el ) => {
            let termName = el.closest( 'label' ).querySelector( '.acadp-term-name' ).innerHTML;
            names.push( termName );
        });

        if ( names.length > 0 ) {
            this.setAttribute( 'has-value', true );

            this._dropdownInputEl.value   = names.join( ', ' );
            this._dropdownResetBtn.hidden = false;           
        } else {
            this.removeAttribute( 'has-value' );

            this._dropdownInputEl.value   = '';
            this._dropdownResetBtn.hidden = true;
        }        
	}

    _buildList( items, level ) {        
        let html = '<div class="acadp-terms acadp-terms-children" data-level="' + level + '">';

        let attributes = {
            type: this.type,
            name: this.name,
            class: [ 'acadp-term-input', 'acadp-form-control', 'acadp-form-' + this.type ]
        };

        if ( this.type == 'radio' && this.required ) {
            attributes.required = true;
            attributes.class.push( 'acadp-form-validate' );
        }

        attributes.class = attributes.class.join( ' ' );

        for ( var key in items ) {
            attributes['value'] = key;

            html += '<div class="acadp-term">';
            html += '<label class="acadp-term-label" style="padding-left: ' + ( level * 16 ) + 'px;">';
            html += '<span class="acadp-term-name">' + items[ key ] + '</span>';
            html += '<input ' +  this._merge( attributes ) + ' />';        
            html += '</label>';
            html += '</div>';
        }

        html += '</div>';

        return html;
    }

    _merge( obj ) {
        let attributes = '';
        for ( let key in obj ) {
            attributes += ( key + '="' + obj[ key ] + '" ' );
        }

        return attributes;
    }	

    _trigger( eventName ) {
        this.dispatchEvent( new CustomEvent( eventName ) );
        jQuery( this ).trigger( eventName ); // An ugly hack for jQuery based event listeners
    }

    _fetch( data, callback ) {       
        jQuery.post( this.ajaxUrl, data, callback, 'json' ); 						
    }

    /**
     * Define private async methods.
     */    

    async _loadTermsList( event ) { 
        this._trigger( 'acadp.terms.change' );

        this._toggleSelectedTermNames();        

        const containerEl = event.target.closest( '.acadp-term' );

        if ( containerEl.classList.contains( 'acadp-terms-children-populated' ) ) return false;
        containerEl.classList.add( 'acadp-terms-children-populated' );

        containerEl.querySelector( '.acadp-term-input' ).hidden = true;

        const spinnerEl = document.createElement( 'div' );
        spinnerEl.className = 'acadp-spinner';       
        containerEl.querySelector( 'label' ).appendChild( spinnerEl );

        let data = {
            'action': 'acadp_get_child_terms',     
            'taxonomy': this.taxonomy,          
            'parent': parseInt( event.target.value ),
            'security': this.ajaxNonce
        };

        this._fetch( data, ( response ) => {
            containerEl.querySelector( '.acadp-spinner' ).remove();
            containerEl.querySelector( '.acadp-term-input' ).hidden = false;

            if ( response.status == 'success' ) {
                const level = parseInt( containerEl.closest( '.acadp-terms' ).dataset.level );
                const list = this._buildList( response.items, level + 1 );

                containerEl.insertAdjacentHTML( 'beforeend', list );
            }          
        }); 

        if ( this.closeOnSelect ) {
            this._dropdownEl.hidden = true;
        }
    }

}

/**
 * Hide the dropdown menu when clicked outside of the element.
 */
(function( $ ) {	
	
	/**
	 * Called when the page has loaded.
	 */
	$(function() {

        document.addEventListener( 'click', ( event ) => {
            const self = event.target.closest( 'acadp-dropdown-terms' );

            document.querySelectorAll( 'acadp-dropdown-terms' ).forEach(( el ) => {
                if ( el !== self ) { 
                    el.querySelector( '.acadp-dropdown' ).hidden = true;
                }	
            });		
        });

	});

})( jQuery );

// Register custom element
customElements.define( 'acadp-dropdown-terms', ACADPDropdownTermsElement );