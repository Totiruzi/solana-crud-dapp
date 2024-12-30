// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolanacrudappIDL from '../target/idl/solanacrudapp.json'
import type { Solanacrudapp } from '../target/types/solanacrudapp'

// Re-export the generated IDL and type
export { Solanacrudapp, SolanacrudappIDL }

// The programId is imported from the program IDL.
export const SOLANACRUDAPP_PROGRAM_ID = new PublicKey(SolanacrudappIDL.address)

// This is a helper function to get the Solanacrudapp Anchor program.
export function getSolanacrudappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolanacrudappIDL, address: address ? address.toBase58() : SolanacrudappIDL.address } as Solanacrudapp, provider)
}

// This is a helper function to get the program ID for the Solanacrudapp program depending on the cluster.
export function getSolanacrudappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solanacrudapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLANACRUDAPP_PROGRAM_ID
  }
}