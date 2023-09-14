
import React, { Component } from 'react'
import styles from './index.less'
import CompileIndex from './CompileIndex'
import TableContent from './TableContent'

import Store from './Store'

export default class Sef extends Component {

    store = new Store()

    render() {

        return (
            <div className={styles.sefBox}>
                <CompileIndex store={this.store}/>
                <TableContent store={this.store}/>
            </div>
        )
    }
}
