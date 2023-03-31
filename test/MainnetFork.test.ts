import { expect } from "chai";
import { ethers, upgrades} from "hardhat";

describe("Pizza Contract", async () => {
    const provider = new ethers.providers.JsonRpcProvider(" http://127.0.0.1:8545/");
    let whale = "0x0000000000000000000000000000000000000000";
    let impersonatedSigner: any;
    let pizza: any;

    describe("Pizza V1", async () => {
        beforeEach(async () => {
            impersonatedSigner = await ethers.getImpersonatedSigner(whale);

            const Pizza = await ethers.getContractFactory("Pizza");
            // pizza = await Pizza.connect(impersonatedSigner).deploy();
            pizza = await upgrades.deployProxy(Pizza, [8], {initializer: "initialize",});
            await pizza.deployed();
        })
        
        it("Test if it's Mainnet Fork", async () => {
           console.log("Whale Balance: ", await provider.getBalance(impersonatedSigner.address));
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
    })
})