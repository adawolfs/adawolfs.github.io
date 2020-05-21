<template>
  <div class="wrap-banner">
    <vue-particles
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
    >
      <div class="main-title header">
        <h1>
          <span class="site-title">Alvin Estrada</span>
          <span class="site-description">DevOps & Software Developer</span>
        </h1>
        <div class="header-icons">
          <a aria-label="Send email" :href="'mailto:' + $global.email">
            <font-awesome-icon class="icon" :icon="['fas', 'envelope']" aria-hidden="true" />
          </a>
          <!--a aria-label="My Twitter" target="_blank" href="https://twitter.com/{{site.twitter_username}}"><i class="icon fa fa-twitter" aria-hidden="true"></i></a-->
          <a aria-label="My Github" target="_blank" :href="$global.github">
            <font-awesome-icon class="icon" :icon="['fab', 'github']" aria-hidden="true" />
          </a>
          <a aria-label="My Linkedin" target="_blank" :href="$global.linkedin">
            <font-awesome-icon class="icon" :icon="['fab', 'linkedin']" aria-hidden="true" />
          </a>
        </div>
        <br />
        <div class="header-links">
          <a
            class="link"
            href="#about"
            @click.prevent
            v-smooth-scroll="{
            updateHistory: false
          }"
          >About Me</a>
          <a class="link" href="/blog">Blog</a>
        </div>
      </div>
    </vue-particles>
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
import VueParticles from "@/components/vue-particles/vue-particles.vue";

export default {
  name: "Header",
  data: () => ({
    // email: __GLOBAL__.email
  }),
  components: {
    VueParticles
  },
  methods: {}
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

.main-title {
  padding-top: 120px;
  color: #fff;
}

@media only screen and (min-width: 550px) {
  .site-title {
    margin: 0;
    font-size: 100px;
  }
  .site-description {
    font-size: 40px;
  }
  h1 > span {
    display: block;
  }
}
h1 {
  span {
    font-weight: bold;
  }
}
.header {
  z-index: 1;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  .site-title {
    font-size: 50px;
    display: block;
    line-height: 1;
    color: #fff;
    @media only screen and (min-width: $cut) {
      margin: 0;
      font-size: 100px;
    }
  }
  .site-description {
    font-size: 20px;
    display: block;
    line-height: 1;
    color: #fff;
    margin-top: 10px;
    @media only screen and (min-width: $cut) {
      font-size: 40px;
    }
  }
}

.header-links {
  margin: 10px;
  .link {
    color: #fff;
    text-decoration: none;
    font-size: 15px;
    margin: 10px;
    @media only screen and (min-width: $cut) {
      font-size: 20px;
    }
  }
}

.header-icons {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  .icon {
    text-align: center;
    color: #fff;
    width: 20px;
    height: 20px;
    font-size: 20px;
    padding: 10px;
    margin: 5px;
    border-radius: 50%;
    border: 2px solid #fff;
    transition: all 0.7s;
    &:hover {
      color: $main;
      background: #fff;
    }
    &:active {
      color: $main;
      background: #fff;
    }
    @media only screen and (min-width: $cut) {
      width: 60px;
      height: 60px;
      font-size: 60px;
    }

    @media only screen and (max-width: $cut) {
      width: 40px;
      height: 40px;
      font-size: 40px;
    }
  }
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