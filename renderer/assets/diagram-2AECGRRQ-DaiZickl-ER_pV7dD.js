import{c as k}from"./wardley-L42UT6IY-BuzZe4U_-glFcVyjS.js";import{B as O,V as S,U as I,H as z,z as R,R as B,h as o,u as D,L as E,Q as y,s as w,D as F,v as P,x as V,T as G}from"./mermaid.core-ClIT2jZ--BssFbvPY.js";import{t as H}from"./chunk-4BX2VUAB-CAnGp29N-BnEIIwHH.js";import"./index-DTlzaKUm.js";import"./step-BLAKVGAu-Ohuqujd6.js";var m={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},M={axes:[],curves:[],options:m},x=structuredClone(M),W=F.radar,j=o(()=>y({...W,...w().radar}),"getConfig"),b=o(()=>x.axes,"getAxes"),_=o(()=>x.curves,"getCurves"),U=o(()=>x.options,"getOptions"),N=o(a=>{x.axes=a.map(t=>{var e;return{name:t.name,label:(e=t.label)==null?t.name:e}})},"setAxes"),Q=o(a=>{x.curves=a.map(t=>{var e;return{name:t.name,label:(e=t.label)==null?t.name:e,entries:Z(t.entries)}})},"setCurves"),Z=o(a=>{if(a[0].axis==null)return a.map(e=>e.value);let t=b();if(t.length===0)throw Error("Axes must be populated before curves for reference entries");return t.map(e=>{let r=a.find(i=>{var l;return((l=i.axis)==null?void 0:l.$refText)===e.name});if(r===void 0)throw Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),$={getAxes:b,getCurves:_,getOptions:U,setAxes:N,setCurves:Q,setOptions:o(a=>{var t,e,r,i,l,s,n,c,d,g;let u=a.reduce((p,h)=>(p[h.name]=h,p),{});x.options={showLegend:(t=(e=u.showLegend)==null?void 0:e.value)==null?m.showLegend:t,ticks:(r=(i=u.ticks)==null?void 0:i.value)==null?m.ticks:r,max:(l=(s=u.max)==null?void 0:s.value)==null?m.max:l,min:(n=(c=u.min)==null?void 0:c.value)==null?m.min:n,graticule:(d=(g=u.graticule)==null?void 0:g.value)==null?m.graticule:d}},"setOptions"),getConfig:j,clear:o(()=>{E(),x=structuredClone(M)},"clear"),setAccTitle:B,getAccTitle:R,setDiagramTitle:z,getDiagramTitle:I,getAccDescription:S,setAccDescription:O},q=o(a=>{H(a,$);let{axes:t,curves:e,options:r}=a;$.setAxes(t),$.setCurves(e),$.setOptions(r)},"populate"),J={parse:o(async a=>{let t=await k("radar",a);P.debug(t),q(t)},"parse")},K=o((a,t,e,r)=>{var i;let l=r.db,s=l.getAxes(),n=l.getCurves(),c=l.getOptions(),d=l.getConfig(),g=l.getDiagramTitle(),u=X(D(t),d),p=(i=c.max)==null?Math.max(...n.map(f=>Math.max(...f.entries))):i,h=c.min,v=Math.min(d.width,d.height)/2;Y(u,s,v,c.ticks,c.graticule),tt(u,s,v,d),C(u,s,n,h,p,c.graticule,d),A(u,n,c.showLegend,d),u.append("text").attr("class","radarTitle").text(g).attr("x",0).attr("y",-d.height/2-d.marginTop)},"draw"),X=o((a,t)=>{var e;let r=t.width+t.marginLeft+t.marginRight,i=t.height+t.marginTop+t.marginBottom,l={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return G(a,i,r,(e=t.useMaxWidth)==null?!0:e),a.attr("viewBox",`0 0 ${r} ${i}`),a.append("g").attr("transform",`translate(${l.x}, ${l.y})`)},"drawFrame"),Y=o((a,t,e,r,i)=>{if(i==="circle")for(let l=0;l<r;l++){let s=e*(l+1)/r;a.append("circle").attr("r",s).attr("class","radarGraticule")}else if(i==="polygon"){let l=t.length;for(let s=0;s<r;s++){let n=e*(s+1)/r,c=t.map((d,g)=>{let u=2*g*Math.PI/l-Math.PI/2;return`${n*Math.cos(u)},${n*Math.sin(u)}`}).join(" ");a.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),tt=o((a,t,e,r)=>{let i=t.length;for(let l=0;l<i;l++){let s=t[l].label,n=2*l*Math.PI/i-Math.PI/2;a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*Math.cos(n)).attr("y2",e*r.axisScaleFactor*Math.sin(n)).attr("class","radarAxisLine"),a.append("text").text(s).attr("x",e*r.axisLabelFactor*Math.cos(n)).attr("y",e*r.axisLabelFactor*Math.sin(n)).attr("class","radarAxisLabel")}},"drawAxes");function C(a,t,e,r,i,l,s){let n=t.length,c=Math.min(s.width,s.height)/2;e.forEach((d,g)=>{if(d.entries.length!==n)return;let u=d.entries.map((p,h)=>{let v=2*Math.PI*h/n-Math.PI/2,f=L(p,r,i,c);return{x:f*Math.cos(v),y:f*Math.sin(v)}});l==="circle"?a.append("path").attr("d",T(u,s.curveTension)).attr("class",`radarCurve-${g}`):l==="polygon"&&a.append("polygon").attr("points",u.map(p=>`${p.x},${p.y}`).join(" ")).attr("class",`radarCurve-${g}`)})}o(C,"drawCurves");function L(a,t,e,r){return r*(Math.min(Math.max(a,t),e)-t)/(e-t)}o(L,"relativeRadius");function T(a,t){let e=a.length,r=`M${a[0].x},${a[0].y}`;for(let i=0;i<e;i++){let l=a[(i-1+e)%e],s=a[i],n=a[(i+1)%e],c=a[(i+2)%e],d={x:s.x+(n.x-l.x)*t,y:s.y+(n.y-l.y)*t},g={x:n.x-(c.x-s.x)*t,y:n.y-(c.y-s.y)*t};r+=` C${d.x},${d.y} ${g.x},${g.y} ${n.x},${n.y}`}return`${r} Z`}o(T,"closedRoundCurve");function A(a,t,e,r){if(!e)return;let i=(r.width/2+r.marginRight)*3/4,l=-(r.height/2+r.marginTop)*3/4;t.forEach((s,n)=>{let c=a.append("g").attr("transform",`translate(${i}, ${l+n*20})`);c.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${n}`),c.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}o(A,"drawLegend");var et={draw:K},at=o((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){let i=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return e},"genIndexStyles"),rt=o(a=>{let t=y(V(),w().themeVariables);return{themeVariables:t,radarOptions:y(t.radar,a)}},"buildRadarStyleOptions"),ct={parser:J,db:$,renderer:et,styles:o(({radar:a}={})=>{let{themeVariables:t,radarOptions:e}=rt(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${at(t,e)}
	`},"styles")};export{ct as diagram};
