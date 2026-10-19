<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Box, BrainCircuit, Cpu, RotateCcw } from '@lucide/vue'
import type { Observatory, SceneMode } from '../lib/observatory'

const props = defineProps<{ paused: boolean }>()
const host = ref<HTMLElement>()
const mode = ref<SceneMode>('systems')
const ready = ref(false)
const failed = ref(false)
let scene: Observatory | undefined
let unmounted = false
const modes = [
  { id: 'systems' as const, label: 'Systems', icon: Box, caption: 'Cloud architecture · Kubernetes · Reliability', number: '01' },
  { id: 'intelligence' as const, label: 'Intelligence', icon: BrainCircuit, caption: 'AI · Connected ideas · New possibilities', number: '02' },
  { id: 'maker' as const, label: 'Maker', icon: Cpu, caption: 'Electronics · Creative code · Experimentation', number: '03' },
]
const active = computed(() => modes.find(item => item.id === mode.value)!)
watch(mode, value => scene?.setMode(value))
watch(() => props.paused, value => scene?.setPaused(value))
onMounted(async () => {
  try {
    const { createObservatory } = await import('../lib/observatory')
    if (unmounted || !host.value) return
    scene = createObservatory(host.value, {
      onReady: () => { ready.value = true },
      onError: () => { failed.value = true },
    })
    scene.setPaused(props.paused)
  } catch { failed.value = true }
})
onBeforeUnmount(() => { unmounted = true; scene?.dispose() })
</script>

<template>
  <div class="observatory" :class="{ 'scene-ready': ready && !failed }" aria-label="Interactive 3D observatory">
    <div class="scene-index mono"><span class="crosshair">+</span> EXPERIMENT {{ active.number }} <span class="muted">/ 03</span></div>
    <div ref="host" class="scene-host" :class="{ 'scene-failed': failed }" aria-hidden="true"></div>
    <div v-if="!ready || failed" class="scene-fallback" aria-hidden="true">
      <div class="fallback-orbit orbit-a"></div><div class="fallback-orbit orbit-b"></div><div class="fallback-orbit orbit-c"></div>
      <div class="fallback-core" :class="mode"></div><span class="fallback-satellite"></span>
    </div>
    <div class="scene-coordinate mono" aria-hidden="true">14°38′ N<br />90°30′ W</div>
    <div class="scene-instruction mono">
      <span class="tiny-cross">↔</span>
      <span v-if="failed">{{ active.label }} · static view</span>
      <span v-else class="desktop-instruction">Drag to orbit</span>
      <span v-if="!failed" class="touch-instruction">Two fingers to orbit</span>
      <button type="button" class="reset-view" aria-label="Reset 3D view" :disabled="failed || !ready" @click="scene?.reset()"><RotateCcw :size="13" /></button>
    </div>
    <div class="scene-selector" role="group" aria-label="Choose 3D experiment">
      <button v-for="item in modes" :key="item.id" type="button" :aria-pressed="mode === item.id" :class="{ active: mode === item.id }" @click="mode = item.id">
        <component :is="item.icon" :size="15" :stroke-width="1.5" /><span>{{ item.label }}</span>
      </button>
    </div>
    <p class="scene-caption mono" aria-live="polite">{{ active.caption }}</p>
  </div>
</template>
