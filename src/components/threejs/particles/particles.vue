<template>
  <div id="threejs-particles">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>


export default {
  data : function() {
    return {
      container: {},
      camera: {},
      scene: {}, 
      renderer: {},
      spheres: [],
      lines : [],
      mouseY : 0,
      mouseX : 0,
      totalParticles : 700,
      minSpehereDist : 10,
      windowHalfX : window.innerWidth / 2,
      windowHalfY : window.innerHeight / 2,
    }
  },
  mounted(){
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://localhost:8080/js/particles.js')
    recaptchaScript.setAttribute('type', 'module')
    document.head.appendChild(recaptchaScript)
    
  }
}
</script>

<style>
 #threejs-particles {
   background-color: black;
 }
</style>