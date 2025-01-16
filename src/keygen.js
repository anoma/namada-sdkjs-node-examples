// This is required with the published @namada/sdk.
// This bug is being fixed in https://github.com/anoma/namada-interface/issues/1403
require("module-alias/register");

// SDK Imports
const { getSdk } = require("@namada/sdk/node");
const { default: init } = require("@namada/sdk/node-init");

// Constants
const { NATIVE_TOKEN, NODE_URL, STORAGE_PATH } = require("./config");

const app = async () => {
  try {
    const { cryptoMemory } = init();
    // TODO: When @namada/sdk v0.15.0 is released, add MASP_URL to the following:
    const sdk = getSdk(cryptoMemory, NODE_URL, STORAGE_PATH, NATIVE_TOKEN);

    const { mnemonic, keys } = sdk;

    const phrase = mnemonic.generate().join(" ");
    const isValid = mnemonic.validateMnemonic(phrase);
    console.log("Mnemonic phrase: ", phrase);
    console.log("Is mnemonic valid?", isValid);

    const bip44Path = { account: 0, change: 0, index: 0 }; // Bip44 path - default
    const keypair = keys.deriveFromMnemonic(phrase, bip44Path);
    console.log("Generated transparent keys:", { keypair, bip44Path });
  } catch (e) {
    console.error(e);
  }
};

app();
