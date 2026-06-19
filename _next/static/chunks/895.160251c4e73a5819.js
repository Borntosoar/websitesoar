(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[895],{257:function(e,t,r){"use strict";var n,o;e.exports=(null==(n=r.g.process)?void 0:n.env)&&"object"==typeof(null==(o=r.g.process)?void 0:o.env)?r.g.process:r(4227)},4227:function(e){!function(){var t={229:function(e){var t,r,n,o=e.exports={};function i(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function u(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var s=[],c=!1,l=-1;function v(){c&&n&&(c=!1,n.length?s=n.concat(s):l=-1,s.length&&f())}function f(){if(!c){var e=u(v);c=!0;for(var t=s.length;t;){for(n=s,s=[];++l<t;)n&&n[l].run();l=-1,t=s.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function d(){}o.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new m(e,t)),1!==s.length||c||u(f)},m.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=d,o.addListener=d,o.once=d,o.off=d,o.removeListener=d,o.removeAllListeners=d,o.emit=d,o.prependListener=d,o.prependOnceListener=d,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}},a=!0;try{t[e](i,i.exports,n),a=!1}finally{a&&delete r[e]}return i.exports}n.ab="//";var o=n(229);e.exports=o}()},119:function(e,t,r){"use strict";r.r(t),r.d(t,{BoxChapterScene:function(){return w},LOOP:function(){return d}});var n=r(7437),o=r(9285),i=r(961),a=r(1119),u=r(2265),s=r(1448);let c={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},l={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},v=u.forwardRef(({scale:e=10,frames:t=1/0,opacity:r=1,width:n=1,height:i=1,blur:v=1,near:f=0,far:m=10,resolution:d=512,smooth:h=!0,color:p="#000000",depthWrite:x=!1,renderOrder:g,...y},M)=>{let w,D;let U=u.useRef(null),j=(0,o.D)(e=>e.scene),b=(0,o.D)(e=>e.gl),T=u.useRef(null);n*=Array.isArray(e)?e[0]:e||1,i*=Array.isArray(e)?e[1]:e||1;let[V,S,R,E,L,C,k]=u.useMemo(()=>{let e=new s.WebGLRenderTarget(d,d),t=new s.WebGLRenderTarget(d,d);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new s.PlaneGeometry(n,i).rotateX(Math.PI/2),o=new s.Mesh(r),a=new s.MeshDepthMaterial;a.depthTest=a.depthWrite=!1,a.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new s.Color(p)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let u=new s.ShaderMaterial(c),v=new s.ShaderMaterial(l);return v.depthTest=u.depthTest=!1,[e,r,a,o,u,v,t]},[d,n,i,e,p]),B=e=>{E.visible=!0,E.material=L,L.uniforms.tDiffuse.value=V.texture,L.uniforms.h.value=1*e/256,b.setRenderTarget(k),b.render(E,T.current),E.material=C,C.uniforms.tDiffuse.value=k.texture,C.uniforms.v.value=1*e/256,b.setRenderTarget(V),b.render(E,T.current),E.visible=!1},A=0;return(0,o.F)(()=>{T.current&&(t===1/0||A<t)&&(A++,w=j.background,D=j.overrideMaterial,U.current.visible=!1,j.background=null,j.overrideMaterial=R,b.setRenderTarget(V),b.render(j,T.current),B(v),h&&B(.4*v),b.setRenderTarget(null),U.current.visible=!0,j.overrideMaterial=D,j.background=w)}),u.useImperativeHandle(M,()=>U.current,[]),u.createElement("group",(0,a.Z)({"rotation-x":Math.PI/2},y,{ref:U}),u.createElement("mesh",{renderOrder:g,geometry:S,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},u.createElement("meshBasicMaterial",{transparent:!0,map:V.texture,opacity:r,depthWrite:x})),u.createElement("orthographicCamera",{ref:T,args:[-n/2,n/2,i/2,-i/2,f,m]}))});var f=r(9344),m=r(2357);let d=15,h=(e,t,r)=>{let n=Math.min(1,Math.max(0,(r-e)/(t-e)));return n*n*(3-2*n)};function p(e){let{onWord:t}=e,{cells:r,step:i}=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1.6,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:7;return(0,u.useMemo)(()=>{let r=[],n=e/2,o=e/t,i=-n+o/2;return[{n:new s.Vector3(0,0,1),u:new s.Vector3(1,0,0),v:new s.Vector3(0,1,0)},{n:new s.Vector3(0,0,-1),u:new s.Vector3(-1,0,0),v:new s.Vector3(0,1,0)},{n:new s.Vector3(1,0,0),u:new s.Vector3(0,0,-1),v:new s.Vector3(0,1,0)},{n:new s.Vector3(-1,0,0),u:new s.Vector3(0,0,1),v:new s.Vector3(0,1,0)},{n:new s.Vector3(0,1,0),u:new s.Vector3(1,0,0),v:new s.Vector3(0,0,-1)},{n:new s.Vector3(0,-1,0),u:new s.Vector3(1,0,0),v:new s.Vector3(0,0,1)}].forEach(e=>{for(let a=0;a<t;a++)for(let u=0;u<t;u++){let t=i+a*o,c=i+u*o,l=new s.Vector3().addScaledVector(e.u,t).addScaledVector(e.v,c).addScaledVector(e.n,n);r.push({pos:l,nor:e.n.clone(),rand:Math.random()})}}),{cells:r,step:o}},[e,t])}(1.6,7),a=(0,u.useRef)(null),c=(0,u.useRef)(null),l=(0,u.useRef)(null),v=(0,u.useRef)(-1),f=(0,u.useMemo)(()=>new s.Object3D,[]),m=(0,u.useMemo)(()=>new s.BoxGeometry(1,1,1),[]),p=(0,u.useMemo)(()=>new s.MeshStandardMaterial({color:"#0a0a0a",roughness:.45,metalness:.15}),[]);return(0,o.F)(e=>{let{clock:n}=e,o=a.current;if(!o)return;let u=n.getElapsedTime(),s=u%d/d,m=h(0,.5,s)*(1-h(.82,1,s)),p=h(.55,.74,s)*(1-h(.86,.99,s)),x=Math.pow(Math.max(0,Math.sin(2.4*u)),3),g=(.006+.022*m)*(1-p);for(let e=0;e<r.length;e++){let t=r[e],n=x*(.03+.05*m),a=p*(1.4+2.6*t.rand);f.position.set(t.pos.x+t.nor.x*n+Math.sin(30*u+99*t.rand)*g+(t.rand-.5)*p*1.4,t.pos.y+t.nor.y*n+a*a*.7,t.pos.z+t.nor.z*n+Math.cos(27*u+70*t.rand)*g+(t.rand-.5)*p*1.4);let s=.82*i*(1-Math.min(1,p*(t.rand+.25)));f.scale.setScalar(Math.max(0,s)),f.rotation.set(p*t.rand*6,p*t.rand*5,0),f.updateMatrix(),o.setMatrixAt(e,f.matrix)}o.instanceMatrix.needsUpdate=!0,o.position.x=.02*Math.sin(31*u)*(.3+m),o.position.z=.02*Math.cos(23*u)*(.3+m),l.current&&(l.current.intensity=1.2+x*(3+6*m)+120*p),c.current&&c.current.scale.setScalar(.18+.05*x*m+30*p);let y=s<.17?0:s<.33?1:s<.5?2:s<.62?3:s<.8?4:5;y!==v.current&&(v.current=y,t(y))}),(0,n.jsxs)("group",{position:[0,.05,0],children:[(0,n.jsx)("instancedMesh",{ref:a,args:[m,p,r.length],castShadow:!0}),(0,n.jsxs)("mesh",{ref:c,children:[(0,n.jsx)("sphereGeometry",{args:[1,24,24]}),(0,n.jsx)("meshBasicMaterial",{color:"#ffffff",toneMapped:!1})]}),(0,n.jsx)("pointLight",{ref:l,color:"#ffffff",intensity:1.2,distance:9,decay:1.4})]})}function x(e){let t=new s.BufferGeometry;return t.setAttribute("position",new s.Float32BufferAttribute([0,0,0,1.2*e,.06,-.12,.32*e,0,-.7],3)),t.setIndex([0,1,2]),t.computeVertexNormals(),t}function g(){let e=(0,u.useRef)(null),t=(0,u.useRef)(null),r=(0,u.useRef)(null),i=(0,u.useMemo)(()=>x(1),[]),a=(0,u.useMemo)(()=>x(-1),[]),c=(0,u.useMemo)(()=>new s.MeshStandardMaterial({color:"#0a0a0a",roughness:.6,side:s.DoubleSide,transparent:!0}),[]);return(0,o.F)(n=>{let{clock:o}=n,i=o.getElapsedTime(),a=i%d/d,u=h(.7,.78,a),s=h(.72,.96,a),l=1-h(.88,.98,a);e.current&&(e.current.scale.setScalar(u*l),e.current.position.set(0,.1+9*s,.4*s),e.current.rotation.x=-.4-.2*s,e.current.rotation.y=.16*Math.sin(1.6*i));let v=.7*Math.sin(18*i);t.current&&(t.current.rotation.z=v),r.current&&(r.current.rotation.z=-v),c.opacity=l}),(0,n.jsxs)("group",{ref:e,scale:0,position:[0,.1,0],children:[(0,n.jsx)("mesh",{ref:t,geometry:i,material:c}),(0,n.jsx)("mesh",{ref:r,geometry:a,material:c})]})}function y(e){let{children:t}=e,r=(0,u.useRef)(null),{pointer:i}=(0,o.D)();return(0,o.F)(()=>{r.current&&(r.current.rotation.y=s.MathUtils.lerp(r.current.rotation.y,.18*i.x,.04),r.current.rotation.x=s.MathUtils.lerp(r.current.rotation.x,-(.08*i.y),.04))}),(0,n.jsx)("group",{ref:r,children:t})}function M(e){let{onWord:t}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[30,32,32]}),(0,n.jsx)("meshBasicMaterial",{color:"#f1f1f1",side:s.BackSide,toneMapped:!1})]}),(0,n.jsx)("ambientLight",{intensity:.55}),(0,n.jsx)("spotLight",{position:[2.5,6,4],angle:.5,penumbra:.8,intensity:2.4,color:"#ffffff",castShadow:!0}),(0,n.jsx)("directionalLight",{position:[-4,3,-3],intensity:.6,color:"#ffffff"}),(0,n.jsx)(v,{position:[0,-.82,0],opacity:.5,scale:9,blur:2.4,far:4,color:"#000000"}),(0,n.jsxs)(y,{children:[(0,n.jsx)(p,{onWord:t}),(0,n.jsx)(g,{})]})]})}function w(e){let{active:t,onWord:r}=e;return(0,n.jsxs)(i.Xz,{shadows:!0,frameloop:t?"always":"never",camera:{position:[0,.55,6],fov:42},gl:{antialias:!0},dpr:[1,2],children:[(0,n.jsx)(M,{onWord:r}),(0,n.jsx)(f.x,{children:(0,n.jsx)(m.d,{intensity:1,luminanceThreshold:.9,luminanceSmoothing:.4,mipmapBlur:!0,radius:.8})})]})}},1119:function(e,t,r){"use strict";function n(){return(n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(null,arguments)}r.d(t,{Z:function(){return n}})}}]);