'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
class HomeController extends Controller {
  async index(data) {
    const { request: { url } } = data;
    // length, 基金排名x个 ignore去除过滤基金
    const { top = 200, ignore = [ 'allDate' ] } = formatData(url);
    const obj = {};
    const arr = [];
    const files = fs.readdirSync(path.join(__dirname, '../data/'), 'utf8');
    files.forEach(item => {
      const key = item.split('.')[0];
      obj[key] = [];
    });
    for (const key in obj) {
      if (!ignore.includes(key)) {
        let _data = fs.readFileSync(path.join(__dirname, `../data/${key}.js`), 'utf8');
        _data = _data.replace(/var rankData = {datas:/, '').replace(/\,allRecords\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\}\;/, '');
        obj[key] = _data;
        obj[key] = JSON.parse(obj[key]);
        obj[key] = obj[key].filter((o, i) => i < top).map(item => `${item.split(',')[0]}: ${item.split(',')[1]}`);
        // obj[key] = obj[key].filter((o, i) => i < top).map(item => item.split(',')[0]);
        arr.push(obj[key]);
      }
    }
    let res = [];
    res = _.intersection(...arr);
    console.log(`top-${top}选出基金: ${res.length}个`);
    // console.log(res)
    const { ctx } = this;
    const html = [];
    res.forEach((item, index) => {
      html.push(`(${index + 1})    ${item}`);
    });
    // 获取post 请求参数
    ctx.body = html.join('\n');

  }
}

function formatData(data) {
  if (data === '/') return {};
  const arr = data.split('?')[1].split('&');
  const obj = {};
  arr.forEach(o => {
    obj[o.split('=')[0]] = o.split('=')[1];
  });
  if (obj.ignore) {
    obj.ignore = obj.ignore.split(',');
  }
  // console.log(obj, '接收到的data');
  return obj;
}

module.exports = HomeController;
