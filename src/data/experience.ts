export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  arrangement: string;
  overview: string;
  scope: string[];
  bullets: string[];
}
export const experience: Experience[] = [
  {
    company: 'Confidential Financial Technology Company',
    role: 'Senior Rust Systems Engineer',
    start: 'Jan 2026', end: 'Present', arrangement: 'Full-time · Remote',
    overview: 'Build and maintain Rust infrastructure for performance-sensitive, real-time financial systems, with a focus on asynchronous networking, concurrent processing, and reliable production behavior.',
    scope: ['Rust', 'Async networking', 'Concurrency', 'Production reliability'],
    bullets: [
      'Develop and maintain performance-sensitive Rust infrastructure for real-time financial systems.',
      'Work on asynchronous networking, concurrent data pipelines, and distributed data processing.',
      'Improve production reliability, latency, and resource efficiency.',
      'Build and maintain robust concurrent systems as part of the infrastructure supporting real-time processing.',
    ],
  },
  {
    company: 'Freenet', role: 'Rust Engineer',
    start: 'May 2024', end: 'Jul 2024', arrangement: 'Part-time · Remote',
    overview: 'Contributed to Freenet’s decentralized networking infrastructure through work in freenet-core and freenet-stdlib, covering node setup, network configuration, and operational reliability.',
    scope: ['Rust', 'Decentralized networking', 'Node configuration'],
    bullets: [
      'Contributed to decentralized networking infrastructure in freenet-core and freenet-stdlib.',
      'Worked on node initialization and configuration in the Rust codebase.',
      'Contributed to hostname resolution and transport-key handling.',
      'Improved event-log reliability and the maintainability of the project workspace.',
    ],
  },
  {
    company: 'Status', role: 'Rust Software Engineer — Nomos',
    start: 'Nov 2022', end: 'Mar 2024', arrangement: 'Full-time · Remote',
    overview: 'Worked on Nomos Layer 1 blockchain infrastructure, with contributions spanning consensus simulation and privacy-preserving communication between nodes.',
    scope: ['Rust', 'Consensus simulation', 'Mixnets', 'Blockchain infrastructure'],
    bullets: [
      'Developed simulation tooling for the Carnot distributed consensus algorithm, supporting the study of protocol behavior.',
      'Contributed Rust infrastructure supporting the Nomos Layer 1 blockchain.',
      'Worked on privacy-preserving networking, including implementation work on mixnets.',
    ],
  },
  {
    company: 'Polar Sync', role: 'Rust and Go Engineer',
    start: 'Jan 2022', end: 'Sep 2023', arrangement: 'Full-time contract · Remote',
    overview: 'Worked across Rust and Go engineering, with a focus on code-generation infrastructure and the abstractions connecting application schemas, queries, and database functionality.',
    scope: ['Rust / Go', 'Procedural macros', 'GraphQL / SQL', 'Query integration'],
    bullets: [
      'Developed Rust procedural macros and reusable code-generation infrastructure.',
      'Worked on GraphQL and SQL functionality, including integration with The Graph subgraphs.',
      'Designed reusable abstractions for database and query integration across these tools.',
    ],
  },
];
