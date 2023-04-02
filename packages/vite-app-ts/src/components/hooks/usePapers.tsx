import {BigNumber} from '@ethersproject/bignumber';
import {useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import {ethers} from 'ethers';
import {useEffect, useState} from 'react';

import {useAppContracts} from '~common/components/context';
import {ERC20, ERC20__factory} from '~common/generated';
import {PaperFactory} from "~common/generated/contract-types";

export interface IPaper {
  title: string;
  url: string;
  owner: string;
  citation?: string;
  identifier:string;
  nbOfCitation:BigNumber;
}

export interface IUserInfo {
  userRewardPerTokenPaid: BigNumber;
  balance: BigNumber;
  rewards: BigNumber;
}

/**
 * Get pools from contract's events
 *
 */
export const usePapers = (): IPaper[] => {
  const ethersAppContext = useEthersAppContext();
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);
  const [papers, setPapers] = useState<IPaper[]>([]);
  const [myAddress] = useSignerAddress(ethersAppContext.signer);

  const updateAllPapers = async (): Promise<void> => {
    if (paperContract && ethersAppContext.signer && myAddress) {
      const eventFilter = paperContract.filters.PaperCreated();
      const _paperEvents = await paperContract.queryFilter(eventFilter);
      const _papers = await Promise.all(
        _paperEvents.map(async (e): Promise<IPaper> => {
          const _paper: IPaper = await paperContract.getPaper(e.args.identifier);
          return {
            title: _paper.title,
            owner: _paper.owner,
            url: _paper.url,
            citation: _paper.citation,
            identifier:_paper.identifier,
            nbOfCitation:_paper.nbOfCitation
          };
        })
      );
      setPapers(_papers);
    }
  };
  /**
   * Reload all infos for each updateReward function.
   * TODO: do better with just updating the necessary infos
   */
  useEffect(() => {
    void updateAllPapers();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    paperContract?.on('PaperCreated', async (): Promise<void> => {
      await updateAllPapers();
    });
  }, [paperContract, ethersAppContext.signer, myAddress]);

  return papers;
};
