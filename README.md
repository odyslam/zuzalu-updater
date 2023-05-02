# Zuzalu Updater

A [cloudflare worker](https://developers.cloudflare.com/workers/) function that is executed via a cron job and updates the deployed [Zuzalu Oracle](https://github.com/odyslam/zuzalu-oracle) with the latest roots of the various Semaphore groups of Zuzalu.

# Develop

All configuration information is placed in `wrangler.toml`.

## Install locally
- `git clone https://github.com/odyslam/zuzalu-updater`
- `yarn` or `npm install`
- `wrangler dev` to run the worker in dev mode
- `wrangler publish` to host the wrangler in production

## Cron job

The worker is configured to run as a cron job, thus it only has a `scheduled` function and not a `fetch` function. It doesn't serve an endpoint. 

The current cron configuration is to run **every 2 hours** and is defined in `wrangler.toml`.

## Env variables

- `CONTRACT_ADDRESS`: The address of the oracle

Env variables are defined in `wrangler.toml`.

## Secrets

- `ETH_RPC_URL`: The RPC url (with the api token) for the network. 
- `PRIVATE_KEY`: The private key of the contract's `owner`.

Secrets are created by running `wrangler secret put <SECRET_NAME>`

# License

MIT
