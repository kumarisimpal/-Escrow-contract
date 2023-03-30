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
  console.log("Proxy Admin address should be Address(0): ", await upgrades.erc1967.getAdminAddress(pizza.address));
  
  const PizzaV2 = await ethers.getContractFactory("PizzaV2");
  await upgrades.upgradeProxy(pizza.address, PizzaV2);
  console.log("New Impl address: ", await upgrades.erc1967.getImplementationAddress(pizza.address));
  
  const newOwner = "Add Your new Owner Address";
  await upgrades.admin.transferProxyAdminOwnership(newOwner);
  console.log("Transferred ownership of ProxyAdmin to:", newOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
