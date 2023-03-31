// require('@openzeppelin/hardhat-upgrades');
// import "@openzeppelin/hardhat-upgrades";
// import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import "@nomiclabs/hardhat-etherscan";

async function main() {
  let pizza: any;

  describe("Pizza Test", async () => {
    beforeEach("Before Each", async () => {
      const Pizza = await ethers.getContractFactory("Pizza");

      // Deploy a new instance of the Pizza contract using the upgrades plugin
      // The contract is initialized with an array of arguments, where the first argument is the number of slices
      pizza = await upgrades.deployProxy(Pizza, [8], {initializer: "initialize",});
      await pizza.deployed();
    });

    it("Test proxy deployment", async () => {
      expect(pizza.address != "0x0000000000000000000000000000000000000000").to.be.true;
      expect(await upgrades.erc1967.getImplementationAddress(pizza.address) != "0x0000000000000000000000000000000000000000").to.be.true;
    });
    
    it("Check that it is UUPS Proxy", async () => {
      expect(await upgrades.erc1967.getAdminAddress(pizza.address) == "0x0000000000000000000000000000000000000000").to.be.true;
    })

    it("Test Contract Initialized", async () => {
      expect(pizza.initialize(10)).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("Eat Slice Function", async () => {
      await pizza.eatSlice();
      expect(await pizza.slices()).to.be.equal(7);
    })
    
    it("Test Custom Errors", async () => {
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      await pizza.eatSlice();
      expect(await pizza.slices()).to.be.equal(0);
      expect(pizza.eatSlice()).to.be.revertedWithCustomError(pizza, "NoSlicesLeft");
    });
    
    it("Should check events emited", async () => {
      await pizza.eatSlice();
      expect(pizza.eatSlice()).to.emit(pizza, "SlicesEaten").withArgs(7);
    })

    it("Test Upgrading Proxy with new Implementation", async () => {
      const oldPizzaImpl = await upgrades.erc1967.getImplementationAddress(pizza.address);
      const PizzaV2 = await ethers.getContractFactory("PizzaV2");
      await upgrades.upgradeProxy(pizza.address, PizzaV2);
      const newPizzaImpl = await upgrades.erc1967.getImplementationAddress(pizza.address);

      expect(oldPizzaImpl).to.not.equal(newPizzaImpl);
    })
  });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
