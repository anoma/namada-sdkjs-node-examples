// This is required with the published @namada/sdk.
// This bug is being fixed in https://github.com/anoma/namada-interface/issues/1403
require("module-alias/register");

const dbManager = require("node-indexeddb/dbManager");
const BigNumber = require("bignumber.js");
const path = require("path");

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
  STORAGE_PATH,
} = require("./config");

const shieldedDataDir = path.resolve(STORAGE_PATH);

async function loadDB() {
  // Some asynchronous operation
  await dbManager.loadCache().catch(console.error);
  // Dynamically import the module
  require("node-indexeddb/auto");
}

const app = async () => {
  await loadDB();
  try {
    const { cryptoMemory } = init();
    const sdk = getSdk(
      cryptoMemory,
      NODE_URL,
      MASP_URL,
      shieldedDataDir,
      NATIVE_TOKEN,
    );
    const { feeAmount, gasLimit } = GAS_CONFIG;

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

    // TODO: Why is this returning "false" even when the params are present? See exception note below:
    if (!(await sdk.masp.hasMaspParams())) {
      console.log("MASP params not found!");
      console.log("Fetching MASP params...");
      // TODO: Why is this throwing an exception? This catch ignores the exception:
      await sdk.masp.fetchAndStoreMaspParams().catch((e) => console.warn(e));
    }

    console.log("Loading MASP params...");
    await sdk.masp.loadMaspParams(shieldedDataDir, CHAIN_ID);

    // console.log("Shielded Sync...");
    // TODO: Provide any viewing keys as first argument to sync balances:
    // await sdk.rpc.shieldedSync([], CHAIN_ID);

    console.log("Building shielding transfer...");
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
