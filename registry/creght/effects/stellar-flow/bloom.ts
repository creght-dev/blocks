const vertex = `attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=(aPosition+1.)*.5;gl_Position=vec4(aPosition,0.,1.);}`
const fragment = `precision mediump float;
varying vec2 vUv;uniform sampler2D uSource;uniform sampler2D uHalo;
uniform vec2 uStep;uniform vec3 uBackground;uniform float uPass,uStrength;
vec3 readLight(vec2 uv){return texture2D(uSource,uv).rgb;}
void main(){
 if(uPass>2.5){vec3 c=texture2D(uSource,vUv).rgb+texture2D(uHalo,vUv).rgb*uStrength;
 gl_FragColor=vec4(uBackground+c,1.);return;}
 if(uPass<.5){
 vec3 c=(readLight(vUv+uStep*vec2(-.5,-.5))+readLight(vUv+uStep*vec2(.5,-.5))
 +readLight(vUv+uStep*vec2(-.5,.5))+readLight(vUv+uStep*vec2(.5,.5)))*.25;
 c*=smoothstep(.16,.65,max(c.r,max(c.g,c.b)));gl_FragColor=vec4(c,1.);return;}
 vec3 c=readLight(vUv)*.227027;
 c+=(readLight(vUv+uStep*1.384615)+readLight(vUv-uStep*1.384615))*.316216;
 c+=(readLight(vUv+uStep*3.230769)+readLight(vUv-uStep*3.230769))*.070270;
 gl_FragColor=vec4(c,1.);
}`

/** Separate screen-space glow lets small sharp stars illuminate their neighbors. */
export function createBloom(gl: WebGLRenderingContext) {
  const shaders: WebGLShader[] = [],
    textures: WebGLTexture[] = [],
    frames: WebGLFramebuffer[] = []
  const program = gl.createProgram()!,
    quad = gl.createBuffer()!
  const dispose = () => {
    shaders.forEach((s) => gl.deleteShader(s))
    textures.forEach((t) => gl.deleteTexture(t))
    frames.forEach((f) => gl.deleteFramebuffer(f))
    gl.deleteBuffer(quad)
    gl.deleteProgram(program)
  }
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const s = gl.createShader(type)!
      shaders.push(s)
      gl.shaderSource(s, source)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) || 'Glow shader compilation failed')
      gl.attachShader(program, s)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Glow shader link failed')
    for (let i = 0; i < 3; i++) {
      textures.push(gl.createTexture()!)
      frames.push(gl.createFramebuffer()!)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  } catch (e) {
    dispose()
    throw e
  }
  const loc = gl.getAttribLocation(program, 'aPosition')
  const u = Object.fromEntries(
    ['Source', 'Halo', 'Step', 'Background', 'Pass', 'Strength'].map((n) => [
      n,
      gl.getUniformLocation(program, 'u' + n),
    ]),
  )
  let width = 1,
    height = 1,
    bw = 1,
    bh = 1
  const resize = (w: number, h: number) => {
    width = w
    height = h
    bw = Math.max(1, Math.ceil(w / 2))
    bh = Math.max(1, Math.ceil(h / 2))
    for (let i = 0; i < 3; i++) {
      gl.bindTexture(gl.TEXTURE_2D, textures[i])
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, i ? bw : w, i ? bh : h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.bindFramebuffer(gl.FRAMEBUFFER, frames[i])
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[i], 0)
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw new Error('Could not allocate the particle glow canvas.')
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  return {
    resize,
    dispose,
    begin() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, frames[0])
      gl.viewport(0, 0, width, height)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
    },
    end(background: number[], strength: number) {
      gl.disable(gl.BLEND)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      gl.uniform1i(u.Source, 0)
      gl.uniform1i(u.Halo, 1)
      gl.uniform3fv(u.Background, background)
      gl.uniform1f(u.Strength, strength * 1.5)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, textures[0])
      for (let pass = 0; pass < 4; pass++) {
        gl.uniform1f(u.Pass, pass)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, textures[pass === 1 ? 1 : pass === 2 ? 2 : 0])
        gl.bindFramebuffer(gl.FRAMEBUFFER, pass === 3 ? null : frames[pass === 1 ? 2 : 1])
        gl.viewport(0, 0, pass === 3 ? width : bw, pass === 3 ? height : bh)
        // These paired Gaussian taps assume adjacent texels. Multiplying their
        // spacing creates separate copies of a point, then a grid after pass 2.
        // Downsample first so both blur axes use the same texel spacing.
        gl.uniform2f(
          u.Step,
          pass === 0 ? 1 / width : pass === 1 ? 1 / bw : 0,
          pass === 0 ? 1 / height : pass === 2 ? 1 / bh : 0,
        )
        if (pass === 3) {
          gl.activeTexture(gl.TEXTURE1)
          gl.bindTexture(gl.TEXTURE_2D, textures[1])
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      gl.activeTexture(gl.TEXTURE0)
    },
  }
}
