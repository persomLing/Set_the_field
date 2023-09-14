import { CopyOutlined, DeleteOutlined, EditOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import _ from 'lodash';
import EditableList from '../EditableList';
import styles from './index.less'
import { Input } from 'antd';

interface propsType {
    parentName: string;
    onChange: (v: any) => void;
    store?: any;
    children: {
        indicatorName: string;
        indicatorCode: string;
        customName: string;
        indicatorDataType: string;
        parentName: null,// 父级的名字
        indicatorParam: {
            code: string;
            name: string;
        }
    }[];
}


export default class Folder extends Component<propsType> {
    state = {
        editOutlinedBol: false,
        parentValue: this.props.parentName,
    }

    onChange = (e: any) => {
        const { value: inputValue } = e?.target;
        this.setState({ parentValue: inputValue })
    }

    handleClick = () => {
        this.setState({ editOutlinedBol: false })
    }

    deleteFolder = ()=>{
        const { store, parentName } = this.props
        store.deleteRightDataValue([{parentName}])
    }

    copyFolder =()=>{
        const { store, parentName } = this.props
        store.copyRightDataValue([{parentName}])
    }

    render() {
        const { parentName, children, store } = this.props
        const { editOutlinedBol, parentValue } = this.state;
        return (
            <div className={styles.folderBox}>

                <section className={styles.parentBox}>
                    <header style={{ display: editOutlinedBol ? 'flex' : 'block', width: editOutlinedBol ? '100%' : 'auto' }}>
                        <FolderOutlined style={{ marginRight: 5 }} />

                        {
                            editOutlinedBol
                                ?
                                <>
                                    <Input
                                        value={parentValue}
                                        onChange={this.onChange}
                                        bordered={false}
                                        style={{ height: 24, background: '#fff' }}
                                    />
                                    <span className={styles.conserve} onClick={this.handleClick}>保存</span>
                                </>
                                : parentValue || ''
                        }

                    </header>
                    {
                        !editOutlinedBol &&
                        <div className={styles.operateBox}>
                            <EditOutlined style={{ cursor: 'pointer' }} onClick={() => this.setState({ editOutlinedBol: true })} />
                            <CopyOutlined style={{ cursor: 'pointer' }} onClick={this.copyFolder}/>
                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={this.deleteFolder}/>
                            <UnorderedListOutlined style={{ cursor: 'pointer' }} />
                        </div>
                    }
                </section>

                {!_.isEmpty(children) && <main className={styles.mainBox}>
                    {
                        _.map(children, (v, i) => {
                            return <EditableList
                                {...v}
                                isSecondlevel={true}
                                key={`${parentName}_${i}`}
                                store={store}
                            />
                        })
                    }
                </main>}

            </div>
        )
    }
}
