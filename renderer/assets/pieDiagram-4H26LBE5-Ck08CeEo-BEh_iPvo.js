import{c as H}from"./wardley-L42UT6IY-BuzZe4U_-glFcVyjS.js";import{V as K,B as U,z as I,R as Q,U as _,H as q,h as u,v as R,K as G,Q as J,u as X,w as Y,T as tt,L as et,D as at}from"./mermaid.core-ClIT2jZ--BssFbvPY.js";import{c as rt}from"./ordinal-CQXecEOr-BhJnzYkN.js";import{Z as y,v as it,f as M}from"./step-BLAKVGAu-Ohuqujd6.js";import{x as E}from"./arc-CaXU7sh_-BP5R3jIq.js";import{t as lt}from"./chunk-4BX2VUAB-CAnGp29N-BnEIIwHH.js";import"./index-DTlzaKUm.js";import"./init-CQl8l1Ov-B3vgOOaq.js";function nt(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function st(t){return t}function ot(){var t=st,a=nt,g=null,s=y(0),p=y(M),w=y(0);function i(e){var n,c=(e=it(e)).length,o,l,h=0,x=Array(c),f=Array(c),S=+s.apply(this,arguments),m=Math.min(M,Math.max(-M,p.apply(this,arguments)-S)),A,b=Math.min(Math.abs(m)/c,w.apply(this,arguments)),$=b*(m<0?-1:1),d;for(n=0;n<c;++n)(d=f[x[n]=n]=+t(e[n],n,e))>0&&(h+=d);for(a==null?g!=null&&x.sort(function(v,D){return g(e[v],e[D])}):x.sort(function(v,D){return a(f[v],f[D])}),n=0,l=h?(m-c*$)/h:0;n<c;++n,S=A)o=x[n],d=f[o],A=S+(d>0?d*l:0)+$,f[o]={data:e[o],index:n,value:d,startAngle:S,endAngle:A,padAngle:b};return f}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:y(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,g=null,i):a},i.sort=function(e){return arguments.length?(g=e,a=null,i):g},i.startAngle=function(e){return arguments.length?(s=typeof e=="function"?e:y(+e),i):s},i.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:y(+e),i):p},i.padAngle=function(e){return arguments.length?(w=typeof e=="function"?e:y(+e),i):w},i}var ut=at.pie,O={sections:new Map,showData:!1},C=O.sections,z=O.showData,pt=structuredClone(ut),V={getConfig:u(()=>structuredClone(pt),"getConfig"),clear:u(()=>{C=new Map,z=O.showData,et()},"clear"),setDiagramTitle:q,getDiagramTitle:_,setAccTitle:Q,getAccTitle:I,setAccDescription:U,getAccDescription:K,addSection:u(({label:t,value:a})=>{if(a<0)throw Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);C.has(t)||(C.set(t,a),R.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),getSections:u(()=>C,"getSections"),setShowData:u(t=>{z=t},"setShowData"),getShowData:u(()=>z,"getShowData")},ct=u((t,a)=>{lt(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),dt={parse:u(async t=>{let a=await H("pie",t);R.debug(a),ct(a,V)},"parse")},gt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),ft=u(t=>{let a=[...t.values()].reduce((s,p)=>s+p,0),g=[...t.entries()].map(([s,p])=>({label:s,value:p})).filter(s=>s.value/a*100>=1);return ot().value(s=>s.value).sort(null)(g)},"createPieArcs"),Tt={parser:dt,db:V,renderer:{draw:u((t,a,g,s)=>{var p,w;R.debug(`rendering pie chart
`+t);let i=s.db,e=G(),n=J(i.getConfig(),e.pie),c=X(a),o=c.append("g");o.attr("transform","translate(225,225)");let{themeVariables:l}=e,[h]=Y(l.pieOuterStrokeWidth);h!=null||(h=2);let x=n.textPosition,f=E().innerRadius(0).outerRadius(185),S=E().innerRadius(185*x).outerRadius(185*x);o.append("circle").attr("cx",0).attr("cy",0).attr("r",185+h/2).attr("class","pieOuterCircle");let m=i.getSections(),A=ft(m),b=[l.pie1,l.pie2,l.pie3,l.pie4,l.pie5,l.pie6,l.pie7,l.pie8,l.pie9,l.pie10,l.pie11,l.pie12],$=0;m.forEach(r=>{$+=r});let d=A.filter(r=>(r.data.value/$*100).toFixed(0)!=="0"),v=rt(b).domain([...m.keys()]);o.selectAll("mySlices").data(d).enter().append("path").attr("d",f).attr("fill",r=>v(r.data.label)).attr("class","pieCircle"),o.selectAll("mySlices").data(d).enter().append("text").text(r=>(r.data.value/$*100).toFixed(0)+"%").attr("transform",r=>"translate("+S.centroid(r)+")").style("text-anchor","middle").attr("class","slice");let D=o.append("text").text(i.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),F=[...m.entries()].map(([r,T])=>({label:r,value:T})),k=o.selectAll(".legend").data(F).enter().append("g").attr("class","legend").attr("transform",(r,T)=>{let j=22*F.length/2;return"translate(216,"+(T*22-j)+")"});k.append("rect").attr("width",18).attr("height",18).style("fill",r=>v(r.label)).style("stroke",r=>v(r.label)),k.append("text").attr("x",22).attr("y",14).text(r=>i.getShowData()?`${r.label} [${r.value}]`:r.label);let W=512+Math.max(...k.selectAll("text").nodes().map(r=>{var T;return(T=r?.getBoundingClientRect().width)==null?0:T})),B=(p=(w=D.node())==null?void 0:w.getBoundingClientRect().width)==null?0:p,P=450/2-B/2,Z=450/2+B/2,L=Math.min(0,P),N=Math.max(W,Z)-L;c.attr("viewBox",`${L} 0 ${N} 450`),tt(c,450,N,n.useMaxWidth)},"draw")},styles:gt};export{Tt as diagram};
