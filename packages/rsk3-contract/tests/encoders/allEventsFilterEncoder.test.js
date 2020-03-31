import {AbiCoder} from '@rsksmart/rsk3-abi';
import AbiModel from '../../src/models/abiModel';
import AbiItemModel from '../../src/models/abiItemModel';
import AllEventsFilterEncoder from '../../src/encoders/allEventsFilterEncoder';

// Mocks
jest.mock('rsk3-abi');
jest.mock('../../src/models/abiModel');
jest.mock('../../src/models/abiItemModel');

/**
 * AllEventsFilterEncoder test
 */
describe('AllEventsFilterEncoderTest', () => {
    let allEventsFilterEncoder, abiCoderMock, abiModelMock, abiItemModelMock;

    beforeEach(() => {
        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];
        abiCoderMock.encodeParameter = jest.fn();

        new AbiModel({});
        abiModelMock = AbiModel.mock.instances[0];

        new AbiItemModel({});
        abiItemModelMock = AbiItemModel.mock.instances[0];

        allEventsFilterEncoder = new AllEventsFilterEncoder(abiCoderMock);
    });

    it('calls encode an returns the expected value', () => {
        abiModelMock.getEvents.mockReturnValueOnce({0: abiItemModelMock});

        abiItemModelMock.getIndexedInputs.mockReturnValueOnce([
            {
                type: 'bytes32',
                name: 'myName'
            },
            {
                type: 'uint256[]',
                name: 'arrayItem'
            }
        ]);

        abiCoderMock.encodeParameter.mockReturnValue('0x0');

        const filter = {
            myName: 'theValue',
            arrayItem: [100, 200]
        };

        const topics = allEventsFilterEncoder.encode(abiModelMock, filter);

        expect(topics).toEqual([['0x0', ['0x0', '0x0']]]);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(1, 'bytes32', filter.myName);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(2, 'uint256[]', filter.arrayItem[0]);

        expect(abiCoderMock.encodeParameter).toHaveBeenNthCalledWith(3, 'uint256[]', filter.arrayItem[1]);
    });
});
