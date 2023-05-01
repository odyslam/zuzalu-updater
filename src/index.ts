import { ethers } from 'ethers';
import { BigNumberish } from 'ethers';
import { ZuzaluOracle__factory } from 'zuzalu-oracle';

export interface Env {
  ETH_RPC_URL: string;
  ETH_PRIVATE_KEY: string;
  CONTRACT_ADDRESS: string;
}

//     enum Groups {
//         // Dummy value so that groups have the official numbering (1-4)
//         None,
//         Participants,
//         Residents,
//         Visitors,
//         Organizers
//     }

interface Historic {
  id: number;
  name: string;
  members: string[];
  depth: number;
}

interface RootAndDepth {
  root: number,
  depth: number
}

const getRootAndDepth = async (group: number): Promise<RootAndDepth> => {
  const rootRes = await fetch(`https://api.pcd-passport.com/semaphore/latest-root/${group.toString()}`);
  const root: number = await rootRes.json();
  const historicRes = await fetch(`https://api.pcd-passport.com/semaphore/historic/${root}`);
  const historic: Historic = await historicRes.json();
  const depth = historic.depth;
  console.log(`Group ${group} has root ${root} and depth ${depth}`)
  return { root: root, depth: depth };
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const provider = new ethers.JsonRpcProvider(env.ETH_RPC_URL);
    const wallet = new ethers.Wallet(env.ETH_PRIVATE_KEY, provider);
    const oracle = ZuzaluOracle__factory.connect(env.CONTRACT_ADDRESS, wallet);

    const contractRoots = await oracle.getLastRoots();
    const participants = await getRootAndDepth(1);
    const residents = await getRootAndDepth(2);
    const visitors = await getRootAndDepth(3);
    const organizers = await getRootAndDepth(4);

    let roots: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] = [0n, 0n, 0n, 0n];
    let depths: [BigNumberish, BigNumberish, BigNumberish, BigNumberish] = [0n, 0n, 0n, 0n];

    if (BigInt(participants.root) != contractRoots[0]) {
      roots[0] = BigInt(participants.root);
      depths[0] = BigInt(participants.depth);
    }
    if (BigInt(residents.root) != contractRoots[1]) {
      roots[1] = BigInt(residents.root);
      depths[1] = BigInt(residents.depth);
    }
    if (BigInt(visitors.root) != contractRoots[2]) {
      roots[2] = BigInt(visitors.root);
      depths[2] = BigInt(visitors.depth);
    }
    if (BigInt(organizers.root) != contractRoots[3]) {
      roots[3] = BigInt(organizers.root);
      depths[3] = BigInt(organizers.depth);
    }
    const tx = await oracle.updateGroups(roots, depths);
    const receipt = await tx.wait();
    console.log("Submitted transaction to update groups");
    console.log(receipt);
  },
};
