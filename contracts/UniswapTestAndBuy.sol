/* SPDX-License-Identifier: UNLICENSED */
pragma solidity 0.8.9;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IUniswapRouterV2} from "./interfaces/IUniswapRouterV2.sol";

contract UniswapTestAndBuy {
    // --------------------------------------------------------
    // --------------------  LIBRARIES  -----------------------
    // --------------------------------------------------------

    using SafeERC20 for IERC20;

    // --------------------------------------------------------
    // ---------------------  STORAGE  ------------------------
    // --------------------------------------------------------

    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    IUniswapRouterV2 public constant UNISWAP_ROUTER =
        IUniswapRouterV2(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    // --------------------------------------------------------
    // ---------------------  ERRORS  -------------------------
    // --------------------------------------------------------

    error NotEnoughETH();

    error TokenBuyTestFailure();

    error TokenSellTestFailure();

    error TokenBuyFailure();

    // --------------------------------------------------------
    // -------------------  RECIEVE ETH  ----------------------
    // --------------------------------------------------------

    receive() external payable {}

    // --------------------------------------------------------
    // ---------------------  ACTIONS  ------------------------
    // --------------------------------------------------------

    struct TestAndBuyArgs {
        address token;
        uint256 testAmountIn;
        uint256 amountOutMin;
    }

    function testAndBuy(TestAndBuyArgs calldata args) external payable {
        if (msg.value <= args.testAmountIn) revert NotEnoughETH();

        address self = address(this);
        IERC20 token = IERC20(args.token);
        uint256 deadline = block.timestamp + 60;

        address[] memory buyPath = new address[](2);
        buyPath[0] = WETH;
        buyPath[1] = args.token;

        uint256 initialBuyTestBalance = token.balanceOf(self);
        UNISWAP_ROUTER.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: args.testAmountIn
        }(0, buyPath, self, deadline);
        uint256 resultBuyTestBalance = token.balanceOf(self);

        if (resultBuyTestBalance <= initialBuyTestBalance)
            revert TokenBuyTestFailure();

        uint256 testTokensBalance = resultBuyTestBalance -
            initialBuyTestBalance;

        token.safeApprove(address(UNISWAP_ROUTER), testTokensBalance);

        address[] memory sellPath = new address[](2);
        sellPath[0] = args.token;
        sellPath[1] = WETH;

        uint256 initialSellTestBalance = self.balance;
        UNISWAP_ROUTER.swapExactTokensForETHSupportingFeeOnTransferTokens(
            testTokensBalance,
            0,
            sellPath,
            self,
            deadline
        );
        uint256 resultSellTestBalance = self.balance;

        if (resultSellTestBalance <= initialSellTestBalance)
            revert TokenSellTestFailure();

        uint256 initialTokenBalance = token.balanceOf(msg.sender);
        UNISWAP_ROUTER.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: msg.value -
                args.testAmountIn +
                resultSellTestBalance -
                initialSellTestBalance
        }(args.amountOutMin, buyPath, msg.sender, deadline);
        uint256 resultTokenBalance = token.balanceOf(msg.sender);

        if (resultTokenBalance <= initialTokenBalance) revert TokenBuyFailure();
    }
}
