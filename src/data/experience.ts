export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  arrangement: string;
  bullets: string[];
}
export const experience: Experience[] = [
  {
    company: 'Confidential Financial Technology Company',
    role: 'Senior Rust Systems Engineer',
    start: 'Jan 2026', end: 'Present', arrangement: 'Full-time · Remote',
    bullets: [
      'Develop and maintain performance-sensitive Rust infrastructure for real-time financial systems.',
      'Work on asynchronous networking, concurrent data pipelines, and distributed data processing.',
      'Improve production reliability, latency, and resource efficiency.',
    ],
  },
  {
    company: 'Freenet', role: 'Rust Engineer',
    start: 'May 2024', end: 'Jul 2024', arrangement: 'Part-time · Remote',
    bullets: [
      'Contributed to decentralized networking infrastructure in freenet-core and freenet-stdlib.',
      'Worked on node initialization, configuration, hostname resolution, and transport-key handling.',
      'Improved event-log reliability and workspace maintainability.',
    ],
  },
  {
    company: 'Status', role: 'Rust Software Engineer — Nomos',
    start: 'Nov 2022', end: 'Mar 2024', arrangement: 'Full-time · Remote',
    bullets: [
      'Developed simulation tooling for the Carnot distributed consensus algorithm.',
      'Contributed to infrastructure supporting the Nomos Layer 1 blockchain.',
      'Worked on privacy-preserving networking, including mixnet implementation.',
    ],
  },
  {
    company: 'Polar Sync', role: 'Rust and Go Engineer',
    start: 'Jan 2022', end: 'Sep 2023', arrangement: 'Full-time contract · Remote',
    bullets: [
      'Developed Rust procedural macros and code-generation infrastructure.',
      'Worked on GraphQL, SQL, and The Graph subgraph functionality.',
      'Designed reusable abstractions for database and query integration.',
    ],
  },
];
