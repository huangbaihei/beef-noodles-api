import fetch from 'node-fetch'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
// import qiniu from 'qiniu'
import gm from 'gm'

import Ids from '../models/ids'

// qiniu.conf.ACCESS_KEY = 'Ep714TDrVhrhZzV2VJJxDYgGHBAX-KmU1xV1SQdS'
// qiniu.conf.SECRET_KEY = 'XNIW2dNffPBdaAhvm9dadBlJ-H6yyCTIJLxNM_N6'

export default class BaseComponent {
  constructor() {
    this.idList = ['restaurant_id', 'food_id', 'order_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id']
    // this.imgTypeList = ['shop', 'food', 'avatar', 'default']
    // this.uploadImg = this.uploadImg.bind(this)
    // this.qiniu = this.qiniu.bind(this)
  }

  // 封装的通用发请求函数
  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {
    type = type.toUpperCase()
    resType = resType.toUpperCase()
    if (type == 'GET') {
      // 数据拼接字符串
      const keys = Object.keys(data)
      if (keys.length > 0) {
        url += `?${keys.map(key => `${key}=${data[key]}`).join('&')}`
      }
    }
    const requestConfig = {
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: type == 'POST' ? JSON.stringify(data) : undefined
    }
    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT') {
        responseJson = await response.text()
      } else {
        responseJson = await response.json()
      }
    } catch(err) {
      console.log('获取http数据失败', err)
      throw new Error(err)
    }
    return responseJson
  }

  // 获取id列表(获取新id)
  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误')
      throw new Error('id类型错误')
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      await idData.save();
      return idData[type]
    } catch(err) {
      console.log('获取ID数据失败')
      throw new Error(err)
    }
  }
}