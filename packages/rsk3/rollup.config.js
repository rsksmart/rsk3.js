import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig('Rsk3', pkg.name,{
    'web3-core-helpers':'web3-core-helpers',
});
