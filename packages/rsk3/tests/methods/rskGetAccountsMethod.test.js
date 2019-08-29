import {AbstractWeb3Module} from 'web3-core';
import {GetAccountsMethod} from 'web3-core-method';
import RskGetAccountsMethod from '../../src/methods/rskGetAccountsMethod';

// Mocks
jest.mock('web3-core');

/**
 * EthGetAccountsMethod test
 */
describe('RskGetAccountsMethodTest', () => {
    let method, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        accountsMock = {};
        accountsMock.wallet = {0: {privateKey: '0x0', address: '0x0'}, accountsIndex: 1};

        new AbstractWeb3Module({}, {}, {}, {});
        moduleInstanceMock = {};
        moduleInstanceMock.accounts = accountsMock;

        method = new RskGetAccountsMethod({}, {}, moduleInstanceMock);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(GetAccountsMethod);
    });

    it('calls execute with unlocked accounts', async () => {
        const response = await method.execute();

        expect(response).toEqual(['0x0']);
    });
});
