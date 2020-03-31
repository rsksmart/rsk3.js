import * as Utils from '@rsksmart/rsk3-utils';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import {AbstractWeb3Module} from 'web3-core';
import MethodFactory from '../src/factories/methodFactory';
import Personal from '../src/personal';

// Mocks
jest.mock('rsk3-utils');
jest.mock('web3-core-helpers');
jest.mock('web3-net');

/**
 * Personal test
 */
describe('PersonalTest', () => {
    let personal, providerMock, methodFactory, networkMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactory = new MethodFactory(Utils, formatters);

        new Network();
        networkMock = Network.mock.instances[0];

        personal = new Personal(providerMock, methodFactory, networkMock, Utils, formatters, {}, {});
    });

    it('constructor check', () => {
        expect(personal.net).toEqual(networkMock);

        expect(personal.utils).toEqual(Utils);

        expect(personal.formatters).toEqual(formatters);

        expect(personal).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls setProvider and returns true', () => {
        networkMock.setProvider = jest.fn();
        networkMock.setProvider.mockReturnValueOnce(true);

        expect(personal.setProvider(providerMock, 'net')).toEqual(true);

        expect(networkMock.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });

    it('sets the defaultGasPrice property', () => {
        personal.defaultGasPrice = 10;

        expect(personal.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        personal.defaultGas = 10;

        expect(personal.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        personal.transactionBlockTimeout = 10;

        expect(personal.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        personal.transactionConfirmationBlocks = 10;

        expect(personal.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        personal.transactionPollingTimeout = 10;

        expect(personal.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValue('0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826');

        personal.defaultAccount = 'cd2a3d9f938e13cd947ec05abc7fe734df8dd826';
        expect(personal.defaultAccount).toEqual('0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826');
        expect(networkMock.defaultAccount).toEqual('cd2a3d9f938e13cd947ec05abc7fe734df8dd826');
        // TODO: add this line after replacing web3-core with rsk3
        // expect(Utils.toChecksumAddress).toHaveBeenCalledWith('cd2a3d9f938e13cd947ec05abc7fe734df8dd826');
    });

    it('sets the defaultBlock property', () => {
        personal.defaultBlock = 1;

        expect(personal.defaultBlock).toEqual(1);

        expect(networkMock.defaultBlock).toEqual(1);
    });
});
