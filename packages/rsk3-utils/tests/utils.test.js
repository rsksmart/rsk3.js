import {
    isBN,
    hexToNumber,
    keccak256,
    isAddress,
    toChecksumAddress,
    stripHexPrefix,
    checkAddressChecksum,
    toHex,
    toBN,
    hexToNumberString,
    numberToHex,
    hexToUtf8,
    hexToAscii,
    utf8ToHex,
    asciiToHex,
    toWei,
    fromWei,
    toTwosComplement,
    jsonInterfaceMethodToString
} from '../src';
import BN from 'bn.js';
import * as CryptoJS from 'crypto-js';
import cjsSha3 from 'crypto-js/sha3';

/**
 * Utils test
 */
describe('UtilsTest', () => {
    it('calls hexToNumber and returns the expected results', () => {
        const tests = [
            {
                value: '0x1a',
                expected: 26
            },
            {
                value: '0x1b',
                expected: 27
            }
        ];

        tests.forEach((test) => {
            expect(hexToNumber(test.value)).toEqual(test.expected);
        });
    });
    it('calls isBN and returns the expected results', () => {
        const tests = [
            {
                value: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {value: new Function(), is: false},
            /* eslint-enable no-new-func */
            {value: 'function', is: false},
            {value: {}, is: false},
            {value: String('hello'), is: false},
            {value: new BN(0), is: true},
            {value: 132, is: false},
            {value: '0x12', is: false}
        ];

        tests.forEach((test) => {
            expect(isBN(test.value)).toEqual(test.is);
        });
    });

    describe('calls keccak256', () => {
        it('should return keccak256 with hex prefix', () => {
            expect(keccak256('test123')).toEqual(
                '0x' +
                    cjsSha3('test123', {
                        outputLength: 256
                    }).toString()
            );

            expect(keccak256('test(int)')).toEqual(
                '0x' +
                    cjsSha3('test(int)', {
                        outputLength: 256
                    }).toString()
            );
        });

        it('should return keccak256 with hex prefix when hex input', () => {
            const keccak256Hex = (value) => {
                if (value.length > 2 && value.substr(0, 2) === '0x') {
                    value = value.substr(2);
                }
                value = CryptoJS.enc.Hex.parse(value);

                return cjsSha3(value, {
                    outputLength: 256
                }).toString();
            };

            expect(keccak256('0x80')).toEqual('0x' + keccak256Hex('0x80'));

            expect(keccak256('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')).toEqual(
                '0x' + keccak256Hex('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
            );
        });

        it('should return keccak256 with hex prefix in hex style', () => {
            const test = (value, expected) => {
                expect(keccak256(value)).toEqual(expected);
            };

            test('test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad');
            test('test(int)', '0xf4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1');
            test('0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421');
            test(
                '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
                '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
            );
        });
    });

    it('calls isAddress with chainId 30 (RSK Mainnet) and returns the expected results', () => {
        const tests = [
            {value: '0xCD2a3d9F938E13CD947ec05Abc7Fe734DF8dd826', is: true},
            {value: '0x7986b3DF570230288501EEA3D890bD66948c9B79', is: true},
            {value: '0x0A3aa774752Ec2042c46548456C094A76c7F3A79', is: true},
            {value: '0xcf7CdBBB5F7bA79D3FFe74A0Bba13fc0295F6036', is: true},
            {value: '0x39b12c05e8503356E3A7DF0b7b33EFA4C054c409', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false}
        ];

        tests.forEach((test) => {
            expect(isAddress(test.value, 30)).toEqual(test.is);
        });
    });

    it('calls isAddress with chainId 31 (RSK testnet) and returns the expected results', () => {
        const tests = [
            {value: '0xCD2a3D9f938e13cD947ec05abC7Fe734Df8DD826', is: true},
            {value: '0x7986B3Df570230288501eea3D890bD66948c9b79', is: true},
            {value: '0x0a3aa774752Ec2042C46548456c094A76C7F3a79', is: true},
            {value: '0xcF7cDbbB5F7BA79D3FFe74a0bBA13fc0295F6036', is: true},
            {value: '0x39B12C05e8503356E3a7DF0B7b33efa4C054C409', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false}
        ];

        tests.forEach((test) => {
            expect(isAddress(test.value, 31)).toEqual(test.is);
        });
    });

    it('calls isAddress with chainId 33 (RSK regtest) and returns the expected results', () => {
        const tests = [
            {
                value: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {value: new Function(), is: false},
            /* eslint-enable */
            {value: 'function', is: false},
            {value: {}, is: false},

            {value: '0xEC4DdeB4380ad69b3e509baad9F158cdF4E4681d', is: true},
            {value: '0xCd2a3D9f938e13Cd947EC05aBc7fE734df8dD826', is: true},
            {value: '0x39B12c05e8503356e3a7DF0B7B33EfA4C054c409', is: true},
            {value: '0xa4DEa4d5c954f5Fd9E87f0e9752911E83A3D18b3', is: true},
            {value: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', is: false}
        ];

        tests.forEach((test) => {
            expect(isAddress(test.value, 33)).toEqual(test.is);
        });
    });

    it('calls toChecksumAddress with chainId 30 (RSK Mainnet) and returns the expected results', () => {
        const tests = [
            {value: 'cd2a3d9f938e13cd947ec05abc7fe734df8dd826', is: '0xCD2a3d9F938E13CD947ec05Abc7Fe734DF8dd826'},
            {value: '7986b3df570230288501eea3d890bd66948c9b79', is: '0x7986b3DF570230288501EEA3D890bD66948c9B79'},
            {value: '0a3aa774752ec2042c46548456c094a76c7f3a79', is: '0x0A3aa774752Ec2042c46548456C094A76c7F3A79'},
            {value: 'cf7cdbbb5f7ba79d3ffe74a0bba13fc0295f6036', is: '0xcf7CdBBB5F7bA79D3FFe74A0Bba13fc0295F6036'}
        ];

        tests.forEach((test) => {
            expect(toChecksumAddress(test.value, 30)).toEqual(test.is);
        });
    });

    it('calls toChecksumAddress with chainId 31 (RSK testnet) and returns the expected results', () => {
        const tests = [
            {value: 'cd2a3d9f938e13cd947ec05abc7fe734df8dd826', is: '0xCD2a3D9f938e13cD947ec05abC7Fe734Df8DD826'},
            {value: '7986b3df570230288501eea3d890bd66948c9b79', is: '0x7986B3Df570230288501eea3D890bD66948c9b79'},
            {value: '0a3aa774752ec2042c46548456c094a76c7f3a79', is: '0x0a3aa774752Ec2042C46548456c094A76C7F3a79'},
            {value: 'cf7cdbbb5f7ba79d3ffe74a0bba13fc0295f6036', is: '0xcF7cDbbB5F7BA79D3FFe74a0bBA13fc0295F6036'}
        ];

        tests.forEach((test) => {
            expect(toChecksumAddress(test.value, 31)).toEqual(test.is);
        });
    });

    it('calls toChecksumAddress with chainId 33 (RSK regtest) and returns the expected results', () => {
        const tests = [
            {value: 'cd2a3d9f938e13cd947ec05abc7fe734df8dd826', is: '0xCd2a3D9f938e13Cd947EC05aBc7fE734df8dD826'},
            {value: '7986b3df570230288501eea3d890bd66948c9b79', is: '0x7986b3df570230288501EeA3D890bD66948C9B79'},
            {value: '0a3aa774752ec2042c46548456c094a76c7f3a79', is: '0x0a3AA774752ec2042C46548456c094A76C7f3a79'},
            {value: 'cf7cdbbb5f7ba79d3ffe74a0bba13fc0295f6036', is: '0xCf7CDBBb5f7ba79d3FfE74a0Bba13FC0295F6036'}
        ];

        tests.forEach((test) => {
            expect(toChecksumAddress(test.value, 33)).toEqual(test.is);
        });
    });

    it('calls stripHexPrefix and returns the expected results', () => {
        const tests = [
            {value: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', is: '5aaeb6053f3e94c9b9a09f33669435e7ef1beaed'},
            {value: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359', is: 'fb6916095ca1df60bb79ce92ce3ea74c37c5d359'},
            {value: 'dbf03b407c01e7cd3cbea99509d93f8dddc8c6fb', is: 'dbf03b407c01e7cd3cbea99509d93f8dddc8c6fb'}
        ];

        tests.forEach((test) => {
            expect(stripHexPrefix(test.value)).toEqual(test.is);
        });
    });

    it('calls checkAddressChecksum with chainId 30 (RSK Mainnet) and returns the expected results', () => {
        const tests = [
            {value: '0xCD2a3d9F938E13CD947ec05Abc7Fe734DF8dd826', is: true},
            {value: '0x7986b3DF570230288501EEA3D890bD66948c9B79', is: true},
            {value: '0x0A3aa774752Ec2042c46548456C094A76c7F3A79', is: true},
            {value: '0xcf7CdBBB5F7bA79D3FFe74A0Bba13fc0295F6036', is: true},
            {value: '0x39b12c05e8503356E3A7DF0b7b33EFA4C054c409', is: true},
            {value: '0xc354D97642FAA06781b76ffB6786f72cD7746C97', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0x52908400098527886E0F7030069857D2E4169EE7', is: false},
            {value: '0x8617E340B3D01FA5F11F306F4090FD50E238070D', is: false}
        ];

        tests.forEach((test) => {
            expect(checkAddressChecksum(test.value, 30)).toEqual(test.is);
        });
    });

    it('calls checkAddressChecksum with chainId 31 (RSK testnet) and returns the expected results', () => {
        const tests = [
            {value: '0xCD2a3D9f938e13cD947ec05abC7Fe734Df8DD826', is: true},
            {value: '0x7986B3Df570230288501eea3D890bD66948c9b79', is: true},
            {value: '0x0a3aa774752Ec2042C46548456c094A76C7F3a79', is: true},
            {value: '0xcF7cDbbB5F7BA79D3FFe74a0bBA13fc0295F6036', is: true},
            {value: '0x39B12C05e8503356E3a7DF0B7b33efa4C054C409', is: true},
            {value: '0xC354d97642fAA06781b76ffB6786F72cd7746C97', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0x52908400098527886E0F7030069857D2E4169EE7', is: false},
            {value: '0x8617E340B3D01FA5F11F306F4090FD50E238070D', is: false}
        ];

        tests.forEach((test) => {
            expect(checkAddressChecksum(test.value, 31)).toEqual(test.is);
        });
    });

    it('calls checkAddressChecksum with chainId 33 (RSK regtest) and returns the expected results', () => {
        const tests = [
            {value: '0xCd2a3D9f938e13Cd947EC05aBc7fE734df8dD826', is: true},
            {value: '0x7986b3df570230288501EeA3D890bD66948C9B79', is: true},
            {value: '0x0a3AA774752ec2042C46548456c094A76C7f3a79', is: true},
            {value: '0xCf7CDBBb5f7ba79d3FfE74a0Bba13FC0295F6036', is: true},
            {value: '0x39B12c05e8503356e3a7DF0B7B33EfA4C054c409', is: true},
            {value: '0xc354D97642FAa06781B76ffb6786F72Cd7746c97', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0x52908400098527886E0F7030069857D2E4169EE7', is: false},
            {value: '0x8617E340B3D01FA5F11F306F4090FD50E238070D', is: false}
        ];

        tests.forEach((test) => {
            expect(checkAddressChecksum(test.value, 33)).toEqual(test.is);
        });
    });

    it('calls toHex and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0x1'},
            {value: '1', expected: '0x1'},
            {value: '0x1', expected: '0x1'},
            {value: '15', expected: '0xf'},
            {value: '0xf', expected: '0xf'},
            {value: -1, expected: '-0x1'},
            {value: '-1', expected: '-0x1'},
            {value: '-0x1', expected: '-0x1'},
            {value: '-15', expected: '-0xf'},
            {value: '-0xf', expected: '-0xf'},
            {value: '0x657468657265756d', expected: '0x657468657265756d'},
            {
                value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {
                value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            },
            {
                value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {value: 0, expected: '0x0'},
            {value: '0', expected: '0x0'},
            {value: '0x0', expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: '-0', expected: '0x0'},
            {value: '-0x0', expected: '0x0'},
            {value: [1, 2, 3, {test: 'data'}], expected: '0x5b312c322c332c7b2274657374223a2264617461227d5d'},
            {value: {test: 'test'}, expected: '0x7b2274657374223a2274657374227d'},
            {value: '{"test": "test"}', expected: '0x7b2274657374223a202274657374227d'},
            {value: 'myString', expected: '0x6d79537472696e67'},
            {value: 'myString 34534!', expected: '0x6d79537472696e6720333435333421'},
            {value: new BN(15), expected: '0xf'},
            {
                value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/',
                expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f'
            },
            {value: true, expected: '0x01'},
            {value: false, expected: '0x00'},
            {
                value:
                    'ff\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x66660300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'
            },
            {
                value:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x0300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'
            },
            {value: '내가 제일 잘 나가', expected: '0xeb82b4eab08020eca09cec9dbc20ec9e9820eb8298eab080'}
        ];

        tests.forEach((test) => {
            expect(toHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls toBN and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '1'},
            {value: '1', expected: '1'},
            {value: '0x1', expected: '1'},
            {value: '0x01', expected: '1'},
            {value: 15, expected: '15'},
            {value: '15', expected: '15'},
            {value: '0xf', expected: '15'},
            {value: '0x0f', expected: '15'},
            {value: new BN('f', 16), expected: '15'},
            {value: -1, expected: '-1'},
            {value: '-1', expected: '-1'},
            {value: '-0x1', expected: '-1'},
            {value: '-0x01', expected: '-1'},
            {value: -15, expected: '-15'},
            {value: '-15', expected: '-15'},
            {value: '-0xf', expected: '-15'},
            {value: '-0x0f', expected: '-15'},
            {
                value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            },
            {
                value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '115792089237316195423570985008687907853269984665640564039457584007913129639933'
            },
            {
                value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639935'
            },
            {
                value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639933'
            },
            {value: 0, expected: '0'},
            {value: '0', expected: '0'},
            {value: '0x0', expected: '0'},
            {value: -0, expected: '0'},
            {value: '-0', expected: '0'},
            {value: '-0x0', expected: '0'},
            {value: new BN(0), expected: '0'}
        ];

        tests.forEach((test) => {
            expect(toBN(test.value).toString(10)).toEqual(test.expected);
        });
    });

    it('calls hexToNumberString and returns the expected results', () => {
        expect(hexToNumberString('0x3e8')).toEqual('1000');

        expect(hexToNumberString('0x1f0fe294a36')).toEqual('2134567897654');

        // allow compatiblity
        expect(hexToNumberString(100000)).toEqual('100000');

        // throw error if the hex string doesn't contain '0x' prefix
        expect(() => {
            hexToNumberString('100000');
        }).toThrow('Given value "100000" is not a valid hex string.');
    });

    it('calls numberToHex and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0x1'},
            {value: '21345678976543214567869765432145647586', expected: '0x100f073a3d694d13d1615dc9bc3097e2'},
            {value: '1', expected: '0x1'},
            {value: '0x1', expected: '0x1'},
            {value: '0x01', expected: '0x1'},
            {value: 15, expected: '0xf'},
            {value: '15', expected: '0xf'},
            {value: '0xf', expected: '0xf'},
            {value: '0x0f', expected: '0xf'},
            {value: -1, expected: '-0x1'},
            {value: '-1', expected: '-0x1'},
            {value: '-0x1', expected: '-0x1'},
            {value: '-0x01', expected: '-0x1'},
            {value: -15, expected: '-0xf'},
            {value: '-15', expected: '-0xf'},
            {value: '-0xf', expected: '-0xf'},
            {value: '-0x0f', expected: '-0xf'},
            {
                value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            },
            {
                value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {
                value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            },
            {
                value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {value: 0, expected: '0x0'},
            {value: '0', expected: '0x0'},
            {value: '0x0', expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: '-0', expected: '0x0'},
            {value: '-0x0', expected: '0x0'}
        ];

        tests.forEach((test) => {
            expect(numberToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls hexToUtf8 and returns the expected results', () => {
        const tests = [
            {
                value: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f',
                expected: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'
            },
            {value: '0x6d79537472696e67', expected: 'myString'},
            {value: '0x6d79537472696e6700', expected: 'myString'},
            {value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value'},
            {
                value: '0x000000000000000000000000000000000000657870656374000065642076616c7565',
                expected: 'expect\u0000\u0000ed value'
            }
        ];

        tests.forEach((test) => {
            expect(hexToUtf8(test.value)).toEqual(test.expected);
        });
    });

    it('calls hexToAscii and returns the expected results', () => {
        const tests = [
            {value: '0x6d79537472696e67', expected: 'myString'},
            {value: '0x6d79537472696e6700', expected: 'myString\u0000'},
            {
                value:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c',
                expected:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB'
            }
        ];

        tests.forEach((test) => {
            expect(hexToAscii(test.value)).toEqual(test.expected);
        });
    });
    it('calls utf8ToHex and returns the expected results', () => {
        const tests = [
            {
                value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/',
                expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f'
            },
            {value: 'myString', expected: '0x6d79537472696e67'},
            {value: 'myString\u0000', expected: '0x6d79537472696e67'},
            {value: 'expected value\u0000\u0000\u0000', expected: '0x65787065637465642076616c7565'},
            {value: 'expect\u0000\u0000ed value\u0000\u0000\u0000', expected: '0x657870656374000065642076616c7565'},
            {
                value: '我能吞下玻璃而不伤身体。',
                expected: '0xe68891e883bde5909ee4b88be78ebbe79283e8808ce4b88de4bca4e8baabe4bd93e38082'
            },
            {
                value: '나는 유리를 먹을 수 있어요. 그래도 아프지 않아요',
                expected:
                    '0xeb8298eb8a9420ec9ca0eba6aceba5bc20eba8b9ec9d8420ec889820ec9e88ec96b4ec9a942e20eab7b8eb9e98eb8f8420ec9584ed9484eca78020ec958aec9584ec9a94'
            }
        ];

        tests.forEach((test) => {
            expect(utf8ToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls asciiToHex and returns the expected results', () => {
        const tests = [
            {value: 'myString', expected: '0x6d79537472696e67000000000000000000000000000000000000000000000000'},
            {value: 'myString\u0000', expected: '0x6d79537472696e67000000000000000000000000000000000000000000000000'},
            {
                value:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'
            }
        ];

        tests.forEach((test) => {
            expect(asciiToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls toWei and returns the expected results', () => {
        expect(toWei('1', 'wei')).toEqual('1');

        expect(toWei('1', 'kwei')).toEqual('1000');

        expect(toWei('1', 'Kwei')).toEqual('1000');

        expect(toWei('1', 'mwei')).toEqual('1000000');

        expect(toWei('1', 'Mwei')).toEqual('1000000');

        expect(toWei('1', 'gwei')).toEqual('1000000000');

        expect(toWei('1', 'Gwei')).toEqual('1000000000');

        expect(toWei('1', 'ether')).toEqual('1000000000000000000');

        expect(toWei('1', 'kether')).toEqual('1000000000000000000000');

        expect(toWei('1', 'mether')).toEqual('1000000000000000000000000');

        expect(toWei('1', 'gether')).toEqual('1000000000000000000000000000');

        expect(toWei('1', 'tether')).toEqual('1000000000000000000000000000000');

        expect(() => {
            toWei(1, 'wei');
        }).toThrow('Please pass numbers as strings or BN objects to avoid precision errors.');
    });

    it('calls fromWei and returns the expected results', () => {
        expect(fromWei('1000000000000000000', 'wei')).toEqual('1000000000000000000');

        expect(fromWei('1000000000000000000', 'kwei')).toEqual('1000000000000000');

        expect(fromWei('1000000000000000000', 'mwei')).toEqual('1000000000000');

        expect(fromWei('1000000000000000000', 'gwei')).toEqual('1000000000');

        expect(fromWei('1000000000000000000', 'ether')).toEqual('1');

        expect(fromWei('1000000000000000000', 'kether')).toEqual('0.001');

        expect(fromWei('1000000000000000000', 'mether')).toEqual('0.000001');

        expect(fromWei('1000000000000000000', 'gether')).toEqual('0.000000001');

        expect(fromWei('1000000000000000000', 'tether')).toEqual('0.000000000001');
    });

    it('calls toTwosComplement and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '1', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '0x1', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '0x01', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: 15, expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '15', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '0xf', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '0x0f', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: new BN(0), expected: '0000000000000000000000000000000000000000000000000000000000000000'}
        ];

        tests.forEach((test) => {
            expect(toTwosComplement(test.value).replace('0x', '')).toEqual(test.expected);
        });
    });

    it('calls jsonInterfaceMethodToString and returns the expected results', () => {
        const abiItem = {
            anonymous: false,
            constant: true,
            inputs: [
                {
                    name: 'testMe',
                    type: 'uint256[3]'
                },
                {
                    name: 'inputA',
                    type: 'tuple',
                    components: [
                        {
                            name: 'a',
                            type: 'uint8'
                        },
                        {
                            name: 'b',
                            type: 'uint8'
                        }
                    ]
                },
                {
                    name: 'inputB',
                    type: 'tuple[]',
                    components: [
                        {
                            name: 'a1',
                            type: 'uint256'
                        },
                        {
                            name: 'a2',
                            type: 'uint256'
                        }
                    ]
                },
                {
                    name: 'inputC',
                    type: 'uint8',
                    indexed: false
                }
            ],
            name: 'testName',
            outputs: [
                {
                    name: 'test',
                    type: 'uint256'
                },
                {
                    name: 'outputA',
                    type: 'tuple',
                    components: [
                        {
                            name: 'a',
                            type: 'uint8'
                        },
                        {
                            name: 'b',
                            type: 'uint8'
                        }
                    ]
                },
                {
                    name: 'outputB',
                    type: 'tuple[]',
                    components: [
                        {
                            name: 'a1',
                            type: 'uint256'
                        },
                        {
                            name: 'a2',
                            type: 'uint256'
                        }
                    ]
                }
            ],
            payable: false,
            stateMutability: 'pure',
            type: 'function'
        };

        expect(jsonInterfaceMethodToString(abiItem)).toEqual(
            'testName(uint256[3],(uint8,uint8),(uint256,uint256)[],uint8)'
        );

        expect(() => jsonInterfaceMethodToString(['string'])).toThrow();
        expect(() => jsonInterfaceMethodToString(234)).toThrow();
        expect(() => jsonInterfaceMethodToString([4])).toThrow();
        expect(() => jsonInterfaceMethodToString(true)).toThrow();
        expect(() => jsonInterfaceMethodToString(null)).toThrow();
        expect(() => jsonInterfaceMethodToString(undefined)).toThrow();
    });
});
