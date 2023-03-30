import { ethers, upgrades } from "hardhat";

async function main() {
  const Pizza = await ethers.getContractFactory("Pizza");

// Deploy a new instance of the Pizza contract using the upgrades plugin
// The contract is initialized with an array of arguments, where the first argument is the number of slices

  const pizza = await upgrades.deployProxy(Pizza, [8], {initializer: "initialize",});
  await pizza.deployed();
  console.log("Pizza Proxy deployed to: ", pizza.address);
  
  // IF NEEDED

  console.log("Impl address: ", await upgrades.erc1967.getImplementationAddress(pizza.address));
  
  /**
   * Will need to verify Implementation Address to get "Is Proxy" feature on Etherscan
   * Do that by npx hardhat verify --network <yourNetwork> <Impl_Contract_Address>
   */

  // console.log("Proxy Admin address should be Address(0): ", await upgrades.erc1967.getAdminAddress(pizza.address));


  // UPGRADE IMPLEMENTATION CODE (if needed)
  
  // const PizzaV2 = await ethers.getContractFactory("PizzaV2");
  // await upgrades.upgradeProxy(pizza.address, PizzaV2);
  // console.log("New Impl address: ", await upgrades.erc1967.getImplementationAddress(pizza.address));
  

  // TRANSFER OWNERSHIP CODE (if needed)

  // const newOwner = "Add Your new Owner Address";
  // await upgrades.admin.transferProxyAdminOwnership(newOwner);
  // console.log("Transferred ownership of ProxyAdmin to:", newOwner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
