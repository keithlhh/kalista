
const Controller = require('egg').Controller;
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
class HomeController extends Controller {
  async index() {
    const length = 200; //基金排名x个
    const ignorArr = ['allDate']; //去除过滤基金
    let obj = {
    }
    const arr = [];
    const files = fs.readdirSync(path.join(__dirname, '../data/'), 'utf8');
    files.forEach(item => {
      let key = item.split('.')[0];
      obj[key] = []
    });
    for(let key in obj) {
      if(ignorArr.includes(key)) continue;
      let _data = fs.readFileSync(path.join(__dirname, `../data/${key}.js`), 'utf8', (err, data) => {});
      _data = _data.replace(/var rankData = {datas:/, '').replace(/\,allRecords\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\,\w+\:\w+\}\;/,'')
      obj[key] = _data;
      obj[key] = JSON.parse(obj[key]);
      obj[key] = obj[key].filter((o, i) => i < length).map(item => `${item.split(',')[0]}: ${item.split(',')[1]}`);
      // obj[key] = obj[key].filter((o, i) => i < length).map(item => item.split(',')[0]);
      arr.push(obj[key]);
    }
    let res = [];
    res = _.intersection(...arr);
    console.log(`选出基金: ${res.length}个`)
    console.log(res)


    const { ctx } = this;
    // 获取post 请求参数
    ctx.body = {
      data:  res
    }
  };
}

module.exports = HomeController;
