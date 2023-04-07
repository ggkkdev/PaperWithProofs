import {CheckCircleOutlined} from '@ant-design/icons';
import {Button, Form, Input, Modal} from 'antd';
import {transactor} from 'eth-components/functions';
import {EthComponentsSettingsContext} from 'eth-components/models';
import {useGasPrice, useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import React, {FC, useContext, useState} from 'react';

import {getNetworkInfo} from '~common/functions';
import {IPaper, usePapers} from '~~/components/hooks/usePapers';
import {PaperFactory, MockVerifier} from '~common/generated/contract-types';
import {useAppContracts} from '~common/components/context';
import {ethers} from 'ethers';
import {Select} from 'antd';
import type {SelectProps} from 'antd';

export interface ICite {
  paper: IPaper;
}

interface ICitationForm {
  citations: string[];
}

export const Cite: FC<ICite> = (props) => {
  const {paper} = props;
  const papers: IPaper[] = usePapers();
  const ethersAppContext = useEthersAppContext();

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);
  const [myAddress] = useSignerAddress(ethersAppContext.signer);
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  let options: SelectProps['options'] = [];

  options = papers.map((item, i) => {
    return {label: item.identifier, value: item.identifier};
  });

  const onValidate = async (values: ICitationForm): Promise<void> => {
    console.log(paper.identifier, values.citations)
    await tx!(paperContract?.cite(paper.identifier, values.citations), (update: any) => {
      setVisible(false);
    });
  };

  return (
    <>
      <Button
        onClick={(): void => setVisible(true)}
        type="primary"
        key={paper.identifier}
        style={{backgroundColor: 'grey', borderColor: 'transparent'}}
        icon={<CheckCircleOutlined/>}>
        Cite
      </Button>
      <Modal
        visible={visible}
        title={'Cite for ' + paper.identifier}
        okText="Validate"
        cancelText="Cancel"
        onCancel={(): void => setVisible(false)}
        onOk={(): void => {
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              await onValidate(values as ICitationForm);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}>
        <Form form={form} name="cite-form" preserve={false}>
          <Form.Item name="citations" label="Citations" rules={[{required: true}]}>
            <Select
              mode="multiple"
              allowClear
              style={{width: '100%'}}
              placeholder="Please select"
              //defaultValue={}
              //onChange={handleChange}
              options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
