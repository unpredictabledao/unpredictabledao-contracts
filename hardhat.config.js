require("@nomiclabs/hardhat-waffle");

const ICE_PRIVATE_KEY = "4939efda6329c6ab785f01771066551d22276bce9b49bb637f8cefa57cedb637";

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
    },
    localhost: {
      chainId: 1337
    }
  }
};
