
import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EscrowStaking, EscrowStaking__factory, OwnedUpgradeabilityProxy, OwnedUpgradeabilityProxy__factory, TokenA, TokenA__factory, VestingStaking, VestingStaking__factory } from "../typechain";

describe("EscrowStaking test cases", async()=>{
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;
    let users: SignerWithAddress[];
    let token: TokenA;
    let proxy: OwnedUpgradeabilityProxy;
    let staking: EscrowStaking;
    let vesting: VestingStaking;

    beforeEach("beforeEach",async()=>{
        [owner,user1,user2,user3,...users] = await ethers.getSigners();
        token = await new TokenA__factory(owner).deploy();
        proxy = await new OwnedUpgradeabilityProxy__factory(owner).deploy();
        staking = await new EscrowStaking__factory(owner).deploy();
        await proxy.upgradeTo(staking.address);
        staking = await new EscrowStaking__factory(owner).attach(proxy.address);
        await staking.connect(owner).initialize(token.address);
        vesting =await new VestingStaking__factory(owner).deploy(token.address,user3.address);

    });
    

    it("deposit function ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,1,{gasLimit: 30000000});
        
    });

    it("deposit: revert youAreNotAdmin",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await expect(staking.connect(user1).deposit(token.address,1,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"youAreNotAdmin");
        
    });

    it("deposit: revert InvalidAmount ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await expect(staking.connect(user1).deposit(token.address,0,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"InvalidAmount");
        
    });

    it("deposit: revert tokenNotWhiteListed ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await expect (staking.connect(user1).deposit(token.address,1,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"tokenNotWhiteListed");
        
    });

    it("withdraw function ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,100,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user1.address);
        await staking.connect(user1).withdraw(10,{gasLimit: 30000000});
    });

    it("withdraw: revert InvalidAmount ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,100,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user1.address);
        await expect (staking.connect(user1).withdraw(0,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"InvalidAmount");
    });

    it("withdraw function ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,100,{gasLimit: 30000000});
        await expect (staking.connect(user1).withdraw(10,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"youAreNotDeveloper");
    });

    it.only("vesting: start vesting ",async()=>{
        await token.connect(owner).mint(user1.address,100000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,100000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,10000,{gasLimit: 30000000});
        await token.connect(user1).approve(vesting.address,10000)
        await vesting.connect(user1).startVesting();
    });
})