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
import { title } from 'process'

interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

export function useSolanacrudappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanacrudappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanacrudappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solanacrudapp', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['JournalEntry', 'create', {cluster}],
    mutationFn: async({title, message, owner}) => {
      return program.methods.createJournalEntry(title, message).rpc();
    },

    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },

    onError: (error) => {
      toast.error(`Error creating entry: ${error.message}`);
    }
  })

  return {
    program,
    accounts,
    getProgramAccount,
    createEntry,
    programId
  }
}

export function useSolanacrudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanacrudappProgram()

  const accountQuery = useQuery({
    queryKey: ['solanacrudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })


  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journalEntry', 'update', {cluster}],
    mutationFn: async ({title, message}) => {
      return program.methods.updateJournalEntry(title, message).rpc();
    },

    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },

    onError: (error) => {
      toast.error(`Error updating entry ${error}`);
    }
  })

  const deleteEntry = useMutation({
    mutationKey: ["journal", "deleteEntry", { cluster, account }],
    mutationFn: (title: string) =>
      program.methods.deleteEntry(title).rpc(),
      onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },

    onError: (error) => {
      toast.error(`Error deleting entry ${error}`);
    }
  })

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  }
}
