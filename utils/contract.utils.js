require('dotenv').config();
const ethers = require('ethers');

const { PoFInternalValidator } = require('../constants/pof.contract');
const rpcapi = process.env.NETWORK_RPC;
const chaindID = parseInt(process.env.NETWORK_CHAINID);
const provider = new ethers.providers.JsonRpcProvider(rpcapi, chaindID);

const loadContract = () => {
  try {
    let abi = PoFInternalValidator.ABI;
    console.log('Loaded: ', PoFInternalValidator.ADDRESS[chaindID]);
    let contract = new ethers.Contract(
      PoFInternalValidator.ADDRESS[chaindID],
      abi,
      provider
    );
    return contract;
  } catch (error) {
    console.log(error);
  }
};

const contractutils = {
  loadContract,
};

module.exports = contractutils;
