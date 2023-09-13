import { Cascader } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import React, { Component } from 'react'

interface Option {
  value: string;
  label: string;
  children?: Option[];
  disabled?: boolean;
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
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
      },
    ],
  },
];

const onChange = (value: string[], selectedOptions: Option[]) => {
  console.log(value, selectedOptions);
};

const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
);

export default class SearchCascader extends Component {
    render() {
      return (
        <Cascader
           options={options}
           onChange={onChange}
           placeholder="Please select"
           showSearch={{ filter }}
           onSearch={value => console.log(value)}
        />
      )
    }
  }



