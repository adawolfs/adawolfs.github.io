/** Public profile content. Provenance and editing instructions are in README.md. */
export const profile = {
  name: 'Alvin Estrada',
  handle: 'adawolfs',
  email: 'adawolfs@gmail.com',
  github: 'https://github.com/adawolfs',
  linkedin: 'https://www.linkedin.com/in/adawolfs/',
  community: 'https://community2.cncf.io/events/details/cncf-kcd-guatemala-presents-kcd-antigua-guatemala-2025/',
  cncf: 'https://www.cncf.io/people/ambassadors/',
  talk: 'https://www.cncf.io/blog/2024/05/24/kcd-argentina-2024-mastering-the-kubernetes-tango-and-scoring-goals-in-container-orchestration/',
}

export type Category = 'All work' | 'Cloud & AI' | 'Web & mobile' | 'Maker lab'
export interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  detail: string
  category: Exclude<Category, 'All work'>
  tags: string[]
  url: string
  demo?: string
  art: 'jarvis' | 'wasm' | 'network' | 'gameboy' | 'flutter' | 'handheld'
  features: string[]
}

export const projects: Project[] = [
  {
    id: 'jarvis', number: '01', title: 'J.A.R.V.I.S.', subtitle: 'A copilot for the cloud-native world.',
    description: 'An AI assistant that brings Kubernetes operations and cloud-native knowledge into a conversation.',
    detail: 'An exploration of how AI can make cloud-native tooling more approachable. J.A.R.V.I.S. connects a conversational interface with Kubernetes management and cloud-native questions.',
    category: 'Cloud & AI', tags: ['TypeScript', 'Kubernetes', 'AI'],
    url: 'https://github.com/adawolfs/jarvis-cloud-native', art: 'jarvis',
    features: ['Conversational cloud-native assistance', 'Kubernetes management workflows', 'Built with TypeScript'],
  },
  {
    id: 'wasm', number: '02', title: 'WASM Everywhere', subtitle: 'Small binaries. Big possibilities.',
    description: 'Taking WebAssembly beyond the browser through hands-on demos in C, Rust, and Go.',
    detail: 'A collection of demonstrations and talk material that explores where WebAssembly can run and what you can build with it. Different languages, a portable runtime, and plenty of room to experiment.',
    category: 'Web & mobile', tags: ['WebAssembly', 'Rust', 'Go'],
    url: 'https://github.com/adawolfs/wasm-everywhere', demo: 'https://adawolfs.github.io/wasm-everywhere', art: 'wasm',
    features: ['Examples across C, Rust, and Go', 'Public presentation slides', 'Portable runtime experiments'],
  },
  {
    id: 'cni', number: '03', title: 'CNI, from scratch', subtitle: 'Understand the network. Build the network.',
    description: 'A hands-on bridge networking demo that opens up the machinery behind container connectivity.',
    detail: 'An educational implementation of CNI networking concepts using Linux and Bash. Built to make container networking tangible, with demonstrations for La Hora de Kubernetes.',
    category: 'Cloud & AI', tags: ['Linux', 'Bash', 'Networking'],
    url: 'https://github.com/adawolfs/CNI-plugin-from-Scratch', art: 'network',
    features: ['Bridge CNI concepts from first principles', 'Linux networking and Bash', 'Community teaching material'],
  },
  {
    id: 'esp', number: '04', title: 'ESP-IDF-Boy', subtitle: 'A little board. A whole lot of nostalgia.',
    description: 'A Game Boy emulator on an ESP32-C3, with a circular touch display and a Wi-Fi web portal.',
    detail: 'A maker experiment at the intersection of embedded systems, playful interfaces, and retro gaming. An ESP32-C3 powers the emulator, with a circular touch display and an embedded HTTP and WebSocket portal.',
    category: 'Maker lab', tags: ['ESP32', 'Embedded', 'C'],
    url: 'https://github.com/adawolfs/ESP-IDF-Boy', art: 'gameboy',
    features: ['Game Boy emulation on ESP32-C3', 'Circular touch display', 'Embedded Wi-Fi HTTP and WebSocket portal'],
  },
  {
    id: 'flutter', number: '05', title: 'FlutterDeX', subtitle: 'A familiar universe, reimagined in Flutter.',
    description: 'A Pokédex interface exploring expressive mobile UI with Flutter and Rive animation.',
    detail: 'An interface experiment built with Flutter and Rive. FlutterDeX uses a familiar world to explore how motion and visual design can make a mobile experience feel more alive.',
    category: 'Web & mobile', tags: ['Flutter', 'Dart', 'Rive'],
    url: 'https://github.com/adawolfs/FlutterDeX', art: 'flutter',
    features: ['Flutter mobile interface', 'Rive animation exploration', 'Pokédex-inspired interaction design'],
  },
  {
    id: 'r36', number: '06', title: 'r36-n64', subtitle: 'Connecting handheld worlds.',
    description: 'A Rust and SDL2 companion for the R36S: wireless controls, ROM uploads, and synchronized saves.',
    detail: 'A handheld companion for espN64, written in Rust with SDL2. The project explores connecting gaming hardware through WebSocket controls, ROM uploads, and game-save synchronization.',
    category: 'Maker lab', tags: ['Rust', 'SDL2', 'WebSockets'],
    url: 'https://github.com/adawolfs/r36-n64', art: 'handheld',
    features: ['WebSocket controller connection', 'ROM upload workflows', 'Game-save synchronization'],
  },
]
