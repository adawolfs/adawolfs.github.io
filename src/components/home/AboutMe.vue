<template>
  <section id="about" class="wrap-banner">
    <div class="content">
      <div class="icon" role="presentation" alt></div>
      <h1>Incognito?</h1>
      <input
        v-b-visible="focusInput"
        v-model="script"
        v-on:keyup.enter="onEnter"
        type="text"
        ref="magicInput"
        class="magic-input"
      />
      <p id="subtitle">
        <span>I'm a FullStack Developer with experience creating DevOps Pipelines</span>
        <br />
        <span>Organizer of Kubernetes Guatemala an official CNCF Meetup</span>
        <br />
        <span>Founder member of AI Guatemala</span>
        <br />
        <!-- <span>I'm not an expert but I have watched a lot of Youtube Videos.</span> -->
        <!-- <a
          class="learn-more-button"
          href="https://support.google.com/chrome/?p=incognito"
        >Learn more</a>-->
      </p>
      <div id="bulletpoints-wrapper">
        <div class="bulletpoints first">
          Developer Skills:
          <ul>
            <li>Android, Flutter</li>
            <li>Laravel, Django, Rails</li>
            <li>Vue, React</li>
          </ul>
        </div>
        <div class="bulletpoints">
          Languages Skills:
          <ul>
            <li>Go, Python, Kotlin</li>
            <li>TypeScript, Dart</li>
            <li>Java</li>
          </ul>
        </div>
        <div class="bulletpoints">
          System Administrator Skills:
          <ul>
            <li>Kubernetes, Docker</li>
            <li>Openshift Administrator</li>
            <li>Linux Administrator</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AboutMe",
  data: () => ({
    script: ""
  }),
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    focusInput(isVisible) {
      if (isVisible) {
        if (!this.script) {
          this.typeScriptText(
            "I am not an expert but I've watched a lot of youtube videos!",
            100,
            0
          );
        }
        this.$refs["magicInput"].focus();
      }
    },
    typeScriptText(text, delay, i) {
      if (i < text.length) {
        this.script += text.charAt(i);
        i++;
        setTimeout(this.typeScriptText, delay, text, delay, i);
      }
    },
    onEnter() {
      command = this.script;
      switch (command) {
        case "hola":
          this.script = "adios";
          break;
        case "time":
          this.script = new Date();
          break;
        case "ping":
          this.script = "pong";
        case "beer":
          this.script = "mmmmm beeeer!";
        default:
          this.script = "";
      }
    }
  }
};
</script>

<style scoped>
[hidden] {
  display: none !important;
}

.magic-input {
  outline: none;
  max-width: 100%;
  min-width: 100%;
  text-align: center;
  background: transparent;
  border: none;
  color: white;
}
/** Typography -------------------------------------------------------------- */
.wrap-banner {
  align-items: baseline;
  background-color: rgb(53, 54, 58);
}
.content {
  /* This is identical to the default background color. It's necessary to set it
     for the case when a theme with a background image is installed. */
  background-color: rgb(53, 54, 58);
  color: rgb(232, 234, 237); /* --google-grey-200 */
  font-size: calc(100% - 2px);
  line-height: calc(100% + 6px);
  min-width: 240px;
  width: 100%;
  margin-top: 10%;
}

h1 {
  font-size: calc(100% + 8px);
  font-weight: 400;
  line-height: calc(100% + 8px);
}

em {
  color: white;
  font-style: normal;
}

.learn-more-button {
  color: rgb(138, 180, 248);
  text-decoration: none;
}

/* Small font on small screens. */
@media (max-width: 240px), (max-height: 320px) {
  .content {
    font-size: calc(100% - 4px);
    line-height: calc(100% + 6px);
  }

  h1 {
    font-size: calc(100% + 4px);
    line-height: calc(100% + 4px);
  }
}

/** Icon -------------------------------------------------------------------- */

.icon {
  content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAwYzMzLjEzNyAwIDYwIDI2Ljg2MyA2MCA2MHMtMjYuODYzIDYwLTYwIDYwUzAgOTMuMTM3IDAgNjAgMjYuODYzIDAgNjAgMHptMTcuNSA2NC44MzdjLTYuNDU2IDAtMTEuODIyIDQuNTAyLTEzLjIyMiAxMC41MTYtMy4yNjctMS4zOTctNi4zLTEuMDA5LTguNTU2LS4wMzlDNTQuMjgzIDY5LjMgNDguOTE3IDY0LjgzNyA0Mi41IDY0LjgzN2MtNy41MDYgMC0xMy42MTEgNi4wOTItMTMuNjExIDEzLjU4MkMyOC44ODkgODUuOTA4IDM0Ljk5NCA5MiA0Mi41IDkyYzcuMTU2IDAgMTIuOTUtNS41MSAxMy40OTQtMTIuNDk1IDEuMTY3LS44MTUgNC4yNC0yLjMyOCA4LjAxMi4wNzhDNjQuNjI4IDg2LjUyOSA3MC4zODMgOTIgNzcuNSA5MmM3LjUwNiAwIDEzLjYxMS02LjA5MiAxMy42MTEtMTMuNTgxIDAtNy40OS02LjEwNS0xMy41ODItMTMuNjExLTEzLjU4MnptLTM1IDMuODhjNS4zNjcgMCA5LjcyMiA0LjM0NyA5LjcyMiA5LjcwMiAwIDUuMzU1LTQuMzU1IDkuNy05LjcyMiA5LjctNS4zNjcgMC05LjcyMi00LjM0NS05LjcyMi05LjcgMC01LjM1NSA0LjM1NS05LjcwMSA5LjcyMi05LjcwMXptMzUgMGM1LjM2NyAwIDkuNzIyIDQuMzQ3IDkuNzIyIDkuNzAyIDAgNS4zNTUtNC4zNTUgOS43LTkuNzIyIDkuNy01LjM2NyAwLTkuNzIyLTQuMzQ1LTkuNzIyLTkuNyAwLTUuMzU1IDQuMzU1LTkuNzAxIDkuNzIyLTkuNzAxek05NSA1N0gyNXY0aDcwdi00ek03Mi44NzQgMjkuMzRjLS44LTEuODItMi44NjYtMi43OC00Ljc4NS0yLjE0M0w2MCAyOS45MTRsLTguMTI4LTIuNzE3LS4xOTItLjA1OGMtMS45MjgtLjUzMy0zLjk1NC41MS00LjY2OSAyLjM4N0wzOC4xNDQgNTNoNDMuNzEyTDcyLjk1IDI5LjUyNnoiIGZpbGw9IiNEQURDRTAiLz48L2c+PC9zdmc+);
  height: 120px;
  width: 120px;
}

