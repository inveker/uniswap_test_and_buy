# Uniswap: Test and Buy

## Dependencies:
1) NodeJS v16 + npm

## Install:
1) Run command in project root folder

        npm i --force
2) Create ".env" file by example env.example 
3) Run command 

        npx hardhat compile

## Test:
    npx hardhat test 

## Deploy:
    npx hardhat deploy --network prodMainnet

## Use:
Call contract function *testAndBuy*:

    function testAndBuy(TestAndBuyArgs calldata args) external payable

Function arguments:

    struct TestAndBuyArgs {
        address token;
        uint256 testAmountIn;
        uint256 amountOutMin;
    }

Example call ethers-lib:

    await uniswapTestAndBuy.testAndBuy({
        token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        testAmountIn: ethers.utils.parseEth('0.001'),
        amountOutMin: 0
    }, { value: ethers.utils.parseEth('0.201') });

## Use in python:

1) copy file ./python_integration/uniswap_test_and_buy.py in u project
2) change variable FOLDER_PATH_UNISWAP_TEST_AND_BUY
3) call function uniswap_test_and_buy_test(list): list

see example in ./python_integration/example.py
