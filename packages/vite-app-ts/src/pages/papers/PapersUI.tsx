import { Divider, Layout } from 'antd';
import React, { FC } from 'react';

import { CreatePaper } from '~~/components/paper/createPaper';
import { Papers } from '~~/components/paper/Papers';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaperProps {}

export const PapersUI: FC<PaperProps> = (props) => {
  return (
    <Layout style={{ padding: '90px' }}>
      <Layout.Header>
        <CreatePaper />
      </Layout.Header>
      <Divider />
      <Layout.Content>
        <Papers />
      </Layout.Content>
    </Layout>
  );
};
