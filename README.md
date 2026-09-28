# Fapshi Checkout

Public hosted checkout for merchant payment links (initiate-pay / `merchant-link`).

Production: **https://checkout.fapshi.com/{mongoId}**  
Sandbox (initiate-pay with sandbox keys): **https://checkout.fapshi.com/test/{mongoId}**  
Sandbox routes call **`https://sandbox.fapshi.com`** for `merchant-link`, `merchantpay/*`, and status. Live routes use **`https://api.fapshi.com`** (or `NEXT_PUBLIC_API_URL`).

## Setup

```bash
cd checkout
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:8093/{24-char-link-id}** or **http://localhost:8093/preview?embed=1&name=…&logo=…&color=…**

## Environment

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Optional override for live API (default: `https://api.fapshi.com`) |
| `CHECKOUT_ORIGIN` | `Origin` header for merchant pay endpoints |

## API (via Fapshi backend)

| Step | Endpoint |
|------|----------|
| Load link | `GET /merchant-link/:mongoId` (includes service `logo` and `color` when set) |
| Pay MoMo | `POST /merchantpay/momo` (proxied at `/api/pay/merchant/momo`) |
| Poll | `GET /merchant-pay-status/:transId` |
| SMS | `POST /merchantpay/sms` (proxied at `/api/pay/merchant/sms`) |

## Routes

| Route | Description |
|-------|-------------|
| `/{mongoId}` | Hosted checkout session (live API) |
| `/test/{mongoId}` | Sandbox checkout (`sandbox.fapshi.com` API + amber banner) |
| `/test/payment/:id` | Legacy sandbox redirect → `/test/{id}` |
| `/payment/:id` | Legacy redirect → `/{id}` |
| `/test/success/:transferId` | Sandbox success page |
| `/receipt/:transferId` | Payment receipt (print) — live |
| `/test/receipt/:transferId` | Payment receipt — sandbox |
| `/preview` | Dashboard iframe preview (`embed=1`, query-driven) |
| `/success/:transferId` | Standalone success page |

## Dashboard preview

Set on the dashboard (optional local dev):

`NEXT_PUBLIC_CHECKOUT_URL=http://localhost:8093`

Preview URL: `/preview?embed=1&name=…&logo=…&color=…&sandbox=1`
