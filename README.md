# @namada/sdk - NodeJS Example

This is an example repo that demonstrates loading `@namada/sdk` into a simple NodeJS app.

## Usage

First, install dependencies:

```bash
yarn
```

_Optionally_, you can update the constants in `src/config.js` to your liking. This is currently configured for the Campfire Testnet.

Then, you can run the example as follows:

```bash
node src/index.js
```

## Broadcasting a Tx directly to an RPC endpoint

There is also an example that can be run which will properly protobuf-encode your Tx to be broadcasted directly to an RPC endpoint:

```bash
node src/protobuf.js
```

## TODO

Upcoming improvements:

- Update for TypeScript
- Update to latest `@namada/sdk` when `0.15.0` is published.
- When the `@namada/sdk` exports issue is fixed, it will be updated accordingly here.
