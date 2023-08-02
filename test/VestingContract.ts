import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EscrowStaking, EscrowStaking__factory, OwnableUpgradeable, OwnedUpgradeabilityProxy, TokenA, TokenA__factory, VestingStaking, VestingStaking__factory } from "../typechain";

describe("VestingStaking test cases", async()=>{
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;
    let users: SignerWithAddress[];
    let teamUser: SignerWithAddress;
    let token: TokenA;
    let staking: EscrowStaking;
    let proxy: OwnedUpgradeabilityProxy;
    let vesting: VestingStaking;

    beforeEach("beforeEach",async()=>{
        [owner,user1,user2,user3,teamUser,...users] = await ethers.getSigners();
        token = await new TokenA__factory(owner).deploy();
        staking = await new EscrowStaking__factory(owner).deploy();
        vesting = await new VestingStaking__factory(owner).deploy(token.address,teamUser.address);
        console.log("owner_address1",owner.address);

    });

    it.only("start vesting", async()=>{
        await token.connect(owner).mint(user1.address,1000);
        console.log("owner_address2",owner.address);
        // await staking.connect(owner).setAdmin(user1.address,{gasLimit: 30000000});
        // await token.connect(user1).approve(staking.address,1000);
        // await staking.connect(owner).setWhiteList(token.address);
        // await staking.connect(user1).deposit(token.address,1,{gasLimit: 30000000});
        
    })
})