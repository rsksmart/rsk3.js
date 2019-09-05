## Demo Guide

1. In the root directory, run **npm run install-all** to ensure that all packages are fully dependent.
1. In the root directory, run **npm run build** to ensure that all package code is packaged.
1. In the demo directory, run **npm i to install** the demo dependencies.
1. Run **npm link** to link test commands.
1. Note that Rskj Docker needs to be running. If Docker hasn't started yet, refer to our document  about it.
[https://developers.doc.rsk.co/docs/setup-node-on-docker](https://developers.doc.rsk.co/docs/setup-node-on-docker)
1. Run **rsktest --compile** on the command line to compile the contract (make sure truffle is installed locally)
1. Run **rsktest --migrate** on the command line to deploy the contract. After successful, it will automatically run the mint() and send() contract functions.