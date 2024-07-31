"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class t{constructor(){this._listeners=[],this._isSilent=!1,this._isScoped=!1}on(t,e,i=10){return Array.isArray(t)?(t.forEach((t=>this.on(t,e,i))),this):(this._listeners.push({event:t,callback:e,priority:i}),s(this._listeners),this)}once(t,e,i=10){return Array.isArray(t)?(t.forEach((t=>this.once(t,e,i))),this):(this._listeners.push({event:t,callback:e,priority:i,once:!0}),s(this._listeners),this)}off(t,e){return Array.isArray(t)?(t.forEach((t=>this.off(t,e))),this):(this._listeners=this._listeners.filter((i=>i.event!==t||void 0!==e&&i.callback!==e)),this)}contain(t,e){return Array.isArray(t)?t.every((t=>this.contain(t,e))):this._listeners.some((i=>i.event===t&&(void 0===e||i.callback===e)))}silent(t){if("boolean"==typeof t)return void(this._isSilent=t);if(Array.isArray(t))return void(this._isSilent=t);this._isSilent=!0;const e=t.call(this);return this._isSilent=!1,e}scope(t){if("boolean"==typeof t)return void(this._isScoped=t);this._isScoped=!0;const e=t.call(this);return this._isScoped=!1,e}emit(t,i,...s){if(this._isSilent)return;if("boolean"!=typeof t&&(s.unshift(i),i=t,t=!1),Array.isArray(this._isSilent)&&this._isSilent.includes(i))return;const r=this._listeners.filter((t=>t.event===i)),n=this._isScoped,o=n?[]:this._listeners.filter((t=>i.startsWith(t.event+"."))),a=t&&!n?this._listeners.filter((t=>t.event.startsWith(i+"."))):[],l=n?[]:this._listeners.filter((t=>"*"===t.event));let c=!1,h=!1,f=!1;const p=()=>{c=!0},_=()=>{h=!0},u=()=>{f=!0},v=r=>{const n={target:i,event:r.event,priority:r.priority,callback:r.callback,broadcast:t,preventDefault:p,stopPropagation:_,stopImmediatePropagation:u,stack:e()};r.once&&this.off(r.event,r.callback),r.callback(n,...s)};for(const t of r){if(c||f)break;v(t)}for(const t of[...a,...o]){if(h||f)break;v(t)}for(const t of l){if(f)break;v(t)}}dispatch(t,s,...r){return new Promise(((n,o)=>{if(this._isSilent||Array.isArray(this._isSilent)&&this._isSilent.includes(s))return n();"boolean"!=typeof t&&([s,t]=[t,!1]);const a=this._listeners.filter((t=>t.event===s)),l=this._isScoped,c=l?[]:this._listeners.filter((t=>s.startsWith(t.event+"."))),h=t&&!l?this._listeners.filter((t=>t.event.startsWith(s+"."))):[],f=l?[]:this._listeners.filter((t=>"*"===t.event));let p=!1,_=!1;const u=()=>{p=!0},v=()=>{},y=()=>{_=!0},b=n=>{const o={target:s,event:n.event,priority:n.priority,callback:n.callback,broadcast:t,preventDefault:u,stopPropagation:v,stopImmediatePropagation:y,stack:e()},a=i(n.callback);return n.once&&this.off(n.event,n.callback),a(o,...r)},d=t=>{let e=0;const i=()=>{if(p||_||e===t.length)return Promise.resolve();const s=t[e++];return b(s).then(i).catch(o)};return i()};d(a).then((()=>d([...h,...c]))).then((()=>d(f))).then(n).catch(o)}))}distribute(t,s,...r){return new Promise(((n,o)=>{if(this._isSilent||Array.isArray(this._isSilent)&&this._isSilent.includes(s))return n();"boolean"!=typeof t&&([s,t]=[t,!1]);const a=this._listeners.filter((t=>t.event===s)),l=this._isScoped,c=l?[]:this._listeners.filter((t=>s.startsWith(t.event+"."))),h=t&&!l?this._listeners.filter((t=>t.event.startsWith(s+"."))):[],f=l?[]:this._listeners.filter((t=>"*"===t.event));let p=!1,_=!1;const u=()=>{p=!0},v=()=>{},y=()=>{_=!0},b=n=>{const o={target:s,event:n.event,priority:n.priority,callback:n.callback,broadcast:t,preventDefault:u,stopPropagation:v,stopImmediatePropagation:y,stack:e()};return n.once&&this.off(n.event,n.callback),i(n.callback)(o,...r)},d=t=>Promise.all(t.map((t=>p||_?Promise.resolve():b(t))));d(a).then((()=>d(c.concat(h)))).then((()=>d(f))).then(n).catch(o)}))}destroy(){this._listeners.length=0}}function e(){const t=new Error;return(t.stack||t.stacktrace).split("\n").slice(2).join("\n")}function i(t){return(...e)=>{try{return Promise.resolve(t(...e))}catch(t){return Promise.reject(t)}}}function s(t){t.sort(((t,e)=>t.priority>e.priority?-1:t.priority<e.priority?1:0))}exports.default=t,exports.eventCenter=t;
