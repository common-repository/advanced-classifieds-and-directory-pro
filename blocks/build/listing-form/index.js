(()=>{"use strict";var e={n:t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return e.d(n,{a:n}),n},d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=window.wp.blocks,n=window.wp.element,r=window.wp.serverSideRender;var o=e.n(r);const c=window.wp.blockEditor,i=window.wp.components,l=window.wp.hooks,a=JSON.parse('{"u2":"acadp/listing-form"}');(0,t.registerBlockType)(a.u2,{edit:function(){const e=(0,n.useRef)();return(0,n.useEffect)((()=>{e.current?(0,l.doAction)("acadp_init_listing_form"):e.current=!0})),(0,n.createElement)(n.Fragment,null,(0,n.createElement)("div",(0,c.useBlockProps)(),(0,n.createElement)(i.Disabled,null,(0,n.createElement)(o(),{block:"acadp/listing-form"}))))}})})();