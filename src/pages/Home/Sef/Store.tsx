import _ from 'lodash';
import { observable, action, flow, autorun, makeObservable, get, computed } from 'mobx';

const data: any[] = [];

for (let ab = 0; ab < 3; ab++) {
    const parentName = Math.random().toString(36).slice(-8)
    const arry = [];
    for (let d = 0; d < _.random(0, 5); d++) {
        arry.push(d)
    };

    const children = _.map(arry, (v) => {
        const customName = Math.random().toString(36).slice(-8);
        const indicatorName = `${_.random(0, 10) * v}定制化`;
        return {
            indicatorName,
            indicatorCode: indicatorName,
            indicatorDataType: 'STRING',
            customName,//自定义的名字
            parentName,// 父级的名字
            indicatorParam: {
                code: customName,
                name: customName,
            }
        }
    })
    data.push(children)
}

const aaa = _.random(0, 4);
for (let ast = 0; ast < aaa; ast++) {
    const indicatorName = `${_.random(0, 10) * ast}定制化78`;
    const customName = Math.random().toString(36).slice(-8);
    const newData: any = {
        indicatorName,
        indicatorCode: indicatorName,
        indicatorDataType: 'STRING',
        customName,//自定义的名字
        parentName: null,// 父级的名字
        indicatorParam: {
            code: customName,
            name: customName,
        }
    }
    data.push(newData)
}

interface dataValue {
    indicatorName: string;
    indicatorCode: string;
    customName: string;
    indicatorDataType: string;
    indicatorParam: {
        code: string;
        name: string;
    }
}

const setNewRightData = (res: any[]) => {
    if (_.size(res) < 0) {
        return []
    }
    const nowData = _.cloneDeep(res);

    let newDataMap = new Map();

    _.forEach(nowData, (v, i) => {
        const parentName = _.get(v, 'parentName');
        const customName = _.get(v, 'customName');
        if (_.isNil(parentName)) {
            newDataMap.set(`${customName}&&${parentName}`, v)
        } else {
            const o = newDataMap.get(parentName)
            if (_.isNil(o)) {
                newDataMap.set(parentName, { children: [v], parentName })
            } else {
                const lastV = _.get(o, 'children', []);
                newDataMap.set(parentName, { children: [...lastV, v], parentName })
            }
        }
    })

    return newDataMap;
}

class Store {

    RightData: any = setNewRightData(_.flatten(data));

    get getRightData() {
        const newData = _.filter(_.flatten([...this.RightData]), (t) => _.isObject(t))
        return newData
    }

    // 修改内容
    setRightData = (value: dataValue[]) => {
        
    }

    // 复制
    copyRightDataValue = (value: { parentName: string | null, customName: string }[]) => {
        console.log('c', _.cloneDeep(value));
        const nowRightData = _.cloneDeep(this.RightData)

        const deWeight = (parentName: string | null, customName: string, nowArry: any, isparentName = false) => {
            let newCustomName = `${customName}-副本(0)`
            let newParentName = `${parentName}-副本(0)`
            let nowdata: any = nowRightData.get(isparentName ? newParentName : `${newCustomName}&&${parentName}`)
            let number = 0;
            // 有重复值就加1， 没有就自动退出
            while (!_.isNil(nowdata)) {
                number += 1;
                if (isparentName) {
                    newParentName = `${parentName}-副本(${number})`;
                } else {
                    newCustomName = `${customName}-副本(${number})`;
                }

                nowdata = nowRightData.get(isparentName ? newParentName : `${newCustomName}&&${parentName}`)
            }

            if (isparentName) {
                const alterChildren = _.map(nowArry.children, (o) => {
                    return { ...o, parentName: newParentName }
                })
                nowRightData?.set(newParentName,)
                return { name: newParentName, data: { children: alterChildren, parentName: newParentName } }
            }
            // 无文件夹
            // 判断是否有重复的自定义名字
            return { name: `${newCustomName}&&${parentName}`, data: { ...nowArry, customName: newCustomName } }

        }

        _.forEach(value, (v) => {
            if (_.isNull(v.parentName)) {
                // 拿到要复制的值
                const nowArry = nowRightData.get(`${v.customName}&&${v.parentName}`)
                const obj = deWeight(v.parentName, v.customName, nowArry)
                nowRightData.set(obj.name, obj.data)
            } else if (_.isUndefined(v.customName)) {
                const nowArry = nowRightData.get(v.parentName)
                const obj = deWeight(v.parentName, v.customName, nowArry, true)
                nowRightData.set(obj.name, obj.data)
            } else {
                const nowres = nowRightData.get(v.parentName) || [];
                const nowArry = _.find(nowres?.children, ['customName', v.customName]);
                const obj = deWeight(v.parentName, v.customName, nowArry)
                nowRightData.set(v.parentName, { parentName: v.parentName, children: [...nowres?.children, obj.data] })
            }
        })
        this.RightData = nowRightData;
    }

    // 删除内容
    deleteRightDataValue = (value: { parentName: string | null, customName: string }[]) => {
        console.log('d', _.cloneDeep(value));
        const nowRightData = _.cloneDeep(this.RightData)
        _.forEach(value, (v) => {
            if (_.isNull(v.parentName)) {
                nowRightData?.delete(`${v.customName}&&${v.parentName}`)
            } else if (_.isUndefined(v.customName)) {
                nowRightData?.delete(v.parentName)
            } else {
                const nowArry = nowRightData.get(v.parentName) || [];
                console.log(nowArry, 'nowArry');
                const children = _.filter(nowArry.children, (t) => t?.customName !== v.customName)
                console.log({ children, parentName: v.parentName }, nowArry);
                nowRightData?.set(v.parentName, { children, parentName: v.parentName })
            }
        })

        this.RightData = nowRightData;
    }

    constructor() {
        makeObservable(this, {
            RightData: observable,
            setRightData: action.bound,
            getRightData: computed,
            deleteRightDataValue: action.bound,
        })
    }
}

export default Store;