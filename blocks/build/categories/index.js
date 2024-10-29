(()=>{"use strict";var e={n:a=>{var l=a&&a.__esModule?()=>a.default:()=>a;return e.d(l,{a:l}),l},d:(a,l)=>{for(var t in l)e.o(l,t)&&!e.o(a,t)&&Object.defineProperty(a,t,{enumerable:!0,get:l[t]})},o:(e,a)=>Object.prototype.hasOwnProperty.call(e,a)};const a=window.wp.blocks,l=window.wp.element,t=window.wp.serverSideRender;var o=e.n(t);const n=window.wp.blockEditor,c=window.wp.components,r=window.wp.hooks,s=window.wp.data;function i(e){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";var t;for(t=0;t<e.length;t+=1)a.push({label:l+e[t].name,value:e[t].id}),e[t].children.length>0&&i(e[t].children,a,l.trim()+"— ");return a}const d=JSON.parse('{"u2":"acadp/categories"}');(0,a.registerBlockType)(d.u2,{attributes:{view:{type:"string",default:acadp_blocks.categories.view},parent:{type:"number",default:acadp_blocks.categories.parent},columns:{type:"number",default:acadp_blocks.categories.columns},depth:{type:"number",default:acadp_blocks.categories.depth},orderby:{type:"string",default:acadp_blocks.categories.orderby},order:{type:"string",default:acadp_blocks.categories.order},show_count:{type:"boolean",default:acadp_blocks.categories.show_count},hide_empty:{type:"boolean",default:acadp_blocks.categories.hide_empty}},edit:function(e){let{attributes:a,setAttributes:t}=e;const{view:d,parent:p,columns:b,depth:u,orderby:_,order:g,show_count:m,hide_empty:h}=a,w=(0,s.useSelect)((e=>{const a=e("core").getEntityRecords("taxonomy","acadp_categories",{per_page:-1});let l=[{label:"— "+acadp_blocks.categories.i18n.parent_label+" —",value:0}];if(a&&a.length>0){let e=function(e,a){var l,t,o={},n=[];for(t=0;t<e.length;t+=1)o[e[t].id]=t,e[t].children=[];for(t=0;t<e.length;t+=1)0==(l=e[t]).parent?n.push(l):o.hasOwnProperty(l.parent)&&e[o[l.parent]].children.push(l);return n}(a),t=i(e);l=[...l,...t]}return l})),k=(0,l.useRef)();return(0,l.useEffect)((()=>{k.current?(0,r.doAction)("acadp_init_categories",a):k.current=!0})),(0,l.createElement)(l.Fragment,null,(0,l.createElement)(n.InspectorControls,null,(0,l.createElement)(c.PanelBody,{title:acadp_blocks.categories.i18n.panel_settings},(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.SelectControl,{label:acadp_blocks.categories.i18n.view_label,value:d,options:[{label:acadp_blocks.categories.i18n.view_list,value:"text_list"},{label:acadp_blocks.categories.i18n.view_grid,value:"image_grid"}],onChange:e=>t({view:e})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.SelectControl,{label:acadp_blocks.categories.i18n.parent_label,value:p,options:w,onChange:e=>t({parent:Number(e)})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.RangeControl,{label:acadp_blocks.categories.i18n.columns_label,value:b,min:1,max:12,onChange:e=>t({columns:e})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.RangeControl,{label:acadp_blocks.categories.i18n.depth_label,value:u,min:1,max:12,onChange:e=>t({depth:e})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.SelectControl,{label:acadp_blocks.categories.i18n.orderby_label,value:_,options:[{label:acadp_blocks.categories.i18n.orderby_id,value:"id"},{label:acadp_blocks.categories.i18n.orderby_count,value:"count"},{label:acadp_blocks.categories.i18n.orderby_name,value:"name"},{label:acadp_blocks.categories.i18n.orderby_slug,value:"slug"}],onChange:e=>t({orderby:e})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.SelectControl,{label:acadp_blocks.categories.i18n.order_label,value:g,options:[{label:acadp_blocks.categories.i18n.order_asc,value:"asc"},{label:acadp_blocks.categories.i18n.order_desc,value:"desc"}],onChange:e=>t({order:e})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.ToggleControl,{label:acadp_blocks.categories.i18n.show_count_label,help:acadp_blocks.categories.i18n.show_count_help,checked:m,onChange:()=>t({show_count:!m})})),(0,l.createElement)(c.PanelRow,null,(0,l.createElement)(c.ToggleControl,{label:acadp_blocks.categories.i18n.hide_empty_label,help:acadp_blocks.categories.i18n.hide_empty_help,checked:h,onChange:()=>t({hide_empty:!h})})))),(0,l.createElement)("div",(0,n.useBlockProps)(),(0,l.createElement)(c.Disabled,null,(0,l.createElement)(o(),{block:"acadp/categories",attributes:a}))))}})})();