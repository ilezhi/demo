$(function() {
  $.ajaxSetup({
    dataType: 'json'
  });
  function BandWidth() {
    this.chart = echarts.init($('#chart')[0]);
    this.option = null;
    this.format = 'YYYY-MM-DD HH:mm:ss';
    this.init();
  };
  BandWidth.prototype = {
    constructor: BandWidth,
    init: function() {
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWidthLabel: true
            },
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '带宽',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      };
    },
    fetch: function(url, method, data) {
      if (!window.fetch) {
        alert('您的浏览器不支持fetch');
        return;
      }

      method = method.toUpperCase();
      var request = {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      if (method === 'GET') {
        url += '?' + Object.keys(data).map(function(key) {
          return key + '=' + data[key];
        }).join('&');
      } else {
        Object.defineProperty(request, 'body', {
          value: JSON.stringify(data)
        });
      }

      return fetch(url, request);
    },
    getDataList: function(start, end) {
      var params = {
        start: start,
        end: end
      };

      var that = this;
      this.chart.showLoading();
      this.fetch('/api/v1/bandwidth', 'get', params)
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          that.chart.hideLoading();
          if (res.code !== 200) {
            throw new Error(res.msg);
          }

          if (res.data.length === 0) {
            return alert('没有此时段的数据');
          }

          var option = that.formater(res.data);
          that.option.xAxis[0].data = option.axis;
          that.option.series[0].data = option.series;

          that.chart.setOption(that.option);
        })
        .catch(function(err) {
          alert(err.message);
        });
    },
    importData: function(data) {
      this.fetch('/api/v1/create', 'post', {data: data})
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          alert(res.msg);
        })
        .catch(function(err) {
          alert(err.message);
        });
    },
    formater: function(data) {
      var axis = [];
      var series = [];
      var that = this;

      data.forEach(function(item) {
        axis.push(moment(item.date).format(that.format));
        series.push(item.bandwidth);
      });

      return {
        axis: axis,
        series: series
      };
    }
  };


  var bw = new BandWidth();
  bw.getDataList('2017-01', '2017-09');


  // 时间筛选
  var format = 'YYYY-MM-DD HH:mm:ss';
  $('#btnGroup').on('click', 'button', function() {
    $(this).addClass('btn-primary');
    $(this).siblings('.btn-primary').removeClass('btn-primary');
    $('#custom').removeClass('btn-primary');

    var i = $(this).index();
    var now = moment();
    var end = moment().format(format);
    var sub = 0;

    switch(i) {
      case 0:
        sub = 1;
        break;
      case 1:
        sub = 2;
        break;
      default:
        sub = 7;
        break;
    }

    var start = now.subtract(sub, 'days').format(format);
    bw.getDataList(start, end);
  });

  // 自定义时间筛选
  $('#custom').on('click', function() {
    var start = $('#btn_start').val();
    var end = $('#btn_end').val();
    if (start === '' || end === '') {
      return alert('日期时间都要选');
    }
    
    $(this).addClass('btn-primary');
    $('#btnGroup button.btn-primary').removeClass('btn-primary');    
    bw.getDataList(start, end);
  });

  // 批量导入
  // var regBatch = /^\[[\s\S]*\]$/;
  // 导入数据
  $('#importData').on('click', function() {
    var val = $('#data_container').val().trim().replace(/\n/g, '');

    try {
      var data = JSON.parse(val);
    } catch(error) {
      alert(error.message);
      return;
    }

    bw.importData(data);
    
  });

});
