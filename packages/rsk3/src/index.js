import {AbstractWeb3Module} from 'web3-core';
import {ProviderDetector, ProvidersModuleFactory} from 'web3-providers';
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

export default class Rsk3 extends AbstractWeb3Module {
    constructor(provider, net, options = {}) {
        super(provider, options, new MethodFactory(Utils, formatters), net);

        if (!options.transactionSigner || options.transactionSigner.type === 'TransactionSigner') {
            options.transactionSigner = new RskTransactionSigner(Utils, formatters);
        }

        const providerResolver = new ProvidersModuleFactory().createProviderResolver();

        const resolvedProvider = providerResolver.resolve(provider, net);

        this.net = new Network(resolvedProvider, null, options);
        this.accounts = new Accounts(resolvedProvider, null, options);
        this.personal = new Personal(resolvedProvider, null, this.accounts, options);
        this.abiCoder = new AbiCoder();
        // TODO: RNS here
        this.formatters = formatters;
        this.subscriptionsFactory = new SubscriptionsFactory(Utils, formatters);
        this.contractModuleFactory = new ContractModuleFactory(Utils, formatters, this.abiCoder, this.accounts);
        this.initiatedContracts = [];
        this._transactionSigner = options.transactionSigner;

        /**
         * This wrapper function is required for the "new web3.eth.Contract(...)" call.
         *
         * @param {Object} abi
         * @param {String} address
         * @param {Object} options
         *
         * @returns {AbstractContract}
         *
         * @constructor
         */
        this.Contract = (abi, address, options = {}) => {
            const contract = this.contractModuleFactory.createContract(
                this.currentProvider,
                this.accounts,
                abi,
                address,
                {
                    defaultAccount: options.from || options.defaultAccount || this.defaultAccount,
                    defaultBlock: options.defaultBlock || this.defaultBlock,
                    defaultGas: options.gas || options.defaultGas || this.defaultGas,
                    defaultGasPrice: options.gasPrice || options.defaultGasPrice || this.defaultGasPrice,
                    transactionBlockTimeout: options.transactionBlockTimeout || this.transactionBlockTimeout,
                    transactionConfirmationBlocks:
                        options.transactionConfirmationBlocks || this.transactionConfirmationBlocks,
                    transactionPollingTimeout: options.transactionPollingTimeout || this.transactionPollingTimeout,
                    transactionSigner: this.transactionSigner,
                    data: options.data
                }
            );

            this.initiatedContracts.push(contract);

            return contract;
        };
    }

    /**
     * Getter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @returns {TransactionSigner}
     */
    get transactionSigner() {
        return this._transactionSigner;
    }

    /**
     * TODO: Remove setter
     *
     * Setter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @param {TransactionSigner} transactionSigner
     */
    set transactionSigner(transactionSigner) {
        if (transactionSigner.type && transactionSigner.type === 'TransactionSigner') {
            throw new Error('Invalid TransactionSigner given!');
        }

        this._transactionSigner = transactionSigner;
        this.accounts.transactionSigner = transactionSigner;
        this.ens.transactionSigner = transactionSigner;

        this.initiatedContracts.forEach((contract) => {
            contract.transactionSigner = transactionSigner;
        });
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions() {
        return super.clearSubscriptions('eth_unsubscribe');
    }

    /**
     * Sets the defaultGasPrice property on all contracts and on all sub-modules
     *
     * @property defaultGasPrice
     *
     * @param {String|Number} value
     */
    set defaultGasPrice(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGasPrice = value;
        });

        this.net.defaultGasPrice = value;
        this.personal.defaultGasPrice = value;

        super.defaultGasPrice = value;
    }

    /**
     * Gets the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {String|Number} value
     */
    get defaultGasPrice() {
        return super.defaultGasPrice;
    }

    /**
     * Sets the defaultGas property on all contracts and on all sub-modules
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultGas = value;
        });

        this.net.defaultGas = value;
        this.personal.defaultGas = value;

        super.defaultGas = value;
    }

    /**
     * Gets the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {String|Number} value
     */
    get defaultGas() {
        return super.defaultGas;
    }

    /**
     * Sets the transactionBlockTimeout property on all contracts and on all sub-modules
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.transactionBlockTimeout = value;
        });

        this.net.transactionBlockTimeout = value;
        this.personal.transactionBlockTimeout = value;

        super.transactionBlockTimeout = value;
    }

    /**
     * Gets the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number} value
     */
    get transactionBlockTimeout() {
        return super.transactionBlockTimeout;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on all sub-modules
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.transactionConfirmationBlocks = value;
        });

        this.net.transactionConfirmationBlocks = value;
        this.personal.transactionConfirmationBlocks = value;

        super.transactionConfirmationBlocks = value;
    }

    /**
     * Gets the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number} value
     */
    get transactionConfirmationBlocks() {
        return super.transactionConfirmationBlocks;
    }

    /**
     * Sets the transactionPollingTimeout property on all contracts and on all sub-modules
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.transactionPollingTimeout = value;
        });

        this.net.transactionPollingTimeout = value;
        this.personal.transactionPollingTimeout = value;

        super.transactionPollingTimeout = value;
    }

    /**
     * Gets the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number} value
     */
    get transactionPollingTimeout() {
        return super.transactionPollingTimeout;
    }

    /**
     * Sets the defaultAccount property on all contracts and on the personal module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultAccount = Rsk3.utils.toChecksumAddress(value);
        });

        this.net.defaultAccount = value;
        this.personal.defaultAccount = value;

        super.defaultAccount = value;
    }

    /**
     * Gets the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {String} value
     */
    get defaultAccount() {
        return super.defaultAccount;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param {String|Number}value
     */
    set defaultBlock(value) {
        this.initiatedContracts.forEach((contract) => {
            contract.defaultBlock = value;
        });

        this.net.defaultBlock = value;
        this.personal.defaultBlock = value;

        super.defaultBlock = value;
    }

    /**
     * Gets the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number} value
     */
    get defaultBlock() {
        return super.defaultBlock;
    }

    /**
     * Gets and executes subscription for an given type
     *
     * @method subscribe
     *
     * @param {String} type
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription}
     */
    subscribe(type, options, callback) {
        return this.subscriptionsFactory.getSubscription(this, type, options).subscribe(callback);
    }

    /**
     * Extends setProvider method from AbstractWeb3Module.
     * This is required for updating the provider also in the sub packages and objects related to Eth.
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        const setContractProviders = this.initiatedContracts.every((contract) => {
            return contract.setProvider(provider, net);
        });

        return (
            this.net.setProvider(provider, net) &&
            this.personal.setProvider(provider, net) &&
            this.ens.setProvider(provider, net) &&
            super.setProvider(provider, net) &&
            setContractProviders
        );
    }

    /**
     * Returns the detected provider
     *
     * @returns {Object}
     */
    static get givenProvider() {
        return ProviderDetector.detect();
    }

    static get utils() {
        return Utils;
    }

    static get Net() {
        const providerResolver = new ProvidersModuleFactory().createProviderResolver();

        return (provider, options, net) => {
            return new Network(providerResolver.resolve(provider, net), options);
        };
    }

    static get Personal() {
        const providerResolver = new ProvidersModuleFactory().createProviderResolver();

        return (provider, options, net) => {
            return new Personal(providerResolver.resolve(provider, net), options);
        };
    }
}
