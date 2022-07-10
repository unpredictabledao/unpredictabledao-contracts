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
    acala: {
      chainId: 595,
      gasPrice: 429496729610000,
      url: `https://tc7-eth.aca-dev.network`,
      accounts: [`0x${ICE_PRIVATE_KEY}`]
    },
    astar: {
      chainId: 81,
      url: `https://evm.shibuya.astar.network/`,
      accounts: [`0x${ICE_PRIVATE_KEY}`]
    },
    hardhat: {
      chainId: 1337
    }
  }
};
