import {AbiCoder} from 'web3-eth-abi';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';

import MethodOptionsValidator from '../../src/validators/methodOptionsValidator';
import MethodOptionsMapper from '../../src/mappers/methodOptionsMapper';
import EventSubscriptionsProxy from '../../src/proxies/eventSubscriptionsProxy';
import MethodsProxy from '../../src/proxies/methodsProxy';
import EventSubscriptionFactory from '../../src/factories/eventSubscriptionFactory';
import AllEventsOptionsMapper from '../../src/mappers/allEventsOptionsMapper';
import EventOptionsMapper from '../../src/mappers/eventOptionsMapper';
import AllEventsLogDecoder from '../../src/decoders/allEventsLogDecoder';
import EventLogDecoder from '../../src/decoders/eventLogDecoder';
import AbiMapper from '../../src/mappers/abiMapper';
import AllEventsFilterEncoder from '../../src/encoders/allEventsFilterEncoder';
import EventFilterEncoder from '../../src/encoders/eventFilterEncoder';
import MethodEncoder from '../../src/encoders/methodEncoder';
import AbiItemModel from '../../src/models/abiItemModel';
import AbiModel from '../../src/models/abiModel';
import AbstractContract from '../../src/abstractContract';
import MethodFactory from '../../src/factories/methodFactory';
import ContractModuleFactory from '../../src/factories/contractModuleFactory';

// Mocks
jest.mock('web3-eth-abi');
jest.mock('web3-utils');
jest.mock('web3-core-helpers');
jest.mock('../../src/validators/methodOptionsValidator');
jest.mock('../../src/mappers/methodOptionsMapper');
jest.mock('../../src/proxies/eventSubscriptionsProxy');
jest.mock('../../src/proxies/methodsProxy');
jest.mock('../../src/factories/eventSubscriptionFactory');
jest.mock('../../src/mappers/allEventsOptionsMapper');
jest.mock('../../src/mappers/eventOptionsMapper');
jest.mock('../../src/decoders/allEventsLogDecoder');
jest.mock('../../src/decoders/eventLogDecoder');
jest.mock('../../src/mappers/abiMapper');
jest.mock('../../src/encoders/allEventsFilterEncoder');
jest.mock('../../src/encoders/eventFilterEncoder');
jest.mock('../../src/encoders/methodEncoder');
jest.mock('../../src/models/abiItemModel');
jest.mock('../../src/models/abiModel');
jest.mock('../../src/abstractContract');
jest.mock('../../src/factories/methodFactory');

/**
 * ContractModuleFactory test
 */
describe('ContractModuleFactoryTest', () => {
    let contractModuleFactory, abiCoderMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        contractModuleFactory = new ContractModuleFactory(Utils, formatters, abiCoderMock);
    });

    it('constructor check', () => {
        expect(contractModuleFactory.utils).toEqual(Utils);

        expect(contractModuleFactory.formatters).toEqual(formatters);

        expect(contractModuleFactory.abiCoder).toEqual(abiCoderMock);
    });

    it('calls createContract and returns an AbstractContract object', () => {
        expect(contractModuleFactory.createContract({}, {}, {}, [], '', {})).toBeInstanceOf(AbstractContract);
    });

    it('calls createAbiModel and returns an AbiModel object', () => {
        expect(contractModuleFactory.createAbiModel({})).toBeInstanceOf(AbiModel);
    });

    it('calls createAbiItemModel and returns an AbiItemModel object', () => {
        expect(contractModuleFactory.createAbiItemModel({})).toBeInstanceOf(AbiItemModel);
    });

    it('calls createMethodEncoder and returns an MethodEncoder object', () => {
        expect(contractModuleFactory.createMethodEncoder()).toBeInstanceOf(MethodEncoder);
    });

    it('calls createEventFilterEncoder and returns an EventFilterEncoder object', () => {
        expect(contractModuleFactory.createEventFilterEncoder()).toBeInstanceOf(EventFilterEncoder);
    });

    it('calls createAllEventsFilterEncoder and returns an AllEventsFilterEncoder object', () => {
        expect(contractModuleFactory.createAllEventsFilterEncoder()).toBeInstanceOf(AllEventsFilterEncoder);
    });

    it('calls createAbiMapper and returns an AbiMapper object', () => {
        expect(contractModuleFactory.createAbiMapper()).toBeInstanceOf(AbiMapper);
    });

    it('calls createEventLogDecoder and returns an EventLogDecoder object', () => {
        expect(contractModuleFactory.createEventLogDecoder()).toBeInstanceOf(EventLogDecoder);
    });

    it('calls createAllEventsLogDecoder and returns an AllEventsLogDecoder object', () => {
        expect(contractModuleFactory.createAllEventsLogDecoder()).toBeInstanceOf(AllEventsLogDecoder);
    });

    it('calls createMethodOptionsValidator and returns an MethodOptionsValidator object', () => {
        expect(contractModuleFactory.createMethodOptionsValidator()).toBeInstanceOf(MethodOptionsValidator);
    });

    it('calls createMethodOptionsMapper and returns an MethodOptionsMapper object', () => {
        expect(contractModuleFactory.createMethodOptionsMapper()).toBeInstanceOf(MethodOptionsMapper);
    });

    it('calls createEventOptionsMapper and returns an EventOptionsMapper object', () => {
        expect(contractModuleFactory.createEventOptionsMapper()).toBeInstanceOf(EventOptionsMapper);
    });

    it('calls createAllEventsOptionsMapper and returns an AllEventsOptionsMapper object', () => {
        expect(contractModuleFactory.createAllEventsOptionsMapper()).toBeInstanceOf(AllEventsOptionsMapper);
    });

    it('calls createMethodFactory and returns an MethodFactory object', () => {
        expect(contractModuleFactory.createMethodFactory()).toBeInstanceOf(MethodFactory);
    });

    it('calls createMethodsProxy and returns an MethodsProxy object', () => {
        expect(contractModuleFactory.createMethodsProxy({}, {}, {})).toBeInstanceOf(MethodsProxy);
    });

    it('calls createEventSubscriptionsProxy and returns an EventSubscriptionsProxy object', () => {
        expect(contractModuleFactory.createEventSubscriptionsProxy({}, {}, {})).toBeInstanceOf(EventSubscriptionsProxy);
    });

    it('calls createEventSubscriptionFactory and returns an EventSubscriptionFactory object', () => {
        expect(contractModuleFactory.createEventSubscriptionFactory()).toBeInstanceOf(EventSubscriptionFactory);
    });
});
