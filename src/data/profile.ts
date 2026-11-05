export const profile = {
  name: 'Al Liu',
  title: 'Rust Systems Engineer & Open-Source Maintainer',
  introduction: 'I build low-latency infrastructure, distributed protocols, networking systems, and storage engines in Rust.',
  summary: 'Rust systems engineer and open-source maintainer specializing in performance-sensitive infrastructure, asynchronous networking, distributed protocols, storage engines, and concurrency. My experience spans production financial systems, decentralized networking, blockchain infrastructure, and reusable developer libraries. I work across protocol implementation, runtime abstractions, concurrent data processing, and the practical work of making systems reliable.',
  publicWork: [
    'Maintain a collection of Rust infrastructure libraries covering language tooling, distributed membership and discovery, asynchronous I/O, file operations, caching, and concurrent data structures. The public source provides concrete examples of protocol design, library APIs, and systems-level implementation.',
    'Use Sans-I/O boundaries, runtime-independent abstractions, validated types, and explicit ownership to separate core logic from its environment. Public work includes SWIM and Lifeguard membership, GraphQL tooling, parser combinators, MVCC storage, memory mapping, and synchronization primitives.',
  ],
  email: 'scygliu1@gmail.com',
  site: 'https://al8n.github.io',
  github: 'https://github.com/al8n',
  linkedin: 'https://linkedin.com/in/al8n',
  crates: 'https://crates.io/users/al8n',
  education: {
    school: 'University of Auckland',
    degree: 'Bachelor of Science with Honours in Computer Science',
    dates: '2019 - 2022',
    graduation: 'Graduated November 2022',
    context: 'Completed the degree while also working full-time as a Rust and Go engineer during 2022.',
    award: '2022 University of Auckland Sub-Doctoral Postgraduate Accommodation Scholarship',
  },
};
export const skills = [
  { name: 'Languages', items: ['Rust', 'Go', 'SQL'] },
  { name: 'Systems & networking', items: ['Linux', 'TCP / UDP', 'QUIC', 'WebSocket', 'Async I/O', 'Protobuf'] },
  { name: 'Distributed systems', items: ['SWIM', 'Gossip', 'Service discovery', 'Consensus', 'Fault tolerance'] },
  { name: 'Storage & performance', items: ['MVCC', 'Concurrent data structures', 'Skiplist', 'Caching', 'Zero-copy', 'Memory-mapped I/O'] },
  { name: 'Additional technologies', items: ['WebAssembly', 'WASI', 'GraphQL'] },
];
export const expertise = [
  { name: 'Rust systems engineering', detail: 'Production services and reusable libraries, with attention to ownership, concurrent access, resource efficiency, and maintainable interfaces.' },
  { name: 'Networking & distributed protocols', detail: 'Asynchronous byte streams, transport abstractions, gossip membership, failure detection, decentralized discovery, and consensus simulation.' },
  { name: 'Storage & concurrency', detail: 'In-memory MVCC, snapshot isolation, arena-backed skiplists, memory-mapped files, cache policies, and synchronization primitives.' },
  { name: 'Languages & developer tooling', detail: 'Procedural macros, code generation, GraphQL, deterministic parser combinators, on-demand lexing, zero-copy parsing, and diagnostics.' },
];
