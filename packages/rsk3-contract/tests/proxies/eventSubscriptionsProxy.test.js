import AbstractContract from '../../src/abstractContract';
import AbiModel from '../../src/models/abiModel';
import EventSubscriptionFactory from '../../src/factories/eventSubscriptionFactory';
import EventOptionsMapper from '../../src/mappers/eventOptionsMapper';
import EventLogDecoder from '../../src/decoders/eventLogDecoder';
import AllEventsLogDecoder from '../../src/decoders/allEventsLogDecoder';
import AllEventsOptionsMapper from '../../src/mappers/allEventsOptionsMapper';
import EventLogSubscription from '../../src/subscriptions/eventLogSubscription';
import AllEventsLogSubscription from '../../src/subscriptions/allEventsLogSubscription';
import AbiItemModel from '../../src/models/abiItemModel';
import EventSubscriptionsProxy from '../../src/proxies/eventSubscriptionsProxy';

// Mocks
jest.mock('../../src/abstractContract');
jest.mock('../../src/models/abiModel');
jest.mock('../../src/factories/eventSubscriptionFactory');
jest.mock('../../src/mappers/eventOptionsMapper');
jest.mock('../../src/decoders/eventLogDecoder');
jest.mock('../../src/decoders/allEventsLogDecoder');
jest.mock('../../src/mappers/allEventsOptionsMapper');
jest.mock('../../src/models/abiItemModel');
jest.mock('../../src/subscriptions/eventLogSubscription');
jest.mock('../../src/subscriptions/allEventsLogSubscription');

/**
 * EventSubscriptionsProxy test
 */
describe('EventSubscriptionsProxyTest', () => {
    let eventSubscriptionsProxy,
        contractMock,
        abiModelMock,
        eventSubscriptionFactoryMock,
        eventOptionsMapperMock,
        eventLogDecoderMock,
        allEventsLogDecoderMock,
        allEventsOptionsMapperMock,
        abiItemModelMock;

    beforeEach(() => {
        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];
        contractMock.abiModel = abiModelMock;

        new EventSubscriptionFactory();
        eventSubscriptionFactoryMock = EventSubscriptionFactory.mock.instances[0];

        new EventOptionsMapper();
        eventOptionsMapperMock = EventOptionsMapper.mock.instances[0];

        new EventLogDecoder();
        eventLogDecoderMock = EventLogDecoder.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        new AllEventsOptionsMapper();
        allEventsOptionsMapperMock = AllEventsOptionsMapper.mock.instances[0];

        new AbiItemModel();
        abiItemModelMock = AbiItemModel.mock.instances[0];

        eventSubscriptionsProxy = new EventSubscriptionsProxy(
            contractMock,
            eventSubscriptionFactoryMock,
            eventOptionsMapperMock,
            eventLogDecoderMock,
            allEventsLogDecoderMock,
            allEventsOptionsMapperMock
        );
    });

    it('constructor check', () => {
        expect(eventSubscriptionsProxy.contract).toEqual(contractMock);

        expect(eventSubscriptionsProxy.eventSubscriptionFactory).toEqual(eventSubscriptionFactoryMock);

        expect(eventSubscriptionsProxy.eventOptionsMapper).toEqual(eventOptionsMapperMock);

        expect(eventSubscriptionsProxy.eventLogDecoder).toEqual(eventLogDecoderMock);

        expect(eventSubscriptionsProxy.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(eventSubscriptionsProxy.allEventsOptionsMapper).toEqual(allEventsOptionsMapperMock);
    });

    it('subscribes an event over the proxy', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(true);

        abiModelMock.getEvent.mockReturnValueOnce(abiItemModelMock);

        new EventLogSubscription();
        const options = {
            filter: []
        };

        const eventLogSubscriptionMock = EventLogSubscription.mock.instances[0];

        eventLogSubscriptionMock.subscribe = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return eventLogSubscriptionMock;
        });

        eventSubscriptionFactoryMock.createEventLogSubscription.mockReturnValueOnce(eventLogSubscriptionMock);

        eventOptionsMapperMock.map.mockReturnValueOnce({options: true});

        const subscription = eventSubscriptionsProxy.MyEvent(options, () => {});

        expect(subscription).toEqual(eventLogSubscriptionMock);

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('MyEvent');

        expect(abiModelMock.getEvent).toHaveBeenCalledWith('MyEvent');

        expect(eventSubscriptionFactoryMock.createEventLogSubscription).toHaveBeenCalledWith(
            eventLogDecoderMock,
            contractMock,
            {options: true},
            abiItemModelMock
        );

        expect(eventOptionsMapperMock.map).toHaveBeenCalledWith(abiItemModelMock, contractMock, options);
    });

    it('subscribes an event over the proxy with a filter and topics set', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(true);

        const options = {
            filter: [],
            topics: []
        };

        expect(() => {
            eventSubscriptionsProxy.MyEvent(options, () => {});
        }).toThrow('Invalid subscription options: Only filter or topics are allowed and not both');

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('MyEvent');

        expect(abiModelMock.getEvent).toHaveBeenCalledWith('MyEvent');
    });

    it('subscribes to all events over the proxy', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(false);

        abiModelMock.getEvent.mockReturnValueOnce(abiItemModelMock);

        new AllEventsLogSubscription();
        const options = {
            filter: []
        };

        const allEventsLogSubscription = AllEventsLogSubscription.mock.instances[0];

        allEventsLogSubscription.subscribe = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return allEventsLogSubscription;
        });

        eventSubscriptionFactoryMock.createAllEventsLogSubscription.mockReturnValueOnce(allEventsLogSubscription);

        allEventsOptionsMapperMock.map.mockReturnValueOnce({options: true});

        const subscription = eventSubscriptionsProxy.allEvents(options, () => {});

        expect(subscription).toEqual(allEventsLogSubscription);

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('allEvents');

        expect(eventSubscriptionFactoryMock.createAllEventsLogSubscription).toHaveBeenCalledWith(
            allEventsLogDecoderMock,
            contractMock,
            {options: true}
        );

        expect(allEventsOptionsMapperMock.map).toHaveBeenCalledWith(abiModelMock, contractMock, options);
    });

    it('subscribes to all evens over the proxy with a filter and topics set', () => {
        abiModelMock.hasEvent.mockReturnValueOnce(false);

        const options = {
            filter: [],
            topics: []
        };

        expect(() => {
            eventSubscriptionsProxy.allEvents(options, () => {});
        }).toThrow('Invalid subscription options: Only filter or topics are allowed and not both');

        expect(abiModelMock.hasEvent).toHaveBeenCalledWith('allEvents');
    });

    it('calls a property on the target that does not exist', () => {
        expect(() => {
            eventSubscriptionsProxy.doesNotExist();
        }).toThrow('eventSubscriptionsProxy.doesNotExist is not a function');
    });
});
