<template>
  <div class="wrap-banner">
    <Particles2D
      color="#ffffff"
      :particleOpacity="1"
      linesColor="#ffffff"
      :particlesNumber="69"
      shapeType="polygon"
      :particleSize="2"
      :linesWidth="0.6"
      :lineLinked="true"
      :lineOpacity="1"
      :linesDistance="100"
      :moveSpeed="6"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      v-if="background=='2d'"
    >
      <HeaderContent></HeaderContent>
    </Particles2D>
    <Particles3D v-else>
      <HeaderContent></HeaderContent>
    </Particles3D>
    <a
      class="down"
      href="#about"
      @click.prevent
      v-smooth-scroll="{
            updateHistory: false
          }"
    >
      <font-awesome-icon class="icon" :icon="['fa', 'chevron-down']" aria-hidden="true" />
    </a>
  </div>
</template>

<script>
import Particles2D from "@/components/vue-particles/vue-particles.vue";
import Particles3D from "@/components/threejs/particles/particles.vue";
import HeaderContent from "@/components/home/Content.vue";

export default {
  name: "Header",
  data: () => ({
    background: "3d"
    // email: __GLOBAL__.email
  }),
  components: {
    HeaderContent,
    Particles2D,
    Particles3D
  },
  methods: {
    changeBackground: function() {
      this.background == "2d"
        ? (this.background = "3d")
        : (this.background = "2d");
    }
  }
};
</script>

<style lang="scss">
$main: #000;
$sec: #4b5664;
$purple: #54516a;
$cut: 550px;

@import url(https://fonts.googleapis.com/css?family=Montserrat);
html {
  line-height: 1.15;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

.particles-js {
  /* background-image: url("/img/space.jpg"); */
  background-color: black;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes pulse {
  0%,
  to {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
    filter: alpha(opacity=40);
    /* opacity:.4; */
    /* top:0; */
  }

  50% {
    -ms-filter: none;
    -webkit-filter: none;
    filter: none;
    opacity: 1;
    top: -10px;
  }
}
.down {
  color: #fff;
  position: absolute;
  bottom: 50px;
  width: 100%;
  margin: 0 auto;
  display: block;
  text-align: center;
  font-size: 30px;
  cursor: pointer;
  .icon {
    position: absolute;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    fill: #fff;
    -webkit-animation: pulse 1.3s infinite;
    animation: pulse 1.3s infinite;
    &:hover {
      color: $sec;
    }
    &:active {
      color: $sec;
    }
  }
}
</style>