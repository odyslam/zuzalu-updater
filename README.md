# Zuzalu Updater

A [cloudflare worker](https://developers.cloudflare.com/workers/) function that is executed via a cron job and updates the deployed [Zuzalu Oracle](https://github.com/odyslam/zuzalu-oracle) with the latest roots of the various Semaphore groups of Zuzalu.

# Develop

All configuration information is placed in `wrangler.toml`.

## Env variables

- `CONTRACT_ADDRESS`: The address of the oracle

Env variables are defined in `wrangler.toml`.

## Secrets

- `ETH_RPC_URL`: The RPC url (with the api token) for the network. 
- `PRIVATE_KEY`: The private key of the contract's `owner`.

Secrets are created by running `wrangler secret put <SECRET_NAME>`

# License

MIT
