import {formatters} from 'web3-core-helpers';
import * as Utils from 'rsk3-utils';
import MethodFactory from './factories/methodFactory';
import NetworkModule from './network.js';

/**
 * Creates the Network Object
 *
 * @method Network
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 *
 * @returns {Network}
 */
export function Network(provider, net = null, options = {}) {
    return new NetworkModule(provider, new MethodFactory(Utils, formatters), Utils, formatters, options, null);
}
