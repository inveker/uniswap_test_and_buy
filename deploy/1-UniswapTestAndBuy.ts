import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'


const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre;
  const { deploy } = deployments;
  const [deployer] = await ethers.getSigners();


 await deploy('UniswapTestAndBuy', {
   contract: 'UniswapTestAndBuy',
    from: deployer.address,
    args: [],
  });
};

deploy.tags = ['UniswapTestAndBuy'];
export default deploy;