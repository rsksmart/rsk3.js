import * as Utils from 'rsk3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractWeb3Module} from 'web3-core';
import Network from '../src/network';

// Mocks
jest.mock('rsk3-utils');
jest.mock('web3-core-helpers');

/**
 * Network test
 */
describe('NetworkTest', () => {
    let network, providerMock, methodFactoryMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};
        methodFactoryMock = {
            hasMethod: () => {
                return false;
            }
        };

        network = new Network(providerMock, methodFactoryMock, Utils, formatters, {}, {});
    });

    it('constructor check', () => {
        expect(network.utils).toEqual(Utils);

        expect(network.formatters).toEqual(formatters);

        expect(network).toBeInstanceOf(AbstractWeb3Module);
    });

    it('calls getNetworkType and resolves to the network name "private', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(0);
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('private');

        expect(callback).toHaveBeenCalledWith(null, 'private');

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "main', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(30);
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('main');

        expect(callback).toHaveBeenCalledWith(null, 'main');

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "morden', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(31);
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('testnet');

        expect(callback).toHaveBeenCalledWith(null, 'testnet');

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and resolves to the network name "ropsten', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.resolve(33);
        });

        await expect(network.getNetworkType(callback)).resolves.toEqual('regtest');

        expect(callback).toHaveBeenCalledWith(null, 'regtest');

        expect(network.getId).toHaveBeenCalled();
    });

    it('calls getNetworkType and rejects the promise', async () => {
        const callback = jest.fn();

        network.getId = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        await expect(network.getNetworkType(callback)).rejects.toEqual(new Error('ERROR'));

        expect(callback).toHaveBeenCalledWith(new Error('ERROR'), null);

        expect(network.getId).toHaveBeenCalled();
    });
});
