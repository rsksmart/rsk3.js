const rsk3 = require('../packages/rsk3');

const result = rsk3.utils.isAddress('0xCd2a3D9f938e13Cd947EC05aBc7fE734df8dD826');
console.log('isAddress result:', result);

const rsk3Instance = new rsk3('http://localhost:4444');
console.log(rsk3Instance);