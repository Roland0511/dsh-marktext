const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./jspdf.es.min-CtyMdsuP.js","./index-DEL58_97.js","./index-CRlwGs6Q.css"])))=>i.map(i=>d[i]);
import{_ as P}from"./index-DEL58_97.js";const v=595.28,H=841.89,s=36,p=794,S=2,k=`
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff !important;
    color: #111111;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    width: ${p}px;
  }
  #editor, .mu-editor {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    flex: none !important;
  }
  .mu-container {
    max-width: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .mu-editor * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* 离屏舞台里 muya 的表格边框依赖主题变量，兜底成明确颜色 */
  .mu-editor table {
    border-collapse: collapse !important;
    width: 100% !important;
  }
  .mu-editor table th,
  .mu-editor table td {
    border: 1px solid #d6d9e0 !important;
    padding: 6px 10px !important;
    text-align: left;
  }
  .mu-editor table th {
    background: #f6f7f9 !important;
    font-weight: 600;
  }
`;function M(n){const o=document.createElement("iframe");o.setAttribute("aria-hidden","true"),o.style.cssText=["position: fixed","left: -20000px","top: 0",`width: ${p}px`,"height: 1200px","border: 0","opacity: 0","pointer-events: none"].join(";"),document.body.appendChild(o);const t=o.contentDocument;t.open(),t.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>'),t.close();for(const a of document.querySelectorAll('link[rel="stylesheet"]')){if(!a.href)continue;const i=t.createElement("link");i.rel="stylesheet",i.href=a.href,t.head.appendChild(i)}for(const a of document.querySelectorAll("style"))t.head.appendChild(t.importNode(a,!0));const e=t.createElement("style");return e.textContent=k,t.head.appendChild(e),t.body.innerHTML=n,{frame:o,doc:t}}async function I(n){try{await n.fonts?.ready}catch{}const o=Array.from(n.images||[]);await Promise.all(o.map(t=>typeof t.decode=="function"?t.decode().catch(()=>{}):new Promise(e=>{t.complete?e():(t.addEventListener("load",e,{once:!0}),t.addEventListener("error",e,{once:!0}))})))}function R(n,o,t=220){const e=Math.max(0,Math.floor(o-t)),a=Math.floor(o)-e;if(a<=0)return o;let i;try{i=n.getContext("2d").getImageData(0,e,n.width,a).data}catch{return o}for(let r=a-1;r>=0;r-=1){let c=!0;for(let l=0;l<n.width;l+=1){const d=(r*n.width+l)*4;if(i[d+3]!==0&&(i[d]<250||i[d+1]<250||i[d+2]<250)){c=!1;break}}if(c)return e+r}return o}function D(n,o,t,e){e.width=n.width,e.height=t;const a=e.getContext("2d");a.fillStyle="#ffffff",a.fillRect(0,0,e.width,e.height),a.drawImage(n,0,o,n.width,t,0,0,n.width,t);const i=e.toDataURL("image/png"),r=e.toDataURL("image/jpeg",.92);return r.length<i.length*.8?{format:"JPEG",data:r}:{format:"PNG",data:i}}async function j(n={}){const o=n.element||document.getElementById("editor");if(!o)throw new Error("no document element to export");const t=`${n.name||"document"}.pdf`,[{default:e},{jsPDF:a}]=await Promise.all([P(()=>import("./html2canvas-pro.esm-DK5AoSyl.js"),[],import.meta.url),P(()=>import("./jspdf.es.min-CtyMdsuP.js").then(c=>c.j),__vite__mapDeps([0,1,2]),import.meta.url)]),{frame:i,doc:r}=M(o.outerHTML);try{await I(r);const c=r.body.firstElementChild||r.body,l=Math.max(1,Math.ceil(c.getBoundingClientRect().height)+8);i.style.height=`${l}px`;const d=await e(r.body,{backgroundColor:"#ffffff",scale:S,useCORS:!0,logging:!1,windowWidth:p,windowHeight:l,width:p,height:l}),y=v-s*2,A=H-s*2,b=y/d.width,u=Math.max(1,Math.floor(A/b)),g=new a({unit:"pt",format:"a4",compress:!0}),T=document.createElement("canvas");let m=0,f=0;for(;f<d.height;){const x=d.height-f,w=Math.min(u,x);let h=w;if(w<x){const E=R(d,f+w)-f;E>u*.6&&(h=E)}if(m>0&&h<12)break;const _=D(d,f,h,T),C=h*b;m>0&&g.addPage("a4","portrait"),g.addImage(_.data,_.format,s,s,y,C,void 0,"FAST"),m+=1,f+=h}return{blob:g.output("blob"),pages:m,filename:t,metrics:{canvasWidth:d.width,canvasHeight:d.height,sliceHeight:u}}}finally{i.remove()}}export{j as exportPdf};
