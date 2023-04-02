import {CheckCircleOutlined} from '@ant-design/icons';
import {Button, Input} from 'antd';
import {transactor} from 'eth-components/functions';
import {EthComponentsSettingsContext} from 'eth-components/models';
import {useGasPrice, useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import React, {FC, useContext} from 'react';

import {getNetworkInfo} from '~common/functions';
import {IPaper} from "~~/components/hooks/usePapers";
import {PaperFactory} from "~common/generated/contract-types";
import {useAppContracts} from "~common/components/context";

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
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);


  const onClick = async (): Promise<void> => {
    await tx!(paperContract?.verifyMock("proof", paper.identifier), (update: any) => {
      alert("verified!!")
    });
  };
  return (
    <>
      {}
      <Input placeholder="Proof" />;
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
