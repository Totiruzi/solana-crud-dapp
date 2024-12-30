import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Solanacrudapp} from '../target/types/solanacrudapp'

describe('solanacrudapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solanacrudapp as Program<Solanacrudapp>

  const solanacrudappKeypair = Keypair.generate()

  it('Initialize Solanacrudapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanacrudapp: solanacrudappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanacrudappKeypair])
      .rpc()

    const currentCount = await program.account.solanacrudapp.fetch(solanacrudappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solanacrudapp', async () => {
    await program.methods.increment().accounts({ solanacrudapp: solanacrudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanacrudapp.fetch(solanacrudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solanacrudapp Again', async () => {
    await program.methods.increment().accounts({ solanacrudapp: solanacrudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanacrudapp.fetch(solanacrudappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solanacrudapp', async () => {
    await program.methods.decrement().accounts({ solanacrudapp: solanacrudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanacrudapp.fetch(solanacrudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solanacrudapp value', async () => {
    await program.methods.set(42).accounts({ solanacrudapp: solanacrudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanacrudapp.fetch(solanacrudappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solanacrudapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanacrudapp: solanacrudappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solanacrudapp.fetchNullable(solanacrudappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
