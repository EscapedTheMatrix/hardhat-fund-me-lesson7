# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

yarn --force
yarn init
yarn solhint
yarn solhint contracts/\*.sol
yarn hardhat compile
yarn hardhat test 
yarn hardhat test + debug
yarn hardhat deploy
yarn hardhat coverage
yarn hardhat node

yarn hardhat compile --tags mocks
yarn hardhat deploy --tags mocks
yarn hardhat test --grep 'Withdraw ETH'
yarn hardhat test --grep "update to amount funded data structure"
yarn hardhat test --grep "Adds funder to array"
yarn hardhat test --grep "withdraw with multiple funders"
yarn hardhat deploy --tags storage
yarn hardhat deploy --network sepolia
yarn hardhat test --network sepolia
yarn hardhat run scripts/fund.js --network localhost  // must be activate ganache
yarn hardhat run scripts/withdraw.js --network localhost // must be activate ganache
yarn hardhat verify --network sepolia 0x3867120D37B79F88eF97a898f8b37181edc5CAE6 // fundMe
yarn hardhat verify --network sepoloa 0xe3Dc9FbE39cE42306D4f0Be1e7b2689b23129d72 // fundWithStorage
