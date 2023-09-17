import {
  CopyOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  FolderOutlined,
  HomeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Popover } from 'antd';
import _ from 'loadsh';
import { observer } from 'mobx-react';
import { Component } from 'react';
import EditableList from '../compontent/EditableList';
import Folder from '../compontent/Folder';
import styles from './index.less';

// let arr:any = []
// for (let index = 0; index < 100; index++) {
//     arr.push(index);
// }

class TableContent extends Component<{ store: any }> {
  paramOnChange = (v: any) => {
    console.log(v, '---------');
  };

  state = {
    open: false,
  };

  hanldeBulkCopy = () => {
    const { copyRightDataValue, RightDatchData } = this.props.store;
    console.log(_.cloneDeep(RightDatchData), '-----');
    copyRightDataValue(RightDatchData, true);
  };

  hanldeBulkDelete = () => {
    const { deleteRightDataValue, RightDatchData } = this.props.store;
    deleteRightDataValue(RightDatchData, true);
  };

  PopoverContent = () => {
    const { getRightData, addFolder, bulkMovement } = this.props.store;
    const folderRes = _.filter(getRightData, (v: any) => _.get(v, 'children'));
    const onclick = (parentName: string | null) => {
      bulkMovement(parentName);
      this.setState({ open: false });
    };
    return (
      <div className={styles.popoverContent}>
        <p onClick={() => onclick(null)}>
          <HomeOutlined style={{ marginRight: 8 }} /> 根目录
        </p>
        {_.map(folderRes, (v: any) => {
          return (
            <p onClick={() => onclick(_.get(v, 'parentName'))}>
              <FolderOutlined style={{ marginRight: 8 }} />
              {_.get(v, 'parentName')}
            </p>
          );
        })}
        <Button
          type="dashed"
          onClick={() => {
            addFolder();
            this.setState({ open: false });
          }}
        >
          <PlusOutlined style={{ marginRight: 5 }} />
          添加文件夹
        </Button>
      </div>
    );
  };

  render() {
    const { getRightData, addFolder } = this.props.store;

    console.log(_.cloneDeep(getRightData), '//////');

    return (
      <div className={styles.tableContent}>
        <div className={styles.headerSeash}>
          <span className={styles.headSpan}>(3/3)表格展示内容</span>
          <Button type="primary" onClick={addFolder}>
            <FolderAddOutlined style={{ marginLeft: 5 }} /> 添加文件夹
          </Button>
        </div>
        <div className={styles.paramList}>
          <p>基金代码</p>
          <p>基金简称</p>
          {_.map(getRightData, (v: any) => {
            const sort = _.get(v, 'sort');
            if (_.has(v, 'children')) {
              return <Folder {...v} key={sort} store={this.props.store} />;
            } else {
              return (
                <EditableList {...v} key={sort} store={this.props.store} />
              );
            }
          })}
        </div>
        <div className={styles.addtotable}>
          <Button type="dashed" onClick={this.hanldeBulkCopy}>
            <CopyOutlined style={{ marginRight: 5 }} />
            批量复制
          </Button>
          <Button type="dashed" onClick={this.hanldeBulkDelete}>
            <DeleteOutlined style={{ marginRight: 5 }} />
            批量删除
          </Button>

          <Popover
            content={this.PopoverContent()}
            placement={'topRight'}
            title="Title"
            trigger="click"
            overlayClassName={styles.popoverUnordered}
            open={this.state.open}
            onOpenChange={(bol) => this.setState({ open: bol })}
          >
            <Button type="dashed" onClick={() => this.setState({ open: true })}>
              <UnorderedListOutlined style={{ marginRight: 5 }} />
              批量移动至
            </Button>
          </Popover>
        </div>
      </div>
    );
  }
}

export default observer(TableContent);
