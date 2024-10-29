/**
 * Import block dependencies
 */
import ServerSideRender from '@wordpress/server-side-render';

import {	 
	InspectorControls,
	useBlockProps
} from '@wordpress/block-editor';

import {
	Disabled,
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl
} from '@wordpress/components';

import { 
	useEffect,
	useRef
} from '@wordpress/element';

import { doAction } from '@wordpress/hooks';

import { useSelect } from '@wordpress/data';

import { 
	BuildTree,
	GroupByParent
 } from '../helper.js';

/**
 * Describes the structure of the block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {	

	const {
		view,
		category,
		location,	
		columns,
		listings_per_page,		
		filterby,
		orderby,
		order,		
		featured,			
		header,
		show_excerpt,
		show_category,
		show_location,
		show_price,
		show_date,
		show_user,
		show_views,
		show_custom_fields,
		pagination,
	} = attributes;

	const locationsList = useSelect( ( select ) => {
		const terms = select( 'core' ).getEntityRecords( 'taxonomy', 'acadp_locations', {
			'per_page': -1
		});		

		let options = [{ 
			label: '— ' + acadp_blocks.listings.i18n.location_none + ' —', 
			value: 0
		}];

		if ( terms && terms.length > 0 ) {		
			let grouped = GroupByParent( terms, parseInt( acadp_blocks.base_location ) );
			let tree = BuildTree( grouped );
			
			options = [ ...options, ...tree ];
		}

		return options;
	});

	const categoriesList = useSelect( ( select ) => {
		const terms = select( 'core' ).getEntityRecords( 'taxonomy', 'acadp_categories', {
			'per_page': -1
		});

		let options = [{ 
			label: '— ' + acadp_blocks.listings.i18n.category_none + ' —', 
			value: 0
		}];

		if ( terms && terms.length > 0 ) {		
			let grouped = GroupByParent( terms, 0 );
			let tree = BuildTree( grouped );
			
			options = [ ...options, ...tree ];
		}

		return options;
	});	

	const mounted = useRef();	
	useEffect(() => {
		if ( ! mounted.current ) {
			// Do componentDidMount logic
			mounted.current = true;
		} else {
			// Do componentDidUpdate logic
			doAction( 'acadp_init_listings', attributes );
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={ acadp_blocks.listings.i18n.panel_settings }>
					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.view_label }
							value={ view }
							options={ [
								{ label: acadp_blocks.listings.i18n.view_list, value: 'list' },
								{ label: acadp_blocks.listings.i18n.view_grid, value: 'grid' },
								{ label: acadp_blocks.listings.i18n.view_map, value: 'map' }
							] }
							onChange={ ( value ) => setAttributes( { view: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.location_label }
							value={ location }
							options={ locationsList }
							onChange={ ( value ) => setAttributes( { location: Number( value ) } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.category_label }
							value={ category }
							options={ categoriesList }
							onChange={ ( value ) => setAttributes( { category: Number( value ) } ) }
						/>
					</PanelRow>

					<PanelRow>
						<RangeControl
							label={ acadp_blocks.listings.i18n.columns_label }
							value={ columns }							
							min={ 1 }
							max={ 12 }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<RangeControl
							label={ acadp_blocks.listings.i18n.listings_per_page_label }
							help={ acadp_blocks.listings.i18n.listings_per_page_help }
							value={ listings_per_page }							
							min={ 1 }
							max={ 100 }
							onChange={ ( value ) => setAttributes( { listings_per_page: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.filterby_label }
							value={ filterby }
							options={ [
								{ label: acadp_blocks.listings.i18n.filterby_none, value: '' },
								{ label: acadp_blocks.listings.i18n.filterby_featured, value: 'featured' }
							] }
							onChange={ ( value ) => setAttributes( { filterby: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.orderby_label }
							value={ orderby }
							options={ [
								{ label: acadp_blocks.listings.i18n.orderby_title, value: 'title' },
								{ label: acadp_blocks.listings.i18n.orderby_date, value: 'date' },
								{ label: acadp_blocks.listings.i18n.orderby_price, value: 'price' },
								{ label: acadp_blocks.listings.i18n.orderby_views, value: 'views' },
								{ label: acadp_blocks.listings.i18n.orderby_rand, value: 'rand' }
							] }
							onChange={ ( value ) => setAttributes( { orderby: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.listings.i18n.order_label }
							value={ order }
							options={ [
								{ label: acadp_blocks.listings.i18n.order_asc, value: 'asc' },
								{ label: acadp_blocks.listings.i18n.order_desc, value: 'desc' }
							] }
							onChange={ ( value ) => setAttributes( { order: value } ) }
						/>
					</PanelRow>					

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.featured_label }
							help={ acadp_blocks.listings.i18n.featured_help }
							checked={ featured }
							onChange={ () => setAttributes( { featured: ! featured } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.header_label }
							help={ acadp_blocks.listings.i18n.header_help }
							checked={ header }
							onChange={ () => setAttributes( { header: ! header } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_excerpt_label }
							checked={ show_excerpt }
							onChange={ () => setAttributes( { show_excerpt: ! show_excerpt } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_category_label }
							checked={ show_category }
							onChange={ () => setAttributes( { show_category: ! show_category } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_location_label }
							checked={ show_location }
							onChange={ () => setAttributes( { show_location: ! show_location } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_price_label }
							checked={ show_price }
							onChange={ () => setAttributes( { show_price: ! show_price } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_date_label}
							checked={ show_date }
							onChange={ () => setAttributes( { show_date: ! show_date } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_user_label }
							checked={ show_user }
							onChange={ () => setAttributes( { show_user: ! show_user } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_views_label }
							checked={ show_views }
							onChange={ () => setAttributes( { show_views: ! show_views } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.show_custom_fields_label }
							checked={ show_custom_fields }
							onChange={ () => setAttributes( { show_custom_fields: ! show_custom_fields } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.listings.i18n.pagination_label }
							checked={ pagination }
							onChange={ () => setAttributes( { pagination: ! pagination } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<Disabled>
					<ServerSideRender
						block="acadp/listings"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
