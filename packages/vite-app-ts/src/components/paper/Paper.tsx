import {Col, List, Progress, Row, Statistic} from 'antd';
import {useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import {useTokenBalance} from 'eth-hooks/erc';
import React, {FC} from 'react';
import {IPaper} from "~~/components/hooks/usePapers";
import {Reward} from "~~/components/paper/reward";
import {Verify} from "~~/components/paper/verify";
import {PaperFactory} from "~common/generated/contract-types";
import {useAppContracts} from "~common/components/context";
import {bigIntegerToFixed, truncateEthAddress} from "~~/helpers/utils";
import {ERC20, RewardToken} from "~common/generated";
import {ethers} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";

export interface IPaperProps {
  paper: IPaper;
}

export const Paper: FC<IPaperProps> = (props) => {
  const {paper} = props;
  const ethersAppContext = useEthersAppContext();
  const [myAddress] = useSignerAddress(ethersAppContext.signer);
  const rewardToken = useAppContracts('RewardToken', ethersAppContext.chainId);
  //const [balance] = useTokenBalance((rewardToken as unknown) as ERC20, myAddress!);
  return (
    <>
      <List.Item
        key={paper.identifier}
        actions={[
          /*          <TokenFaucet pool={pool} key={'token-button'} />,
                    <Stake pool={pool} key={'staking-button'} />,
                    <Withdraw pool={pool} key={'withdraw-button'} />,*/
          <Verify paper={paper}/>,
          <Reward paper={paper} key={'reward-button'}/>,
        ]}>
        <List.Item.Meta
          avatar={<></>}
          title={<a href={paper.url}>{paper.title}</a>}
          //description={`${paper.title} from ${paper.owner}`}
        />
        <Row gutter={20} style={{display: 'flex', justifyContent: 'center'}}>
          <Col span={4}>Verification
            <Progress
              type="circle"
              percent={
                0
              }
            />
          </Col>
          <Col span={4}>Reward claimed
            <Progress
              type="circle"
              percent={
                0
              }
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="Author"
              value={`${truncateEthAddress(paper.owner)}`}
              precision={2}
            />
          </Col>
          <Col span={4}>
            <Statistic title="Number of citations" value={bigIntegerToFixed(paper.nbOfCitation, 0)}/>
          </Col>
          <Col span={4}>
            <Statistic title={`Available reward`} value={bigIntegerToFixed(BigNumber.from(10).mul(10), 0)}/>
          </Col>
        </Row>
      </List.Item>
    </>
  );
};