/* Medium-sized icon on medium-sized screens. */
@media (max-height: 480px), (max-width: 720px) {
  .icon {
    height: 72px;
    width: 72px;
  }
}

/* Very small icon on very small screens. */
@media (max-width: 720px) {
  @media (max-width: 240px), (max-height: 480px) {
    .icon {
      height: 48px;
      width: 48px;
    }
  }
}

/** The "Learn more" link --------------------------------------------------- */

/* By default, we only show the inline "Learn more" link. */
.content > .learn-more-button {
  display: none;
}

/* On narrow screens, we show the standalone "Learn more" link. */
@media (max-width: 720px) {
  #subtitle > .learn-more-button {
    display: none;
  }

  .content > .learn-more-button {
    display: block;
  }
}

/** Layout ------------------------------------------------------------------ */

/* Align the content, icon, and title to to the center. */
.content {
  margin-inline-end: auto;
  margin-inline-start: auto;
  max-width: 1000px;
}

.icon {
  margin-inline-end: auto;
  margin-inline-start: auto;
}

h1 {
  text-align: center;
}

/* Align the two columns of bulletpoints next to each other. */
#bulletpoints-wrapper {
  margin-left: 10%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.bulletpoints {
  flex-basis: 285px; /* (600px - 30px) / 2. */
  flex-grow: 1;
  flex-shrink: 0;
  text-align: left;
}

.bulletpoints.first {
  /* margin-inline-end: 30px; */
}

/* On narrow screens, align everything to the left. */
@media (max-width: 720px) {
  #bulletpoints-wrapper {
    margin-left: 0%;
  }
  .content {
    /* max-width: 600px !important;  */
    /* must override the rule set by JS which
    * is only valid for width > 720px cases. */
    text-align: start;
  }

  /* .icon {
    margin-inline-start: 0;
  } */

  /* h1 {
    text-align: start;
  } */
}

/** Paddings and margins ---------------------------------------------------- */

.bulletpoints ul {
  margin: 4px 0 0;
  padding-inline-start: 16px;
}

/* Wide screens. */
@media (min-width: 720px) {
  .icon,
  h1,
  #subtitle,
  .learn-more-button {
    margin-top: 1.5rem;
  }

  .icon,
  #subtitle,
  .bulletpoints {
    margin-bottom: 1.5rem;
  }

  .content {
    margin-top: 10%;
    min-width: 240px;
    /* padding: 8px 48px 24px; */
  }

  /* Snap the content box to the whole height on short screens. */
  @media (max-height: 480px) {
    html,
    body,
    .content {
      height: 100%;
    }

    .content {
      margin-bottom: 0;
      margin-top: 0;
      padding-bottom: 0;
      padding-top: 0;
    }

    .icon {
      margin-top: 0;
      padding-top: 32px; /* Define the top offset through the icon's padding,
                           * otherwise the screen height would be 100% + 32px */
    }
  }

  /* Smaller vertical margins on very short screens. */
  @media (max-height: 320px) {
    h1,
    #subtitle {
      margin-bottom: 16px;
      margin-top: 16px;
    }

    .learn-more-button,
    .bulletpoints,
    .icon,
    #cookie-controls {
      margin-bottom: 16px;
    }
  }
}

/* Narrow screens */
@media (max-width: 720px) {
  .content {
    min-width: 176px;
    padding: 0 32px;
  }

  .icon,
  h1,
  #subtitle {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
  }

  .bulletpoints,
  .learn-more-button,
  #cookie-controls {
    margin-bottom: 1.5rem;
  }

  /* Smaller offsets on smaller screens. */
  @media (max-height: 600px) {
    .content {
      padding-top: 48px;
    }

    .icon,
    h1,
    #subtitle {
      margin-bottom: 1rem;
      margin-top: 1rem;
    }

    .bulletpoints,
    .learn-more-button,
    #cookie-controls {
      margin-bottom: 1rem;
    }
  }

  /* Small top offset on very small screens. */
  @media (max-height: 480px) {
    .content {
      padding-top: 32px;
    }
  }

  /* Undo the first and last elements margins. */
  .icon {
    margin-top: 0;
  }

  .learn-more-button {
    margin-bottom: 0;
  }
}

/* Very narrow screens. */
@media (max-width: 240px) {
  .content {
    min-width: 192px;
    padding-inline-end: 24px;
    padding-inline-start: 24px;
  }
}
</style>