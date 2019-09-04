/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const privateKey = 'c85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4'; // Public Key: 0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826
const privateKey2 = '0c06818f82e04c564290b32ab86b25676731fc34e9a546108bf109194c8e3aae'; // Public Add: 0x7986b3DF570230288501EEa3D890bd66948C9B79
module.exports = {
    // networks: {
    //     regtest: {
    //         provider: new PrivateKeyProvider(privateKey, 'http://127.0.0.1:4444'),
    //         host: '127.0.0.1',
    //         port: 4444,
    //         network_id: 33
    //     },
    //     regtestAccountTwo: {
    //         provider: new PrivateKeyProvider(privateKey2, 'http://127.0.0.1:4444'),
    //         host: '127.0.0.1',
    //         port: 4444,
    //         network_id: 33
    //     }
    // },
    // Configure your compilers
    compilers: {
        solc: {
            version: '0.4.24',
            evmVersion: 'byzantium'
        }
    }
};
