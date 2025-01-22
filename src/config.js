const BigNumber = require("bignumber.js");

// NOTE:  These values are for the Campfire testnet. Please update these to match your environment
const CHAIN_ID = "campfire-square.ff09671d333707";
const NODE_URL = "https://rpc.campfire.tududes.com";
const MASP_URL = "https://masp.campfire.tududes.com";
const NATIVE_TOKEN = "tnam1qy440ynh9fwrx8aewjvvmu38zxqgukgc259fzp6h";
const STORAGE_PATH = ".";

const VALIDATOR = "tnam1qx5f39v5wynm5z0yc7xzuf9w535w9gn2qgkewyd5";

const KEYS_1 = {
  address: "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
  public: "tpknam1qptrn64myunqr4847yq4cn0uwek5ecwc7eeexjfc5npmd5kmg6ex563n5as",
  private: "59f0d21f1c7375697275d8fe6ef58b06505f5a073aeca5c5b05e0dda24bd6324",
};

const KEYS_2 = {
  address: "tnam1qpmzld3cdtwptlklhxmdavtn7hu6afsv9vjw5ul7",
  public: "tpknam1qrkdqnj89p82kun2fj7az83n9mummglf6n23jfwa8l5fkq83w8a6s0pfmmc",
  private: "bebb118517e09c950841d849eb3e07e27e6cb9c59a8e71179220fa570d5d770f",
};

const GAS_CONFIG = {
  feeAmount: BigNumber(0.1),
  gasLimit: BigNumber(5_000),
};

const PAYMENT_ADDRESS =
  "znam1wzrkk8tcz8zxxv0j3ssckjnantguzj2gnzypvvmg0xwy6k45w4glvv2s9yhl8magw8dx7kz0u4h";

module.exports = {
  CHAIN_ID,
  GAS_CONFIG,
  KEYS_1,
  KEYS_2,
  MASP_URL,
  NATIVE_TOKEN,
  NODE_URL,
  PAYMENT_ADDRESS,
  STORAGE_PATH,
  VALIDATOR,
};
