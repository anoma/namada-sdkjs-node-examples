const BigNumber = require("bignumber.js");

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
  KEYS_2,
  NATIVE_TOKEN,
  NODE_URL,
  STORAGE_PATH,
  MASP_URL,
  VALIDATOR,
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

    // Optional: Calculate a UTC Unix Timestamp for specifying expiration
    const now = new Date();
    // Set expiration to 1 Hour (this is also the default)
    now.setHours(now.getHours() + 1);
    const utcTimestamp = Math.floor(now.getTime() / 1000);

    const { feeAmount, gasLimit } = GAS_CONFIG;

    // Construct a Bond Tx
    const wrapperTxProps = {
      token: NATIVE_TOKEN,
      feeAmount,
      gasLimit,
      chainId: CHAIN_ID,
      publicKey: KEYS_1.public,
      // Optional expiration timestamp
      expiration: utcTimestamp,
      // Optional alternate wrapper fee payer (Public Key)
      wrapperFeePayer: KEYS_2.public,
    };

    const bondProps = {
      // Update this to a valid source that has balance
      source: KEYS_1.address,
      // Update this to a valid validator address
      validator: VALIDATOR,
      amount: BigNumber(100),
    };

    const revealPkTx = await sdk.tx.buildRevealPk(wrapperTxProps);
    const signedRevealPkTx = await sdk.signing.sign(revealPkTx, [
      KEYS_1.private,
      // If paying fees with a different account, also provide signing key for that keypair
      KEYS_2.private,
    ]);

    const bondTx = await sdk.tx.buildBond(wrapperTxProps, bondProps);
    const signedBondTx = await sdk.signing.sign(bondTx, [
      KEYS_1.private,
      // If paying fees with a different account, also provide signing key for that keypair
      KEYS_2.private,
    ]);

    // Reveal the public key on chain if it hasn't previously been used
    const revealPkResponse = await sdk.rpc.broadcastTx(
      signedRevealPkTx,
      wrapperTxProps,
    );
    const bondTxResponse = await sdk.rpc.broadcastTx(
      signedBondTx,
      wrapperTxProps,
    );

    console.log(
      `Result of broadcasting RevealPK Tx for ${wrapperTxProps.publicKey}`,
      revealPkResponse,
    );
    console.log(
      `Result of broadcasting Bond Tx ${bondTx.hash}`,
      bondTxResponse,
    );

    const balance = await sdk.rpc.queryBalance(
      "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
      [NATIVE_TOKEN],
      CHAIN_ID,
    );
    console.log("Balance:", balance);
  } catch (e) {
    console.warn(e);
  }
};

app();
