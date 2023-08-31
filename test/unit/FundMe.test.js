const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let MockV3Aggregator
          // const sendValue = 1000000000000000000 // 1 ETH
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              // deploy our fundMe contract using hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("Sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.reverted
              })
              it("update to amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), response.toString())
              })
              it("Adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("Withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("Withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("is allows us to withdraw with multiple funders", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`(W)GasCost: ${gasCost}`)
                  console.log(`(W)GasUsed: ${gasUsed}`)
                  console.log(`(W)GasPrice: ${effectiveGasPrice}`)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that the funders are reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Cheaper Withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("is allows us to withdraw with multiple funders", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`(C)GasCost: ${gasCost}`)
                  console.log(`(C)GasUsed: ${gasUsed}`)
                  console.log(`(C)GasPrice: ${effectiveGasPrice}`)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that the funders are reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
      })

// ==========================================================================================

//       describe("CheaperWithdraw", async function () {
//           beforeEach(async function () {
//               await fundMe.fund({ value: sendValue })
//           })
//           it("Cheaper Withdraw ETH from a single founder", async function () {
//               // Arrange
//               const startingFundMeBalance =
//                   await fundMe.provider.getBalance(fundMe.address)
//               const startingDeployerBalance =
//                   await fundMe.provider.getBalance(deployer)

//               // Act
//               const transactionResponse = await fundMe.cheaperWithdraw()
//               const transactionReceipt = await transactionResponse.wait(1)
//               const { gasUsed, effectiveGasPrice } = transactionReceipt
//               const gasCost = gasUsed.mul(effectiveGasPrice)

//               const endingFundMeBalance = await fundMe.provider.getBalance(
//                   fundMe.address
//               )
//               const endingDeployerBalance =
//                   await fundMe.provider.getBalance(deployer)

//               // Assert
//               assert.equal(endingFundMeBalance, 0)
//               assert.equal(
//                   startingFundMeBalance
//                       .add(startingDeployerBalance)
//                       .toString(),
//                   endingDeployerBalance.add(gasCost).toString()
//               )
//           })
//           it("is allows us to withdraw with multiple funders", async function () {
//               // Arrange
//               const accounts = await ethers.getSigners()
//               for (let i = 1; i < 6; i++) {
//                   const fundMeConnectedContract = await fundMe.connect(
//                       accounts[i]
//                   )
//                   await fundMeConnectedContract.fund({ value: sendValue })
//               }
//               const startingFundMeBalance =
//                   await fundMe.provider.getBalance(fundMe.address)
//               const startingDeployerBalance =
//                   await fundMe.provider.getBalance(deployer)

//               // Act
//               const transactionResponse = await fundMe.cheaperWithdraw()
//               const transactionReceipt = await transactionResponse.wait(1)
//               const { gasUsed, effectiveGasPrice } = transactionReceipt
//               const gasCost = gasUsed.mul(effectiveGasPrice)
//               console.log(`(C)GasCost: ${gasCost}`)
//               console.log(`(C)GasUsed: ${gasUsed}`)
//               console.log(`(C)GasPrice: ${effectiveGasPrice}`)

//               const endingFundMeBalance = await fundMe.provider.getBalance(
//                   fundMe.address
//               )
//               const endingDeployerBalance =
//                   await fundMe.provider.getBalance(deployer)

//               // Assert
//               assert.equal(endingFundMeBalance, 0)
//               assert.equal(
//                   startingFundMeBalance
//                       .add(startingDeployerBalance)
//                       .toString(),
//                   endingDeployerBalance.add(gasCost).toString()
//               )

//               // Make sure that the funders are reset properly
//               await expect(fundMe.getFunders(0)).to.be.reverted
//               for (let i = 1; i < 6; i++) {
//                   assert.equal(
//                       await fundMe.getAddressToAmountFunded(
//                           accounts[i].address
//                       ),
//                       0
//                   )
//               }
//           })
//           it("Only allows the owner to withdraw", async function () {
//               const accounts = await ethers.getSigners()
//               const fundMeConnectedContract = await fundMe.connect(
//                   accounts[1]
//               )
//               await expect(
//                   fundMeConnectedContract.withdraw()
//               ).to.be.revertedWith("FundMe__NotOwner")
//           })
//       })
//   })
