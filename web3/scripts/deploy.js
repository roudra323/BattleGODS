require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("*" * 10);
  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await ethers.deployContract("BallteGODS");

  await contract.waitForDeployment();
  console.log("*" * 10);
  console.log("Contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
