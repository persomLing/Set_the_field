import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Component } from 'react';
import Store from '../../Store';
import Config from './config';

interface props {
  defaultValue: string;
  handleChange: (v: any, o: number) => void;
  item: any;
  k: number;
  record: any;
}

@observer
export default class SelectComp extends Component<props> {
  Store = Store;

  render() {
    const { defaultValue, handleChange, item, k, record } = this.props;
    const {
      componentDictRes: { setFieldIntervalData },
      timeSliceRes: { data },
    } = Store;
    const code = _.get(record, 'indicatorCode');
    let newItem = { newData: item, defaultValue };
    const getOptions: any = _.get(Config, `${code}.getOptions`);
    if (_.isFunction(getOptions)) {
      newItem = getOptions(item, record, setFieldIntervalData, data);
    }
    return _.size(_.get(newItem, 'newData')) > 0 ? (
      <Select
        size="small"
        style={{ minWidth: 90, width: 90 }}
        suffixIcon={<CaretDownOutlined />}
        bordered={false}
        dropdownMatchSelectWidth={false}
        value={_.get(newItem, 'defaultValue') || defaultValue}
        options={_.map(_.get(newItem, 'newData') || [], (vv) => {
          return {
            value: _.get(vv, 'paramKey'),
            label: _.get(vv, 'paramName'),
          };
        })}
        onChange={(vv: unknown) => {
          handleChange(vv, k);
        }}
      />
    ) : (
      ''
    );
  }
}
