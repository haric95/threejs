export function vertexShader() {
  return `
    varying vec3 vUv;
    void main() {
        vUv = position;
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition * 1.0;
    }
    `;
}

export function fragmentShader() {
  return `
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vUv;
    void main() {
        gl_FragColor = vec4(mix(colorB, colorA, vUv.z), 1.0);
        if
    }
    `;
}

// export function rectangle() {
//   return `
//   void rect(vec2 st, vec2 origin, float width, float height, out float outputty) {
//     vec2 bl = step(origin, st);
//     float pct = bl.x * bl.y;

//     vec2 tr = step(1.0-origin-vec2(width, height), 1.0-st);
//     pct *= tr.x * tr.y;
//     outputty = pct;
// }
//   `;
// }
