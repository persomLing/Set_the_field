import { message } from 'antd';
import _ from 'lodash';
import { action, computed, makeObservable, observable } from 'mobx';

const data: any[] = [];

for (let ab = 0; ab < 3; ab++) {
  const parentName = Math.random().toString(36).slice(-8);
  const arry = [];
  for (let d = 0; d < _.random(0, 5); d++) {
    arry.push(d);
  }

  const children = _.map(arry, (v) => {
    const customName = Math.random().toString(36).slice(-8);
    const indicatorName = `${_.random(0, 10) * v}定制化`;
    return {
      indicatorName,
      indicatorCode: indicatorName,
      indicatorDataType: 'STRING',
      customName, //自定义的名字
      parentName, // 父级的名字
      indicatorParam: {
        code: customName,
        name: customName,
      },
    };
  });
  data.push(children);
}

const aaa = _.random(0, 4);
for (let ast = 0; ast < aaa; ast++) {
  const indicatorName = `${_.random(0, 10) * ast}定制化78`;
  const customName = Math.random().toString(36).slice(-8);
  const newData: any = {
    indicatorName,
    indicatorCode: indicatorName,
    indicatorDataType: 'STRING',
    customName, //自定义的名字
    parentName: null, // 父级的名字
    indicatorParam: {
      code: customName,
      name: customName,
    },
  };
  data.push(newData);
}

interface dataValue {
  indicatorName: string;
  indicatorCode: string;
  customName: string;
  parentName: string | null;
  indicatorDataType: string;
  indicatorParam: {
    code: string;
    name: string;
  };
}

const setNewRightData = (res: any[]) => {
  if (_.size(res) < 0) {
    return [];
  }
  const nowData = _.cloneDeep(res);

  let newDataMap = new Map();

  _.forEach(nowData, (v, i) => {
    const parentName = _.get(v, 'parentName');
    const customName = _.get(v, 'customName');
    if (_.isNil(parentName)) {
      newDataMap.set(`${customName}&&${parentName}`, {
        ...v,
        sort: i.toString(),
      });
    } else {
      const o = newDataMap.get(parentName);
      if (_.isNil(o)) {
        newDataMap.set(parentName, {
          children: [{ ...v, sort: `${i}-0` }],
          parentName,
          sort: i.toString(),
        });
      } else {
        const lastV = _.get(o, 'children', []);
        const sort = _.get(o, 'sort');
        newDataMap.set(parentName, {
          ...o,
          children: [...lastV, { ...v, sort: `${sort}-${_.size(lastV)}` }],
          parentName,
        });
      }
    }
  });
  console.log();
  return newDataMap;
};

class Store {
  //-------------------------右侧操作部分-----------------

  RightData: any = setNewRightData(_.flatten(data));

  get getRightData() {
    const newData = _.filter(_.flatten([...this.RightData]), (t) =>
      _.isObject(t),
    );
    // 排序
    const newSortData = _.map(_.orderBy(newData, ['sort']), (v) => {
      const children = _.get(v, 'children');
      if (_.size(children) > 0) {
        return { ...v, children: _.orderBy(children, ['sort']) };
      }
      return v;
    });

    console.log(
      _.cloneDeep(newSortData),
      '---newSortData',
      _.cloneDeep(newData),
    );
    return newSortData;
  }

  // 批量操作内容
  RightDatchData: { parentName: string | null; customName: string }[] = [];

  // 批量操作 修改批量操作内容
  steRightDatchData = (
    res: { parentName: string | null; customName: string },
    isNotDelete = false,
  ) => {
    let datchData: any = [];
    if (!isNotDelete) {
      datchData = _.filter(this.RightDatchData, (v) => {
        return !_.isEqual(v, res);
      });
    } else {
      datchData = [...this.RightDatchData, res];
    }
    console.log(_.cloneDeep(datchData), 'datchData');
    this.RightDatchData = datchData;
  };

