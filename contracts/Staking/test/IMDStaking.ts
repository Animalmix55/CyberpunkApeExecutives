import { BN } from "bn.js";

const truffleAssert = require('truffle-assertions');
const IMDStaking = artifacts.require("IMDStaking");
const MockNFT = artifacts.require('MockNFT');
const RewardToken = artifacts.require('CollegeCredit');

export { };

/**
 * For reference:
 * 
 * await truffleAssert.reverts(
 *    rooTroopInstance.withdraw(15, { from: accounts[1] }) // invalid owner
 * );
 */

const advanceTime = async (time: number) => {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as any).send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: new Date().getTime()
    }, (err1: any, result1: any) => {
      if (err1) return reject(err1);
      (web3.currentProvider as any).send({ jsonrpc: "2.0", method: "evm_mine", params: [], id: 0 }, (err2: any) => {
        if (err2) { return reject(err2) }
        return resolve(result1);
      });
    });
  })
}

const to18Decimals = (amount: number): BN => {
  return new BN(amount).mul(new BN(10).pow(new BN(18)));
}

const ONEWEEK = new BN(60 * 60 * 24 * 7);

contract('IMDStaking', (accounts) => {
  it('sets initial staking reward token', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    const { 0: minYield, 1: maxYield, 2: step, 3: yieldPeriod } = await imdStakingInstance.stakableTokenAttributes(stakableNFT.address);
    assert.equal(minYield.toString(), to18Decimals(10).toString());
    assert.equal(maxYield.toString(), to18Decimals(50).toString());
    assert.equal(step.toString(), to18Decimals(10).toString());
    assert.equal(yieldPeriod.toString(), ONEWEEK.toString());
  });

  it('creates the reward token and allows minting of it', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    await truffleAssert.reverts(
      imdStakingInstance.mintRewardToken(accounts[0], to18Decimals(10), { from: accounts[1] }) // invalid owner
    );
    await imdStakingInstance.mintRewardToken(accounts[0], to18Decimals(10));

    const rewardTokenAddress = await imdStakingInstance.rewardToken();
    const rewardToken = await RewardToken.at(rewardTokenAddress);

    const rewardtokenBalance = await rewardToken.balanceOf(accounts[0]);
    assert.equal(rewardtokenBalance.toString(), to18Decimals(10).toString());
  });

  it('allows for the addition of new stakable tokens', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    const newStakableNFT = await MockNFT.new();

    await imdStakingInstance.addStakableToken(newStakableNFT.address, to18Decimals(11), to18Decimals(51), to18Decimals(11), ONEWEEK.add(new BN(1)));
    const { 0: minYield, 1: maxYield, 2: step, 3: yieldPeriod } = await imdStakingInstance.stakableTokenAttributes(newStakableNFT.address);
    assert.equal(minYield.toString(), to18Decimals(11).toString());
    assert.equal(maxYield.toString(), to18Decimals(51).toString());
    assert.equal(step.toString(), to18Decimals(11).toString());
    assert.equal(yieldPeriod.toString(), ONEWEEK.add(new BN(1)).toString());
  });

  it('allows staking of a stakable token', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    // grant nft #1 to owner
    await stakableNFT.mint(accounts[0], 1);
    // approve for all
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);

    // fails for bad token id
    await truffleAssert.reverts(
      imdStakingInstance.stake(stakableNFT.address, 2)
    );

    // stake
    await imdStakingInstance.stake(stakableNFT.address, 1);
    const stakedTokens = await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address);

    assert.equal(stakedTokens.length, 1);
    assert.equal(stakedTokens[0].toString(), '1');
  });

  it('tracks the total number staked in contract for a given token', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);
  
    assert.equal((await imdStakingInstance.totalStaked(stakableNFT.address)).toString(), '1');
    await imdStakingInstance.stake(stakableNFT.address, 2);
    assert.equal((await imdStakingInstance.totalStaked(stakableNFT.address)).toString(), '2');
    await imdStakingInstance.unstake(stakableNFT.address, 1);
    assert.equal((await imdStakingInstance.totalStaked(stakableNFT.address)).toString(), '1');
  });

  it('tracks the token ids staked from a certain token for a given user', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);
  
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address)).length, 1);
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address))[0].toString(), '1');

    await imdStakingInstance.stake(stakableNFT.address, 2);
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address)).length, 2);
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address))[1].toString(), '2');

    await imdStakingInstance.unstake(stakableNFT.address, 1);
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address)).length, 1);
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address))[0].toString(), '2');
  });

  it('does not allow staking of a token that is not stakable', async () => {
    const stakableNFT = await MockNFT.new();
    const unstakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    // grant nft #1 to owner
    await unstakableNFT.mint(accounts[0], 1);
    // approve for all
    await unstakableNFT.setApprovalForAll(imdStakingInstance.address, true);

    // fails for bad token id
    await truffleAssert.reverts(
      imdStakingInstance.stake(unstakableNFT.address, 1)
    );
  });

  it('allows unstaking of a staked token', async () => {
    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, to18Decimals(10), to18Decimals(50), to18Decimals(10), ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    // fails for bad token id
    await truffleAssert.reverts(
      imdStakingInstance.unstake(stakableNFT.address, 2)
    );

    // fails for bad token owner
    await truffleAssert.reverts(
      imdStakingInstance.unstake(stakableNFT.address, 1, { from: accounts[1] })
    );

    assert.equal((await stakableNFT.balanceOf(accounts[0])).toNumber(), 0);
    await imdStakingInstance.unstake(stakableNFT.address, 1);
    assert.equal((await stakableNFT.balanceOf(accounts[0])).toNumber(), 1);

    const stakedTokens = await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address);
    assert.equal(stakedTokens.length, 0);
  });

  it('checks dividend', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(500);
    const step = to18Decimals(20);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    let dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // let nearly a week pass
    await advanceTime(ONEWEEK.toNumber() - 100);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // finish the week
    await advanceTime(200);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.toString());

    let lastDividend = minYield;
    let lastStep = new BN(0);
    let expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)));
    while (true) {
      await advanceTime(ONEWEEK.toNumber());
      const actualDividend = await imdStakingInstance.dividendOf(accounts[0]);
      assert.equal(actualDividend.toString(), expectedDividend.toString());

      lastStep = actualDividend.sub(lastDividend).sub(minYield);
      lastDividend = actualDividend;

      if (minYield.add(lastStep.add(step)).gt(maxYield)) break;
      expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)));
    }

    // final increment
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield).toString());
    lastDividend = dividend;

    // ensure doesn't go over
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield).toString());
  });

  it('checks dividend when multiple staked together', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(500);
    const step = to18Decimals(20);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);
    await imdStakingInstance.stake(stakableNFT.address, 2);

    let dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // let nearly a week pass
    await advanceTime(ONEWEEK.toNumber() - 100);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // finish the week
    await advanceTime(200);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.mul(new BN(2)).toString());

    let lastDividend = dividend;
    let lastStep = new BN(0);
    let expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)).mul(new BN(2)));
    while (true) {
      await advanceTime(ONEWEEK.toNumber());
      const actualDividend = await imdStakingInstance.dividendOf(accounts[0]);
      assert.equal(actualDividend.toString(), expectedDividend.toString());

      lastStep = actualDividend.sub(lastDividend).div(new BN(2)).sub(minYield);
      lastDividend = actualDividend;

      if (minYield.add(lastStep.add(step)).gt(maxYield)) break;
      expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)).mul(new BN(2)));
    }

    // final increment
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield.mul(new BN(2))).toString());
    lastDividend = dividend;

    // ensure doesn't go over
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield.mul(new BN(2))).toString());
  });

  it('checks dividend when multiple staked together from different contracts', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(500);
    const step = to18Decimals(20);

    const stakableNFT = await MockNFT.new();
    const stakableNFT2 = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);
    await imdStakingInstance.addStakableToken(stakableNFT2.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT2.mint(accounts[0], 1);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await stakableNFT2.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);
    await imdStakingInstance.stake(stakableNFT2.address, 1);

    let dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // let nearly a week pass
    await advanceTime(ONEWEEK.toNumber() - 100);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // finish the week
    await advanceTime(200);
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.mul(new BN(2)).toString());

    let lastDividend = dividend;
    let lastStep = new BN(0);
    let expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)).mul(new BN(2)));
    while (true) {
      await advanceTime(ONEWEEK.toNumber());
      const actualDividend = await imdStakingInstance.dividendOf(accounts[0]);
      assert.equal(actualDividend.toString(), expectedDividend.toString());

      lastStep = actualDividend.sub(lastDividend).div(new BN(2)).sub(minYield);
      lastDividend = actualDividend;

      if (minYield.add(lastStep.add(step)).gt(maxYield)) break;
      expectedDividend = lastDividend.add(minYield.add(lastStep.add(step)).mul(new BN(2)));
    }

    // final increment
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield.mul(new BN(2))).toString());
    lastDividend = dividend;

    // ensure doesn't go over
    await advanceTime(ONEWEEK.toNumber());
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), lastDividend.add(maxYield.mul(new BN(2))).toString());
  });

  it('checks dividend when multiple staked at different times', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(50);
    const step = to18Decimals(10);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    let dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), '0');

    // let over a week pass
    await advanceTime(ONEWEEK.toNumber() + 100)

    // token 1 - 1 week, token 2 - 0 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.toString());
    await imdStakingInstance.stake(stakableNFT.address, 2);

    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.toString());

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 2 weeks, token 2 - 1 week
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), minYield.mul(new BN(2)).add(minYield.add(step)).toString());

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 3 weeks, token 2 - 2 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), 
      minYield.mul(new BN(2)) // 2 at min yield
        .add(minYield.add(step).mul(new BN(2))) // 2 at week 2 yield
        .add(minYield.add(step.mul(new BN(2)))) // 1 at week 3 yield
        .toString()
    );

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 4 weeks, token 2 - 3 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), 
      minYield.mul(new BN(2)) // 2 at min yield
        .add(minYield.add(step).mul(new BN(2))) // 2 at week 2 yield
        .add(minYield.add(step.mul(new BN(2))).mul(new BN(2))) // 2 at week 3 yield
        .add(minYield.add(step.mul(new BN(3)))) // 1 at week 4 yield
        .toString()
    );

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 5 weeks, token 2 - 4 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), 
      minYield.mul(new BN(2)) // 2 at min yield
        .add(minYield.add(step).mul(new BN(2))) // 2 at week 2 yield
        .add(minYield.add(step.mul(new BN(2))).mul(new BN(2))) // 2 at week 3 yield
        .add(minYield.add(step.mul(new BN(3))).mul(new BN(2))) // 2 at week 4 yield
        .add(maxYield) // 1 at week 5 yield
        .toString()
    );

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 6 weeks, token 2 - 5 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), 
      minYield.mul(new BN(2)) // 2 at min yield
        .add(minYield.add(step).mul(new BN(2))) // 2 at week 2 yield
        .add(minYield.add(step.mul(new BN(2))).mul(new BN(2))) // 2 at week 3 yield
        .add(minYield.add(step.mul(new BN(3))).mul(new BN(2))) // 2 at week 4 yield
        .add(maxYield.mul(new BN(3))) // 3 at week 5 yield
        .toString()
    );

    await advanceTime(ONEWEEK.toNumber());
    // token 1 - 7 weeks, token 2 - 6 weeks
    dividend = await imdStakingInstance.dividendOf(accounts[0]);
    assert.equal(dividend.toString(), 
      minYield.mul(new BN(2)) // 2 at min yield
        .add(minYield.add(step).mul(new BN(2))) // 2 at week 2 yield
        .add(minYield.add(step.mul(new BN(2))).mul(new BN(2))) // 2 at week 3 yield
        .add(minYield.add(step.mul(new BN(3))).mul(new BN(2))) // 2 at week 4 yield
        .add(maxYield.mul(new BN(5))) // 5 at week 5 yield
        .toString()
    );
  });

  it('withdraws dividend', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(50);
    const step = to18Decimals(10);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 2);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    const rewardToken = await RewardToken.at(await imdStakingInstance.rewardToken());

    await advanceTime(ONEWEEK.toNumber() * 10 + 100);
    assert.equal((await rewardToken.balanceOf(accounts[0])).toString(), '0');

    const dividend = await imdStakingInstance.dividendOf(accounts[0]);
    await imdStakingInstance.claimRewards();

    assert.equal((await rewardToken.balanceOf(accounts[0])).toString(), dividend.toString());
    assert.equal((await imdStakingInstance.dividendOf(accounts[0])).toString(), '0');

    await advanceTime(ONEWEEK.toNumber());
    assert.equal((await imdStakingInstance.dividendOf(accounts[0])).toString(), maxYield.mul(new BN(2)).toString());
  });

  it('withdraws stake', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(50);
    const step = to18Decimals(10);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 2);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    await advanceTime(ONEWEEK.toNumber() * 10 + 100);

    const dividend = await imdStakingInstance.dividendOf(accounts[0]);
    await imdStakingInstance.unstake(stakableNFT.address, 2);
    await imdStakingInstance.unstake(stakableNFT.address, 1);

    assert.equal((await imdStakingInstance.dividendOf(accounts[0])).toString(), dividend.toString());
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address)).length, 0);

    await advanceTime(ONEWEEK.toNumber());
    assert.equal((await imdStakingInstance.dividendOf(accounts[0])).toString(), dividend.toString());
  });

  it('withdraws stake and dividend', async () => {
    const minYield = to18Decimals(10);
    const maxYield = to18Decimals(50);
    const step = to18Decimals(10);

    const stakableNFT = await MockNFT.new();
    const imdStakingInstance = await IMDStaking.new(stakableNFT.address, minYield, maxYield, step, ONEWEEK);
    const rewardToken = await RewardToken.at(await imdStakingInstance.rewardToken());

    await stakableNFT.mint(accounts[0], 1);
    await stakableNFT.mint(accounts[0], 2);
    await stakableNFT.setApprovalForAll(imdStakingInstance.address, true);
    await imdStakingInstance.stake(stakableNFT.address, 2);
    await imdStakingInstance.stake(stakableNFT.address, 1);

    await advanceTime(ONEWEEK.toNumber() * 10 + 100);

    const dividend = await imdStakingInstance.dividendOf(accounts[0]);
    await imdStakingInstance.unstake(stakableNFT.address, 2);

    // fails for bad token owner
    await truffleAssert.reverts(
      imdStakingInstance.unstakeAndClaimRewards(stakableNFT.address, 1, { from: accounts[1] })
    );
    await imdStakingInstance.unstakeAndClaimRewards(stakableNFT.address, 1);

    assert.equal((await imdStakingInstance.dividendOf(accounts[0])).toString(), '0');
    assert.equal((await imdStakingInstance.stakedTokenIds(accounts[0], stakableNFT.address)).length, 0);
    assert.equal((await rewardToken.balanceOf(accounts[0])).toString(), dividend.toString());
  });
});
