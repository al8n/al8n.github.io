# Public content sources

Reviewed on 2026-11-05. Role titles, dates, public responsibilities, contact information, and education follow the owner's supplied engineering-site brief. Polar Sync's full-time contract arrangement follows the owner's explicit clarification. No private recruitment PDF was copied into this workspace or used as a deployed asset.

## Project verification

Descriptions are conservative summaries of public repository READMEs, Cargo manifests, and, for hostaddr, its published Rust documentation. The 30 public repositories and their root manifests and READMEs were retrieved directly through the authenticated GitHub API for the expanded collection. The owner’s Discord screenshots supply the nine primary categories and project names; existing projects are retained, with a separate storage-engine category for skipdb. No star counts, performance benchmarks, or live download totals are shown. The résumé's undated aggregate-download snapshot was omitted rather than presented as a current metric.

| Project | Primary source | Scope reflected in this site |
| --- | --- | --- |
| memberlist | https://github.com/al8n/memberlist | SWIM and Lifeguard membership; Sans-I/O core; pluggable transports and runtimes |
| serf | https://github.com/al8n/serf | Gossip discovery and coordination; runtime and WASM/WASI support |
| agnostic | https://github.com/al8n/agnostic | Runtime-agnostic async abstractions; networking |
| getifs | https://github.com/al8n/getifs | Cross-platform interfaces, addresses, MTUs, gateways, and routing |
| hostaddr | https://github.com/al8n/hostaddr ; https://docs.rs/hostaddr/latest/hostaddr/ | Validated domain/host/endpoint types |
| peekable | https://github.com/al8n/peekable | Buffered non-consuming inspection of sync and async readers |
| fs4 | https://github.com/al8n/fs4 | File locking, allocation, filesystem utilities; explicitly credits fs2-rs ancestry |
| fmmap | https://github.com/al8n/fmmap | High-level mmap with sync and async interfaces |
| atomic-time | https://github.com/al8n/atomic-time | Atomic time types; lock freedom is platform-dependent |
| wg | https://github.com/al8n/wg | Sync/async WaitGroup coordination, including no_std |
| skipdb | https://github.com/al8n/skipdb | In-memory MVCC, optimistic and serializable snapshot isolation; no durability claim |
| skl | https://github.com/al8n/skl | Arena-backed concurrent skiplists for memtables |
| stretto | https://github.com/al8n/stretto | Memory-bound concurrent cache; credits Ristretto inspiration |
| caches-rs | https://github.com/al8n/caches-rs | LRU/LFU-family implementations; published crate is `caches` |
| tokora | https://github.com/al8n/tokora | On-demand lexing, explicit backtracking, diagnostics; no parser-generator claim |
| smear | https://github.com/al8n/smear | Zero-copy GraphQL lexer, parser, validator; optional Sans-I/O execution core behind non-default `proto` feature |

| buffo | https://github.com/al8n/buffo | Sans-I/O codec buffers, mutable/read-only chunks, no_std |
| varing | https://github.com/al8n/varing | Protobuf varint and LEB128 encoding/decoding; const operations |
| memmapix | https://github.com/al8n/memmapix | Cross-platform memory mapping using rustix |
| emailaddr | https://github.com/al8n/emailaddr | Validated email types; generic storage, IDNA, no_std/no_alloc |
| iradix | https://github.com/al8n/iradix | Persistent copy-on-write radix trie; Rc/Arc structural sharing |
| smol-bytes | https://github.com/al8n/smol-bytes | Inline small buffers, shared heap bytes, UTF-8 wrappers |
| memspan | https://github.com/al8n/memspan | SIMD byte-class scanning with runtime dispatch and scalar fallbacks |
| cronp | https://github.com/al8n/cronp | Multiple cron dialects; no_std/no_alloc parsing |
| hick | https://github.com/al8n/hick | mDNS/DNS-SD; Sans-I/O core and runtime drivers |
| hardware-address | https://github.com/al8n/hardware-address | MAC-48, EUI-48/EUI-64, 20-octet IPoIB address types |
| iprfc | https://github.com/al8n/iprfc | Curated RFC address blocks and checked-in IANA snapshots, not a live routing/security policy |
| iprobe | https://github.com/al8n/iprobe | Host IPv4, IPv6, and IPv4-mapped IPv6 support probing |
| among | https://github.com/al8n/among | Three-case sum type; no_std and optional integrations |
| whichdisk | https://github.com/al8n/whichdisk | Path-to-volume resolution, usage, filesystem capabilities and volume identity |

`pql` is included only by the name and lexer/parser category supplied in the owner’s screenshot. Its source is not public; no private README, implementation, description, or repository link is included.

The `fs4-rs` repository URL was observed redirecting to `al8n/fs4`; the site uses the canonical URL. Cargo workspace/member identities were checked against the retrieved manifests and README installation blocks. The site omits a crates.io link for smear because its current package publication was not independently established. All 30 public repository URLs were verified through GitHub. The crates.io website returned HTTP 403 from this environment, so registry-page response checks remain unverified; repository and README evidence supports the listed crate identities. New source-only cards omit unverified package links.

All 30 linked repositories were public and not archived at the verification time. This does not establish a future maintenance commitment, and the site makes no all-projects-actively-maintained claim. Public ownership does not imply exclusive authorship: derivation is credited for fs4 and stretto.

## Employment and education

The public brief is the source for Freenet, Status/Nomos, and education dates and descriptions. These records have not been independently certified. Carnot work is described as simulation tooling, not authorship of the protocol. Overlapping Status and Polar Sync dates are preserved. Optional GPA and honours classification are omitted to keep the public CV focused.

## Platform references

Astro GitHub Pages guidance: https://docs.astro.build/en/guides/deploy/github/

The deployment uses static output and the official GitHub Pages upload/deploy actions. The existing private website repository was inspected directly. Its legacy Flutter files were replaced while preserving the four earlier commits. The former legacy Pages build failed without deployment during replacement. The owner has now approved public deployment through the GitHub Actions workflow.
