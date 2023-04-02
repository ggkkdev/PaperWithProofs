import { Button, Form, Input, Modal } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useGasPrice } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { FC, useContext, useState } from 'react';

import { useAppContracts } from '~common/components/context';
import { getNetworkInfo } from '~common/functions';
import {PaperFactory} from "~common/generated/contract-types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICreatePaperProps {}

interface IPaperForm {
  title: string;
  url: string;
  owner:string;
  identifier:string;
  citation:string;

}

export const CreatePaper: FC<ICreatePaperProps> = (props) => {
  const ethersAppContext = useEthersAppContext();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));
  const tx = transactor(ethComponentsSettings, ethersAppContext?.signer, gasPrice);
  const paperContract: PaperFactory | undefined = useAppContracts('PaperFactory', ethersAppContext.chainId);

  const onValidate = async (values: IPaperForm): Promise<void> => {
    console.log(values.url,values.identifier,  values.title, values.citation )
    await tx!(paperContract?.createPaper( values.url, values.identifier, values.title,values.citation ), (update: any) => {
      setVisible(false);
      if (update.status === 1) {
        console.log('Paper created!');
      }
    });
  };
  return (
    <>
      <Button type="primary" size={'large'} onClick={(): void => setVisible(true)}>
        Create new Paper
      </Button>
      <Modal
        visible={visible}
        title="Create a new paper"
        okText="Create"
        cancelText="Cancel"
        onCancel={(): void => setVisible(false)}
        onOk={(): void => {
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              await onValidate(values as IPaperForm);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}>
        <Form form={form} name="paper-form" preserve={false}>
          {/* //onFinish={onFinish}>*/}
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input type={'string'} />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true }]}>
            <Input type={'string'} />
          </Form.Item>
          <Form.Item name="identifier" label="Identifier" rules={[{ required: true }]}>
            <Input type={'string'} />
          </Form.Item>
          <Form.Item name="citation" label="Citation" >
            <Input type={'string'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
