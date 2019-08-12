import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {AbiCoder} from 'web3-eth-abi';
import ContractModuleFactory from './factories/contractModuleFactory';

export AbstractContract from './AbstractContract';
export ContractModuleFactory from './factories/contractModuleFactory';

/**
 * TODO: Improve this factory method for the TransactionSigner handling.
 *
 * Returns an object of type Contract
 *
 * @method Contract
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Array} abi
 * @param {Accounts} accounts
 * @param {String} address
 * @param {Object} options
 *
 * @returns {AbstractContract}
 *
 * @constructor
 */
export function Contract(provider, abi, accounts, address, options) {
    return new ContractModuleFactory(Utils, formatters, new AbiCoder()).createContract(
        provider,
        accounts,
        abi,
        address,
        options
    );
}
