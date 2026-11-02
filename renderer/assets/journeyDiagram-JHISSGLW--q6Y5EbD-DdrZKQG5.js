import{V as gt,B as mt,z as xt,R as kt,U as _t,H as bt,h as n,K as j,M as et,T as vt,L as $t}from"./mermaid.core-ClIT2jZ--BssFbvPY.js";import{x as it}from"./arc-CaXU7sh_-BP5R3jIq.js";import{t as wt}from"./chunk-FMBD7UC4-Bab8-lSW-D5CKGD80.js";import{o as Mt,u as ot,s as Tt,a as Ct}from"./chunk-ND2GUHAM-DU3M-HUf-z_LcKL2h.js";import"./index-DTlzaKUm.js";import"./step-BLAKVGAu-Ohuqujd6.js";var X=(function(){var e=n(function(i,a,r,p){for(r=r||{},p=i.length;p--;r[i[p]]=a);return r},"o"),t=[6,8,10,11,12,14,16,17,18],l=[1,9],y=[1,10],s=[1,11],c=[1,12],h=[1,13],u=[1,14],f={trace:n(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:n(function(i,a,r,p,d,o,k){var m=o.length-1;switch(d){case 1:return o[m-1];case 2:this.$=[];break;case 3:o[m-1].push(o[m]),this.$=o[m-1];break;case 4:case 5:this.$=o[m];break;case 6:case 7:this.$=[];break;case 8:p.setDiagramTitle(o[m].substr(6)),this.$=o[m].substr(6);break;case 9:this.$=o[m].trim(),p.setAccTitle(this.$);break;case 10:case 11:this.$=o[m].trim(),p.setAccDescription(this.$);break;case 12:p.addSection(o[m].substr(8)),this.$=o[m].substr(8);break;case 13:p.addTask(o[m-1],o[m]),this.$="task";break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},e(t,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:l,12:y,14:s,16:c,17:h,18:u},e(t,[2,7],{1:[2,1]}),e(t,[2,3]),{9:15,11:l,12:y,14:s,16:c,17:h,18:u},e(t,[2,5]),e(t,[2,6]),e(t,[2,8]),{13:[1,16]},{15:[1,17]},e(t,[2,11]),e(t,[2,12]),{19:[1,18]},e(t,[2,4]),e(t,[2,9]),e(t,[2,10]),e(t,[2,13])],defaultActions:{},parseError:n(function(i,a){if(a.recoverable)this.trace(i);else{var r=Error(i);throw r.hash=a,r}},"parseError"),parse:n(function(i){var a=this,r=[0],p=[],d=[null],o=[],k=this.table,m="",b=0,V=0,B=0,pt=2,Z=1,yt=o.slice.call(arguments,1),x=Object.create(this.lexer),I={yy:{}};for(var D in this.yy)Object.prototype.hasOwnProperty.call(this.yy,D)&&(I.yy[D]=this.yy[D]);x.setInput(i,I.yy),I.yy.lexer=x,I.yy.parser=this,x.yylloc===void 0&&(x.yylloc={});var Y=x.yylloc;o.push(Y);var dt=x.options&&x.options.ranges;typeof I.yy.parseError=="function"?this.parseError=I.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft($){r.length-=2*$,d.length-=$,o.length-=$}n(ft,"popStack");function J(){var $=p.pop()||x.lex()||Z;return typeof $!="number"&&($ instanceof Array&&(p=$,$=p.pop()),$=a.symbols_[$]||$),$}n(J,"lex");for(var _,W,A,v,q,P={},N,T,Q,O;;){if(A=r[r.length-1],this.defaultActions[A]?v=this.defaultActions[A]:(_==null&&(_=J()),v=k[A]&&k[A][_]),v===void 0||!v.length||!v[0]){var tt="";for(N in O=[],k[A])this.terminals_[N]&&N>pt&&O.push("'"+this.terminals_[N]+"'");tt=x.showPosition?"Parse error on line "+(b+1)+`:
`+x.showPosition()+`
Expecting `+O.join(", ")+", got '"+(this.terminals_[_]||_)+"'":"Parse error on line "+(b+1)+": Unexpected "+(_==Z?"end of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(tt,{text:x.match,token:this.terminals_[_]||_,line:x.yylineno,loc:Y,expected:O})}if(v[0]instanceof Array&&v.length>1)throw Error("Parse Error: multiple actions possible at state: "+A+", token: "+_);switch(v[0]){case 1:r.push(_),d.push(x.yytext),o.push(x.yylloc),r.push(v[1]),_=null,W?(_=W,W=null):(V=x.yyleng,m=x.yytext,b=x.yylineno,Y=x.yylloc,B>0);break;case 2:if(T=this.productions_[v[1]][1],P.$=d[d.length-T],P._$={first_line:o[o.length-(T||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(T||1)].first_column,last_column:o[o.length-1].last_column},dt&&(P._$.range=[o[o.length-(T||1)].range[0],o[o.length-1].range[1]]),q=this.performAction.apply(P,[m,V,b,I.yy,v[1],d,o].concat(yt)),q!==void 0)return q;T&&(r=r.slice(0,-1*T*2),d=d.slice(0,-1*T),o=o.slice(0,-1*T)),r.push(this.productions_[v[1]][0]),d.push(P.$),o.push(P._$),Q=k[r[r.length-2]][r[r.length-1]],r.push(Q);break;case 3:return!0}}return!0},"parse")};f.lexer=(function(){return{EOF:1,parseError:n(function(i,a){if(this.yy.parser)this.yy.parser.parseError(i,a);else throw Error(i)},"parseError"),setInput:n(function(i,a){return this.yy=a||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:n(function(){var i=this._input[0];return this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i,i.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},"input"),unput:n(function(i){var a=i.length,r=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-a),this.offset-=a;var p=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),r.length-1&&(this.yylineno-=r.length-1);var d=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:r?(r.length===p.length?this.yylloc.first_column:0)+p[p.length-r.length].length-r[0].length:this.yylloc.first_column-a},this.options.ranges&&(this.yylloc.range=[d[0],d[0]+this.yyleng-a]),this.yyleng=this.yytext.length,this},"unput"),more:n(function(){return this._more=!0,this},"more"),reject:n(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:n(function(i){this.unput(this.match.slice(i))},"less"),pastInput:n(function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:n(function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:n(function(){var i=this.pastInput(),a=Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+a+"^"},"showPosition"),test_match:n(function(i,a){var r,p,d;if(this.options.backtrack_lexer&&(d={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(d.yylloc.range=this.yylloc.range.slice(0))),p=i[0].match(/(?:\r\n?|\n).*/g),p&&(this.yylineno+=p.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:p?p[p.length-1].length-p[p.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],r=this.performAction.call(this,this.yy,this,a,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),r)return r;if(this._backtrack){for(var o in d)this[o]=d[o];return!1}return!1},"test_match"),next:n(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,a,r,p;this._more||(this.yytext="",this.match="");for(var d=this._currentRules(),o=0;o<d.length;o++)if(r=this._input.match(this.rules[d[o]]),r&&(!a||r[0].length>a[0].length)){if(a=r,p=o,this.options.backtrack_lexer){if(i=this.test_match(r,d[o]),i!==!1)return i;if(this._backtrack){a=!1;continue}else return!1}else if(!this.options.flex)break}return a?(i=this.test_match(a,d[p]),i===!1?!1:i):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:n(function(){return this.next()||this.lex()},"lex"),begin:n(function(i){this.conditionStack.push(i)},"begin"),popState:n(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:n(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:n(function(i){return i=this.conditionStack.length-1-Math.abs(i||0),i>=0?this.conditionStack[i]:"INITIAL"},"topState"),pushState:n(function(i){this.begin(i)},"pushState"),stateStackSize:n(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:n(function(i,a,r,p){switch(r){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;case 8:return this.popState(),"acc_title_value";case 9:return this.begin("acc_descr"),14;case 10:return this.popState(),"acc_descr_value";case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}}})();function g(){this.yy={}}return n(g,"Parser"),g.prototype=f,f.Parser=g,new g})();X.parser=X;var Et=X,S="",H=[],F=[],L=[],It=n(function(){H.length=0,F.length=0,S="",L.length=0,$t()},"clear"),At=n(function(e){S=e,H.push(e)},"addSection"),Pt=n(function(){return H},"getSections"),St=n(function(){let e=st(),t=0;for(;!e&&t<100;)e=st(),t++;return F.push(...L),F},"getTasks"),jt=n(function(){let e=[];return F.forEach(t=>{t.people&&e.push(...t.people)}),[...new Set(e)].sort()},"updateActors"),Vt=n(function(e,t){let l=t.substr(1).split(":"),y=0,s=[];l.length===1?(y=Number(l[0]),s=[]):(y=Number(l[0]),s=l[1].split(","));let c=s.map(u=>u.trim()),h={section:S,type:S,people:c,task:e,score:y};L.push(h)},"addTask"),Bt=n(function(e){let t={section:S,type:S,description:e,task:e,classes:[]};F.push(t)},"addTaskOrg"),st=n(function(){let e=n(function(l){return L[l].processed},"compileTask"),t=!0;for(let[l,y]of L.entries())e(l),t=t&&y.processed;return t},"compileTasks"),rt={getConfig:n(()=>j().journey,"getConfig"),clear:It,setDiagramTitle:bt,getDiagramTitle:_t,setAccTitle:kt,getAccTitle:xt,setAccDescription:mt,getAccDescription:gt,addSection:At,getSections:Pt,getTasks:St,addTask:Vt,addTaskOrg:Bt,getActors:n(function(){return jt()},"getActors")},Ft=n(e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${e.textColor}
  }

  .legend {
    fill: ${e.textColor};
    font-family: ${e.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${e.textColor}
  }

  .face {
    ${e.faceColor?`fill: ${e.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${e.fillType0?`fill: ${e.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${e.fillType0?`fill: ${e.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${e.fillType0?`fill: ${e.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${e.fillType0?`fill: ${e.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${e.fillType0?`fill: ${e.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${e.fillType0?`fill: ${e.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${e.fillType0?`fill: ${e.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${e.fillType0?`fill: ${e.fillType7}`:""};
  }

  .actor-0 {
    ${e.actor0?`fill: ${e.actor0}`:""};
  }
  .actor-1 {
    ${e.actor1?`fill: ${e.actor1}`:""};
  }
  .actor-2 {
    ${e.actor2?`fill: ${e.actor2}`:""};
  }
  .actor-3 {
    ${e.actor3?`fill: ${e.actor3}`:""};
  }
  .actor-4 {
    ${e.actor4?`fill: ${e.actor4}`:""};
  }
  .actor-5 {
    ${e.actor5?`fill: ${e.actor5}`:""};
  }
  ${wt()}
`,"getStyles"),K=n(function(e,t){return Ct(e,t)},"drawRect"),Lt=n(function(e,t){let l=e.append("circle").attr("cx",t.cx).attr("cy",t.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),y=e.append("g");y.append("circle").attr("cx",t.cx-15/3).attr("cy",t.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),y.append("circle").attr("cx",t.cx+15/3).attr("cy",t.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function s(u){let f=it().startAngle(Math.PI/2).endAngle(Math.PI/2*3).innerRadius(7.5).outerRadius(6.8181818181818175);u.append("path").attr("class","mouth").attr("d",f).attr("transform","translate("+t.cx+","+(t.cy+2)+")")}n(s,"smile");function c(u){let f=it().startAngle(3*Math.PI/2).endAngle(Math.PI/2*5).innerRadius(7.5).outerRadius(6.8181818181818175);u.append("path").attr("class","mouth").attr("d",f).attr("transform","translate("+t.cx+","+(t.cy+7)+")")}n(c,"sad");function h(u){u.append("line").attr("class","mouth").attr("stroke",2).attr("x1",t.cx-5).attr("y1",t.cy+7).attr("x2",t.cx+5).attr("y2",t.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return n(h,"ambivalent"),t.score>3?s(y):t.score<3?c(y):h(y),l},"drawFace"),lt=n(function(e,t){let l=e.append("circle");return l.attr("cx",t.cx),l.attr("cy",t.cy),l.attr("class","actor-"+t.pos),l.attr("fill",t.fill),l.attr("stroke",t.stroke),l.attr("r",t.r),l.class!==void 0&&l.attr("class",l.class),t.title!==void 0&&l.append("title").text(t.title),l},"drawCircle"),ct=n(function(e,t){return Tt(e,t)},"drawText"),Rt=n(function(e,t){function l(s,c,h,u,f){return s+","+c+" "+(s+h)+","+c+" "+(s+h)+","+(c+u-f)+" "+(s+h-f*1.2)+","+(c+u)+" "+s+","+(c+u)}n(l,"genPoints");let y=e.append("polygon");y.attr("points",l(t.x,t.y,50,20,7)),y.attr("class","labelBox"),t.y+=t.labelMargin,t.x+=.5*t.labelMargin,ct(e,t)},"drawLabel"),Nt=n(function(e,t,l){let y=e.append("g"),s=ot();s.x=t.x,s.y=t.y,s.fill=t.fill,s.width=l.width*t.taskCount+l.diagramMarginX*(t.taskCount-1),s.height=l.height,s.class="journey-section section-type-"+t.num,s.rx=3,s.ry=3,K(y,s),ht(l)(t.text,y,s.x,s.y,s.width,s.height,{class:"journey-section section-type-"+t.num},l,t.colour)},"drawSection"),G=-1,Ot=n(function(e,t,l,y){let s=t.x+l.width/2,c=e.append("g");G++,c.append("line").attr("id",y+"-task"+G).attr("x1",s).attr("y1",t.y).attr("x2",s).attr("y2",450).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),Lt(c,{cx:s,cy:300+(5-t.score)*30,score:t.score});let h=ot();h.x=t.x,h.y=t.y,h.fill=t.fill,h.width=l.width,h.height=l.height,h.class="task task-type-"+t.num,h.rx=3,h.ry=3,K(c,h);let u=t.x+14;t.people.forEach(f=>{let g=t.actors[f].color;lt(c,{cx:u,cy:t.y,r:7,fill:g,stroke:"#000",title:f,pos:t.actors[f].position}),u+=10}),ht(l)(t.task,c,h.x,h.y,h.width,h.height,{class:"task"},l,t.colour)},"drawTask"),zt=n(function(e,t){Mt(e,t)},"drawBackgroundRect"),ht=(function(){function e(s,c,h,u,f,g,i,a){y(c.append("text").attr("x",h+f/2).attr("y",u+g/2+5).style("font-color",a).style("text-anchor","middle").text(s),i)}n(e,"byText");function t(s,c,h,u,f,g,i,a,r){let{taskFontSize:p,taskFontFamily:d}=a,o=s.split(/<br\s*\/?>/gi);for(let k=0;k<o.length;k++){let m=k*p-p*(o.length-1)/2,b=c.append("text").attr("x",h+f/2).attr("y",u).attr("fill",r).style("text-anchor","middle").style("font-size",p).style("font-family",d);b.append("tspan").attr("x",h+f/2).attr("dy",m).text(o[k]),b.attr("y",u+g/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),y(b,i)}}n(t,"byTspan");function l(s,c,h,u,f,g,i,a){let r=c.append("switch"),p=r.append("foreignObject").attr("x",h).attr("y",u).attr("width",f).attr("height",g).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");p.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(s),t(s,r,h,u,f,g,i,a),y(p,i)}n(l,"byFo");function y(s,c){for(let h in c)h in c&&s.attr(h,c[h])}return n(y,"_setTextAttrs"),function(s){return s.textPlacement==="fo"?l:s.textPlacement==="old"?e:t}})(),R={drawRect:K,drawCircle:lt,drawSection:Nt,drawText:ct,drawLabel:Rt,drawTask:Ot,drawBackgroundRect:zt,initGraphics:n(function(e,t){G=-1,e.append("defs").append("marker").attr("id",t+"-arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics")},Dt=n(function(e){Object.keys(e).forEach(function(t){M[t]=e[t]})},"setConf"),C={},z=0;function ut(e){let t=j().journey,l=t.maxLabelWidth;z=0;let y=60;Object.keys(C).forEach(s=>{let c=C[s].color,h={cx:20,cy:y,r:7,fill:c,stroke:"#000",pos:C[s].position};R.drawCircle(e,h);let u=e.append("text").attr("visibility","hidden").text(s),f=u.node().getBoundingClientRect().width;u.remove();let g=[];if(f<=l)g=[s];else{let i=s.split(" "),a="";u=e.append("text").attr("visibility","hidden"),i.forEach(r=>{let p=a?`${a} ${r}`:r;if(u.text(p),u.node().getBoundingClientRect().width>l){if(a&&g.push(a),a=r,u.text(r),u.node().getBoundingClientRect().width>l){let d="";for(let o of r)d+=o,u.text(d+"-"),u.node().getBoundingClientRect().width>l&&(g.push(d.slice(0,-1)+"-"),d=o);a=d}}else a=p}),a&&g.push(a),u.remove()}g.forEach((i,a)=>{var r;let p={x:40,y:y+7+a*20,fill:"#666",text:i,textMargin:(r=t.boxTextMargin)==null?5:r},d=R.drawText(e,p).node().getBoundingClientRect().width;d>z&&d>t.leftMargin-d&&(z=d)}),y+=Math.max(20,g.length*20)})}n(ut,"drawActorLegend");var M=j().journey,E=0,Yt=n(function(e,t,l,y){let s=j(),c=s.journey.titleColor,h=s.journey.titleFontSize,u=s.journey.titleFontFamily,f=s.securityLevel,g;f==="sandbox"&&(g=et("#i"+t));let i=et(f==="sandbox"?g.nodes()[0].contentDocument.body:"body");w.init();let a=i.select("#"+t);R.initGraphics(a,t);let r=y.db.getTasks(),p=y.db.getDiagramTitle(),d=y.db.getActors();for(let B in C)delete C[B];let o=0;d.forEach(B=>{C[B]={color:M.actorColours[o%M.actorColours.length],position:o},o++}),ut(a),E=M.leftMargin+z,w.insert(0,0,E,Object.keys(C).length*50),Wt(a,r,0,t);let k=w.getBounds();p&&a.append("text").text(p).attr("x",E).attr("font-size",h).attr("font-weight","bold").attr("y",25).attr("fill",c).attr("font-family",u);let m=k.stopy-k.starty+2*M.diagramMarginY,b=E+k.stopx+2*M.diagramMarginX;vt(a,m,b,M.useMaxWidth),a.append("line").attr("x1",E).attr("y1",M.height*4).attr("x2",b-E-4).attr("y2",M.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#"+t+"-arrowhead)");let V=p?70:0;a.attr("viewBox",`${k.startx} -25 ${b} ${m+V}`),a.attr("preserveAspectRatio","xMinYMin meet"),a.attr("height",m+V+25)},"draw"),w={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:n(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},"init"),updateVal:n(function(e,t,l,y){e[t]===void 0?e[t]=l:e[t]=y(l,e[t])},"updateVal"),updateBounds:n(function(e,t,l,y){let s=j().journey,c=this,h=0;function u(f){return n(function(g){h++;let i=c.sequenceItems.length-h+1;c.updateVal(g,"starty",t-i*s.boxMargin,Math.min),c.updateVal(g,"stopy",y+i*s.boxMargin,Math.max),c.updateVal(w.data,"startx",e-i*s.boxMargin,Math.min),c.updateVal(w.data,"stopx",l+i*s.boxMargin,Math.max),f!=="activation"&&(c.updateVal(g,"startx",e-i*s.boxMargin,Math.min),c.updateVal(g,"stopx",l+i*s.boxMargin,Math.max),c.updateVal(w.data,"starty",t-i*s.boxMargin,Math.min),c.updateVal(w.data,"stopy",y+i*s.boxMargin,Math.max))},"updateItemBounds")}n(u,"updateFn"),this.sequenceItems.forEach(u())},"updateBounds"),insert:n(function(e,t,l,y){let s=Math.min(e,l),c=Math.max(e,l),h=Math.min(t,y),u=Math.max(t,y);this.updateVal(w.data,"startx",s,Math.min),this.updateVal(w.data,"starty",h,Math.min),this.updateVal(w.data,"stopx",c,Math.max),this.updateVal(w.data,"stopy",u,Math.max),this.updateBounds(s,h,c,u)},"insert"),bumpVerticalPos:n(function(e){this.verticalPos+=e,this.data.stopy=this.verticalPos},"bumpVerticalPos"),getVerticalPos:n(function(){return this.verticalPos},"getVerticalPos"),getBounds:n(function(){return this.data},"getBounds")},U=M.sectionFills,nt=M.sectionColours,Wt=n(function(e,t,l,y){let s=j().journey,c="",h=l+(s.height*2+s.diagramMarginY),u=0,f="#CCC",g="black",i=0;for(let[a,r]of t.entries()){if(c!==r.section){f=U[u%U.length],i=u%U.length,g=nt[u%nt.length];let d=0,o=r.section;for(let m=a;m<t.length&&t[m].section==o;m++)d+=1;let k={x:a*s.taskMargin+a*s.width+E,y:50,text:r.section,fill:f,num:i,colour:g,taskCount:d};R.drawSection(e,k,s),c=r.section,u++}let p=r.people.reduce((d,o)=>(C[o]&&(d[o]=C[o]),d),{});r.x=a*s.taskMargin+a*s.width+E,r.y=h,r.width=s.diagramMarginX,r.height=s.diagramMarginY,r.colour=g,r.fill=f,r.num=i,r.actors=p,R.drawTask(e,r,s,y),w.insert(r.x,r.y,r.x+r.width+s.taskMargin,450)}},"drawTasks"),at={setConf:Dt,draw:Yt},Zt={parser:Et,db:rt,renderer:at,styles:Ft,init:n(e=>{at.setConf(e.journey),rt.clear()},"init")};export{Zt as diagram};
