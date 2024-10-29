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
		parent,
		columns,
		depth,			
		orderby,
		order,
		show_count,
		hide_empty,			
	} = attributes;

	const categoriesList = useSelect( ( select ) => {
		const terms = select( 'core' ).getEntityRecords( 'taxonomy', 'acadp_categories', {
			'per_page': -1
		});

		let options = [{ 
			label: '— ' + acadp_blocks.categories.i18n.parent_label + ' —', 
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
			doAction( 'acadp_init_categories', attributes );
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={ acadp_blocks.categories.i18n.panel_settings }>
					<PanelRow>
						<SelectControl
							label={ acadp_blocks.categories.i18n.view_label }
							value={ view }
							options={ [
								{ label: acadp_blocks.categories.i18n.view_list, value: 'text_list' },
								{ label: acadp_blocks.categories.i18n.view_grid, value: 'image_grid' }								
							] }
							onChange={ ( value ) => setAttributes( { view: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.categories.i18n.parent_label }
							value={ parent }
							options={ categoriesList }
							onChange={ ( value ) => setAttributes( { parent: Number( value ) } ) }
						/>
					</PanelRow>				

					<PanelRow>
						<RangeControl
							label={ acadp_blocks.categories.i18n.columns_label }
							value={ columns }							
							min={ 1 }
							max={ 12 }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<RangeControl
							label={ acadp_blocks.categories.i18n.depth_label }
							value={ depth }							
							min={ 1 }
							max={ 12 }
							onChange={ ( value ) => setAttributes( { depth: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.categories.i18n.orderby_label }
							value={ orderby }
							options={[
								{ label: acadp_blocks.categories.i18n.orderby_id, value: 'id' },
								{ label: acadp_blocks.categories.i18n.orderby_count, value: 'count' },
								{ label: acadp_blocks.categories.i18n.orderby_name, value: 'name' },
								{ label: acadp_blocks.categories.i18n.orderby_slug, value: 'slug' }
							]}
							onChange={ ( value ) => setAttributes( { orderby: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label={ acadp_blocks.categories.i18n.order_label }
							value={ order }
							options={ [
								{ label: acadp_blocks.categories.i18n.order_asc, value: 'asc' },
								{ label: acadp_blocks.categories.i18n.order_desc, value: 'desc' }
							] }
							onChange={ ( value ) => setAttributes( { order: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.categories.i18n.show_count_label }
							help={ acadp_blocks.categories.i18n.show_count_help }
							checked={ show_count }
							onChange={ () => setAttributes( { show_count: ! show_count } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.categories.i18n.hide_empty_label }
							help={ acadp_blocks.categories.i18n.hide_empty_help }
							checked={ hide_empty }
							onChange={ () => setAttributes( { hide_empty: ! hide_empty } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<Disabled>
					<ServerSideRender 
						block="acadp/categories" 
						attributes={ attributes } 
					/>
				</Disabled>	
			</div>					
		</>
	);
}
