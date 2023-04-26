import { ethers } from 'ethers';
/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_verifier",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidGroup",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "root",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "depth",
        "type": "uint256"
      }
    ],
    "name": "Update",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "$organizersToDepth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "$participantsToDepth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "$residentsToDepth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "$visitorsToDepth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VERIFIER",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum ZuzaluOracle.Groups",
        "name": "_group",
        "type": "uint8"
      }
    ],
    "name": "getLastRoot",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastRoots",
    "outputs": [
      {
        "internalType": "uint256[4]",
        "name": "",
        "type": "uint256[4]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "root",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_depth",
        "type": "uint256"
      },
      {
        "internalType": "enum ZuzaluOracle.Groups",
        "name": "_group",
        "type": "uint8"
      }
    ],
    "name": "updateGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[4]",
        "name": "_roots",
        "type": "uint256[4]"
      },
      {
        "internalType": "uint256[4]",
        "name": "_depths",
        "type": "uint256[4]"
      }
    ],
    "name": "updateGroups",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nullifierHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_signal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_externalNullifier",
        "type": "uint256"
      },
      {
        "internalType": "uint256[8]",
        "name": "_proof",
        "type": "uint256[8]"
      },
      {
        "internalType": "enum ZuzaluOracle.Groups",
        "name": "_group",
        "type": "uint8"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_root",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_depth",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_nullifierHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_signal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_externalNullifier",
        "type": "uint256"
      },
      {
        "internalType": "uint256[8]",
        "name": "_proof",
        "type": "uint256[8]"
      }
    ],
    "name": "verifyUnsafe",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
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
  const rootRes = await fetch("https://api.pcd-passport.com/semaphore/latest-root/" + group.toString());
  const root: number = await rootRes.json();
  const historicRes = await fetch(`https://api.pcd-passport.com/semaphore/historic/${root}`);
  const historic: Historic = await historicRes.json();
  const depth = historic.depth;
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
    const contract = new ethers.Contract(env.CONTRACT_ADDRESS, abi, wallet);
    const contractRoots = await contract.getLastRoots();
    const participants = await getRootAndDepth(1);
    const residents = await getRootAndDepth(2);
    const visitors = await getRootAndDepth(3);
    const organizers = await getRootAndDepth(4);

    let roots = [0n, 0n, 0n, 0n]
    let depths = [0n, 0n, 0n, 0n]

    if (participants.root != contractRoots[0]) {
      roots[0] = BigInt(participants.root);
      depths[0] = BigInt(participants.depth);
    }
    if (residents.root != contractRoots[1]) {
      roots[1] = BigInt(residents.root);
      depths[1] = BigInt(residents.depth);
    }
    if (visitors.root != contractRoots[2]) {
      roots[2] = BigInt(visitors.root);
      depths[2] = BigInt(visitors.depth);
    }
    if (organizers.root != contractRoots[3]) {
      roots[3] = BigInt(organizers.root);
      depths[3] = BigInt(organizers.depth);
    }
    const tx = await contract.updateGroups(roots, depths);
    const receipt = await tx.wait();
    console.log(receipt);
  },
};
