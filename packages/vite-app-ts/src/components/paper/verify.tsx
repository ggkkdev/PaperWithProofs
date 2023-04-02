import {CheckCircleOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {transactor} from 'eth-components/functions';
import {EthComponentsSettingsContext} from 'eth-components/models';
import {useGasPrice, useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import {parseEther} from 'ethers/lib/utils';
import React, {FC, useContext} from 'react';

import {getNetworkInfo} from '~common/functions';
import {IPaper} from "~~/components/hooks/usePapers";

export interface IVerify {
  paper: IPaper;
}

export const Verify: FC<IVerify> = (props) => {
  const { paper } = props;
  const ethersAppContext = useEthersAppContext();
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);
  const [myAddress] = useSignerAddress(ethersAppContext.signer);


  const onClick = async (): Promise<void> => {
/*    await tx!(contract?.mint(myAddress!, parseEther('20')), (update: any) => {
    });*/
  };
  return (
    <>
      {}
      <Button
        onClick={(): void => {
          void onClick();
        }}
        type="primary"
        key={paper.identifier}
        style={{ backgroundColor: 'grey', borderColor: 'transparent' }}
        icon={<CheckCircleOutlined />}>
        Verify
      </Button>
    </>
  );
};
