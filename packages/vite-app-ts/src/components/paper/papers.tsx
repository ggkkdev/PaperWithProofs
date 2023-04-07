import { List } from 'antd';
import React, { FC } from 'react';
import {IPaper, usePapers} from "~~/components/hooks/usePapers";
import {Paper} from "~~/components/paper/paper";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPapersProps {}

export const Papers: FC<IPapersProps> = (props) => {
  const papers: IPaper[] = usePapers();
  return (
    <div style={{ width: '100%' }}>
      <List
        itemLayout="vertical"
        pagination={{
          onChange: (page): void => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={papers}
        renderItem={(item: IPaper): any => <Paper paper={item} />}
      />
    </div>
  );
};
