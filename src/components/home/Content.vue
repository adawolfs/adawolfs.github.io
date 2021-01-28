<template>
  <div class="main-title header">
    <h1>
      <span class="site-title">Alvin Estrada</span>
      <span class="site-description">Not an expert!</span>
    </h1>
    <div class="header-icons">
      <a aria-label="Send email" :href="'mailto:' + $global.email">
        <font-awesome-icon
          class="icon"
          :icon="['fas', 'envelope']"
          aria-hidden="true"
        />
      </a>
      <!--a aria-label="My Twitter" target="_blank" href="https://twitter.com/{{site.twitter_username}}"><i class="icon fa fa-twitter" aria-hidden="true"></i></a-->
      <a aria-label="My Github" target="_blank" :href="$global.github">
        <font-awesome-icon
          class="icon"
          :icon="['fab', 'github']"
          aria-hidden="true"
        />
      </a>
      <a aria-label="My Linkedin" target="_blank" :href="$global.linkedin">
        <font-awesome-icon
          class="icon"
          :icon="['fab', 'linkedin']"
          aria-hidden="true"
        />
      </a>
    </div>
    <br />
    <div class="header-links">
      <a
        class="link"
        href="#about"
        @click.prevent
        v-smooth-scroll="{
          updateHistory: false,
        }"
        >About Me</a
      >
      <!--
      <a class="link" href="/blog">Blog</a>
      -->
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
$main: #000;
$sec: #4b5664;
$purple: #54516a;
$cut: 550px;

@import url(https://fonts.googleapis.com/css?family=Montserrat);

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
</style>