  // 修改内容
  setRightData = (value: dataValue) => {
    const parentName = _.get(value, 'parentName');
    const customName = _.get(value, 'customName');
    const lastCustomLabel = _.get(value, 'lastCustomLabel');
    const lastparentName = _.get(value, 'lastparentName');
    console.log('s', _.cloneDeep(value));
    const nowRightData = _.cloneDeep(this.RightData);
    if (_.isNull(parentName)) {
      const otherRes = nowRightData?.get(parentName);
      if (otherRes) {
        message.warning('该名称已被占用！');
        return;
      }
      nowRightData?.delete(`${lastCustomLabel}&&${parentName}`);
      nowRightData?.set(
        `${customName}&&${parentName}`,
        _.omit(value, ['lastCustomLabel', 'lastparentName']),
      );
    } else if (_.isUndefined(customName)) {
      const nowRes = nowRightData?.get(lastparentName);

      const otherRes = nowRightData?.get(parentName);
      if (otherRes) {
        message.warning('该文件夹名称已被占用！');
      } else {
        const children = _.map(nowRes?.children || [], (o) => {
          return { ...o, parentName };
        });
        nowRightData?.delete(lastparentName);
        nowRightData.set(parentName, { ...nowRes, parentName, children });
      }
    } else {
    }
    this.RightData = nowRightData;
  };

  // 复制内容
  copyRightDataValue = (
    value: { parentName: string | null; customName: string }[],
    isBulk = false,
  ) => {
    if (_.isEmpty(value)) return;
    console.log('c', _.cloneDeep(value));
    const nowRightData = _.cloneDeep(this.RightData);

    const deWeight = (
      parentName: string | null,
      customName: string,
      nowRes: any,
      isparentName = false,
      childrenRes?: any,
    ) => {
      let newCustomName = `${customName}-副本(1)`;
      let newParentName = `${parentName}-副本(1)`;
      let sort = `${_.get(nowRes, 'sort')}-1`;
      let nowdata = nowRightData.get(
        isparentName ? newParentName : `${newCustomName}&&${parentName}`,
      );
      if (!_.isNil(childrenRes)) {
        nowdata = _.find(childrenRes, ['customName', newCustomName]);
      }
      let number = 0;
      // 有重复值就加1， 没有就自动退出
      while (!_.isNil(nowdata) || !_.isEmpty(nowdata)) {
        number += 1;
        if (isparentName) {
          newParentName = `${parentName}-副本(${number})`;
        } else {
          newCustomName = `${customName}-副本(${number})`;
        }

        if (childrenRes) {
          nowdata = _.find(childrenRes, ['customName', newCustomName]);
        } else {
          nowdata = nowRightData.get(
            isparentName ? newParentName : `${newCustomName}&&${parentName}`,
          );
        }
        sort = `${_.get(nowRes, 'sort')}-${number}`;
      }

      if (isparentName) {
        const alterChildren = _.map(nowRes.children, (o, i) => {
          return { ...o, parentName: newParentName, sort: `${sort}-${i}` };
        });
        nowRightData?.set(newParentName);
        return {
          name: newParentName,
          data: { children: alterChildren, parentName: newParentName, sort },
        };
      }
      // 无文件夹
      // 判断是否有重复的自定义名字
      return {
        name: `${newCustomName}&&${parentName}`,
        data: { ...nowRes, customName: newCustomName, sort },
      };
    };

    _.forEach(value, (v) => {
      if (_.isNull(v.parentName)) {
        // 拿到要复制的值
        const nowRes = nowRightData.get(`${v.customName}&&${v.parentName}`);
        const obj = deWeight(v.parentName, v.customName, nowRes);
        nowRightData.set(obj.name, obj.data);
      } else if (_.isUndefined(v.customName)) {
        const nowRes = nowRightData.get(v.parentName);
        const obj = deWeight(v.parentName, v.customName, nowRes, true);
        nowRightData.set(obj.name, obj.data);
      } else {
        const nowres = nowRightData.get(v.parentName) || [];
        const nowChildren = _.find(nowres?.children, [
          'customName',
          v.customName,
        ]);
        const obj = deWeight(
          v.parentName,
          v.customName,
          nowChildren,
          false,
          nowres?.children,
        );
        nowRightData.set(v.parentName, {
          ...nowres,
          parentName: v.parentName,
          children: [...nowres?.children, obj.data],
        });
      }
    });
    if (isBulk) {
      // this.RightDatchData = [];
    }
    this.RightData = nowRightData;
  };

