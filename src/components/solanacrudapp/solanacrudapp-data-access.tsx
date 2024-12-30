'use client'

import { getSolanacrudappProgram, getSolanacrudappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSolanacrudappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanacrudappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanacrudappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solanacrudapp', 'all', { cluster }],
    queryFn: () => program.account.solanacrudapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solanacrudapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solanacrudapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSolanacrudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanacrudappProgram()

  const accountQuery = useQuery({
    queryKey: ['solanacrudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanacrudapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solanacrudapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solanacrudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solanacrudapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solanacrudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solanacrudapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solanacrudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solanacrudapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solanacrudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
