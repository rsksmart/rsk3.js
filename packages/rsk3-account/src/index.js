import * as Utils from 'rsk3-utils';
import {formatters} from 'web3-core-helpers';
import MethodFactory from './factories/methodFactory';
import AccountsModule from './accounts';

/**
 * Returns the Accounts object
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Object} options
 * @param {Net.Socket} net
 *
 * @returns {Accounts}
 * @constructor
 */
export function Accounts(provider, net = null, options = {}) {
    return new AccountsModule(provider, Utils, formatters, new MethodFactory(Utils, formatters), options, net);
}
