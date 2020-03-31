import {formatters} from 'web3-core-helpers';
import * as Utils from '@rsksmart/rsk3-utils';

import EventSubscriptionFactory from '../../src/factories/eventSubscriptionFactory';
import EventLogSubscription from '../../src/subscriptions/eventLogSubscription';
import AllEventsLogSubscription from '../../src/subscriptions/allEventsLogSubscription';

// Mocks
jest.mock('web3-core-helpers');
jest.mock('rsk3-utils');
jest.mock('../../src/subscriptions/eventLogSubscription');
jest.mock('../../src/subscriptions/allEventsLogSubscription');

/**
 * EventSubscriptionFactory test
 */
describe('EventSubscriptionFactoryTest', () => {
    let eventSubscriptionFactory;

    beforeEach(() => {
        eventSubscriptionFactory = new EventSubscriptionFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(eventSubscriptionFactory.utils).toEqual(Utils);

        expect(eventSubscriptionFactory.formatters).toEqual(formatters);
    });

    it('calls createEventLogSubscription and returns an EventLogSubscription object', () => {
        expect(eventSubscriptionFactory.createEventLogSubscription({}, {}, {}, {})).toBeInstanceOf(
            EventLogSubscription
        );
    });

    it('calls createAllEventsLogSubscription and returns an AllEventsLogSubscription object', () => {
        expect(eventSubscriptionFactory.createAllEventsLogSubscription({}, {}, {})).toBeInstanceOf(
            AllEventsLogSubscription
        );
    });
});
