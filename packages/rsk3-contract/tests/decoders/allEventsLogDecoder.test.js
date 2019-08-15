import {AbiCoder} from 'rsk3-abi';
import AllEventsLogDecoder from '../../src/decoders/allEventsLogDecoder';
import AbiModel from '../../src/models/abiModel';
import AbiItemModel from '../../src/models/abiItemModel';

// Mocks
jest.mock('rsk3-abi');
jest.mock('../../src/models/abiModel');
jest.mock('../../src/models/abiItemModel');

/**
 * AllEventsLogDecoder test
 */
describe('AllEventsLogDecoderTest', () => {
    let allEventsLogDecoder, abiCoderMock, abiModelMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.decodeLog = jest.fn();

        new AbiModel({});
        abiModelMock = AbiModel.mock.instances[0];

        allEventsLogDecoder = new AllEventsLogDecoder(abiCoderMock);
    });

    it('constructor check', () => {
        expect(allEventsLogDecoder.abiCoder).toEqual(abiCoderMock);
    });

    it('calls decode and returns the expected value', () => {
        new AbiItemModel({});
        const abiItemModel = AbiItemModel.mock.instances[0];

        const response = {
            topics: ['0x0'],
            data: '0x0'
        };

        abiCoderMock.decodeLog.mockReturnValueOnce(['0x0']);

        abiModelMock.getEventBySignature.mockReturnValueOnce(abiItemModel);

        abiItemModel.getInputs.mockReturnValueOnce([]);

        const decodedLog = allEventsLogDecoder.decode(abiModelMock, response);

        expect(decodedLog.data).toEqual(undefined);

        expect(decodedLog.topics).toEqual(undefined);

        expect(decodedLog.raw.data).toEqual('0x0');

        expect(decodedLog.raw.topics).toEqual(['0x0']);

        expect(decodedLog.signature).toEqual(abiItemModel.signature);

        expect(decodedLog.event).toEqual(abiItemModel.name);

        expect(decodedLog.returnValues).toEqual(['0x0']);

        expect(abiModelMock.getEventBySignature).toHaveBeenCalledWith('0x0');

        expect(abiCoderMock.decodeLog).toHaveBeenCalledWith([], '0x0', []);

        expect(abiItemModel.getInputs).toHaveBeenCalled();
    });

    it('calls decode and returns the response without decoding it because there is no event with this name in the ABI', () => {
        const response = {
            topics: ['0x0'],
            data: '0x0'
        };

        abiModelMock.getEventBySignature.mockReturnValueOnce(false);

        const decodedLog = allEventsLogDecoder.decode(abiModelMock, response);

        expect(decodedLog.raw.data).toEqual('0x0');

        expect(decodedLog.raw.topics).toEqual(['0x0']);

        expect(abiModelMock.getEventBySignature).toHaveBeenCalledWith('0x0');
    });
});
