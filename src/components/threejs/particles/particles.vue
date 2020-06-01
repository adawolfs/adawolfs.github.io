<template>
  <div id="threejs-particles">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      container: {},
      camera: {},
      scene: {},
      renderer: {},
      spheres: [],
      lines: [],
      mouseY: 0,
      mouseX: 0,
      totalParticles: 700,
      minSpehereDist: 10,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2
    };
  },
  mounted() {
    this.particlesScript = document.createElement("script");
    this.particlesScript.setAttribute(
      "src",
      process.env.BASE_URL + "particles.js"
    );
    this.particlesScript.setAttribute("id", "particles-script-js");
    this.particlesScript.setAttribute("type", "module");
    document.head.appendChild(this.particlesScript);
  },
  beforeDestroy() {
    const elem = document.getElementById("particles-script-js");
    elem.parentNode.removeChild(elem);
  }
};
</script>

<style>
#threejs-particles {
  background-color: black;
}
</style>