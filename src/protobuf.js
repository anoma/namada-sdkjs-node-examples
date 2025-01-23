// Protobuf encoded Tx example
require("module-alias/register");
const protobuf = require("protobufjs");
const path = require("path");

// SDK Imports
const { getSdk } = require("@namada/sdk/node");
const { default: init } = require("@namada/sdk/node-init");

// Constants
const {
  CHAIN_ID,
  NATIVE_TOKEN,
  NODE_URL,
  KEYS_1,
  STORAGE_PATH,
  MASP_URL,
  GAS_CONFIG,
} = require("./config");

const app = async () => {
  try {
    const { cryptoMemory } = init();
    const sdk = getSdk(
      cryptoMemory,
      NODE_URL,
      MASP_URL,
      STORAGE_PATH,
      NATIVE_TOKEN,
    );
    console.log({ sdk });

    const { feeAmount, gasLimit } = GAS_CONFIG;

    // Construct a Bond Tx
    const wrapperTxProps = {
      token: NATIVE_TOKEN,
      chainId: CHAIN_ID,
      feeAmount,
      gasLimit,
      publicKey: KEYS_1.public,
    };

    const revealPkTx = await sdk.tx.buildRevealPk(wrapperTxProps);
    const signedRevealPkTx = await sdk.signing.sign(revealPkTx, KEYS_1.private);

    console.log({ signedRevealPkTx });

    protobuf.load(
      path.resolve("./src/types/types.proto"),
      function (err, root) {
        console.log({ err, root });

        const NamadaTx = root.lookupType("types.Tx");
        const payload = { data: signedRevealPkTx };

        // Validate message payload
        const errMsg = NamadaTx.verify(payload);
        if (errMsg) throw Error(errMsg);

        const message = NamadaTx.create(payload);
        const buffer = NamadaTx.encode(message).finish();
        const base64Tx = buffer.toString("base64");

        console.log({ buffer, base64: base64Tx });

        fetch(NODE_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: -1,
            method: "broadcast_tx_sync",
            params: [base64Tx],
          }),
        })
          .then(async (rawResponse) => {
            const txResponse = await rawResponse.json();
            console.log({ txResponse });
          })
          .catch((e) => {
            console.error(e);
          });
      },
    );
  } catch (e) {
    console.error(e);
  }
};

app();
