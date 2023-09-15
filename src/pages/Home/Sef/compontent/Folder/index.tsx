import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Input, message } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Component } from 'react';
import EditableList from '../EditableList';
import styles from './index.less';

interface propsType {
  parentName: string;
  onChange: (v: any) => void;
  store?: any;
  children: {
    indicatorName: string;
    indicatorCode: string;
    customName: string;
    indicatorDataType: string;
    parentName: null; // 父级的名字
    indicatorParam: {
      code: string;
      name: string;
    };
  }[];
}

class Folder extends Component<propsType> {
  state = {
    editOutlinedBol: false,
    parentValue: this.props.parentName,
  };

  onChange = (e: any) => {
    const { value: inputValue } = e?.target;
    this.setState({ parentValue: inputValue });
  };

  handleClick = () => {
    const { store, parentName } = this.props;
    // this.state.parentValue
    if (!this.state.parentValue) {
      message.warning('请输入正确内容！');
    }
    if (this.state.parentValue !== parentName) {
      store.setRightData({
        parentName: this.state.parentValue,
        lastparentName: parentName,
      });
    }

    this.setState({ editOutlinedBol: false });
  };

  deleteFolder = () => {
    const { store, parentName } = this.props;
    store.deleteRightDataValue([{ parentName }]);
  };

  copyFolder = () => {
    const { store, parentName } = this.props;
    store.copyRightDataValue([{ parentName }]);
  };

  render() {
    const { parentName, children, store } = this.props;
    const { editOutlinedBol, parentValue } = this.state;

    const bol = editOutlinedBol || _.isUndefined(parentName);
    return (
      <div className={styles.folderBox}>
        <section className={styles.parentBox}>
          <header
            style={{
              display: bol ? 'flex' : 'block',
              width: bol ? '100%' : 'auto',
            }}
          >
            <FolderOutlined style={{ marginRight: 5 }} />

            {bol ? (
              <>
                <Input
                  value={parentValue}
                  onChange={this.onChange}
                  bordered={false}
                  style={{ height: 24, background: '#fff' }}
                />
                <span className={styles.conserve} onClick={this.handleClick}>
                  保存
                </span>
              </>
            ) : (
              parentValue || ''
            )}
          </header>
          {!bol && (
            <div className={styles.operateBox}>
              <EditOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ editOutlinedBol: true })}
              />
              <CopyOutlined
                style={{ cursor: 'pointer' }}
                onClick={this.copyFolder}
              />
              <DeleteOutlined
                style={{ cursor: 'pointer' }}
                onClick={this.deleteFolder}
              />
              <UnorderedListOutlined style={{ cursor: 'pointer' }} />
            </div>
          )}
        </section>

        {!_.isEmpty(children) && (
          <main className={styles.mainBox}>
            {_.map(children, (v, i) => {
              return (
                <EditableList
                  {...v}
                  isSecondlevel={true}
                  key={`${parentName}_${i}`}
                  store={store}
                />
              );
            })}
          </main>
        )}
      </div>
    );
  }
}

export default observer(Folder);
