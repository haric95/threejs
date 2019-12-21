export class starfield {
  constructor(numStars, radius) {
    let starsGeometry = new THREE.Geometry();
    for (let i = 0; i < numStars; i++) {
      let theta = Math.random() * 2 * Math.PI;
      let phi = Math.random() * 2 * Math.PI;
      let r = radius;
      console.log(r, phi, theta);
      let [x, y, z] = this.polarToCartaesian(theta, phi, r);
      starsGeometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    let starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      map: new THREE.TextureLoader().load(
        "http://127.0.0.1:8887/js/imgs/test.png"
      ),
      alphaTest: 0.5
    });

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
  }
  polarToCartaesian(theta, phi, r) {
    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.sin(phi) * Math.sin(theta);
    let z = r * Math.cos(theta);
    return [x, y, z];
  }
}
