
import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EscrowStaking, EscrowStaking__factory, OwnedUpgradeabilityProxy, OwnedUpgradeabilityProxy__factory, TokenA, TokenA__factory } from "../typechain";

describe("EscrowStaking test cases", async()=>{
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;
    let admin: SignerWithAddress;
    let users: SignerWithAddress[];
    let token: TokenA;
    let proxy: OwnedUpgradeabilityProxy;
    let staking: EscrowStaking;

    beforeEach("beforeEach",async()=>{
        [admin,user1,user2,user3,...users] = await ethers.getSigners();
        token = await new TokenA__factory(admin).deploy();
        proxy = await new OwnedUpgradeabilityProxy__factory(admin).deploy();
        staking = await new EscrowStaking__factory(admin).deploy();
        console.log("aaaaaaaaaaaaaaaa");
        await proxy.upgradeTo(staking.address);
        console.log("bbbbbbbbbbbbbbbb");
        staking = await new EscrowStaking__factory(admin).attach(staking.address);
        console.log("ccccccccccccc");
        // await staking.initialize(token.address);
        
    });
    
    it.only("deposit function ",async()=>{
        console.log("dddddddddddddddddddd");
        await token.connect(admin).mint(user1.address,1000 ,{gasLimit: 30000000});
        
    })
})