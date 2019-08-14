import * as Utils from 'web3-utils'; // TODO change to rsk3-utils
import {AbiCoder as EthersAbiCoder} from 'ethers/utils/abi-coder';
import EthAbiCoder from './abiCoder.js';

/**
 * Returns an object of AbiCoder
 *
 * @returns {AbiCoder}
 *
 * @constructor
 */
export function AbiCoder() {
    return new EthAbiCoder(Utils, new EthersAbiCoder());
}
