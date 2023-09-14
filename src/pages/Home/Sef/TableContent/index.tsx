import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './index.less';
import { Button } from 'antd';
import { CopyOutlined, DeleteOutlined, FolderAddOutlined, UnorderedListOutlined } from '@ant-design/icons';
import _ from 'loadsh';
import Folder from '../compontent/Folder';
import EditableList from '../compontent/EditableList';
import { observer } from 'mobx-react';

// let arr:any = []
// for (let index = 0; index < 100; index++) {
//     arr.push(index);
// }

@observer
export default class TableContent extends Component<{ store: any }> {

    paramOnChange(v) {
        console.log(v, '---------');
    }

    render() {
        const { getRightData, setRightData } = this.props.store
        return (
            <div className={styles.tableContent}>
                <div className={styles.headerSeash}>
                    <span className={styles.headSpan}>(3/3)表格展示内容</span>
                    <Button type="primary"><FolderAddOutlined style={{ marginLeft: 5 }} /> 添加文件夹</Button>
                </div>
                <div className={styles.paramList}>
                    <p>基金代码</p>
                    <p>基金简称</p>
                    {
                        _.map(getRightData, (v: any, i: number) => {
                            if (_.has(v, 'children')) {
                                return <Folder {...v} key={i} store={this.props.store}/>
                            } else {
                                return <EditableList {...v} key={i} store={this.props.store}/>
                            }
                        })
                    }
                </div>
                <div className={styles.addtotable}>
                    <Button type="dashed">
                        <CopyOutlined style={{ marginRight: 5 }} />
                        批量复制
                    </Button>
                    <Button type="dashed">
                        <DeleteOutlined style={{ marginRight: 5 }} />
                        批量删除
                    </Button>
                    <Button type="dashed">
                        <UnorderedListOutlined style={{ marginRight: 5 }} />
                        批量移动至
                    </Button>
                </div>
            </div>
        )
    }
}
