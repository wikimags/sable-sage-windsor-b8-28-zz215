# Sable & Sage attribution test: B8-28

Before-state preparation for the Windsor.ai desktop connector benchmark. All records are fictional. The user chose the synthetic Windsor File setup because no native paid-ad accounts are connected.

## Source data

Campaign window: August 24 to September 20, 2026, Africa/Nairobi; USD; seven-day click lookback. The three CSVs represent spend and platform claims, completed orders, and timestamped customer journeys. See [data definitions](data/README.md) and the [data folder](data).

- `sable_b8_28_spend`: 84 daily campaign rows, three paid channels, $8,400 spend.
- `sable_b8_28_orders`: 122 raw rows, 120 unique completed orders, $24,000 revenue.
- `sable_b8_28_touches`: 305 raw touch rows, 303 unique touch IDs, including 60 non-converting journeys.

The input contains intentional overlap and duplicate-delivery cases, along with direct-only orders and out-of-window/post-conversion touches. These must be handled explicitly.

## Scope of this setup

This tests connector retrieval followed by a reproducible cross-channel attribution calculation. It does not demonstrate native Google Ads/Meta/TikTok authentication or a proprietary Windsor attribution-model execution. The exposed connector tools were inspected; no standalone attribution-model execution tool was listed. The benchmark's native-platform prerequisite is therefore not fully reproduced by this approved synthetic alternative.

An observational attribution model distributes credit. It cannot establish which channel caused incremental conversions without additional causal evidence. The expected result must disclose that limitation.

## Review and reproducibility

Run `node build-fixture.cjs` to regenerate the frozen inputs and expected calculations. Source data should remain unchanged during both scored runs. Store screenshots separately in the local before-evidence folder. The repository's data folder contains only source files and definitions.
