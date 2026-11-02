import{A as mt,D as _t}from"./index-DTlzaKUm.js";import{V as fe,B as me,U as ye,H as ke,z as pe,R as ge,h as d,K as ct,M as Dt,T as be,v as nt,S as ve,L as xe,t as Te,e as $e,b as we}from"./mermaid.core-ClIT2jZ--BssFbvPY.js";import{B as _e}from"./linear-_i7axQhS-BNq4O4Hz.js";import{h as De,o as Se,a as Me,Q as Ut,z as Zt,O as Ce,P as Ee,N as Ye,M as Ae,k as Le,A as Ie,l as Oe,w as Qt,S as qt,b as Xt,y as Kt,d as Jt}from"./time-C7uuhDcq-_ndZ-cxx.js";import{T as Fe}from"./step-BLAKVGAu-Ohuqujd6.js";import"./defaultLocale-MdLIoXIH-B3KGQYvT.js";import"./init-CQl8l1Ov-B3vgOOaq.js";function We(t){return t}var xt=1,St=2,Ct=3,vt=4,te=1e-6;function Pe(t){return"translate("+t+",0)"}function ze(t){return"translate(0,"+t+")"}function He(t){return i=>+t(i)}function Ne(t,i){return i=Math.max(0,t.bandwidth()-i*2)/2,t.round()&&(i=Math.round(i)),r=>+t(r)+i}function Be(){return!this.__axis}function ne(t,i){var r=[],s=null,o=null,u=6,k=6,D=3,A=typeof window<"u"&&window.devicePixelRatio>1?0:.5,S=t===xt||t===vt?-1:1,x=t===vt||t===St?"x":"y",O=t===xt||t===Ct?Pe:ze;function T($){var H=s??(i.ticks?i.ticks.apply(i,r):i.domain()),C=o??(i.tickFormat?i.tickFormat.apply(i,r):We),v=Math.max(u,0)+D,M=i.range(),F=+M[0]+A,L=+M[M.length-1]+A,N=(i.bandwidth?Ne:He)(i.copy(),A),B=$.selection?$.selection():$,E=B.selectAll(".domain").data([null]),p=B.selectAll(".tick").data(H,i).order(),m=p.exit(),h=p.enter().append("g").attr("class","tick"),g=p.select("line"),y=p.select("text");E=E.merge(E.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),p=p.merge(h),g=g.merge(h.append("line").attr("stroke","currentColor").attr(x+"2",S*u)),y=y.merge(h.append("text").attr("fill","currentColor").attr(x,S*v).attr("dy",t===xt?"0em":t===Ct?"0.71em":"0.32em")),$!==B&&(E=E.transition($),p=p.transition($),g=g.transition($),y=y.transition($),m=m.transition($).attr("opacity",te).attr("transform",function(n){return isFinite(n=N(n))?O(n+A):this.getAttribute("transform")}),h.attr("opacity",te).attr("transform",function(n){var c=this.parentNode.__axis;return O((c&&isFinite(c=c(n))?c:N(n))+A)})),m.remove(),E.attr("d",t===vt||t===St?k?"M"+S*k+","+F+"H"+A+"V"+L+"H"+S*k:"M"+A+","+F+"V"+L:k?"M"+F+","+S*k+"V"+A+"H"+L+"V"+S*k:"M"+F+","+A+"H"+L),p.attr("opacity",1).attr("transform",function(n){return O(N(n)+A)}),g.attr(x+"2",S*u),y.attr(x,S*v).text(C),B.filter(Be).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===St?"start":t===vt?"end":"middle"),B.each(function(){this.__axis=N})}return T.scale=function($){return arguments.length?(i=$,T):i},T.ticks=function(){return r=Array.from(arguments),T},T.tickArguments=function($){return arguments.length?(r=$==null?[]:Array.from($),T):r.slice()},T.tickValues=function($){return arguments.length?(s=$==null?null:Array.from($),T):s&&s.slice()},T.tickFormat=function($){return arguments.length?(o=$,T):o},T.tickSize=function($){return arguments.length?(u=k=+$,T):u},T.tickSizeInner=function($){return arguments.length?(u=+$,T):u},T.tickSizeOuter=function($){return arguments.length?(k=+$,T):k},T.tickPadding=function($){return arguments.length?(D=+$,T):D},T.offset=function($){return arguments.length?(A=+$,T):A},T}function je(t){return ne(xt,t)}function Re(t){return ne(Ct,t)}var Ge=_t(((t,i)=>{(function(r,s){typeof t=="object"&&i!==void 0?i.exports=s():typeof define=="function"&&define.amd?define(s):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_isoWeek=s()})(t,(function(){var r="day";return function(s,o,u){var k=function(S){return S.add(4-S.isoWeekday(),r)},D=o.prototype;D.isoWeekYear=function(){return k(this).year()},D.isoWeek=function(S){if(!this.$utils().u(S))return this.add(7*(S-this.isoWeek()),r);var x,O,T,$,H=k(this),C=(x=this.isoWeekYear(),O=this.$u,T=(O?u.utc:u)().year(x).startOf("year"),$=4-T.isoWeekday(),T.isoWeekday()>4&&($+=7),T.add($,r));return H.diff(C,"week")+1},D.isoWeekday=function(S){return this.$utils().u(S)?this.day()||7:this.day(this.day()%7?S:S-7)};var A=D.startOf;D.startOf=function(S,x){var O=this.$utils(),T=!!O.u(x)||x;return O.p(S)==="isoweek"?T?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):A.bind(this)(S,x)}}}))})),Ve=_t(((t,i)=>{(function(r,s){typeof t=="object"&&i!==void 0?i.exports=s():typeof define=="function"&&define.amd?define(s):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_customParseFormat=s()})(t,(function(){var r={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},s=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,o=/\d/,u=/\d\d/,k=/\d\d?/,D=/\d*[^-_:/,()\s\d]+/,A={},S=function(v){return(v=+v)+(v>68?1900:2e3)},x=function(v){return function(M){this[v]=+M}},O=[/[+-]\d\d:?(\d\d)?|Z/,function(v){(this.zone||(this.zone={})).offset=(function(M){if(!M||M==="Z")return 0;var F=M.match(/([+-]|\d\d)/g),L=60*F[1]+(+F[2]||0);return L===0?0:F[0]==="+"?-L:L})(v)}],T=function(v){var M=A[v];return M&&(M.indexOf?M:M.s.concat(M.f))},$=function(v,M){var F,L=A.meridiem;if(L){for(var N=1;N<=24;N+=1)if(v.indexOf(L(N,0,M))>-1){F=N>12;break}}else F=v===(M?"pm":"PM");return F},H={A:[D,function(v){this.afternoon=$(v,!1)}],a:[D,function(v){this.afternoon=$(v,!0)}],Q:[o,function(v){this.month=3*(v-1)+1}],S:[o,function(v){this.milliseconds=100*v}],SS:[u,function(v){this.milliseconds=10*v}],SSS:[/\d{3}/,function(v){this.milliseconds=+v}],s:[k,x("seconds")],ss:[k,x("seconds")],m:[k,x("minutes")],mm:[k,x("minutes")],H:[k,x("hours")],h:[k,x("hours")],HH:[k,x("hours")],hh:[k,x("hours")],D:[k,x("day")],DD:[u,x("day")],Do:[D,function(v){var M=A.ordinal,F=v.match(/\d+/);if(this.day=F[0],M)for(var L=1;L<=31;L+=1)M(L).replace(/\[|\]/g,"")===v&&(this.day=L)}],w:[k,x("week")],ww:[u,x("week")],M:[k,x("month")],MM:[u,x("month")],MMM:[D,function(v){var M=T("months"),F=(T("monthsShort")||M.map((function(L){return L.slice(0,3)}))).indexOf(v)+1;if(F<1)throw Error();this.month=F%12||F}],MMMM:[D,function(v){var M=T("months").indexOf(v)+1;if(M<1)throw Error();this.month=M%12||M}],Y:[/[+-]?\d+/,x("year")],YY:[u,function(v){this.year=S(v)}],YYYY:[/\d{4}/,x("year")],Z:O,ZZ:O};function C(v){for(var M=v,F=A&&A.formats,L=(v=M.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(g,y,n){var c=n&&n.toUpperCase();return y||F[n]||r[n]||F[c].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(f,l,w){return l||w.slice(1)}))}))).match(s),N=L.length,B=0;B<N;B+=1){var E=L[B],p=H[E],m=p&&p[0],h=p&&p[1];L[B]=h?{regex:m,parser:h}:E.replace(/^\[|\]$/g,"")}return function(g){for(var y={},n=0,c=0;n<N;n+=1){var f=L[n];if(typeof f=="string")c+=f.length;else{var l=f.regex,w=f.parser,a=g.slice(c),I=l.exec(a)[0];w.call(y,I),g=g.replace(I,"")}}return(function(e){var b=e.afternoon;if(b!==void 0){var _=e.hours;b?_<12&&(e.hours+=12):_===12&&(e.hours=0),delete e.afternoon}})(y),y}}return function(v,M,F){F.p.customParseFormat=!0,v&&v.parseTwoDigitYear&&(S=v.parseTwoDigitYear);var L=M.prototype,N=L.parse;L.parse=function(B){var E=B.date,p=B.utc,m=B.args;this.$u=p;var h=m[1];if(typeof h=="string"){var g=m[2]===!0,y=m[3]===!0,n=g||y,c=m[2];y&&(c=m[2]),A=this.$locale(),!g&&c&&(A=F.Ls[c]),this.$d=(function(a,I,e,b){try{if(["x","X"].indexOf(I)>-1)return new Date((I==="X"?1e3:1)*a);var _=C(I)(a),Y=_.year,W=_.month,P=_.day,z=_.hours,j=_.minutes,q=_.seconds,ht=_.milliseconds,at=_.zone,gt=_.week,ft=new Date,ot=P||(Y||W?1:ft.getDate()),G=Y||ft.getFullYear(),et=0;Y&&!W||(et=W>0?W-1:ft.getMonth());var Z,U=z||0,st=j||0,X=q||0,it=ht||0;return at?new Date(Date.UTC(G,et,ot,U,st,X,it+60*at.offset*1e3)):e?new Date(Date.UTC(G,et,ot,U,st,X,it)):(Z=new Date(G,et,ot,U,st,X,it),gt&&(Z=b(Z).week(gt).toDate()),Z)}catch{return new Date("")}})(E,h,p,F),this.init(),c&&c!==!0&&(this.$L=this.locale(c).$L),n&&E!=this.format(h)&&(this.$d=new Date("")),A={}}else if(h instanceof Array)for(var f=h.length,l=1;l<=f;l+=1){m[1]=h[l-1];var w=F.apply(this,m);if(w.isValid()){this.$d=w.$d,this.$L=w.$L,this.init();break}l===f&&(this.$d=new Date(""))}else N.call(this,B)}}}))})),Ue=_t(((t,i)=>{(function(r,s){typeof t=="object"&&i!==void 0?i.exports=s():typeof define=="function"&&define.amd?define(s):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_advancedFormat=s()})(t,(function(){return function(r,s){var o=s.prototype,u=o.format;o.format=function(k){var D=this,A=this.$locale();if(!this.isValid())return u.bind(this)(k);var S=this.$utils(),x=(k||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(O){switch(O){case"Q":return Math.ceil((D.$M+1)/3);case"Do":return A.ordinal(D.$D);case"gggg":return D.weekYear();case"GGGG":return D.isoWeekYear();case"wo":return A.ordinal(D.week(),"W");case"w":case"ww":return S.s(D.week(),O==="w"?1:2,"0");case"W":case"WW":return S.s(D.isoWeek(),O==="W"?1:2,"0");case"k":case"kk":return S.s(String(D.$H===0?24:D.$H),O==="k"?1:2,"0");case"X":return Math.floor(D.$d.getTime()/1e3);case"x":return D.$d.getTime();case"z":return"["+D.offsetName()+"]";case"zzz":return"["+D.offsetName("long")+"]";default:return O}}));return u.bind(this)(x)}}}))})),Ze=_t(((t,i)=>{(function(r,s){typeof t=="object"&&i!==void 0?i.exports=s():typeof define=="function"&&define.amd?define(s):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_duration=s()})(t,(function(){var r,s,o=1e3,u=6e4,k=36e5,D=864e5,A=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,S=31536e6,x=2628e6,O=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,T={years:S,months:x,days:D,hours:k,minutes:u,seconds:o,milliseconds:1,weeks:6048e5},$=function(E){return E instanceof N},H=function(E,p,m){return new N(E,m,p.$l)},C=function(E){return s.p(E)+"s"},v=function(E){return E<0},M=function(E){return v(E)?Math.ceil(E):Math.floor(E)},F=function(E){return Math.abs(E)},L=function(E,p){return E?v(E)?{negative:!0,format:""+F(E)+p}:{negative:!1,format:""+E+p}:{negative:!1,format:""}},N=(function(){function E(m,h,g){var y=this;if(this.$d={},this.$l=g,m===void 0&&(this.$ms=0,this.parseFromMilliseconds()),h)return H(m*T[C(h)],this);if(typeof m=="number")return this.$ms=m,this.parseFromMilliseconds(),this;if(typeof m=="object")return Object.keys(m).forEach((function(f){y.$d[C(f)]=m[f]})),this.calMilliseconds(),this;if(typeof m=="string"){var n=m.match(O);if(n){var c=n.slice(2).map((function(f){return f==null?0:Number(f)}));return this.$d.years=c[0],this.$d.months=c[1],this.$d.weeks=c[2],this.$d.days=c[3],this.$d.hours=c[4],this.$d.minutes=c[5],this.$d.seconds=c[6],this.calMilliseconds(),this}}return this}var p=E.prototype;return p.calMilliseconds=function(){var m=this;this.$ms=Object.keys(this.$d).reduce((function(h,g){return h+(m.$d[g]||0)*T[g]}),0)},p.parseFromMilliseconds=function(){var m=this.$ms;this.$d.years=M(m/S),m%=S,this.$d.months=M(m/x),m%=x,this.$d.days=M(m/D),m%=D,this.$d.hours=M(m/k),m%=k,this.$d.minutes=M(m/u),m%=u,this.$d.seconds=M(m/o),m%=o,this.$d.milliseconds=m},p.toISOString=function(){var m=L(this.$d.years,"Y"),h=L(this.$d.months,"M"),g=+this.$d.days||0;this.$d.weeks&&(g+=7*this.$d.weeks);var y=L(g,"D"),n=L(this.$d.hours,"H"),c=L(this.$d.minutes,"M"),f=this.$d.seconds||0;this.$d.milliseconds&&(f+=this.$d.milliseconds/1e3,f=Math.round(1e3*f)/1e3);var l=L(f,"S"),w=m.negative||h.negative||y.negative||n.negative||c.negative||l.negative,a=n.format||c.format||l.format?"T":"",I=(w?"-":"")+"P"+m.format+h.format+y.format+a+n.format+c.format+l.format;return I==="P"||I==="-P"?"P0D":I},p.toJSON=function(){return this.toISOString()},p.format=function(m){var h=m||"YYYY-MM-DDTHH:mm:ss",g={Y:this.$d.years,YY:s.s(this.$d.years,2,"0"),YYYY:s.s(this.$d.years,4,"0"),M:this.$d.months,MM:s.s(this.$d.months,2,"0"),D:this.$d.days,DD:s.s(this.$d.days,2,"0"),H:this.$d.hours,HH:s.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:s.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:s.s(this.$d.seconds,2,"0"),SSS:s.s(this.$d.milliseconds,3,"0")};return h.replace(A,(function(y,n){return n||String(g[y])}))},p.as=function(m){return this.$ms/T[C(m)]},p.get=function(m){var h=this.$ms,g=C(m);return g==="milliseconds"?h%=1e3:h=g==="weeks"?M(h/T[g]):this.$d[g],h||0},p.add=function(m,h,g){var y;return y=h?m*T[C(h)]:$(m)?m.$ms:H(m,this).$ms,H(this.$ms+y*(g?-1:1),this)},p.subtract=function(m,h){return this.add(m,h,!0)},p.locale=function(m){var h=this.clone();return h.$l=m,h},p.clone=function(){return H(this.$ms,this)},p.humanize=function(m){return r().add(this.$ms,"ms").locale(this.$l).fromNow(!m)},p.valueOf=function(){return this.asMilliseconds()},p.milliseconds=function(){return this.get("milliseconds")},p.asMilliseconds=function(){return this.as("milliseconds")},p.seconds=function(){return this.get("seconds")},p.asSeconds=function(){return this.as("seconds")},p.minutes=function(){return this.get("minutes")},p.asMinutes=function(){return this.as("minutes")},p.hours=function(){return this.get("hours")},p.asHours=function(){return this.as("hours")},p.days=function(){return this.get("days")},p.asDays=function(){return this.as("days")},p.weeks=function(){return this.get("weeks")},p.asWeeks=function(){return this.as("weeks")},p.months=function(){return this.get("months")},p.asMonths=function(){return this.as("months")},p.years=function(){return this.get("years")},p.asYears=function(){return this.as("years")},E})(),B=function(E,p,m){return E.add(p.years()*m,"y").add(p.months()*m,"M").add(p.days()*m,"d").add(p.hours()*m,"h").add(p.minutes()*m,"m").add(p.seconds()*m,"s").add(p.milliseconds()*m,"ms")};return function(E,p,m){r=m,s=m().$utils(),m.duration=function(y,n){return H(y,{$l:m.locale()},n)},m.isDuration=$;var h=p.prototype.add,g=p.prototype.subtract;p.prototype.add=function(y,n){return $(y)?B(this,y,1):h.bind(this)(y,n)},p.prototype.subtract=function(y,n){return $(y)?B(this,y,-1):g.bind(this)(y,n)}}}))})),Qe=we(),V=mt(Te(),1),qe=mt(Ge(),1),Xe=mt(Ve(),1),Ke=mt(Ue(),1),Je=mt(Ze(),1),Et=(function(){var t=d(function(n,c,f,l){for(f=f||{},l=n.length;l--;f[n[l]]=c);return f},"o"),i=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],s=[1,27],o=[1,28],u=[1,29],k=[1,30],D=[1,31],A=[1,32],S=[1,33],x=[1,34],O=[1,9],T=[1,10],$=[1,11],H=[1,12],C=[1,13],v=[1,14],M=[1,15],F=[1,16],L=[1,19],N=[1,20],B=[1,21],E=[1,22],p=[1,23],m=[1,25],h=[1,35],g={trace:d(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:d(function(n,c,f,l,w,a,I){var e=a.length-1;switch(w){case 1:return a[e-1];case 2:this.$=[];break;case 3:a[e-1].push(a[e]),this.$=a[e-1];break;case 4:case 5:this.$=a[e];break;case 6:case 7:this.$=[];break;case 8:l.setWeekday("monday");break;case 9:l.setWeekday("tuesday");break;case 10:l.setWeekday("wednesday");break;case 11:l.setWeekday("thursday");break;case 12:l.setWeekday("friday");break;case 13:l.setWeekday("saturday");break;case 14:l.setWeekday("sunday");break;case 15:l.setWeekend("friday");break;case 16:l.setWeekend("saturday");break;case 17:l.setDateFormat(a[e].substr(11)),this.$=a[e].substr(11);break;case 18:l.enableInclusiveEndDates(),this.$=a[e].substr(18);break;case 19:l.TopAxis(),this.$=a[e].substr(8);break;case 20:l.setAxisFormat(a[e].substr(11)),this.$=a[e].substr(11);break;case 21:l.setTickInterval(a[e].substr(13)),this.$=a[e].substr(13);break;case 22:l.setExcludes(a[e].substr(9)),this.$=a[e].substr(9);break;case 23:l.setIncludes(a[e].substr(9)),this.$=a[e].substr(9);break;case 24:l.setTodayMarker(a[e].substr(12)),this.$=a[e].substr(12);break;case 27:l.setDiagramTitle(a[e].substr(6)),this.$=a[e].substr(6);break;case 28:this.$=a[e].trim(),l.setAccTitle(this.$);break;case 29:case 30:this.$=a[e].trim(),l.setAccDescription(this.$);break;case 31:l.addSection(a[e].substr(8)),this.$=a[e].substr(8);break;case 33:l.addTask(a[e-1],a[e]),this.$="task";break;case 34:this.$=a[e-1],l.setClickEvent(a[e-1],a[e],null);break;case 35:this.$=a[e-2],l.setClickEvent(a[e-2],a[e-1],a[e]);break;case 36:this.$=a[e-2],l.setClickEvent(a[e-2],a[e-1],null),l.setLink(a[e-2],a[e]);break;case 37:this.$=a[e-3],l.setClickEvent(a[e-3],a[e-2],a[e-1]),l.setLink(a[e-3],a[e]);break;case 38:this.$=a[e-2],l.setClickEvent(a[e-2],a[e],null),l.setLink(a[e-2],a[e-1]);break;case 39:this.$=a[e-3],l.setClickEvent(a[e-3],a[e-1],a[e]),l.setLink(a[e-3],a[e-2]);break;case 40:this.$=a[e-1],l.setLink(a[e-1],a[e]);break;case 41:case 47:this.$=a[e-1]+" "+a[e];break;case 42:case 43:case 45:this.$=a[e-2]+" "+a[e-1]+" "+a[e];break;case 44:case 46:this.$=a[e-3]+" "+a[e-2]+" "+a[e-1]+" "+a[e];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(i,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:s,14:o,15:u,16:k,17:D,18:A,19:18,20:S,21:x,22:O,23:T,24:$,25:H,26:C,27:v,28:M,29:F,30:L,31:N,33:B,35:E,36:p,37:24,38:m,40:h},t(i,[2,7],{1:[2,1]}),t(i,[2,3]),{9:36,11:17,12:r,13:s,14:o,15:u,16:k,17:D,18:A,19:18,20:S,21:x,22:O,23:T,24:$,25:H,26:C,27:v,28:M,29:F,30:L,31:N,33:B,35:E,36:p,37:24,38:m,40:h},t(i,[2,5]),t(i,[2,6]),t(i,[2,17]),t(i,[2,18]),t(i,[2,19]),t(i,[2,20]),t(i,[2,21]),t(i,[2,22]),t(i,[2,23]),t(i,[2,24]),t(i,[2,25]),t(i,[2,26]),t(i,[2,27]),{32:[1,37]},{34:[1,38]},t(i,[2,30]),t(i,[2,31]),t(i,[2,32]),{39:[1,39]},t(i,[2,8]),t(i,[2,9]),t(i,[2,10]),t(i,[2,11]),t(i,[2,12]),t(i,[2,13]),t(i,[2,14]),t(i,[2,15]),t(i,[2,16]),{41:[1,40],43:[1,41]},t(i,[2,4]),t(i,[2,28]),t(i,[2,29]),t(i,[2,33]),t(i,[2,34],{42:[1,42],43:[1,43]}),t(i,[2,40],{41:[1,44]}),t(i,[2,35],{43:[1,45]}),t(i,[2,36]),t(i,[2,38],{42:[1,46]}),t(i,[2,37]),t(i,[2,39])],defaultActions:{},parseError:d(function(n,c){if(c.recoverable)this.trace(n);else{var f=Error(n);throw f.hash=c,f}},"parseError"),parse:d(function(n){var c=this,f=[0],l=[],w=[null],a=[],I=this.table,e="",b=0,_=0,Y=0,W=2,P=1,z=a.slice.call(arguments,1),j=Object.create(this.lexer),q={yy:{}};for(var ht in this.yy)Object.prototype.hasOwnProperty.call(this.yy,ht)&&(q.yy[ht]=this.yy[ht]);j.setInput(n,q.yy),q.yy.lexer=j,q.yy.parser=this,j.yylloc===void 0&&(j.yylloc={});var at=j.yylloc;a.push(at);var gt=j.options&&j.options.ranges;typeof q.yy.parseError=="function"?this.parseError=q.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft(Q){f.length-=2*Q,w.length-=Q,a.length-=Q}d(ft,"popStack");function ot(){var Q=l.pop()||j.lex()||P;return typeof Q!="number"&&(Q instanceof Array&&(l=Q,Q=l.pop()),Q=c.symbols_[Q]||Q),Q}d(ot,"lex");for(var G,et,Z,U,st,X={},it,J,Gt,bt;;){if(Z=f[f.length-1],this.defaultActions[Z]?U=this.defaultActions[Z]:(G==null&&(G=ot()),U=I[Z]&&I[Z][G]),U===void 0||!U.length||!U[0]){var Vt="";for(it in bt=[],I[Z])this.terminals_[it]&&it>W&&bt.push("'"+this.terminals_[it]+"'");Vt=j.showPosition?"Parse error on line "+(b+1)+`:
`+j.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[G]||G)+"'":"Parse error on line "+(b+1)+": Unexpected "+(G==P?"end of input":"'"+(this.terminals_[G]||G)+"'"),this.parseError(Vt,{text:j.match,token:this.terminals_[G]||G,line:j.yylineno,loc:at,expected:bt})}if(U[0]instanceof Array&&U.length>1)throw Error("Parse Error: multiple actions possible at state: "+Z+", token: "+G);switch(U[0]){case 1:f.push(G),w.push(j.yytext),a.push(j.yylloc),f.push(U[1]),G=null,et?(G=et,et=null):(_=j.yyleng,e=j.yytext,b=j.yylineno,at=j.yylloc,Y>0);break;case 2:if(J=this.productions_[U[1]][1],X.$=w[w.length-J],X._$={first_line:a[a.length-(J||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(J||1)].first_column,last_column:a[a.length-1].last_column},gt&&(X._$.range=[a[a.length-(J||1)].range[0],a[a.length-1].range[1]]),st=this.performAction.apply(X,[e,_,b,q.yy,U[1],w,a].concat(z)),st!==void 0)return st;J&&(f=f.slice(0,-1*J*2),w=w.slice(0,-1*J),a=a.slice(0,-1*J)),f.push(this.productions_[U[1]][0]),w.push(X.$),a.push(X._$),Gt=I[f[f.length-2]][f[f.length-1]],f.push(Gt);break;case 3:return!0}}return!0},"parse")};g.lexer=(function(){return{EOF:1,parseError:d(function(n,c){if(this.yy.parser)this.yy.parser.parseError(n,c);else throw Error(n)},"parseError"),setInput:d(function(n,c){return this.yy=c||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:d(function(){var n=this._input[0];return this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n,n.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},"input"),unput:d(function(n){var c=n.length,f=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var l=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var w=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===l.length?this.yylloc.first_column:0)+l[l.length-f.length].length-f[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[w[0],w[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},"unput"),more:d(function(){return this._more=!0,this},"more"),reject:d(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:d(function(n){this.unput(this.match.slice(n))},"less"),pastInput:d(function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:d(function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:d(function(){var n=this.pastInput(),c=Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+c+"^"},"showPosition"),test_match:d(function(n,c){var f,l,w;if(this.options.backtrack_lexer&&(w={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(w.yylloc.range=this.yylloc.range.slice(0))),l=n[0].match(/(?:\r\n?|\n).*/g),l&&(this.yylineno+=l.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:l?l[l.length-1].length-l[l.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],f=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var a in w)this[a]=w[a];return!1}return!1},"test_match"),next:d(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,c,f,l;this._more||(this.yytext="",this.match="");for(var w=this._currentRules(),a=0;a<w.length;a++)if(f=this._input.match(this.rules[w[a]]),f&&(!c||f[0].length>c[0].length)){if(c=f,l=a,this.options.backtrack_lexer){if(n=this.test_match(f,w[a]),n!==!1)return n;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(n=this.test_match(c,w[l]),n===!1?!1:n):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:d(function(){return this.next()||this.lex()},"lex"),begin:d(function(n){this.conditionStack.push(n)},"begin"),popState:d(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:d(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:d(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:d(function(n){this.begin(n)},"pushState"),stateStackSize:d(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:d(function(n,c,f,l){switch(f){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}}})();function y(){this.yy={}}return d(y,"Parser"),y.prototype=g,g.Parser=y,new y})();Et.parser=Et;var ti=Et;V.default.extend(qe.default),V.default.extend(Xe.default),V.default.extend(Ke.default);var ee={friday:5,saturday:6},K="",Ot="",Ft=void 0,Wt="",yt=[],kt=[],Pt=new Map,zt=[],$t=[],ut="",Ht="",re=["active","done","crit","milestone","vert"],Nt=[],lt="",pt=!1,Bt=!1,jt="sunday",wt="saturday",Yt=0,ei=d(function(){zt=[],$t=[],ut="",Nt=[],Lt=0,It=void 0,Tt=void 0,R=[],K="",Ot="",Ht="",Ft=void 0,Wt="",yt=[],kt=[],pt=!1,Bt=!1,Yt=0,Pt=new Map,lt="",xe(),jt="sunday",wt="saturday"},"clear"),ii=d(function(t){lt=t},"setDiagramId"),si=d(function(t){Ot=t},"setAxisFormat"),ni=d(function(){return Ot},"getAxisFormat"),ri=d(function(t){Ft=t},"setTickInterval"),ai=d(function(){return Ft},"getTickInterval"),oi=d(function(t){Wt=t},"setTodayMarker"),li=d(function(){return Wt},"getTodayMarker"),ci=d(function(t){K=t},"setDateFormat"),di=d(function(){pt=!0},"enableInclusiveEndDates"),ui=d(function(){return pt},"endDatesAreInclusive"),hi=d(function(){Bt=!0},"enableTopAxis"),fi=d(function(){return Bt},"topAxisEnabled"),mi=d(function(t){Ht=t},"setDisplayMode"),yi=d(function(){return Ht},"getDisplayMode"),ki=d(function(){return K},"getDateFormat"),pi=d(function(t){yt=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),gi=d(function(){return yt},"getIncludes"),bi=d(function(t){kt=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),vi=d(function(){return kt},"getExcludes"),xi=d(function(){return Pt},"getLinks"),Ti=d(function(t){ut=t,zt.push(t)},"addSection"),$i=d(function(){return zt},"getSections"),wi=d(function(){let t=ie(),i=0;for(;!t&&i<10;)t=ie(),i++;return $t=R,$t},"getTasks"),ae=d(function(t,i,r,s){let o=t.format(i.trim()),u=t.format("YYYY-MM-DD");return s.includes(o)||s.includes(u)?!1:r.includes("weekends")&&(t.isoWeekday()===ee[wt]||t.isoWeekday()===ee[wt]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(o)||r.includes(u)},"isInvalidDate"),_i=d(function(t){jt=t},"setWeekday"),Di=d(function(){return jt},"getWeekday"),Si=d(function(t){wt=t},"setWeekend"),oe=d(function(t,i,r,s){if(!r.length||t.manualEndTime)return;let o;o=t.startTime instanceof Date?(0,V.default)(t.startTime):(0,V.default)(t.startTime,i,!0),o=o.add(1,"d");let u;u=t.endTime instanceof Date?(0,V.default)(t.endTime):(0,V.default)(t.endTime,i,!0);let[k,D]=Mi(o,u,i,r,s);t.endTime=k.toDate(),t.renderEndTime=D},"checkTaskDates"),Mi=d(function(t,i,r,s,o){let u=!1,k=null,D=i.add(1e4,"d");for(;t<=i;){if(u||(k=i.toDate()),u=ae(t,r,s,o),u&&(i=i.add(1,"d"),i>D))throw Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[i,k]},"fixTaskDates"),At=d(function(t,i,r){if(r=r.trim(),d(u=>{let k=u.trim();return k==="x"||k==="X"},"isTimestampFormat")(i)&&/^\d+$/.test(r))return new Date(Number(r));let s=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(s!==null){let u=null;for(let D of s.groups.ids.split(" ")){let A=rt(D);A!==void 0&&(!u||A.endTime>u.endTime)&&(u=A)}if(u)return u.endTime;let k=new Date;return k.setHours(0,0,0,0),k}let o=(0,V.default)(r,i.trim(),!0);if(o.isValid())return o.toDate();{nt.debug("Invalid date:"+r),nt.debug("With date format:"+i.trim());let u=new Date(r);if(u===void 0||isNaN(u.getTime())||u.getFullYear()<-1e4||u.getFullYear()>1e4)throw Error("Invalid date:"+r);return u}},"getStartDate"),le=d(function(t){let i=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return i===null?[NaN,"ms"]:[Number.parseFloat(i[1]),i[2]]},"parseDuration"),ce=d(function(t,i,r,s=!1){r=r.trim();let o=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(o!==null){let S=null;for(let O of o.groups.ids.split(" ")){let T=rt(O);T!==void 0&&(!S||T.startTime<S.startTime)&&(S=T)}if(S)return S.startTime;let x=new Date;return x.setHours(0,0,0,0),x}let u=(0,V.default)(r,i.trim(),!0);if(u.isValid())return s&&(u=u.add(1,"d")),u.toDate();let k=(0,V.default)(t),[D,A]=le(r);if(!Number.isNaN(D)){let S=k.add(D,A);S.isValid()&&(k=S)}return k.toDate()},"getEndDate"),Lt=0,dt=d(function(t){return t===void 0?(Lt+=1,"task"+Lt):t},"parseId"),Ci=d(function(t,i){let r;r=i.substr(0,1)===":"?i.substr(1,i.length):i;let s=r.split(","),o={};Rt(s,o,re);for(let k=0;k<s.length;k++)s[k]=s[k].trim();let u="";switch(s.length){case 1:o.id=dt(),o.startTime=t.endTime,u=s[0];break;case 2:o.id=dt(),o.startTime=At(void 0,K,s[0]),u=s[1];break;case 3:o.id=dt(s[0]),o.startTime=At(void 0,K,s[1]),u=s[2];break}return u&&(o.endTime=ce(o.startTime,K,u,pt),o.manualEndTime=(0,V.default)(u,"YYYY-MM-DD",!0).isValid(),oe(o,K,kt,yt)),o},"compileData"),Ei=d(function(t,i){let r;r=i.substr(0,1)===":"?i.substr(1,i.length):i;let s=r.split(","),o={};Rt(s,o,re);for(let u=0;u<s.length;u++)s[u]=s[u].trim();switch(s.length){case 1:o.id=dt(),o.startTime={type:"prevTaskEnd",id:t},o.endTime={data:s[0]};break;case 2:o.id=dt(),o.startTime={type:"getStartDate",startData:s[0]},o.endTime={data:s[1]};break;case 3:o.id=dt(s[0]),o.startTime={type:"getStartDate",startData:s[1]},o.endTime={data:s[2]};break}return o},"parseData"),It,Tt,R=[],de={},Yi=d(function(t,i){let r={section:ut,type:ut,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:i},task:t,classes:[]},s=Ei(Tt,i);r.raw.startTime=s.startTime,r.raw.endTime=s.endTime,r.id=s.id,r.prevTaskId=Tt,r.active=s.active,r.done=s.done,r.crit=s.crit,r.milestone=s.milestone,r.vert=s.vert,r.order=Yt,Yt++;let o=R.push(r);Tt=r.id,de[r.id]=o-1},"addTask"),rt=d(function(t){let i=de[t];return R[i]},"findTaskById"),Ai=d(function(t,i){let r={section:ut,type:ut,description:t,task:t,classes:[]},s=Ci(It,i);r.startTime=s.startTime,r.endTime=s.endTime,r.id=s.id,r.active=s.active,r.done=s.done,r.crit=s.crit,r.milestone=s.milestone,r.vert=s.vert,It=r,$t.push(r)},"addTaskOrg"),ie=d(function(){let t=d(function(r){let s=R[r],o="";switch(R[r].raw.startTime.type){case"prevTaskEnd":s.startTime=rt(s.prevTaskId).endTime;break;case"getStartDate":o=At(void 0,K,R[r].raw.startTime.startData),o&&(R[r].startTime=o);break}return R[r].startTime&&(R[r].endTime=ce(R[r].startTime,K,R[r].raw.endTime.data,pt),R[r].endTime&&(R[r].processed=!0,R[r].manualEndTime=(0,V.default)(R[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),oe(R[r],K,kt,yt))),R[r].processed},"compileTask"),i=!0;for(let[r,s]of R.entries())t(r),i=i&&s.processed;return i},"compileTasks"),Li=d(function(t,i){let r=i;ct().securityLevel!=="loose"&&(r=(0,Qe.sanitizeUrl)(i)),t.split(",").forEach(function(s){rt(s)!==void 0&&(he(s,()=>{window.open(r,"_self")}),Pt.set(s,r))}),ue(t,"clickable")},"setLink"),ue=d(function(t,i){t.split(",").forEach(function(r){let s=rt(r);s!==void 0&&s.classes.push(i)})},"setClass"),Ii=d(function(t,i,r){if(ct().securityLevel!=="loose"||i===void 0)return;let s=[];if(typeof r=="string"){s=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<s.length;o++){let u=s[o].trim();u.startsWith('"')&&u.endsWith('"')&&(u=u.substr(1,u.length-2)),s[o]=u}}s.length===0&&s.push(t),rt(t)!==void 0&&he(t,()=>{$e.runFunc(i,...s)})},"setClickFun"),he=d(function(t,i){Nt.push(function(){let r=lt?`${lt}-${t}`:t,s=document.querySelector(`[id="${r}"]`);s!==null&&s.addEventListener("click",function(){i()})},function(){let r=lt?`${lt}-${t}`:t,s=document.querySelector(`[id="${r}-text"]`);s!==null&&s.addEventListener("click",function(){i()})})},"pushFun"),Oi={getConfig:d(()=>ct().gantt,"getConfig"),clear:ei,setDateFormat:ci,getDateFormat:ki,enableInclusiveEndDates:di,endDatesAreInclusive:ui,enableTopAxis:hi,topAxisEnabled:fi,setAxisFormat:si,getAxisFormat:ni,setTickInterval:ri,getTickInterval:ai,setTodayMarker:oi,getTodayMarker:li,setAccTitle:ge,getAccTitle:pe,setDiagramTitle:ke,getDiagramTitle:ye,setDiagramId:ii,setDisplayMode:mi,getDisplayMode:yi,setAccDescription:me,getAccDescription:fe,addSection:Ti,getSections:$i,getTasks:wi,addTask:Yi,findTaskById:rt,addTaskOrg:Ai,setIncludes:pi,getIncludes:gi,setExcludes:bi,getExcludes:vi,setClickEvent:d(function(t,i,r){t.split(",").forEach(function(s){Ii(s,i,r)}),ue(t,"clickable")},"setClickEvent"),setLink:Li,getLinks:xi,bindFunctions:d(function(t){Nt.forEach(function(i){i(t)})},"bindFunctions"),parseDuration:le,isInvalidDate:ae,setWeekday:_i,getWeekday:Di,setWeekend:Si};function Rt(t,i,r){let s=!0;for(;s;)s=!1,r.forEach(function(o){let u="^\\s*"+o+"\\s*$",k=new RegExp(u);t[0].match(k)&&(i[o]=!0,t.shift(1),s=!0)})}d(Rt,"getTaskTags"),V.default.extend(Je.default);var Fi=d(function(){nt.debug("Something is calling, setConf, remove the call")},"setConf"),se={monday:Oe,tuesday:Ie,wednesday:Le,thursday:Ae,friday:Ye,saturday:Ee,sunday:Ce},Wi=d((t,i)=>{let r=[...t].map(()=>-1/0),s=[...t].sort((u,k)=>u.startTime-k.startTime||u.order-k.order),o=0;for(let u of s)for(let k=0;k<r.length;k++)if(u.startTime>=r[k]){r[k]=u.endTime,u.order=k+i,k>o&&(o=k);break}return o},"getMaxIntersections"),tt,Mt=1e4,Gi={parser:ti,db:Oi,renderer:{setConf:Fi,draw:d(function(t,i,r,s){let o=ct().gantt;s.db.setDiagramId(i);let u=ct().securityLevel,k;u==="sandbox"&&(k=Dt("#i"+i));let D=Dt(u==="sandbox"?k.nodes()[0].contentDocument.body:"body"),A=u==="sandbox"?k.nodes()[0].contentDocument:document,S=A.getElementById(i);tt=S.parentElement.offsetWidth,tt===void 0&&(tt=1200),o.useWidth!==void 0&&(tt=o.useWidth);let x=s.db.getTasks(),O=[];for(let h of x)O.push(h.type);O=m(O);let T={},$=2*o.topPadding;if(s.db.getDisplayMode()==="compact"||o.displayMode==="compact"){let h={};for(let y of x)h[y.section]===void 0?h[y.section]=[y]:h[y.section].push(y);let g=0;for(let y of Object.keys(h)){let n=Wi(h[y],g)+1;g+=n,$+=n*(o.barHeight+o.barGap),T[y]=n}}else{$+=x.length*(o.barHeight+o.barGap);for(let h of O)T[h]=x.filter(g=>g.type===h).length}S.setAttribute("viewBox","0 0 "+tt+" "+$);let H=D.select(`[id="${i}"]`),C=De().domain([Se(x,function(h){return h.startTime}),Me(x,function(h){return h.endTime})]).rangeRound([0,tt-o.leftPadding-o.rightPadding]);function v(h,g){let y=h.startTime,n=g.startTime,c=0;return y>n?c=1:y<n&&(c=-1),c}d(v,"taskCompare"),x.sort(v),M(x,tt,$),be(H,$,tt,o.useMaxWidth),H.append("text").text(s.db.getDiagramTitle()).attr("x",tt/2).attr("y",o.titleTopMargin).attr("class","titleText");function M(h,g,y){let n=o.barHeight,c=n+o.barGap,f=o.topPadding,l=o.leftPadding,w=_e().domain([0,O.length]).range(["#00B9FA","#F95002"]).interpolate(Fe);L(c,f,l,g,y,h,s.db.getExcludes(),s.db.getIncludes()),B(l,f,g,y),F(h,c,f,l,n,w,g),E(c,f),p(l,f,g,y)}d(M,"makeGantt");function F(h,g,y,n,c,f,l){h.sort((e,b)=>e.vert===b.vert?0:e.vert?1:-1);let w=[...new Set(h.map(e=>e.order))].map(e=>h.find(b=>b.order===e));H.append("g").selectAll("rect").data(w).enter().append("rect").attr("x",0).attr("y",function(e,b){return b=e.order,b*g+y-2}).attr("width",function(){return l-o.rightPadding/2}).attr("height",g).attr("class",function(e){for(let[b,_]of O.entries())if(e.type===_)return"section section"+b%o.numberSectionStyles;return"section section0"}).enter();let a=H.append("g").selectAll("rect").data(h).enter(),I=s.db.getLinks();if(a.append("rect").attr("id",function(e){return i+"-"+e.id}).attr("rx",3).attr("ry",3).attr("x",function(e){return e.milestone?C(e.startTime)+n+.5*(C(e.endTime)-C(e.startTime))-.5*c:C(e.startTime)+n}).attr("y",function(e,b){return b=e.order,e.vert?o.gridLineStartPadding:b*g+y}).attr("width",function(e){return e.milestone?c:e.vert?.08*c:C(e.renderEndTime||e.endTime)-C(e.startTime)}).attr("height",function(e){return e.vert?x.length*(o.barHeight+o.barGap)+o.barHeight*2:c}).attr("transform-origin",function(e,b){return b=e.order,(C(e.startTime)+n+.5*(C(e.endTime)-C(e.startTime))).toString()+"px "+(b*g+y+.5*c).toString()+"px"}).attr("class",function(e){let b="";e.classes.length>0&&(b=e.classes.join(" "));let _=0;for(let[W,P]of O.entries())e.type===P&&(_=W%o.numberSectionStyles);let Y="";return e.active?e.crit?Y+=" activeCrit":Y=" active":e.done?Y=e.crit?" doneCrit":" done":e.crit&&(Y+=" crit"),Y.length===0&&(Y=" task"),e.milestone&&(Y=" milestone "+Y),e.vert&&(Y=" vert "+Y),Y+=_,Y+=" "+b,"task"+Y}),a.append("text").attr("id",function(e){return i+"-"+e.id+"-text"}).text(function(e){return e.task}).attr("font-size",o.fontSize).attr("x",function(e){let b=C(e.startTime),_=C(e.renderEndTime||e.endTime);if(e.milestone&&(b+=.5*(C(e.endTime)-C(e.startTime))-.5*c,_=b+c),e.vert)return C(e.startTime)+n;let Y=this.getBBox().width;return Y>_-b?_+Y+1.5*o.leftPadding>l?b+n-5:_+n+5:(_-b)/2+b+n}).attr("y",function(e,b){return e.vert?o.gridLineStartPadding+x.length*(o.barHeight+o.barGap)+60:(b=e.order,b*g+o.barHeight/2+(o.fontSize/2-2)+y)}).attr("text-height",c).attr("class",function(e){let b=C(e.startTime),_=C(e.endTime);e.milestone&&(_=b+c);let Y=this.getBBox().width,W="";e.classes.length>0&&(W=e.classes.join(" "));let P=0;for(let[j,q]of O.entries())e.type===q&&(P=j%o.numberSectionStyles);let z="";return e.active&&(z=e.crit?"activeCritText"+P:"activeText"+P),e.done?z=e.crit?z+" doneCritText"+P:z+" doneText"+P:e.crit&&(z=z+" critText"+P),e.milestone&&(z+=" milestoneText"),e.vert&&(z+=" vertText"),Y>_-b?_+Y+1.5*o.leftPadding>l?W+" taskTextOutsideLeft taskTextOutside"+P+" "+z:W+" taskTextOutsideRight taskTextOutside"+P+" "+z+" width-"+Y:W+" taskText taskText"+P+" "+z+" width-"+Y}),ct().securityLevel==="sandbox"){let e;e=Dt("#i"+i);let b=e.nodes()[0].contentDocument;a.filter(function(_){return I.has(_.id)}).each(function(_){var Y=b.querySelector("#"+CSS.escape(i+"-"+_.id)),W=b.querySelector("#"+CSS.escape(i+"-"+_.id+"-text"));let P=Y.parentNode;var z=b.createElement("a");z.setAttribute("xlink:href",I.get(_.id)),z.setAttribute("target","_top"),P.appendChild(z),z.appendChild(Y),z.appendChild(W)})}}d(F,"drawRects");function L(h,g,y,n,c,f,l,w){if(l.length===0&&w.length===0)return;let a,I;for(let{startTime:W,endTime:P}of f)(a===void 0||W<a)&&(a=W),(I===void 0||P>I)&&(I=P);if(!a||!I)return;if((0,V.default)(I).diff((0,V.default)(a),"year")>5){nt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}let e=s.db.getDateFormat(),b=[],_=null,Y=(0,V.default)(a);for(;Y.valueOf()<=I;)s.db.isInvalidDate(Y,e,l,w)?_?_.end=Y:_={start:Y,end:Y}:_&&(b.push(_),_=null),Y=Y.add(1,"d");H.append("g").selectAll("rect").data(b).enter().append("rect").attr("id",W=>i+"-exclude-"+W.start.format("YYYY-MM-DD")).attr("x",W=>C(W.start.startOf("day"))+y).attr("y",o.gridLineStartPadding).attr("width",W=>C(W.end.endOf("day"))-C(W.start.startOf("day"))).attr("height",c-g-o.gridLineStartPadding).attr("transform-origin",function(W,P){return(C(W.start)+y+.5*(C(W.end)-C(W.start))).toString()+"px "+(P*h+.5*c).toString()+"px"}).attr("class","exclude-range")}d(L,"drawExcludeDays");function N(h,g,y,n){if(y<=0||h>g)return 1/0;let c=g-h,f=V.default.duration({[n??"day"]:y}).asMilliseconds();return f<=0?1/0:Math.ceil(c/f)}d(N,"getEstimatedTickCount");function B(h,g,y,n){let c=s.db.getDateFormat(),f=s.db.getAxisFormat(),l;if(f)l=f;else if(c==="D")l="%d";else{var w;l=(w=o.axisFormat)==null?"%Y-%m-%d":w}let a=Re(C).tickSize(-n+g+o.gridLineStartPadding).tickFormat(Ut(l)),I=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(s.db.getTickInterval()||o.tickInterval);if(I!==null){let e=parseInt(I[1],10);if(isNaN(e)||e<=0)nt.warn(`Invalid tick interval value: "${I[1]}". Skipping custom tick interval.`);else{let b=I[2],_=s.db.getWeekday()||o.weekday,Y=C.domain(),W=Y[0],P=Y[1],z=N(W,P,e,b);if(z>Mt)nt.warn(`The tick interval "${e}${b}" would generate ${z} ticks, which exceeds the maximum allowed (${Mt}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(b){case"millisecond":a.ticks(Jt.every(e));break;case"second":a.ticks(Kt.every(e));break;case"minute":a.ticks(Xt.every(e));break;case"hour":a.ticks(qt.every(e));break;case"day":a.ticks(Qt.every(e));break;case"week":a.ticks(se[_].every(e));break;case"month":a.ticks(Zt.every(e));break}}}if(H.append("g").attr("class","grid").attr("transform","translate("+h+", "+(n-50)+")").call(a).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),s.db.topAxisEnabled()||o.topAxis){let e=je(C).tickSize(-n+g+o.gridLineStartPadding).tickFormat(Ut(l));if(I!==null){let b=parseInt(I[1],10);if(isNaN(b)||b<=0)nt.warn(`Invalid tick interval value: "${I[1]}". Skipping custom tick interval.`);else{let _=I[2],Y=s.db.getWeekday()||o.weekday,W=C.domain(),P=W[0],z=W[1];if(N(P,z,b,_)<=Mt)switch(_){case"millisecond":e.ticks(Jt.every(b));break;case"second":e.ticks(Kt.every(b));break;case"minute":e.ticks(Xt.every(b));break;case"hour":e.ticks(qt.every(b));break;case"day":e.ticks(Qt.every(b));break;case"week":e.ticks(se[Y].every(b));break;case"month":e.ticks(Zt.every(b));break}}}H.append("g").attr("class","grid").attr("transform","translate("+h+", "+g+")").call(e).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}d(B,"makeGrid");function E(h,g){let y=0,n=Object.keys(T).map(c=>[c,T[c]]);H.append("g").selectAll("text").data(n).enter().append(function(c){let f=c[0].split(ve.lineBreakRegex),l=-(f.length-1)/2,w=A.createElementNS("http://www.w3.org/2000/svg","text");w.setAttribute("dy",l+"em");for(let[a,I]of f.entries()){let e=A.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),a>0&&e.setAttribute("dy","1em"),e.textContent=I,w.appendChild(e)}return w}).attr("x",10).attr("y",function(c,f){if(f>0)for(let l=0;l<f;l++)return y+=n[f-1][1],c[1]*h/2+y*h+g;else return c[1]*h/2+g}).attr("font-size",o.sectionFontSize).attr("class",function(c){for(let[f,l]of O.entries())if(c[0]===l)return"sectionTitle sectionTitle"+f%o.numberSectionStyles;return"sectionTitle"})}d(E,"vertLabels");function p(h,g,y,n){let c=s.db.getTodayMarker();if(c==="off")return;let f=H.append("g").attr("class","today"),l=new Date,w=f.append("line");w.attr("x1",C(l)+h).attr("x2",C(l)+h).attr("y1",o.titleTopMargin).attr("y2",n-o.titleTopMargin).attr("class","today"),c!==""&&w.attr("style",c.replace(/,/g,";"))}d(p,"drawToday");function m(h){let g={},y=[];for(let n=0,c=h.length;n<c;++n)Object.prototype.hasOwnProperty.call(g,h[n])||(g[h[n]]=!0,y.push(h[n]));return y}d(m,"checkUnique")},"draw")},styles:d(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar — same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles")};export{Gi as diagram};
