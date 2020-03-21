'use strict'

import mongoose from 'mongoose';
import config from 'config-lite'
import chalk from 'chalk';

mongoose.connect(config.url, { useMongoClient: true })
mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open', () => {
  console.log(chalk.green('链接数据库成功'))
})

db.on('error', error => {
  console.error(chalk.red('Error in MongoDb connection'))
  mongoose.disconnect()
})

db.on('close', () => {
  console.log(chalk.red('数据库断开，重新链接数据库'))
  mongoose.connect(config.url, { server: { auto_reconnect: true } })
})

export default db