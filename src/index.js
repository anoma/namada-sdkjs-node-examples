// This is required with the published @namada/sdk.
// This bug is being fixed in https://github.com/anoma/namada-interface/issues/1403
require("module-alias/register");

// SDK Imports
const { getSdk } = require("@namada/sdk/node");
const { default: init } = require("@namada/sdk/node-init");
const BigNumber = require("bignumber.js");

// Constants
const { CHAIN_ID, NATIVE_TOKEN, NODE_URL, STORAGE_PATH } = require("./config");

const app = async () => {
  try {
    const { cryptoMemory } = init();
    // TODO: When @namada/sdk v0.15.0 is released, add MASP_URL to the following:
    const sdk = getSdk(cryptoMemory, NODE_URL, STORAGE_PATH, NATIVE_TOKEN);
    console.log({ sdk });

    // Construct a Bond Tx
    const wrapperTxProps = {
      token: NATIVE_TOKEN,
      feeAmount: BigNumber(5),
      gasLimit: BigNumber(20_000),
      chainId: CHAIN_ID,
      // Update this to a valid public key
      publicKey:
        "tpknam1qzz3nvg5zjwdpk5z0x9ngkf7guv9qpqrtz0da7weenwl5766pkkgvvt689t",
    };
    const bondProps = {
      // Update this to a valid source that has balance
      source: "tnam1qqshvryx9pngpk7mmzpzkjkm6klelgusuvmkc0uz",
      // Update this to a valid validator address
      validator: "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
      amount: BigNumber(100),
    };

    const revealPkTx = await sdk.tx.buildRevealPk(wrapperTxProps);
    const signedRevealPkTx = await sdk.signing.sign(revealPkTx, SIGNING_KEY);
    const bondTx = await sdk.tx.buildBond(wrapperTxProps, bondProps);
    const signedBondTx = await sdk.signing.sign(bondTx, SIGNING_KEY);

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
