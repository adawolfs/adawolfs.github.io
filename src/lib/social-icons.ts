import { defineComponent, h } from 'vue'

// Social marks kept local so the icon set can stay focused on interface icons.
const icon = (name: string, paths: string[]) => defineComponent({
  name,
  props: { size: { type: [String, Number], default: 24 } },
  setup: props => () => h('svg', {
    width: props.size, height: props.size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round',
    'stroke-linejoin': 'round', 'aria-hidden': 'true',
  }, paths.map(d => h('path', { d }))),
})

export const Github = icon('GithubMark', [
  'M9 19c-4.3 1.4-4.3-2.5-6-3',
  'M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 6.97A3.37 3.37 0 0 0 8 18.13V22',
])

export const Linkedin = icon('LinkedinMark', [
  'M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z',
  'M7.5 10v7M7.5 7v.01M11 17v-7m0 3a3 3 0 0 1 6 0v4',
])
