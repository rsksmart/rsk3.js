import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {LogSubscription} from 'web3-core-subscriptions';
import {GetPastLogsMethod} from 'web3-core-method';
import AllEventsLogSubscription from '../../src/subscriptions/allEventsLogSubscription';
import AbstractContract from '../../src/abstractContract';
import AllEventsLogDecoder from '../../src/decoders/allEventsLogDecoder';
import AbiModel from '../../src/models/abiModel';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');
jest.mock('web3-core-method');
jest.mock('../../src/abstractContract');
jest.mock('../../src/decoders/allEventsLogDecoder');
jest.mock('../../src/models/abiModel');

/**
 * AllEventsLogSubscription test
 */
describe('AllEventsLogSubscriptionTest', () => {
    let allEventsLogSubscription, contractMock, getPastLogsMethodMock, allEventsLogDecoderMock, abiModelMock;

    beforeEach(() => {
        new AbstractContract();
        contractMock = AbstractContract.mock.instances[0];

        new GetPastLogsMethod();
        getPastLogsMethodMock = GetPastLogsMethod.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        allEventsLogSubscription = new AllEventsLogSubscription(
            {},
            Utils,
            formatters,
            contractMock,
            getPastLogsMethodMock,
            allEventsLogDecoderMock,
            abiModelMock
        );
    });

    it('constructor check', () => {
        expect(allEventsLogSubscription.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(allEventsLogSubscription.abiModel).toEqual(abiModelMock);

        expect(allEventsLogSubscription).toBeInstanceOf(LogSubscription);
    });

    it('calls onNewSubscriptionItem returns the decoded items', () => {
        allEventsLogDecoderMock.decode.mockReturnValueOnce(true);

        formatters.outputLogFormatter.mockReturnValueOnce({item: false});

        expect(allEventsLogSubscription.onNewSubscriptionItem({item: true})).toEqual(true);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith(abiModelMock, {item: false});

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({item: true});
    });

    it('calls onNewSubscriptionItem returns the decoded items and triggers the changed event', (done) => {
        allEventsLogDecoderMock.decode.mockReturnValueOnce(true);

        formatters.outputLogFormatter.mockReturnValueOnce({item: false, removed: true});

        allEventsLogSubscription.on('changed', (decodedLog) => {
            expect(decodedLog).toEqual(true);

            done();
        });

        expect(allEventsLogSubscription.onNewSubscriptionItem({item: true, removed: true})).toEqual(true);

        expect(allEventsLogDecoderMock.decode).toHaveBeenCalledWith(abiModelMock, {item: false, removed: true});

        expect(formatters.outputLogFormatter).toHaveBeenCalledWith({item: true, removed: true});
    });
});
