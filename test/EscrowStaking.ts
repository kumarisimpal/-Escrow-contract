
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
        vesting =await new VestingStaking__factory(owner).deploy(token.address);
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
        await token.connect(owner).mint(user1.address,100000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,10000);
        await staking.connect(user1).deposit(token.address,10000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        
    });

    it("withdraw: revert InvalidAmount ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,100,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await expect (staking.connect(user2).withdraw(vesting.address,0,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"InvalidAmount");
    });

    it("withdraw function ",async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await token.connect(user1).approve(staking.address,1000);
        await staking.connect(owner).setWhiteList(token.address);
        await staking.connect(user1).deposit(token.address,100,{gasLimit: 30000000});
        await expect (staking.connect(user2).withdraw(vesting.address,10,{gasLimit: 30000000})).to.be.revertedWithCustomError(staking,"youAreNotDeveloper");
    });

    it("vesting: start vesting ",async()=>{
        await token.connect(owner).mint(user1.address,1000000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,1000000);
        await staking.connect(user1).deposit(token.address,10000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        await vesting.connect(owner).startVesting({gasLimit: 30000000});

    });

    it("vesting: claimTokens before 30 days", async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,10000);
        await staking.connect(user1).deposit(token.address,1000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        await vesting.connect(user2).startVesting({gasLimit: 30000000});
        await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
        await vesting.connect(user2).claimTokens({gasLimit: 30000000});
    
    });

    it("vesting: claimTokens after 1 month", async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,10000);
        await staking.connect(user1).deposit(token.address,1000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        await vesting.connect(user2).startVesting({gasLimit: 30000000});
        await ethers.provider.send("evm_increaseTime", [35 * 24 * 60 * 60]);
        await vesting.connect(user2).claimTokens({gasLimit: 30000000});
    
    });

    it("vesting: claimTokens after 3 months", async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,10000);
        await staking.connect(user1).deposit(token.address,1000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        await vesting.connect(user2).startVesting({gasLimit: 30000000});
        await ethers.provider.send("evm_increaseTime", [100 * 24 * 60 * 60]);
        await vesting.connect(user2).claimTokens({gasLimit: 30000000});
    
    });

    it("vesting: claimTokens after 3.5 months", async()=>{
        await token.connect(owner).mint(user1.address,10000 ,{gasLimit: 30000000});
        await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        await staking.connect(owner).setWhiteList(token.address);
        await token.connect(user1).approve(staking.address,10000);
        await staking.connect(user1).deposit(token.address,1000,{gasLimit: 30000000});
        await staking.connect(user1).setDeveloper(user2.address);
        await staking.connect(user2).withdraw(vesting.address,1000);
        await vesting.connect(user2).startVesting({gasLimit: 30000000});
        await ethers.provider.send("evm_increaseTime", [106 * 24 * 60 * 60]);
        await vesting.connect(user2).claimTokens({gasLimit: 30000000});
    
    });

   
});
