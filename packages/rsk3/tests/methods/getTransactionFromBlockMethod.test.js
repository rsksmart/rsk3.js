import * as Utils from '@rsksmart/rsk3-utils';
import {formatters} from 'web3-core-helpers';
import GetTransactionFromBlockMethod from '../../src/methods/getTransactionFromBlockMethod';

/**
 * GetTransactionFromBlockMethod test
 */
describe('GetTransactionFromBlockMethodTest', () => {
    let getTransactionFromBlockMethod;

    beforeEach(() => {
        getTransactionFromBlockMethod = new GetTransactionFromBlockMethod(Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });

    it('calls execute with hash', () => {
        getTransactionFromBlockMethod.parameters = ['0x0', '1'];

        getTransactionFromBlockMethod.beforeExecution({});

        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockHashAndIndex');
    });

    it('calls execute with number', () => {
        getTransactionFromBlockMethod.parameters = [100, '1'];

        getTransactionFromBlockMethod.beforeExecution({});

        expect(getTransactionFromBlockMethod.rpcMethod).toEqual('eth_getTransactionByBlockNumberAndIndex');
    });
});
