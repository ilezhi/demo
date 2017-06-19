$(function() {
  function BandWidth() {

  };

  BandWidth.prototype = {
    constructor: BandWidth,
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

      this.fetch('/api/v1/bandwidth', 'get', params)
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          console.log(res);
        })
    }
  };

  $.ajaxSetup({
    dataType: 'json'
  });

  var bw = new BandWidth();
  bw.getDataList('2017-01', '2017-09');

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

    bw.fetch('/api/v1/create', 'post', {data: data})
      .then(function(res) {
        return res.json();
      })
      .then(function(res) {
        if (res.code !==200) {
          alert(res.msg);
          return;
        }

        alert(res.msg);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  });
});
