import AbiModel from '../models/abiModel';
import AbiItemModel from '../models/abiItemModel';
import MethodEncoder from '../encoders/methodEncoder';
import EventFilterEncoder from '../encoders/eventFilterEncoder';
import AllEventsFilterEncoder from '../encoders/allEventsFilterEncoder';
import EventLogDecoder from '../decoders/eventLogDecoder';
import AllEventsLogDecoder from '../decoders/allEventsLogDecoder';
import AbiMapper from '../mappers/abiMapper';
import MethodOptionsMapper from '../mappers/methodOptionsMapper';
import EventOptionsMapper from '../mappers/eventOptionsMapper';
import AllEventsOptionsMapper from '../mappers/allEventsOptionsMapper';
import MethodsProxy from '../proxies/methodsProxy';
import EventSubscriptionsProxy from '../proxies/eventSubscriptionsProxy';
import MethodOptionsValidator from '../validators/methodOptionsValidator';
import MethodFactory from './methodFactory';
import EventSubscriptionFactory from './eventSubscriptionFactory';
import AbstractContract from '../abstractContract';

export default class ContractModuleFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(utils, formatters, abiCoder) {
        this.utils = utils;
        this.formatters = formatters;
        this.abiCoder = abiCoder;
    }

    /**
     * Returns an object of type AbstractContract
     *
     * @method createContract
     *
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {Accounts} accounts
     * @param {Array} abi
     * @param {String} address
     * @param {Object} options
     *
     * @returns {AbstractContract}
     */
    createContract(provider, accounts, abi, address, options) {
        return new AbstractContract(
            provider,
            this,
            accounts,
            this.abiCoder,
            this.utils,
            this.formatters,
            abi,
            address,
            options
        );
    }

    /**
     * Returns an object of type AbiModel
     *
     * @method createAbiModel
     *
     * @param {Object} mappedAbi
     *
     * @returns {AbiModel}
     */
    createAbiModel(mappedAbi) {
        return new AbiModel(mappedAbi);
    }

    /**
     * Returns an object of type AbiItemModel
     *
     * @method createAbiItemModel
     *
     * @param {Object} abiItem
     *
     * @returns {AbiItemModel}
     */
    createAbiItemModel(abiItem) {
        return new AbiItemModel(abiItem);
    }

    /**
     * Returns an object of type MethodEncoder
     *
     * @method createMethodEncoder
     *
     * @returns {MethodEncoder}
     */
    createMethodEncoder() {
        return new MethodEncoder(this.abiCoder);
    }

    /**
     * Returns an object of type EventFilterEncoder
     *
     * @method createEventFilterEncoder
     *
     * @returns {EventFilterEncoder}
     */
    createEventFilterEncoder() {
        return new EventFilterEncoder(this.abiCoder);
    }

    /**
     * Returns an object of type AllEventsFilterEncoder
     *
     * @method createAllEventsFilterEncoder
     *
     * @returns {AllEventsFilterEncoder}
     */
    createAllEventsFilterEncoder() {
        return new AllEventsFilterEncoder(this.abiCoder);
    }

    /**
     * Returns an object oftype AbiMapper
     *
     * @method createAbiMapper
     *
     * @returns {AbiMapper}
     */
    createAbiMapper() {
        return new AbiMapper(this, this.abiCoder, this.utils);
    }

    /**
     * Returns an object of type EventLogDecoder
     *
     * @method createEventLogDecoder
     *
     * @returns {EventLogDecoder}
     */
    createEventLogDecoder() {
        return new EventLogDecoder(this.abiCoder);
    }

    /**
     * Returns an object of type AllEventsLogDecoder
     *
     * @method createAllEventsLogDecoder
     *
     * @returns {AllEventsLogDecoder}
     */
    createAllEventsLogDecoder() {
        return new AllEventsLogDecoder(this.abiCoder);
    }

    /**
     * Returns an object of type MethodOptionsValidator
     *
     * @method createMethodOptionsValidator
     *
     * @returns {MethodOptionsValidator}
     */
    createMethodOptionsValidator() {
        return new MethodOptionsValidator(this.utils);
    }

    /**
     * Returns an object of type MethodOptionsMapper
     *
     * @method createMethodOptionsMapper
     *
     * @returns {MethodOptionsMapper}
     */
    createMethodOptionsMapper() {
        return new MethodOptionsMapper(this.utils, this.formatters);
    }

    /**
     * Returns an object of type EventOptionsMapper
     *
     * @method createEventOptionsMapper
     *
     * @returns {EventOptionsMapper}
     */
    createEventOptionsMapper() {
        return new EventOptionsMapper(this.formatters, this.createEventFilterEncoder());
    }

    /**
     * Returns an object of type AllEventsOptionsMapper
     *
     * @method createAllEventsOptionsMapper
     *
     * @returns {AllEventsOptionsMapper}
     */
    createAllEventsOptionsMapper() {
        return new AllEventsOptionsMapper(this.formatters, this.createAllEventsFilterEncoder());
    }

    /**
     * Returns an object of type MethodFactory
     *
     * @method createMethodFactory
     *
     * @returns {MethodFactory}
     */
    createMethodFactory() {
        return new MethodFactory(this.utils, this.formatters, this, this.abiCoder);
    }

    /**
     * Returns an object of type MethodsProxy
     *
     * @method createMethodsProxy
     *
     * @param {AbstractContract} contract
     *
     * @returns {MethodsProxy}
     */
    createMethodsProxy(contract) {
        return new MethodsProxy(
            contract,
            this.createMethodFactory(),
            this.createMethodEncoder(),
            this.createMethodOptionsValidator(),
            this.createMethodOptionsMapper()
        );
    }

    /**
     * Returns an object of type EventSubscriptionsProxy
     *
     * @method createEventSubscriptionsProxy
     *
     * @param {AbstractContract} contract
     *
     * @returns {EventSubscriptionsProxy}
     */
    createEventSubscriptionsProxy(contract) {
        return new EventSubscriptionsProxy(
            contract,
            this.createEventSubscriptionFactory(),
            this.createEventOptionsMapper(),
            this.createEventLogDecoder(),
            this.createAllEventsLogDecoder(),
            this.createAllEventsOptionsMapper()
        );
    }

    /**
     * Returns an object of type EventSubscriptionFactory
     *
     * @method createEventSubscriptionFactory
     *
     * @returns {EventSubscriptionFactory}
     */
    createEventSubscriptionFactory() {
        return new EventSubscriptionFactory(this.utils, this.formatters);
    }
}
