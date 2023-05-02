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
  const historicRes = await fetch(`https://api.pcd-passport.com/semaphore/historic/${group.toString()}/${root}`);
  const historic: Historic = await historicRes.json();
  const depth = historic.depth;
  console.log(`Group ${group} has root ${root} and depth ${depth}`)
  return { root: root, depth: depth };
}

export default {
  async scheduled(
    _event: Event,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    const ethers = await import('ethers');
    const zuzaluOracle = await import('zuzalu-oracle');

    const provider = new ethers.JsonRpcProvider(env.ETH_RPC_URL);
    const wallet = new ethers.Wallet(env.ETH_PRIVATE_KEY, provider);
    const oracle = zuzaluOracle.ZuzaluOracle__factory.connect(env.CONTRACT_ADDRESS, wallet);

    const contractRoots = await oracle.getLastRoots();
    const participants = await getRootAndDepth(1);
    const residents = await getRootAndDepth(2);
    const visitors = await getRootAndDepth(3);
    const organizers = await getRootAndDepth(4);

    let roots: [bigint, bigint, bigint, bigint] = [0n, 0n, 0n, 0n];
    let depths: [bigint, bigint, bigint, bigint] = [0n, 0n, 0n, 0n];

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
    if (roots[0] == 0n && roots[1] == 0n && roots[2] == 0n && roots[3] == 0n) {
      console.log("No updates to groups");
      return;
    }
    const tx = await oracle.updateGroups(roots, depths);
    const receipt = await tx.wait();
    console.log("Submitted transaction to update groups");
    console.log(receipt);
  },
};
