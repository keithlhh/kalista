
const Controller = require('egg').Controller;
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
class HomeController extends Controller {
  async index(data) {
    const { request: { url }} = data;
    //length, 基金排名x个 ignore去除过滤基金
    let { top = 200, ignore = ['allDate'] } = formatData(url);
    let obj = {}
    const arr = [];
    const files = fs.readdirSync(path.join(__dirname, '../data/'), 'utf8');
    files.forEach(item => {
      let key = item.split('.')[0];
      obj[key] = []
    });
    for(let key in obj) {
      if(!ignore.includes(key)) {
        let _data = fs.readFileSync(path.join(__dirname, `../data/${key}.js`), 'utf8', (err, data) => {});
        _data = _data.replace(/var rankData = {datas:/, '').replace(/\,allRecords\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\}\;/,'')
        obj[key] = _data;
        obj[key] = JSON.parse(obj[key]);
        obj[key] = obj[key].filter((o, i) => i < top).map(item => `${item.split(',')[0]}: ${item.split(',')[1]}`);
        // obj[key] = obj[key].filter((o, i) => i < top).map(item => item.split(',')[0]);
        arr.push(obj[key]);
      }
    }
    let res = [];
    res = _.intersection(...arr);
    console.log(`top-${top}选出基金: ${res.length}个`)
    // console.log(res)
    const { ctx } = this;
    let html = [];
    res.forEach((item, index) => {
      html.push(`(${index + 1})    ${item}`)
    })
    // 获取post 请求参数
    ctx.body = html.join('\n')

  };
}

function formatData(data) {
  if(data === '/' ) return {};
  const arr = data.split('?')[1].split('&');
  let obj = {};
  arr.forEach(o => {
    obj[o.split('=')[0]] = o.split('=')[1]
  })
  if(obj.ignore) {
    obj.ignore = obj.ignore.split(',');
  }
  // console.log(obj, '接收到的data');
  return obj;
}

module.exports = HomeController;
