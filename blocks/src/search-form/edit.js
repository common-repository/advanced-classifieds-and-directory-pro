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
	SelectControl,
	ToggleControl
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	
	const { 
		style,
		keyword,	
		location,		
		category,
		custom_fields,
		price
	} = attributes;
	
	return (
		<>
			<InspectorControls>
				<PanelBody title={ acadp_blocks.search_form.i18n.panel_settings }>
					<PanelRow>
						<SelectControl
							label={ acadp_blocks.search_form.i18n.style_label }
							value={ style }
							options={ [
								{ label: acadp_blocks.search_form.i18n.style_vertical, value: 'vertical' },
								{ label: acadp_blocks.search_form.i18n.style_inline, value: 'inline' }
							] }
							onChange={ ( value ) => setAttributes( { style: value } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.search_form.i18n.keyword_label }
							checked={ keyword }
							onChange={ () => setAttributes( { keyword: ! keyword } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.search_form.i18n.location_label }
							checked={ location }
							onChange={ () => setAttributes( { location: ! location } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.search_form.i18n.category_label }
							checked={ category }
							onChange={ () => setAttributes( { category: ! category } ) }
						/>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.search_form.i18n.custom_fields_label }
							checked={ custom_fields }
							onChange={ () => setAttributes( { custom_fields: ! custom_fields } ) }
						/>
					</PanelRow>
					
					<PanelRow>
						<ToggleControl
							label={ acadp_blocks.search_form.i18n.price_label }
							checked={ price }
							onChange={ () => setAttributes( { price: ! price } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<Disabled>
					<ServerSideRender
						block="acadp/search-form"
						attributes={ attributes }
					/>
				</Disabled>	
			</div>
		</>
	);
}
