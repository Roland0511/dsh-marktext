import{c as v}from"./wardley-L42UT6IY-BuzZe4U_-glFcVyjS.js";import{h as g,Q as m,u as C,T as z,v as w,R as P,z as S,H as T,U as D,V as E,B as F,s as W,D as R,L as A}from"./mermaid.core-ClIT2jZ--BssFbvPY.js";import{t as H}from"./chunk-4BX2VUAB-CAnGp29N-BnEIIwHH.js";import"./index-DTlzaKUm.js";import"./step-BLAKVGAu-Ohuqujd6.js";var f,L=R.packet,y=(f=class{constructor(){this.packet=[],this.setAccTitle=P,this.getAccTitle=S,this.setDiagramTitle=T,this.getDiagramTitle=D,this.getAccDescription=E,this.setAccDescription=F}getConfig(){let t=m({...L,...W().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){A(),this.packet=[]}},g(f,"PacketDB"),f),V=1e4,Y=g((t,e)=>{H(t,e);let l=-1,r=[],n=1,{bitsPerRow:c}=e.getConfig();for(let{start:a,end:i,bits:s,label:o}of t.blocks){var h;if(a!==void 0&&i!==void 0&&i<a)throw Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a!=null||(a=l+1),a!==l+1){var u;throw Error(`Packet block ${a} - ${(u=i)==null?a:u} is not contiguous. It should start from ${l+1}.`)}if(s===0)throw Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i!=null||(i=a+((h=s)==null?1:h)-1),s!=null||(s=i-a+1),l=i,w.debug(`Packet block ${a} - ${l} with label ${o}`);r.length<=c+1&&e.getPacket().length<V;){let[p,d]=M({start:a,end:i,bits:s,label:o},n,c);if(r.push(p),p.end+1===n*c&&(e.pushWord(r),r=[],n++),!d)break;({start:a,end:i,bits:s,label:o}=d)}}e.pushWord(r)},"populate"),M=g((t,e,l)=>{if(t.start===void 0)throw Error("start should have been set during first phase");if(t.end===void 0)throw Error("end should have been set during first phase");if(t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*l)return[t,void 0];let r=e*l-1,n=e*l;return[{start:t.start,end:r,label:t.label,bits:r-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:g(async t=>{var e;let l=await v("packet",t),r=(e=x.parser)==null?void 0:e.yy;if(!(r instanceof y))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(l),Y(l,r)},"parse")},U=g((t,e,l,r)=>{let n=r.db,c=n.getConfig(),{rowHeight:h,paddingY:u,bitWidth:a,bitsPerRow:i}=c,s=n.getPacket(),o=n.getDiagramTitle(),p=h+u,d=p*(s.length+1)-(o?0:h),b=a*i+2,k=C(e);k.attr("viewBox",`0 0 ${b} ${d}`),z(k,d,b,c.useMaxWidth);for(let[$,B]of s.entries())_(k,B,$,c);k.append("text").text(o).attr("x",b/2).attr("y",d-p/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),_=g((t,e,l,{rowHeight:r,paddingX:n,paddingY:c,bitWidth:h,bitsPerRow:u,showBits:a})=>{let i=t.append("g"),s=l*(r+c)+c;for(let o of e){let p=o.start%u*h+1,d=(o.end-o.start+1)*h-n;if(i.append("rect").attr("x",p).attr("y",s).attr("width",d).attr("height",r).attr("class","packetBlock"),i.append("text").attr("x",p+d/2).attr("y",s+r/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(o.label),!a)continue;let b=o.end===o.start,k=s-2;i.append("text").attr("x",p+(b?d/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(o.start),b||i.append("text").attr("x",p+d).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(o.end)}},"drawWord"),j={draw:U},I={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J={parser:x,get db(){return new y},renderer:j,styles:g(({packet:t}={})=>{let e=m(I,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles")};export{J as diagram};
