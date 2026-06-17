(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[716],{1057:function(e,t,r){"use strict";r.d(t,{j:function(){return c}});var n=r(1119),o=r(2265),i=r(1448),s=r(9285);let a={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
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
  `},u={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
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
  `},c=o.forwardRef(({scale:e=10,frames:t=1/0,opacity:r=1,width:c=1,height:l=1,blur:f=1,near:v=0,far:h=10,resolution:m=512,smooth:d=!0,color:p="#000000",depthWrite:x=!1,renderOrder:g,...y},M)=>{let w,D;let U=o.useRef(null),j=(0,s.D)(e=>e.scene),b=(0,s.D)(e=>e.gl),T=o.useRef(null);c*=Array.isArray(e)?e[0]:e||1,l*=Array.isArray(e)?e[1]:e||1;let[V,S,R,k,E,L,z]=o.useMemo(()=>{let e=new i.WebGLRenderTarget(m,m),t=new i.WebGLRenderTarget(m,m);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let r=new i.PlaneGeometry(c,l).rotateX(Math.PI/2),n=new i.Mesh(r),o=new i.MeshDepthMaterial;o.depthTest=o.depthWrite=!1,o.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new i.Color(p)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let s=new i.ShaderMaterial(a),f=new i.ShaderMaterial(u);return f.depthTest=s.depthTest=!1,[e,r,o,n,s,f,t]},[m,c,l,e,p]),A=e=>{k.visible=!0,k.material=E,E.uniforms.tDiffuse.value=V.texture,E.uniforms.h.value=1*e/256,b.setRenderTarget(z),b.render(k,T.current),k.material=L,L.uniforms.tDiffuse.value=z.texture,L.uniforms.v.value=1*e/256,b.setRenderTarget(V),b.render(k,T.current),k.visible=!1},B=0;return(0,s.F)(()=>{T.current&&(t===1/0||B<t)&&(B++,w=j.background,D=j.overrideMaterial,U.current.visible=!1,j.background=null,j.overrideMaterial=R,b.setRenderTarget(V),b.render(j,T.current),A(f),d&&A(.4*f),b.setRenderTarget(null),U.current.visible=!0,j.overrideMaterial=D,j.background=w)}),o.useImperativeHandle(M,()=>U.current,[]),o.createElement("group",(0,n.Z)({"rotation-x":Math.PI/2},y,{ref:U}),o.createElement("mesh",{renderOrder:g,geometry:S,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},o.createElement("meshBasicMaterial",{transparent:!0,map:V.texture,opacity:r,depthWrite:x})),o.createElement("orthographicCamera",{ref:T,args:[-c/2,c/2,l/2,-l/2,v,h]}))})},257:function(e,t,r){"use strict";var n,o;e.exports=(null==(n=r.g.process)?void 0:n.env)&&"object"==typeof(null==(o=r.g.process)?void 0:o.env)?r.g.process:r(4227)},4227:function(e){!function(){var t={229:function(e){var t,r,n,o=e.exports={};function i(){throw Error("setTimeout has not been defined")}function s(){throw Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{r="function"==typeof clearTimeout?clearTimeout:s}catch(e){r=s}}();var u=[],c=!1,l=-1;function f(){c&&n&&(c=!1,n.length?u=n.concat(u):l=-1,u.length&&v())}function v(){if(!c){var e=a(f);c=!0;for(var t=u.length;t;){for(n=u,u=[];++l<t;)n&&n[l].run();l=-1,t=u.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===s||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new h(e,t)),1!==u.length||c||a(v)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}},s=!0;try{t[e](i,i.exports,n),s=!1}finally{s&&delete r[e]}return i.exports}n.ab="//";var o=n(229);e.exports=o}()},8914:function(e,t,r){"use strict";r.r(t),r.d(t,{BreakthroughScene:function(){return p}});var n=r(7437),o=r(9285),i=r(961),s=r(1057),a=r(9344),u=r(2357),c=r(2265),l=r(1448);function f(e){let{boost:t}=e,{cells:r,step:i}=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1.6,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:7;return(0,c.useMemo)(()=>{let r=[],n=e/2,o=e/t,i=-n+o/2;return[{n:new l.Vector3(0,0,1),u:new l.Vector3(1,0,0),v:new l.Vector3(0,1,0)},{n:new l.Vector3(0,0,-1),u:new l.Vector3(-1,0,0),v:new l.Vector3(0,1,0)},{n:new l.Vector3(1,0,0),u:new l.Vector3(0,0,-1),v:new l.Vector3(0,1,0)},{n:new l.Vector3(-1,0,0),u:new l.Vector3(0,0,1),v:new l.Vector3(0,1,0)},{n:new l.Vector3(0,1,0),u:new l.Vector3(1,0,0),v:new l.Vector3(0,0,-1)},{n:new l.Vector3(0,-1,0),u:new l.Vector3(1,0,0),v:new l.Vector3(0,0,1)}].forEach(e=>{for(let s=0;s<t;s++)for(let a=0;a<t;a++){let t=i+s*o,u=i+a*o,c=new l.Vector3().addScaledVector(e.u,t).addScaledVector(e.v,u).addScaledVector(e.n,n);r.push({pos:c,nor:e.n.clone(),rand:Math.random()})}}),{cells:r,step:o}},[e,t])}(1.6,7),s=(0,c.useRef)(null),a=(0,c.useRef)(null),u=(0,c.useRef)(null),f=(0,c.useMemo)(()=>new l.Object3D,[]),v=(0,c.useMemo)(()=>new l.Vector3,[]),h=(0,c.useMemo)(()=>new l.BoxGeometry(1,1,1),[]),m=(0,c.useMemo)(()=>new l.MeshStandardMaterial({color:"#0b0b0b",roughness:.38,metalness:.22}),[]);return(0,o.F)(e=>{let{clock:n}=e,o=s.current;if(!o)return;let c=n.getElapsedTime(),l=t.current,h=(.6*Math.pow(Math.max(0,Math.sin(1.7*c)),2)+.4*Math.pow(Math.max(0,Math.sin(2.6*c+1.3)),4))*(.35+.65*(.5+.5*Math.sin(.9*c))),m=.009*(.4+h);for(let e=0;e<r.length;e++){let t=r[e],n=1-l,s=.06*h*n,a=v.copy(t.pos).normalize(),u=l*(1.6+2.8*t.rand);f.position.set(t.pos.x+a.x*u+(t.nor.x*s+Math.sin(30*c+99*t.rand)*m)*n+(t.rand-.5)*.2*l,t.pos.y+a.y*u+.9*u+t.nor.y*s*n,t.pos.z+a.z*u+(t.nor.z*s+Math.cos(27*c+70*t.rand)*m)*n+(t.rand-.5)*.2*l);let d=.82*i*Math.max(0,1-l*(.7+.55*t.rand));f.scale.setScalar(d),f.rotation.set(l*t.rand*8,l*t.rand*7,l*t.rand*4),f.updateMatrix(),o.setMatrixAt(e,f.matrix)}o.instanceMatrix.needsUpdate=!0,o.position.x=.02*Math.sin(31*c)*(.3+h)*(1-l),o.position.z=.02*Math.cos(23*c)*(.3+h)*(1-l),u.current&&(u.current.intensity=1.3+7*h+140*l);let d=Math.max(0,(l-.6)/.4);a.current&&a.current.scale.setScalar(.06+.05*h+d*d*(3-2*d)*26)}),(0,n.jsxs)("group",{position:[0,.05,0],children:[(0,n.jsx)("instancedMesh",{ref:s,args:[h,m,r.length],castShadow:!0}),(0,n.jsxs)("mesh",{ref:a,children:[(0,n.jsx)("sphereGeometry",{args:[1,24,24]}),(0,n.jsx)("meshBasicMaterial",{color:"#ffffff",toneMapped:!1})]}),(0,n.jsx)("pointLight",{ref:u,color:"#ffffff",intensity:1.5,distance:9,decay:1.4})]})}function v(e){let t=new l.BufferGeometry,r=new Float32Array([0,0,.12,0,0,-.22,.5*e,0,.02,.55*e,0,-.28,1.05*e,.05,-.04,1*e,.04,-.3]);return t.setAttribute("position",new l.BufferAttribute(r,3)),t.setIndex([0,2,1,1,2,3,2,4,3,3,4,5]),t.computeVertexNormals(),t}function h(e){let{boost:t}=e,r=(0,c.useRef)(null),i=(0,c.useRef)(null),s=(0,c.useRef)(null),a=(0,c.useMemo)(()=>v(1),[]),u=(0,c.useMemo)(()=>v(-1),[]),f=(0,c.useMemo)(()=>new l.MeshStandardMaterial({color:"#080808",roughness:.5,metalness:.1,side:l.DoubleSide,transparent:!0}),[]);return(0,o.F)(e=>{let{clock:n}=e,o=t.current,a=n.getElapsedTime(),u=1-o;r.current&&(r.current.scale.setScalar(.34+.85*o),r.current.position.set(.16*Math.sin(7*a)*u+.2*Math.sin(.9*a)*o,.05+9*Math.pow(o,1.3),.11*Math.cos(6.3*a)*u+.7*o),r.current.rotation.x=-.18*o-.12*Math.sin(5*a)*u,r.current.rotation.z=.2*Math.sin(1.2*a)*o+.14*Math.sin(9*a)*u,r.current.rotation.y=.14*Math.sin(.8*a)*o+.22*Math.sin(4.5*a)*u,f.opacity=o>.9?Math.max(0,1-(o-.9)/.1):1);let c=Math.sin(a*(14+10*u)),l=.5+.9*c;i.current&&(i.current.rotation.z=l,i.current.rotation.y=.1*c),s.current&&(s.current.rotation.z=-l,s.current.rotation.y=-(.1*c))}),(0,n.jsxs)("group",{ref:r,scale:.34,position:[0,.05,0],children:[(0,n.jsx)("mesh",{material:f,scale:[.16,.16,.5],children:(0,n.jsx)("sphereGeometry",{args:[1,16,12]})}),(0,n.jsx)("mesh",{material:f,position:[0,.03,.42],scale:.12,children:(0,n.jsx)("sphereGeometry",{args:[1,14,12]})}),(0,n.jsx)("mesh",{material:f,position:[0,0,-.5],rotation:[.18,0,0],scale:[.2,.02,.24],children:(0,n.jsx)("boxGeometry",{args:[1,1,1]})}),(0,n.jsx)("group",{ref:i,position:[.05,.02,0],children:(0,n.jsx)("mesh",{geometry:a,material:f})}),(0,n.jsx)("group",{ref:s,position:[-.05,.02,0],children:(0,n.jsx)("mesh",{geometry:u,material:f})})]})}function m(e){let{children:t}=e,r=(0,c.useRef)(null),{pointer:i}=(0,o.D)();return(0,o.F)(()=>{r.current&&(r.current.rotation.y=l.MathUtils.lerp(r.current.rotation.y,.22*i.x,.04),r.current.rotation.x=l.MathUtils.lerp(r.current.rotation.x,-(.1*i.y),.04))}),(0,n.jsx)("group",{ref:r,children:t})}function d(e){let{unlocked:t}=e,r=(0,c.useRef)(0),i=(0,c.useRef)(null);return(0,o.F)(e=>{if(t){null===i.current&&(i.current=e.clock.elapsedTime);let t=Math.min(1,(e.clock.elapsedTime-i.current)/3);r.current=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}else r.current=0,i.current=null}),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[30,32,32]}),(0,n.jsx)("meshBasicMaterial",{color:"#f0f0f0",side:l.BackSide,toneMapped:!1})]}),(0,n.jsx)("ambientLight",{intensity:.5}),(0,n.jsx)("spotLight",{position:[3,6.5,4.5],angle:.5,penumbra:1,intensity:2.6,color:"#ffffff",castShadow:!0,"shadow-mapSize":[1024,1024],"shadow-bias":-.0002}),(0,n.jsx)("directionalLight",{position:[-3,4,-5],intensity:1.1,color:"#ffffff"}),(0,n.jsx)("directionalLight",{position:[0,-2,4],intensity:.25,color:"#ffffff"}),(0,n.jsx)(s.j,{position:[0,-.82,0],opacity:.42,scale:11,blur:3,far:4.5,resolution:512,color:"#000000"}),(0,n.jsxs)(m,{children:[(0,n.jsx)(f,{boost:r}),(0,n.jsx)(h,{boost:r})]})]})}function p(e){let{unlocked:t=!1}=e;return(0,n.jsxs)(i.Xz,{shadows:!0,camera:{position:[0,.5,5.9],fov:40},gl:{antialias:!0},dpr:[1,2],children:[(0,n.jsx)(d,{unlocked:t}),(0,n.jsx)(a.x,{children:(0,n.jsx)(u.d,{intensity:1,luminanceThreshold:.9,luminanceSmoothing:.4,mipmapBlur:!0,radius:.85})})]})}}}]);