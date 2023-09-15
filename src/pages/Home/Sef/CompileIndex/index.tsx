import search from '@/res/search.json';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Cascader, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Component } from 'react';
import styles from './index.less';

class CompileIndex extends Component<{ store: any }> {
  onChange = (_value: string[], selectedOptions: any) => {
    // console.log(value, selectedOptions);
    this.props.store.setCascaderData(selectedOptions[1]);
  };

  filter = (inputValue: string, path: DefaultOptionType[]) => {
    path.some(
      (option) =>
        (option.label as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1,
    );
  };

  render() {
    console.log(search, 'search===---');

    const cascaderData = _.map(search.data, (v) => {
      const children = _.map(_.get(v, 'children'), (t) => {
        return {
          value: t.indicatorCode,
          label: t.indicatorName,
          parent: v.indicatorCode,
        };
      });
      return {
        value: v.indicatorCode,
        label: v.indicatorName,
        children,
      };
    });

    const {
      CascaderValue,
      handleLeft,
      handleRight,
      showContent,
      historyRecordArray,
    } = this.props.store;
    console.log(_.cloneDeep(CascaderValue));

    const number = _.size(historyRecordArray);

    let leftColor = '#14100B';
    let rightColor = '#14100B';
    if (number <= 1) {
      leftColor = '#A9A9A9';
      rightColor = '#A9A9A9';
    } else {
      leftColor = showContent?.sort === 0 ? '#A9A9A9' : '#14100B';
      rightColor = showContent?.sort === number - 1 ? '#A9A9A9' : '#14100B';
    }

    return (
      <div className={styles.compileBox}>
        <div className={styles.headerSeash}>
          <span className={styles.headSpan}>(1/3) 选择展示指标</span>
          <Cascader
            options={cascaderData}
            style={{ margin: '8px 0 16px 0', width: '100%' }}
            onChange={this.onChange as never}
            placeholder="输入指标名称"
            value={[CascaderValue?.parent, CascaderValue?.value]}
            displayRender={(e) => e[1]}
            showSearch={{ filter: this.filter }}
            onSearch={(value: any) => console.log(value)}
          />
        </div>
        <div className={styles.paramConfig}>
          <span className={styles.headSpan}>
            (2/3) 配置指标参数
            <Tooltip
              title={
                '每个指标可以选择一个参数作为多选项，多选后其他参数会自动调整为单选。'
              }
            >
              <QuestionCircleOutlined
                style={{ marginLeft: 5, cursor: 'pointer' }}
              />
            </Tooltip>
          </span>
          <div className={styles.paramList}>
            {/* 筛选条件的下拉框 */}

            <h1>{showContent?.label || ''}</h1>
          </div>
          <footer>
            <DoubleLeftOutlined
              onClick={handleLeft}
              style={{ color: leftColor }}
            />
            <span>
              配置记录
              <Tooltip
                title={'可最多向前回溯5个已添加的指标和配置项，用于快速编辑'}
              >
                <QuestionCircleOutlined
                  style={{ marginLeft: 5, cursor: 'pointer' }}
                />
              </Tooltip>
            </span>
            <DoubleRightOutlined
              onClick={handleRight}
              style={{ color: rightColor }}
            />
          </footer>
        </div>
        <div className={styles.addtotable}>
          <Button type="dashed">
            添加至表格
            <DoubleRightOutlined />
          </Button>
        </div>
      </div>
    );
  }
}

export default observer(CompileIndex);
