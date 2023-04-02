import {CheckCircleOutlined} from '@ant-design/icons';
import {Button, message} from 'antd';
import {transactor} from 'eth-components/functions';
import {EthComponentsSettingsContext} from 'eth-components/models';
import {useGasPrice} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import React, {FC, useContext} from 'react';

import {useAppContracts} from '~common/components/context';
import {getNetworkInfo} from '~common/functions';
import {PaperFactory} from '~common/generated/contract-types';
import {IPaper} from "~~/components/hooks/usePapers";

export interface IRewardProps {
  paper: IPaper;
}

export const Reward: FC<IRewardProps> = (props) => {
  const { paper } = props;
  const ethersAppContext = useEthersAppContext();
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);

  const onClick = async (): Promise<void> => {
    await tx!(paperContract?.claimReward(paper.identifier), (update: any) => {
      if (update.status === 1) {
        void message.success(`Good job ! you get ${update.value} reward`);
        console.log(update);
        console.log('reward ok  !');
      }
    });
  };
  return (
    <>
      {}
      <Button
        onClick={(): void => {
          void onClick();
        }}
        type="primary"
        key={paper.identifier + ' identifier'}
        style={{ backgroundColor: '#389e0d', borderColor: 'transparent' }}
        icon={<CheckCircleOutlined />}>
        Claim Reward
      </Button>
    </>
  );
};
