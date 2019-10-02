import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig('Rsk3', pkg.name,{
    'web3-core-helpers':'web3-core-helpers',
    'rsk3-account':'rsk3-account',
    'rsk3-contract':'rsk3-contract',
    'rsk3-personal':'rsk3-personal',
    'rsk3-abi':'rsk3-abi',
    'rsk3-net':'rsk3-net',
    'rsk-utils':'rsk-utils'
});
