import { EditOutlined, CopyOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Checkbox, Form, Input, Modal } from 'antd'
import React, { Component } from 'react'
import type { FormInstance } from 'antd'
import styles from './index.less';

interface Props {
    indicatorName: string;
    indicatorCode: string;
    customName: string;
    indicatorDataType: string;
    parentName: null,// 父级的名字
    indicatorParam: {
        code: string;
        name: string;
    }
    isSecondlevel?: boolean;
    store?: any;
}

export default class EditableList extends Component<Props> {

    state = {
        EditOutlinedBol: false,
        customLabel: this.props.customName,
        selectValue: [],
    }

    formRef = React.createRef<FormInstance>();


    handleOk = () => {
        const { store } = this.props
        // 编辑值 setRightData
        // ......

        // store

        this.setState({ EditOutlinedBol: false })
    }

    onChange = (e: any) => {
        const { value: inputValue } = e?.target;
        this.setState({ customLabel: inputValue })
    }

    deleteItem = ()=>{
        const { store, customName, parentName } = this.props
        store.deleteRightDataValue([{parentName, customName}])
    }

    copyItem = ()=>{
        const { store, customName, parentName } = this.props
        store.copyRightDataValue([{parentName, customName}])
    }

    render() {
        const { customName, isSecondlevel, indicatorName } = this.props;
        const { EditOutlinedBol, customLabel, selectValue } = this.state;
        return (
            <div
                className={styles.listBox}
                style={{
                    padding: isSecondlevel ? '3px 8px 3px 12px' : '',
                    borderLeft: isSecondlevel ? '1px solid #D2D2D2' : ''
                }}
            >
                <header>
                    <Checkbox style={{ marginRight: 5 }} />
                    {customName || ''}
                </header>
                <div className={styles.operateBox}>
                    <EditOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={() => { this.setState({ EditOutlinedBol: true }) }}
                    />
                    <CopyOutlined style={{ cursor: 'pointer' }} onClick={this.copyItem}/>
                    <DeleteOutlined style={{ cursor: 'pointer' }} onClick={this.deleteItem}/>
                    <UnorderedListOutlined style={{ cursor: 'pointer' }} />
                </div>



                <Modal
                    title={<span className={styles.modalHeader}>编辑结果列——{indicatorName}</span>}
                    open={EditOutlinedBol}
                    onOk={this.handleOk}
                    okText={'保存'}
                    mask={false}
                    wrapClassName={styles.listModal}
                    // confirmLoading
                    onCancel={() => this.setState({ EditOutlinedBol: false })}
                >
                    <Form.Item label={'自定义列名'}>
                        <Input
                            value={customLabel}
                            onChange={this.onChange}
                        />
                    </Form.Item>
                    <Form ref={this.formRef} initialValues={selectValue}>

                    </Form>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}
