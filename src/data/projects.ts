export const categories = [
  { id: 'networking', name: 'Networking & distributed systems', short: 'Networking', description: 'Membership, discovery, and the protocols that connect systems.' },
  { id: 'systems', name: 'Systems & concurrency', short: 'Systems', description: 'Small, dependable primitives close to the operating system.' },
  { id: 'storage', name: 'Storage & data structures', short: 'Storage', description: 'Transactions, memory, and concurrent access to data.' },
  { id: 'parsing', name: 'Parsing infrastructure', short: 'Parsing', description: 'Reusable building blocks for languages and developer tooling.' },
] as const;
export type Category = typeof categories[number]['id'];
export interface Project {
  name: string;
  category: Category;
  description: string;
  detail: string;
  concepts: string[];
  github: string;
  crate?: string;
  featured?: boolean;
  provenance?: string;
}
export const projects: Project[] = [
  { name: 'memberlist', category: 'networking', description: 'Cluster membership. Without a central coordinator.', detail: 'SWIM membership and failure detection with Lifeguard extensions, a Sans-I/O protocol core, and pluggable runtime and transport layers.', concepts: ['SWIM + Lifeguard', 'Sans-I/O', 'TCP / TLS / QUIC'], github: 'https://github.com/al8n/memberlist', crate: 'memberlist', featured: true },
  { name: 'serf', category: 'networking', description: 'Decentralized service discovery and orchestration.', detail: 'Gossip-based discovery and coordination with tunable convergence and support for multiple async runtimes.', concepts: ['Gossip', 'Service discovery', 'WASM / WASI'], github: 'https://github.com/al8n/serf', crate: 'serf', featured: true },
  { name: 'agnostic', category: 'networking', description: 'Async infrastructure, independent of the runtime.', detail: 'Shared abstractions for asynchronous networking and other runtime operations across Tokio, smol, and WebAssembly.', concepts: ['Async I/O', 'Runtime abstractions', 'Networking'], github: 'https://github.com/al8n/agnostic', crate: 'agnostic' },
  { name: 'getifs', category: 'networking', description: 'Discover the network your software runs on.', detail: 'Cross-platform enumeration of network interfaces, addresses, MTUs, gateways, and routing information.', concepts: ['Network interfaces', 'OS networking', 'Cross-platform'], github: 'https://github.com/al8n/getifs', crate: 'getifs' },
  { name: 'hostaddr', category: 'networking', description: 'Typed host addresses for networked applications.', detail: 'Network address abstractions and utilities for representing hostnames and IP-based endpoints.', concepts: ['Host addresses', 'Networking', 'Rust types'], github: 'https://github.com/al8n/hostaddr', crate: 'hostaddr' },
  { name: 'peekable', category: 'networking', description: 'Inspect incoming bytes without consuming them.', detail: 'Buffered peeking for synchronous and asynchronous readers, useful for protocol detection and header inspection.', concepts: ['Byte streams', 'Async readers', 'Protocol detection'], github: 'https://github.com/al8n/peekable', crate: 'peekable' },
  { name: 'fs4', category: 'systems', description: 'File operations, with sync and async on equal footing.', detail: 'Cross-platform file locking, allocation, and filesystem utilities with async support. A maintained fork of fs2-rs using rustix.', concepts: ['File locking', 'Async filesystems', 'rustix'], github: 'https://github.com/al8n/fs4', crate: 'fs4', featured: true, provenance: 'A fork of danburkert/fs2-rs.' },
  { name: 'fmmap', category: 'systems', description: 'Memory-mapped files, with a higher-level interface.', detail: 'Convenient memory-mapped file I/O with synchronous and asynchronous interfaces for zero-copy access.', concepts: ['mmap', 'Zero-copy I/O', 'Async I/O'], github: 'https://github.com/al8n/fmmap', crate: 'fmmap', featured: true },
  { name: 'atomic-time', category: 'systems', description: 'Atomic operations for Rust time types.', detail: 'Thread-safe atomic Duration, SystemTime, Instant, and Option variants. Lock freedom depends on the platform.', concepts: ['Atomic primitives', 'Time', 'Concurrency'], github: 'https://github.com/al8n/atomic-time', crate: 'atomic-time' },
  { name: 'wg', category: 'systems', description: 'Wait for work to finish, synchronously or asynchronously.', detail: 'Go-style WaitGroup coordination for synchronous and asynchronous Rust, including no_std environments.', concepts: ['WaitGroup', 'Synchronization', 'no_std'], github: 'https://github.com/al8n/wg', crate: 'wg' },
  { name: 'skipdb', category: 'storage', description: 'Concurrent transactions. Carefully isolated.', detail: 'An embedded in-memory MVCC database with zero-copy storage and optimistic or serializable snapshot isolation.', concepts: ['MVCC', 'Snapshot isolation', 'Zero-copy'], github: 'https://github.com/al8n/skipdb', crate: 'skipdb', featured: true },
  { name: 'skl', category: 'storage', description: 'Concurrent skiplists, built around an arena.', detail: 'Lock-free, thread-safe arena-backed skiplist structures for storage-engine memtables and MVCC data.', concepts: ['Skiplist', 'Arena allocation', 'Memtables'], github: 'https://github.com/al8n/skl', crate: 'skl' },
  { name: 'stretto', category: 'storage', description: 'Concurrent caching with a bounded memory budget.', detail: 'A memory-bound concurrent Rust cache inspired by Dgraph Ristretto, with admission and eviction policies.', concepts: ['Concurrent caching', 'Admission policies', 'Memory bounds'], github: 'https://github.com/al8n/stretto', crate: 'stretto', provenance: 'Inspired by Dgraph Ristretto.' },
  { name: 'caches-rs', category: 'storage', description: 'Cache implementations for different tradeoffs.', detail: 'Reusable Rust cache implementations and eviction policies, including support for no_std environments.', concepts: ['Eviction policies', 'Data structures', 'no_std'], github: 'https://github.com/al8n/caches-rs', crate: 'caches' },
  { name: 'tokora', category: 'parsing', description: 'Parse as you lex. Keep the control explicit.', detail: 'Parser combinators with on-demand lexing, explicit lookahead and backtracking, and configurable diagnostics.', concepts: ['Parser combinators', 'On-demand lexing', 'Diagnostics'], github: 'https://github.com/al8n/tokora', crate: 'tokora', featured: true },
  { name: 'smear', category: 'parsing', description: 'A reusable front end for GraphQL and related languages.', detail: 'Zero-copy lexing, parsing, and validation for GraphQL, with reusable combinators for GraphQL-like DSLs. Execution is outside its current scope.', concepts: ['GraphQL', 'Zero-copy parsing', 'Language tooling'], github: 'https://github.com/al8n/smear' },
];
export const featured = ['memberlist', 'skipdb', 'serf', 'fs4', 'tokora', 'fmmap'].map(name => projects.find(p => p.name === name)!);
