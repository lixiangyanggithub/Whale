
let db = require("../config/db")

// 登录验证方法,检测用户的账号密码是否正确
function login(account, password, callback) {
  // 准备sql语句
  let sql = "SELECT * FROM user WHERE username=? AND password=?";
  // 准备参数
  let sqlParm = [account, password]
  // 执行sql
  db.query(sql, sqlParm, function (err, result) {
    if (err) {
      // 如果出现错误，就打印错误
      console.log(err);
    } else {
      // 如果没有错误，就通过回调函数将结果返回
      // 对结果进行处理
      let resultStr = JSON.stringify(result) // 将结果转化成字符串
      let data = JSON.parse(resultStr) // 将数据转化为JSON对象
      callback(data)
    }
  })
}


// 注册方法，将用户信息插入数据库
function register(username, email, password, callback) {
  // 准备 SQL 插入语句
  let sql = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
  // 准备参数
  let sqlParams = [username, email, password];
  
  // 执行 SQL 插入操作
  db.query(sql, sqlParams, function (err, result) {
    if (err) {
      // 如果出现错误，将错误信息传递给回调函数
      callback(err);
    } else {
      // 如果插入成功，将结果传递给回调函数
      callback(null, result);
    }
  });
}




// 购买方法，将用户购买信息插入数据库
function register_2(username, email, password,money,flow, callback) {
  // 准备 SQL 插入语句
  let sql = "INSERT INTO user (username, email, password,money,flow) VALUES (?, ?, ?, ?, ?)";
  // 准备参数
  let sqlParams = [username, email, password,money,flow];
  
  // 执行 SQL 插入操作
  db.query(sql, sqlParams, function (err, result) {
    if (err) {
      // 如果出现错误，将错误信息传递给回调函数
      callback(err);
    } else {
      // 如果插入成功，将结果传递给回调函数
      callback(null, result);
    }
  });
}

function updateMoney(uid, money, callback) {
  let sql = "SELECT * FROM user WHERE id = '" + uid + "'";
  db.query(sql,  function (err, userInfo) {
    if (err) {
      console.log(err);
    } else {
      let ret = {
        code: 1002
      }
      if (userInfo.length < 0) {
        callback(ret)
      } else {
        let uMoney = parseInt(userInfo[0].money) + parseInt(money)
        let uSql = "UPDATE user SET money = ? WHERE id = ?;"
        let sqlParams = [uMoney, uid];
        db.query(uSql, sqlParams, function (err) {
          if (err) {
            console.log(err);
          } else {
            ret.code = 1001
            callback(ret)
          }
        })
      }
    }
  });
}

function updateFlow(uid, flow, callback) {
  let sql = "SELECT * FROM user WHERE id = '" + uid + "'";
  db.query(sql,  function (err, userInfo) {
    if (err) {
      console.log(err);
    } else {
      let ret = {
        code: 1002
      }
      if (userInfo.length < 0) {
        callback(ret)
      } else {
        // 流量费为 0.03M/元
        let uMoney = parseInt(userInfo[0].money) - parseInt(flow) * 0.03
        if (uMoney < 0) {
          ret.code = 1002
          callback(ret)
          return
        }
        let uFlow = parseInt(userInfo[0].flow) + parseInt(flow)
        let uSql = "UPDATE user SET flow = ?, money = ? WHERE id = ?;"
        let sqlParams = [uFlow, uMoney, uid];
        db.query(uSql, sqlParams, function (err) {
          if (err) {
            console.log(err);
          } else {
            ret.code = 1001
            callback(ret)
          }
        })
      }
    }
  });
}

function inquireInfo(uid, callback) {
  let sql = "SELECT * FROM user WHERE id = '" + uid + "'";
  db.query(sql,  function (err, userInfo) {
    if (err) {
      console.log(err);
    } else {
      callback(userInfo)
    }
  })
}

function getFeedback(uid, callback) {
  let sql = "SELECT * FROM feedback WHERE id = '" + uid + "'";
  db.query(sql,  function (err, res) {
    if (err) {
      console.log(err);
    } else {
      callback(res)
    }
  })
}

function deleteFeedback(fid, callback) {
  let sql = "DELETE FROM feedback WHERE fid = '" + fid + "'";
  db.query(sql,  function (err) {
    if (err) {
      console.log(err);
    } else {
      let ret = {
        code: 1001
      }
      callback(ret)
    }
  })
}

function sendFeedback(uid, text, callback) {
  let sql = "INSERT INTO feedback (id, text) VALUES (?, ?)";
  let sqlParams = [uid, text];
  db.query(sql, sqlParams, function (err) {
    if (err) {
      console.log(err);
    } else {
      let ret = {
        code: 1001
      }
      callback(ret)
    }
  })
}

module.exports = {
  login: login,
  register: register,
  register_2: register_2,
  updateMoney: updateMoney,
  updateFlow: updateFlow,
  inquireInfo: inquireInfo,
  getFeedback: getFeedback,
  deleteFeedback: deleteFeedback,
  sendFeedback: sendFeedback
}