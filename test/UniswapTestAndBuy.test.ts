import { ethers, deployments } from 'hardhat';
import { Signer } from 'ethers';
import { assert } from 'chai';
import { IERC20, UniswapTestAndBuy } from '../typechain-types';


const TEST_TOKENS = [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xb50844b129731B7578624BF84f7727E430107B64', // KINU
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
];

describe(`UniswapTestAndBuy.sol`, () => {
    // --------------------------------------------------------
    // ----------------------  DEPLOY  ------------------------
    // --------------------------------------------------------

    let uniswapTestAndBuy: UniswapTestAndBuy;
    let owner: Signer;

    beforeEach(async () => {
        await deployments.fixture(['UniswapTestAndBuy']);
        const UniswapTestAndBuyDeployment = await deployments.get('UniswapTestAndBuy');
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        uniswapTestAndBuy = await ethers.getContractAt(
            'UniswapTestAndBuy',
            UniswapTestAndBuyDeployment.address,
        ) as UniswapTestAndBuy;
    });

    // --------------------------------------------------------
    // ------------------  REGULAR TESTS  ---------------------
    // --------------------------------------------------------

    for (const TOKEN of TEST_TOKENS) {
        it(`Regular test ${TOKEN}`, async () => {
            const token = await ethers.getContractAt('IERC20', TOKEN) as IERC20;
            const initialBalance = await token.balanceOf(await owner.getAddress());
            const testAmount = ethers.utils.parseEther('0.001');
            const buyAmount = ethers.utils.parseEther('0.2');
            await uniswapTestAndBuy.connect(owner).testAndBuy({
                token: TOKEN,
                testAmountIn: testAmount,
                amountOutMin: 0
            }, { value: buyAmount.add(testAmount) });
            const resultBalance = await token.balanceOf(await owner.getAddress());
            console.log(`RESULT: ${resultBalance.sub(initialBalance)}`);
            assert(resultBalance.gt(initialBalance), 'Token not buy!');
        });
    }
});