  // 删除内容
  deleteRightDataValue = (
    value: { parentName: string | null; customName: string }[],
    isBulk = false,
  ) => {
    if (_.isEmpty(value)) return;
    console.log('d', _.cloneDeep(value));
    const nowRightData = _.cloneDeep(this.RightData);
    _.forEach(value, (v) => {
      if (_.isNull(v.parentName)) {
        nowRightData?.delete(`${v.customName}&&${v.parentName}`);
      } else if (_.isUndefined(v.customName)) {
        nowRightData?.delete(v.parentName);
      } else {
        const nowRes = nowRightData.get(v.parentName) || [];
        const children = _.filter(
          nowRes.children,
          (t) => t?.customName !== v.customName,
        );
        nowRightData?.set(v.parentName, {
          ...nowRes,
          children,
          parentName: v.parentName,
        });
      }
      this.steRightDatchData(v, true);
    });

    if (isBulk) {
      this.RightDatchData = [];
    }

    this.RightData = nowRightData;
  };

  // 添加文件夹
  addFolder = () => {
    const nowRightData = _.cloneDeep(this.RightData);

    const res = nowRightData.get(undefined);
    if (res) {
      message.warning('一次最多添加一个文件！');
      return;
    }
    let size: any = -nowRightData.size;
    const sort = _.get(this.getRightData, '0.sort', 0) * 1;

    if (sort >= size && sort !== 0) {
      size = `${_.ceil(sort * 0.8, 4)}`;
    }
    nowRightData.set(undefined, {
      parentName: undefined,
      sort: `${size}`,
      children: [],
    });
    this.RightData = nowRightData;
  };

  // ---------------------左侧操作部分-----------------------

  // 搜索
  CascaderValue = {};

  // 参数配置记录 只记录5次
  historyRecordArray: any[] = [];

  // 展示的配置参数
  showContent: any = {};

  setCascaderData = (v: any) => {
    this.CascaderValue = v;

    // 记录
    const lastHistoryRecord = [...this.historyRecordArray, v];

    if (_.size(lastHistoryRecord) > 5) {
      lastHistoryRecord.shift();
    }
    const newRes = _.map(lastHistoryRecord, (v, i) => {
      return { ...v, sort: i };
    });
    this.historyRecordArray = newRes;
    this.showContent = _.last(newRes);
  };

  // left

  handleLeft = () => {
    const num = _.size(this.historyRecordArray);
    const showContentSort = _.get(this.showContent, 'sort');
    if (num <= 1 || showContentSort <= 0) return;
    const sort = _.get(this.showContent, 'sort') || 1;
    const nowContent = _.find(this.historyRecordArray, ['sort', sort - 1]);
    this.CascaderValue = nowContent;
    this.showContent = nowContent;
  };

  // right

  handleRight = () => {
    const num = _.size(this.historyRecordArray);
    const showContentSort = _.get(this.showContent, 'sort');
    if (num <= 1 || showContentSort === num - 1) return;
    const sort = _.get(this.showContent, 'sort') || 1;
    const nowContent = _.find(this.historyRecordArray, ['sort', sort + 1]);
    this.CascaderValue = nowContent;
    this.showContent = nowContent;
  };

  constructor() {
    makeObservable(this, {
      RightData: observable,
      showContent: observable,
      CascaderValue: observable,
      RightDatchData: observable,
      addFolder: action.bound,
      handleLeft: action.bound,
      handleRight: action.bound,
      setCascaderData: action.bound,
      steRightDatchData: action.bound,
      setRightData: action.bound,
      getRightData: computed,
      copyRightDataValue: action.bound,
      deleteRightDataValue: action.bound,
    });
  }
}

export default Store;
