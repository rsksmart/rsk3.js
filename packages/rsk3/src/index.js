import {formatters} from 'web3-core-helpers';
import {Accounts} from 'rsk3-account';
import {ContractModuleFactory} from 'rsk3-contract';
import {Personal} from 'rsk3-personal';
import {AbiCoder} from 'rsk3-abi';
import {Network} from 'rsk3-net';
import * as Utils from 'rsk3-utils';
import RskTransactionSigner from './signers/transactionSigner';
import MethodFactory from './factories/methodFactory';
import SubscriptionsFactory from './factories/subscriptionsFactory';
import {ProviderResolver} from 'web3-providers';
import RskModule from './rsk3.js';

/**
 * Creates the TransactionSigner class
 *
 * @returns {TransactionSigner}
 * @constructor
 */
export function TransactionSigner() {
    return new RskTransactionSigner(Utils, formatters);
}

/**
 * Creates the Rsk3 object
 *
 * @method Rsk3
 *
 * @param {AbstractSocketProvider|HttpProvider|CustomProvider|String} provider
 * @param {Net} net
 * @param {Object} options
 *
 * @returns {Rsk3}
 * @constructor
 */
export function Rsk3(provider, net = null, options = {}) {
    if (!options.transactionSigner || options.transactionSigner.type === 'TransactionSigner') {
        options.transactionSigner = new TransactionSigner();
    }

    const resolvedProvider = new ProviderResolver().resolve(provider, net);
    const accounts = new Accounts(resolvedProvider, null, options);
    const abiCoder = new AbiCoder();

    return new RskModule(
        resolvedProvider,
        new MethodFactory(Utils, formatters),
        new Network(resolvedProvider, null, options),
        accounts,
        new Personal(resolvedProvider, null, accounts, options),
        abiCoder,
        Utils,
        formatters,
        new SubscriptionsFactory(Utils, formatters),
        new ContractModuleFactory(Utils, formatters, abiCoder, accounts),
        options,
        net
    );
}
