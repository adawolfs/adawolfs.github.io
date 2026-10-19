<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Box as BoxIcon, ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, Menu, X, Play, Pause, Copy, Check, Terminal, ChevronRight, Globe2, Network, Sparkles, Cpu, ExternalLink, Code2, Radio, MapPin } from '@lucide/vue'
import { Github, Linkedin } from './lib/social-icons'
import Observatory from './components/Observatory.vue'
import { profile, projects } from './lib/profile'
import type { Category, Project } from './lib/profile'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const menuOpen = ref(false)
const filter = ref<Category>('All work')
const categories: Category[] = ['All work', 'Cloud & AI', 'Web & mobile', 'Maker lab']
const visibleProjects = computed(() => filter.value === 'All work' ? projects : projects.filter(p => p.category === filter.value))
const selectedProject = ref<Project | null>(null)
const projectDialog = ref<HTMLDialogElement>()
const terminalDialog = ref<HTMLDialogElement>()
const terminalInput = ref<HTMLInputElement>()
const terminalCommand = ref('')
const terminalOutput = ref('Welcome to my little corner of the internet. Type “help” to explore.')
const copied = ref(false)
const copyFailed = ref(false)
const paused = ref(false)
const activeSection = ref('')
const localTime = ref('')
const progress = ref(0)
let timer: ReturnType<typeof setInterval>
let copyTimer: ReturnType<typeof setTimeout>
let observer: IntersectionObserver | undefined
let motionQuery: MediaQueryList
let motionOverridden = false
const updateMotion = () => { if (!motionOverridden) paused.value = motionQuery.matches }
const toggleMotion = () => { motionOverridden = true; paused.value = !paused.value }
const updateTime = () => { localTime.value = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Guatemala', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) }
const updateScroll = () => { progress.value = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) }
const navigate = (id: string) => {
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: paused.value ? 'instant' : 'smooth' })
}
const openProject = async (project: Project) => {
  selectedProject.value = project
  await nextTick()
  projectDialog.value?.showModal()
  document.body.style.overflow = 'hidden'
}
const closeProject = () => { projectDialog.value?.close() }
const unlockScroll = () => { document.body.style.overflow = ''; selectedProject.value = null }
const closeOnBackdrop = (event: MouseEvent, dialog?: HTMLDialogElement) => { if (event.target === dialog) dialog.close() }
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    copyFailed.value = false
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2500)
  } catch { copyFailed.value = true }
}
const openTerminal = async () => {
  if (projectDialog.value?.open) return
  terminalDialog.value?.showModal()
  document.body.style.overflow = 'hidden'
  await nextTick()
  terminalInput.value?.focus()
}
const closeTerminal = () => { terminalDialog.value?.close() }
const unlockTerminal = () => { document.body.style.overflow = '' }
const runCommand = () => {
  const command = terminalCommand.value.trim().toLowerCase()
  const destinations: Record<string, string> = { about: 'about', work: 'work', projects: 'work', community: 'community', contact: 'contact', home: 'top' }
  if (destinations[command]) { closeTerminal(); navigate(destinations[command]) }
  else if (command === 'help') terminalOutput.value = 'Explore: about · work · community · contact\nDiscover: whoami · stack · location · github · ping\nUtilities: clear · exit'
  else if (command === 'whoami') terminalOutput.value = 'Alvin Estrada / @adawolfs\nCloud architect. CNCF Ambassador. Developer. Maker.\nBuilding from Guatemala, sharing with the world.'
  else if (command === 'stack') terminalOutput.value = 'Kubernetes · Linux · Docker · Ansible\nTypeScript · Go · Rust · Python · Dart\nVue · Flutter · WebAssembly · Arduino'
  else if (command === 'location') terminalOutput.value = `Guatemala, Central America. UTC−6.\nLocal time: ${localTime.value}. Usually thinking about my next experiment.`
  else if (command === 'github') terminalOutput.value = `Find the source, experiments, and more:\n${profile.github}`
  else if (command === 'ping') terminalOutput.value = 'pong. Curiosity is online.'
  else if (command === 'sudo') terminalOutput.value = 'Nice try. Curiosity already has root access.'
  else if (command === 'clear') terminalOutput.value = ''
  else if (command === 'exit') closeTerminal()
  else if (command) terminalOutput.value = `Command “${command}” not found. Try “help”.`
  terminalCommand.value = ''
}
const onKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); terminalDialog.value?.open ? closeTerminal() : openTerminal() }
  if (event.key === 'Escape') menuOpen.value = false
}
onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  motionQuery.addEventListener('change', updateMotion)
  updateTime()
  timer = setInterval(updateTime, 30000)
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) activeSection.value = entry.target.id }, { rootMargin: '-20% 0px -50% 0px' })
  document.querySelectorAll('main > section[id]').forEach(section => observer?.observe(section))
})
onBeforeUnmount(() => {
  clearInterval(timer); clearTimeout(copyTimer); observer?.disconnect()
  motionQuery?.removeEventListener('change', updateMotion)
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="site-shell" :class="{ 'motion-paused': paused }">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true"></div>
    <header class="site-header">
      <a href="#top" class="brand" aria-label="Alvin Estrada home" @click.prevent="navigate('top')">
        <svg class="brand-mark" width="31" height="35" viewBox="0 0 40 44" aria-hidden="true"><path d="M3 36 20 7l17 29H25l-5-9-5 9Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M11 36h18" stroke="currentColor" stroke-width="2.2"/></svg>
        <span>alvin<span class="brand-dot">.</span>estrada<span class="brand-handle mono">@adawolfs</span></span>
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a v-for="item in ['About', 'Work', 'Community']" :key="item" :href="`#${item.toLowerCase()}`" :class="{ active: activeSection === item.toLowerCase() }" @click.prevent="navigate(item.toLowerCase())">{{ item }}</a>
      </nav>
      <div class="header-actions">
        <button class="motion-control" type="button" :aria-label="paused ? 'Enable animation' : 'Pause animation'" :aria-pressed="!paused" @click="toggleMotion"><Play v-if="paused" :size="13" /><Pause v-else :size="13" /><span class="mono">Motion {{ paused ? 'off' : 'on' }}</span></button>
        <a href="#contact" class="header-contact" @click.prevent="navigate('contact')">Let’s talk <ArrowUpRight :size="16" /></a>
        <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" @click="menuOpen = !menuOpen"><X v-if="menuOpen" :size="22" /><Menu v-else :size="22" /></button>
      </div>
      <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation"><a v-for="item in ['About', 'Work', 'Community', 'Contact']" :key="item" :href="`#${item.toLowerCase()}`" @click.prevent="navigate(item.toLowerCase())">{{ item }}<ArrowUpRight :size="20" /></a></nav>
    </header>

    <main id="main">
      <section id="top" class="hero section-wrap">
        <div class="hero-topline mono"><span class="eyebrow"><span class="status-light"></span> CLOUD ARCHITECT · CNCF AMBASSADOR</span><span class="hero-edition">BASED IN GUATEMALA <span class="mini-globe">↗</span></span></div>
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="hero-greeting"><span class="short-rule"></span><p>Hello, I’m Alvin Estrada.</p></div>
            <h1>Cloud. Code.<br /><span class="serif-word">Curiosity.</span><span class="orange-period">↗</span></h1>
            <p class="hero-description">I turn complex systems into possibilities.<br class="desktop-break" /> Cloud architect, developer, and maker—building<br class="desktop-break" /> from Guatemala, sharing with the world.</p>
            <div class="hero-cta"><a href="#work" class="button button-primary" @click.prevent="navigate('work')">Explore my work <ArrowUpRight :size="19" /></a><a :href="profile.github" target="_blank" rel="noopener noreferrer" class="github-link"><Github :size="18" /> GitHub <ArrowUpRight :size="13" /></a></div>
            <div class="hero-footnote mono"><span class="tiny-cross">+</span> SYSTEMS THINKER. CONSTANT TINKERER.</div>
          </div>
          <Observatory :paused="paused" />
        </div>
        <div class="hero-bottom"><a href="#about" class="scroll-cue mono" @click.prevent="navigate('about')"><span class="scroll-cue-icon"><ArrowDown :size="14" /></span> A LITTLE SCROLL. A LOT TO EXPLORE.</a><button type="button" class="terminal-hint mono" @click="openTerminal"><Terminal :size="14" /> For the curious <kbd>⌘ / Ctrl K</kbd></button></div>
      </section>

      <div class="technology-strip" aria-label="Selected technologies"><div class="technology-strip-inner"><span class="mono strip-label">A FEW TOOLS OF THE TRADE</span><span>Kubernetes</span><span class="strip-plus">+</span><span>Go</span><span class="strip-plus">+</span><span>Rust</span><span class="strip-plus">+</span><span>TypeScript</span><span class="strip-plus">+</span><span>WebAssembly</span><span class="strip-plus">+</span><span>Flutter</span><span class="strip-plus">+</span><span>Linux</span></div></div>

      <section id="about" class="about-section section-wrap section-space">
        <div class="section-label mono"><span>01 / THE HUMAN BEHIND THE HANDLE</span><span class="tiny-cross">+</span></div>
        <div class="about-grid">
          <div class="about-visual">
            <div class="portrait-frame"><img :src="asset('images/alvin-estrada.jpg')" alt="Alvin Estrada" width="600" height="600" loading="lazy" /><div class="portrait-corner corner-tl"></div><div class="portrait-corner corner-br"></div><span class="portrait-caption mono">FIG. 01 — ALWAYS CURIOUS</span></div>
            <div class="portrait-meta mono"><MapPin :size="13" /><span>GUATEMALA, CENTRAL AMERICA</span><span class="status-light"></span></div>
            <div class="maker-note"><span class="note-asterisk">✳</span><p>“If you can imagine it,<br />you can build it.”</p><span class="mono">MY DEFAULT SETTING</span></div>
          </div>
          <div class="about-copy">
            <h2>Big-picture thinker.<br /><span class="text-dim">Hands-on builder.</span></h2>
            <p class="body-large">I’m Alvin. On the internet, <a :href="profile.github" target="_blank" rel="noopener noreferrer">@adawolfs</a>.</p>
            <p>My work lives where software meets infrastructure. I build cloud-native systems, explore what AI can do, and make complex technology a little more understandable.</p>
            <p>As a CNCF Ambassador and community organizer, I believe the best things happen when we share what we know. Away from the terminal, you’ll find me tinkering with electronics, 3D printers, and probably another ambitious side project.</p>
            <div class="approach-list">
              <div><span class="approach-icon"><Network :size="20" :stroke-width="1.5" /></span><div><h3>Build for the real world.</h3><p>Cloud architecture, Kubernetes, and reliability.</p></div><span class="mono">01</span></div>
              <div><span class="approach-icon"><Code2 :size="20" :stroke-width="1.5" /></span><div><h3>Stay a beginner at something.</h3><p>From WebAssembly to tiny embedded worlds.</p></div><span class="mono">02</span></div>
              <div><span class="approach-icon"><Globe2 :size="20" :stroke-width="1.5" /></span><div><h3>Bring people along.</h3><p>Open source, community, and learning in public.</p></div><span class="mono">03</span></div>
            </div>
            <a :href="profile.linkedin" class="text-link" target="_blank" rel="noopener noreferrer">More of my story on LinkedIn <ArrowUpRight :size="17" /></a>
          </div>
        </div>
      </section>

      <section id="work" class="work-section section-wrap section-space">
        <div class="section-label mono"><span>02 / SELECTED EXPLORATIONS</span><span>IDEAS → THINGS THAT WORK</span></div>
        <div class="section-heading"><h2>Built with intent.<br /><span class="text-dim">And a little obsession.</span></h2><p>A few things I’ve built, broken, and learned from.<br />Open source. Open to possibilities.</p></div>
        <div class="project-toolbar"><div class="project-filters" role="group" aria-label="Filter projects"><button v-for="category in categories" :key="category" type="button" :aria-pressed="filter === category" :class="{ active: filter === category }" @click="filter = category">{{ category }}<span v-if="category === 'All work'" class="filter-count">06</span></button></div><span class="mono projects-count" role="status">{{ String(visibleProjects.length).padStart(2, '0') }} PROJECTS</span></div>
        <div class="project-grid">
          <article v-for="project in visibleProjects" :key="project.id" class="project-card">
            <button type="button" class="project-open" :aria-label="`Explore ${project.title}`" @click="openProject(project)">
              <div class="project-art" :class="`art-${project.art}`" aria-hidden="true">
                <span class="art-category mono">{{ project.category.toUpperCase() }}</span><span class="art-number mono">{{ project.number }} / 06</span>
                <div v-if="project.art === 'jarvis'" class="jarvis-art"><div class="jarvis-circle outer"></div><div class="jarvis-circle middle"></div><div class="jarvis-circle inner"></div><div class="jarvis-center"><Sparkles :size="34" :stroke-width="1" /></div><span class="art-code mono">J.A.R.V.I.S. / CLOUD NATIVE</span><span class="art-orbit-dot dot-one"></span><span class="art-orbit-dot dot-two"></span></div>
                <div v-else-if="project.art === 'wasm'" class="wasm-art"><div class="wasm-tile"><span class="wasm-cutout"></span><span>W<span class="wasm-a">A</span></span></div><span class="floating-tag tag-c mono">C</span><span class="floating-tag tag-rust mono">RUST</span><span class="floating-tag tag-go mono">GO</span><span class="art-code mono">COMPILE ONCE. EXPLORE EVERYWHERE.</span></div>
                <div v-else-if="project.art === 'network'" class="network-art"><div class="network-root mono"><Network :size="20" /> cni0</div><div class="network-branches"><span></span><span></span><span></span></div><div class="network-nodes"><span class="mono"><BoxIcon />netns_01</span><span class="mono"><BoxIcon />netns_02</span><span class="mono"><BoxIcon />netns_03</span></div><span class="art-code mono">LINUX BRIDGE / PACKETS IN MOTION</span></div>
                <div v-else-if="project.art === 'gameboy'" class="gameboy-art"><div class="gameboy-board"><span class="board-pin pin-left"></span><span class="board-pin pin-right"></span><div class="round-display"><div class="pixel-ship"></div><span class="mono">PRESS START</span><div class="pixel-stars">· + ·<br /> + ·</div></div><span class="board-label mono">ESP32-C3</span></div><span class="art-code mono">HARDWARE, MEET IMAGINATION.</span></div>
                <div v-else-if="project.art === 'flutter'" class="flutter-art"><div class="phone-frame"><span class="phone-camera"></span><span class="phone-title">FlutterDeX <span>⌕</span></span><span class="phone-subtitle mono">GOTTA EXPLORE ’EM ALL</span><div class="dex-grid"><span v-for="n in 4" :key="n"><span class="pokeball"></span><i></i></span></div></div><span class="flutter-spark">✳</span><span class="art-code mono">FLUTTER + RIVE / MADE TO MOVE</span></div>
                <div v-else class="handheld-art"><div class="handheld"><div class="handheld-screen"><span class="mono">PLAYER 01<br /><b>CONNECTED</b></span><span class="screen-lines"></span></div><div class="handheld-controls"><span>✚</span><span class="handheld-buttons">● ●</span></div><span class="handheld-speaker"></span></div><span class="signal-wave wave-one"></span><span class="signal-wave wave-two"></span><span class="art-code mono">RUST / SDL2 / PLAY TOGETHER</span></div>
                <span class="project-art-arrow"><ArrowUpRight :size="22" :stroke-width="1.5" /></span>
              </div>
              <div class="project-info"><div class="project-title-row"><h3>{{ project.title }}</h3><ArrowUpRight :size="20" /></div><p>{{ project.description }}</p><div class="project-tags mono"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div></div>
            </button>
          </article>
        </div>
        <a :href="`${profile.github}?tab=repositories`" class="all-projects-link" target="_blank" rel="noopener noreferrer"><Github :size="18" /><span>There’s always another experiment.</span><strong>All repositories <ArrowUpRight :size="16" /></strong></a>
      </section>

      <section id="community" class="community-section section-wrap section-space">
        <div class="section-label mono"><span>03 / BETTER TOGETHER</span><span class="tiny-cross">+</span></div>
        <div class="community-heading"><div><span class="community-eyebrow mono"><span class="status-light"></span> FROM GUATEMALA, WITH CURIOSITY.</span><h2>Good ideas travel.<br /><span class="text-dim">Let’s give them a push.</span></h2></div><p>Technology moves forward when people do.<br />I organize, speak, and build spaces for us<br class="desktop-break" /> to learn from each other.</p></div>
        <div class="community-grid">
          <a :href="profile.community" target="_blank" rel="noopener noreferrer" class="community-card community-featured"><div class="community-card-top"><span class="mono">THE COMMUNITY</span><ArrowUpRight :size="20" /></div><div class="community-orbit" aria-hidden="true"><Globe2 :size="104" :stroke-width="0.65" /><span></span><span></span><span></span></div><div><span class="community-type mono">ORGANIZER & SPEAKER</span><h3>Kubernetes Guatemala</h3><p>Connecting the local cloud-native community through meetups, shared knowledge, and Kubernetes Community Days.</p><span class="community-link">Meet the community <ArrowUpRight :size="15" /></span></div></a>
          <div class="community-side"><a :href="profile.cncf" target="_blank" rel="noopener noreferrer" class="community-card"><div class="community-card-top"><span class="mono">THE ECOSYSTEM</span><ArrowUpRight :size="20" /></div><div class="community-small-icon"><Network :size="28" :stroke-width="1.3" /></div><h3>CNCF Ambassador</h3><p>Helping people find their way into cloud-native technology. One conversation, contribution, and connection at a time.</p><span class="community-link">The ambassador network <ArrowUpRight :size="15" /></span></a><a :href="profile.talk" target="_blank" rel="noopener noreferrer" class="community-card talk-card"><div class="community-card-top"><span class="mono">ON THE STAGE</span><ArrowUpRight :size="20" /></div><Radio :size="25" :stroke-width="1.3" /><div><h3>Under the surface of eBPF</h3><p>KCD Argentina 2024 · Sharing what happens in kernel space.</p></div><span class="community-link">Read the event story <ArrowUpRight :size="15" /></span></a></div>
        </div>
      </section>

      <section id="contact" class="contact-section">
        <div class="contact-inner section-wrap"><div class="section-label mono"><span>04 / NEXT CONNECTION</span><span>THE BEST PART STARTS WITH A HELLO.</span></div><div class="contact-heading"><h2>Have a good<br />problem<span class="contact-question">?</span></h2><a :href="`mailto:${profile.email}`" class="contact-arrow" aria-label="Email Alvin Estrada"><ArrowUpRight :stroke-width="0.8" /></a></div><div class="contact-bottom"><div><p>A new idea. A tricky system. A community worth building.</p><a :href="`mailto:${profile.email}`" class="email-link">{{ profile.email }} <ArrowUpRight :size="21" /></a><button class="copy-email" type="button" :aria-label="copied ? 'Email copied' : 'Copy email address'" @click="copyEmail"><Check v-if="copied" :size="17" /><Copy v-else :size="17" /></button><span class="copy-status mono" role="status">{{ copied ? 'Copied!' : copyFailed ? 'Please copy the address above.' : '' }}</span></div><div class="contact-socials"><a :href="profile.github" target="_blank" rel="noopener noreferrer"><Github :size="19" /> GitHub <ArrowUpRight :size="15" /></a><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"><Linkedin :size="19" /> LinkedIn <ArrowUpRight :size="15" /></a></div></div></div>
      </section>
    </main>

    <footer class="site-footer section-wrap"><div class="footer-top"><a href="#top" class="footer-brand" @click.prevent="navigate('top')">alvin.estrada <span class="mono">/ @adawolfs</span></a><button type="button" class="back-top mono" @click="navigate('top')">BACK TO ORBIT <ArrowUp :size="16" /></button></div><div class="footer-bottom mono"><span>© {{ new Date().getFullYear() }} ALVIN ESTRADA</span><span class="footer-local"><span class="status-light"></span> GUATEMALA <time>{{ localTime }}</time> UTC−6</span><button type="button" class="footer-terminal" @click="openTerminal"><Terminal :size="13" /> ALWAYS ANOTHER WAY IN <ChevronRight :size="13" /></button></div></footer>

    <dialog ref="projectDialog" class="project-dialog" aria-labelledby="project-dialog-title" @click="closeOnBackdrop($event, projectDialog)" @close="unlockScroll">
      <div v-if="selectedProject" class="dialog-content"><div class="dialog-top"><span class="mono">EXPLORATION {{ selectedProject.number }} / {{ selectedProject.category.toUpperCase() }}</span><button type="button" class="icon-button" aria-label="Close project details" autofocus @click="closeProject"><X :size="22" /></button></div><div class="dialog-project-icon"><component :is="selectedProject.category === 'Maker lab' ? Cpu : selectedProject.category === 'Cloud & AI' ? Network : Code2" :size="40" :stroke-width="1.2" /></div><h2 id="project-dialog-title">{{ selectedProject.title }}</h2><p class="dialog-subtitle">{{ selectedProject.subtitle }}</p><p class="dialog-description">{{ selectedProject.detail }}</p><ul class="dialog-features"><li v-for="feature in selectedProject.features" :key="feature"><Check :size="15" />{{ feature }}</li></ul><div class="project-tags mono"><span v-for="tag in selectedProject.tags" :key="tag">{{ tag }}</span></div><div class="dialog-links"><a :href="selectedProject.url" class="button button-primary" target="_blank" rel="noopener noreferrer"><Github :size="17" /> Explore the source <ArrowUpRight :size="17" /></a><a v-if="selectedProject.demo" :href="selectedProject.demo" class="text-link" target="_blank" rel="noopener noreferrer">View the slides <ExternalLink :size="16" /></a></div></div>
    </dialog>
    <dialog ref="terminalDialog" class="terminal-dialog" aria-labelledby="terminal-title" @click="closeOnBackdrop($event, terminalDialog)" @close="unlockTerminal"><div class="terminal-top"><div class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></div><h2 id="terminal-title" class="mono">adawolfs@portfolio: ~</h2><button type="button" class="icon-button" aria-label="Close terminal" @click="closeTerminal"><X :size="18" /></button></div><div class="terminal-body"><span class="terminal-welcome mono">CURIOSITY OS <span>v2.0</span></span><p class="terminal-output mono" role="status">{{ terminalOutput }}</p><form class="terminal-form" @submit.prevent="runCommand"><label for="terminal-command" class="mono">❯<span class="sr-only">Enter a terminal command</span></label><input id="terminal-command" ref="terminalInput" v-model="terminalCommand" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type a command…" class="mono" /><button type="submit" aria-label="Run command"><ArrowRight :size="18" /></button></form></div><div class="terminal-bottom mono"><span>help <span class="muted">for commands</span></span><span><kbd>esc</kbd> to close</span></div></dialog>
  </div>
</template>
