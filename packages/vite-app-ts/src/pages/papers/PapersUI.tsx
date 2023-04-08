import {Divider, Layout, Row} from 'antd';
import React, {FC} from 'react';
import {Typography} from 'antd';

const {Title} = Typography;
import {CreatePaper} from '~~/components/paper/buttons/createPaper';
import {Papers} from '~~/components/paper/papers';
import {useTokenBalance} from 'eth-hooks/erc';
import {useAppContracts} from "~common/components/context";
import {useEthersAppContext} from "eth-hooks/context";
import {useSignerAddress} from "eth-hooks";
import {RewardToken} from "~common/generated/contract-types";
import {bigIntegerToFixed} from "~~/helpers/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaperProps {
}

export const PapersUI: FC<PaperProps> = (props) => {
  const ethersAppContext = useEthersAppContext();
  const rewardToken: RewardToken = useAppContracts('RewardToken', ethersAppContext.chainId)!;
  const [myAddress] = useSignerAddress(ethersAppContext.signer)
  const tokenBalance = useTokenBalance(rewardToken!, myAddress!)
  return (
    <Layout style={{padding: '90px'}}>
      <Layout.Header>
        <Row style={{justifyContent: "center"}}><Title>{"PWP Balance: " + bigIntegerToFixed(tokenBalance[0], 4)}</Title></Row>
        <CreatePaper/>
      </Layout.Header>
      <Divider/>
      <Layout.Content>
        <Papers/>
      </Layout.Content>
    </Layout>
  );
};
