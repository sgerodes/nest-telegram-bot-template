# TON Service Setup

This service uses TonCenter as the HTTP provider. You need an API key for higher rate limits.

## Get TonCenter API key
1. Open https://toncenter.com/
2. In Telegram, open the @toncenter bot
3. Generate an API key

## Environment variables
Set these in your `.env`:

- `TON_API_URL` (mainnet): `https://toncenter.com/api/v2/jsonRPC`
- `TON_API_KEY`: your TonCenter API key
- `TON_TIMEOUT_MS`: optional request timeout in ms (e.g. `5000`)

## Usage
The bot command `/ton_balance <address>` calls `TonService.getBalance()` and returns the balance.
