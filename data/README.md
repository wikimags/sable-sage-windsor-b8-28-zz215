# Sable & Sage cross-channel attribution inputs

Synthetic preparation data for Windsor.ai B8-28. Campaign window: August 24 through September 20, 2026, inclusive, Africa/Nairobi. Currency: USD. This is a frozen fictional snapshot, with no personal data, ad spend or live campaigns.

- `channel-daily.csv`: 84 rows, one day per campaign across Meta Ads, Google Ads and TikTok Ads. Includes spend, impressions, clicks and each platform's purchase/revenue claims.
- `orders.csv`: 122 raw rows representing 120 unique completed orders. Two identical redeliveries retain their original order IDs. Revenue belongs to the order and must only be counted once.
- `touchpoints.csv`: Dated, identified journeys with paid clicks, direct visits, repeat clicks, duplicate deliveries, a touch outside the lookback, a post-purchase touch and 60 non-converting journeys. Dates before the campaign window support lookback coverage.

Join by `order_id` and confirm `journey_id`. Deduplicate orders by order ID and touches by touch ID. Retain completed orders in the campaign window. Eligible paid clicks must occur no later than conversion and within the preceding seven days, inclusive. Direct-only orders remain unattributed to paid media. Empty order IDs identify non-converting journeys.

The platform reports deliberately overlap: each channel claims an order when it has an eligible click. These claims are synthetic and use one common seven-day click, conversion-date definition for a fair reconciliation. Do not treat repeated clicks on one channel as separate platform conversions.

For a reproducible comparison, calculate channel-linear attribution by assigning equal shares to each distinct eligible paid channel for an order. Also compare first-paid-click and last-paid-click. A repeat click on the same channel does not increase that channel's linear weight, but may change the last-click channel. Do not multiply spend or revenue by the number of journey rows. Spend covers the campaign window, while attribution uses the stated lookback; this is a conversion-window reporting comparison, not a fully cohort-matched acquisition ROI study.

These source files are to be connected using Windsor File. The channel labels do not mean native ad accounts are connected. Rules-based credit is not causal lift. No randomized control group, counterfactual outcome or verified incremental-conversion measurement is present.
