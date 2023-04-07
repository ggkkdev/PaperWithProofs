import {Col, List, Progress, Row, Statistic} from 'antd';
import {useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import {useTokenBalance} from 'eth-hooks/erc';
import React, {FC} from 'react';
import {IPaper} from "~~/components/hooks/usePapers";
import {Verify} from "~~/components/paper/buttons/verify";
import {PaperFactory} from "~common/generated/contract-types";
import {useAppContracts} from "~common/components/context";
import {bigIntegerToFixed, truncateEthAddress} from "~~/helpers/utils";
import {ERC20, RewardToken} from "~common/generated";
import {ethers} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";
import {Cite} from "~~/components/paper/buttons/cite";

export interface IPaperProps {
  paper: IPaper;
}

export const Paper: FC<IPaperProps> = (props) => {
  const {paper} = props;

  return (
    <>
      <List.Item
        key={paper.identifier}
        actions={[
          <Verify paper={paper}/>,
          <Cite paper={paper}/>
        ]}>
        <List.Item.Meta
          avatar={<></>}
          title={<a href={paper.url}>{paper.title}</a>}
        />
        <Row gutter={20} style={{display: 'flex', justifyContent: 'center'}}>
          <Col span={6}><Row style={{justifyContent:"center"}}>Verification</Row>
            <Progress
              type="circle"
              percent={
                paper.verified ? 100 : 0
              }
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Author"
              value={`${truncateEthAddress(paper.owner)}`}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic title="Number of citations" value={bigIntegerToFixed(paper.nbOfCitation, 0)}/>
          </Col>

        </Row>
      </List.Item>
    </>
  );
};
