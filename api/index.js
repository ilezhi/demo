var mongoose = require('mongoose');
var BandWidth = require('../models').BandWidth;
var moment = require('moment');
mongoose.Promise = global.Promise;

// 根据时间筛选带宽值列表
exports.index = async function(req, res, next) {
  let {start, end} = req.query;

  if (start === '' || end === '') {
    return res.json({
      code: 500,
      msg: '缺少时间参数'
    });
  }
  
  // 转化成isodate再进行匹配
  start = moment(start).utcOffset(-8);
  end = moment(end).utcOffset(-8);

  let query = BandWidth
                .find()
                .select('bandwidth date')
                .where({'date': {'$gte': start, '$lte': end}});
  
  try {
    let result = await query.exec();
    return res.json({
      code: 200,
      msg: 'success',
      data: result
    });
  } catch(err) {
    return res.json({
      code: 500,
      msg: '查询失败'
    });
  }
};


// 单个导入
exports.create = async function(req, res, next) {
  let data = req.body.data;
  let isArray = Array.isArray(data);

  // 单条导入
  if (typeof data === 'object' && !isArray) {
    try {
      // 查询是否在数据库， 返回Entity
      let result = await BandWidth.findOne({date: data.date});
      if (result === null) {
        await BandWidth.create(data);
      } else {
        // 更行
        result.bandwidth = data.bandwidth;
        await result.save();
      }
    } catch(err) {
      return res.json({
        code: 500,
        msg: '单条导入失败'
      });
    }

    return res.json({
        code: 200,
        msg: '单条添加成功'
    });
  }

  if (isArray) {
    // 批量导入
    let len = data.length;
    try {
      for (let i = 0; i < len; i++) {
        // 查询是否在数据库
        let result = await BandWidth.findOne({date: data[i].date});
        if (result === null) {
          // 返回插入后的值
          let resp = await BandWidth.create({
            bandwidth: data[i].bandwidth,
            date: data[i].date
          });
        } else {
          // 更新
          result.bandwidth = data[i].bandwidth;
          await result.save();
        }
      }
    } catch(err) {
      return res.json({
        code: 500,
        msg: '批量添加失败'
      });
    }
    res.json({
      code: 200,
      msg: '批量添加成功'
    });
  }

  res.json({
    code: 500,
    msg: '数据格式有误,仅支持json数据格式'
  });
  
};


async function findAndUpdateOrInsert() {

}
