# B8-28 before-state verification

Verified on September 24, 2026, before either scored run. These are setup checks, not model run results.

Windsor File in zz215@expert.micro1.ai returned all three Sable & Sage datasets. Every source value was compared with its connector readback: **6,003 cells matched**, allowing only Boolean text and empty/null presentation differences.

- Spend: account 375, 84 rows, 1,428 cells matched.
- Orders: account 376, 122 rows, 1,220 cells matched.
- Touchpoints: account 378, 305 rows, 3,355 cells matched.

The JSON readbacks, field discovery and machine-readable verification report are in this folder. Include source_row_id when querying to preserve raw records. Deduplicate purchases on order_id and touchpoints on touch_id, not source_row_id.

Readback dates: August 16 to September 21, 2026, to cover the input timing cases. Reporting window: August 24 to September 20 inclusive, Africa/Nairobi. Look back seven days from each conversion for eligible clicks.

The initial import cached an older schema and aggregated duplicate orders. Adding unique source-row references and refreshing the connection resolved this before testing. The final source revision is 771c2c14c41ebeecfddd05c5ec3e40db549436a3. Spend and orders use the main CSV URLs; touchpoints use the pinned revision URL. Keep these source files unchanged for both runs.

Screenshots are saved separately in the local Downloads/B8-28_Windsor_Before/Screenshots folder. The GitHub data folder contains source data only. Synthetic File data does not establish native ad-platform connectivity or causal incrementality.
