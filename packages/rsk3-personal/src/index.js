import {Network} from 'web3-net';
import * as Utils from '@rsksmart/rsk3-utils';
import {formatters} from 'web3-core-helpers';
import {ProviderResolver} from 'web3-providers';
import MethodFactory from './factories/methodFactory';
import PersonalModule from './personal.js';

/**
 * Returns the Personal object
 *
 * @method Personal
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 *
 * @returns {Personal}
 */
export function Personal(provider, net = null, options = {}) {
    const resolvedProvider = new ProviderResolver().resolve(provider, net);

    return new PersonalModule(
        resolvedProvider,
        new MethodFactory(Utils, formatters),
        new Network(resolvedProvider, null, options),
        Utils,
        formatters,
        options,
        null
    );
}
