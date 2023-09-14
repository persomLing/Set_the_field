import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './index.less'
import { DefaultOptionType } from 'antd/lib/select';
import { Button, Cascader, Tooltip } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
            },
            {
                value: 'xihu',
                label: 'West Lake',
            },
            {
                value: 'xiasha',
                label: 'Xia Sha',
                disabled: true,
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children:[]
            },
            {
                value: 'zhonghuamen',
                label: 'Zhong Hua men',
            },
        ],
    },
];

export default class CompileIndex extends Component<{store:any}> {

    onChange(value: string[], selectedOptions: any) {
        console.log(value, selectedOptions);
    };

    filter(inputValue: string, path: DefaultOptionType[]) {
        path.some(
            option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
        );
    }

    render() {

        return (
            <div className={styles.compileBox}>
                <div className={styles.headerSeash}>
                    <span className={styles.headSpan}>(1/3) 选择展示指标</span>
                    <Cascader
                        options={options}
                        style={{ margin: '8px 0 16px 0', width: '100%' }}
                        onChange={this.onChange}
                        placeholder="输入指标名称"
                        showSearch={{ filter: this.filter }}
                        onSearch={(value: any) => console.log(value)}
                    />
                </div>
                <div className={styles.paramConfig}>
                    <span className={styles.headSpan}>(2/3) 配置指标参数
                        <Tooltip title={'每个指标可以选择一个参数作为多选项，多选后其他参数会自动调整为单选。'}>
                            <QuestionCircleOutlined style={{ marginLeft: 5, cursor: 'pointer' }} />
                        </Tooltip >
                    </span>
                    <div className={styles.paramList}>
                        {/* 筛选条件的下拉框 */}
                    </div>
                    <footer>
                        <DoubleLeftOutlined />
                        <span>
                            配置记录
                            <Tooltip title={'可最多向前回溯5个已添加的指标和配置项，用于快速编辑'}>
                                <QuestionCircleOutlined style={{ marginLeft: 5, cursor: 'pointer' }} />
                            </Tooltip >
                        </span>
                        <DoubleRightOutlined />
                    </footer>
                </div>
                <div className={styles.addtotable}>
                    <Button type="dashed">
                        添加至表格
                        <DoubleRightOutlined />
                    </Button>
                </div>
            </div>
        )
    }
}
