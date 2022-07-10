require("@nomiclabs/hardhat-waffle");

const ICE_PRIVATE_KEY = "YOUR PRIVATE KEY";

module.exports = {
  solidity: "0.8.12",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    testnet: {
      url: `https://arctic-rpc.icenetwork.io:9933`,
      accounts: [`0x${ICE_PRIVATE_KEY}`]
    },
    hardhat: {
      chainId: 1337
    }
  }
};
