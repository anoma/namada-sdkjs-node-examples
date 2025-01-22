const BigNumber = require("bignumber.js");
const path = require("path");

// This is required with the published @namada/sdk.
// This bug is being fixed in https://github.com/anoma/namada-interface/issues/1403
require("module-alias/register");

// SDK Imports
const { getSdk } = require("@namada/sdk/node");
const { default: init } = require("@namada/sdk/node-init");

// Constants
const {
  CHAIN_ID,
  KEYS_1,
  NATIVE_TOKEN,
  NODE_URL,
  MASP_URL,
  GAS_CONFIG,
  PAYMENT_ADDRESS,
} = require("./config");

const app = async () => {
  try {
    const { cryptoMemory } = init();
    const sdk = getSdk(
      cryptoMemory,
      NODE_URL,
      MASP_URL,
      path.resolve("./data"),
      NATIVE_TOKEN,
    );
    console.log({ sdk });
    const { feeAmount, gasLimit } = GAS_CONFIG;

    // Construct a Bond Tx
    const wrapperTxProps = {
      token: NATIVE_TOKEN,
      feeAmount,
      gasLimit,
      chainId: CHAIN_ID,
      publicKey: KEYS_1.public,
    };

    const shieldingTransferProps = {
      target: PAYMENT_ADDRESS,
      data: [
        {
          source: KEYS_1.address,
          token: NATIVE_TOKEN,
          amount: BigNumber(1),
        },
      ],
    };

    // Load MASP Params
    const maspParamLocation = "./data"; // TODO: Store masp params
    console.log("Fetching MASP params...");
    // TODO: Load masp params locally instead
    await sdk.masp.fetchAndStoreMaspParams();
    console.log("Loading MASP params...");
    await sdk.masp.loadMaspParams(maspParamLocation, CHAIN_ID);

    const shieldingTransfer = await sdk.tx.buildShieldingTransfer(
      wrapperTxProps,
      shieldingTransferProps,
    );
    console.log({ shieldingTransfer });
  } catch (e) {
    console.error(e);
  }
};

app();
