import * as Utils from 'rsk3-utils';
import {formatters} from 'web3-core-helpers';
import GetUncleMethod from '../../src/methods/getUncleMethod';

/**
 * GetUncleMethodTest test
 */
describe('GetUncleMethodTest', () => {
    let getUncleMethod;

    beforeEach(() => {
        getUncleMethod = new GetUncleMethod(Utils, formatters, {});
    });

    it('constructor check', () => {
        expect(getUncleMethod.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });

    it('calls execute with hash', () => {
        getUncleMethod.parameters = ['0x0', '1'];

        getUncleMethod.beforeExecution({});

        expect(getUncleMethod.rpcMethod).toEqual('eth_getUncleByBlockHashAndIndex');
    });

    it('calls execute with number', () => {
        getUncleMethod.parameters = [100, '1'];

        getUncleMethod.beforeExecution({});

        expect(getUncleMethod.rpcMethod).toEqual('eth_getUncleByBlockNumberAndIndex');
    });
});
