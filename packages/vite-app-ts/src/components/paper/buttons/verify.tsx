import {CheckCircleOutlined} from '@ant-design/icons';
import {Button, Form, Input, Modal} from 'antd';
import {transactor} from 'eth-components/functions';
import {EthComponentsSettingsContext} from 'eth-components/models';
import {useGasPrice, useSignerAddress} from 'eth-hooks';
import {useEthersAppContext} from 'eth-hooks/context';
import React, {FC, useContext, useState} from 'react';

import {getNetworkInfo} from '~common/functions';
import {IPaper} from "~~/components/hooks/usePapers";
import {PaperFactory, MockVerifier} from "~common/generated/contract-types";
import {useAppContracts} from "~common/components/context";
import {ethers} from 'ethers';

export interface IVerify {
  paper: IPaper;
}

interface IVerifyForm {
  proof: string;
  address: string;
}

export const Verify: FC<IVerify> = (props) => {
  const {paper} = props;
  const ethersAppContext = useEthersAppContext();

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);
  const [myAddress] = useSignerAddress(ethersAppContext.signer);
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);
  const mockVerifier: MockVerifier | undefined = useAppContracts('MockVerifier', ethersAppContext.chainId);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onValidate = async (values: IVerifyForm): Promise<void> => {
    const proof = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(values.proof));
    await tx!(paperContract?.verify(paper.identifier, [1, 2, 3], proof, mockVerifier!.address), (update: any) => {
      console.log(update)
      setVisible(false)
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
        Verify
      </Button>
      <Modal
        visible={visible}
        title={"Verify " + paper.identifier}
        okText="Validate"
        cancelText="Cancel"
        onCancel={(): void => setVisible(false)}
        onOk={(): void => {
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              await onValidate(values as IVerifyForm);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}>
        <Form form={form} name="verify-form" preserve={false}>
          <Form.Item name="proof" label="Proof" rules={[{required: true}]}>
            <Input type={'string'}/>
          </Form.Item>
          <Form.Item name="verifier_address" label="Verifier address" rules={[{required: true}]}>
            <Input type={'string'}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
