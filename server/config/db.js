let mysql = require("mysql")

let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "$lxy232729",
  port: 3306,
  database: "huafei",
  // 如果是mac，使用MAMP搭建的服务器，则需要加上以下配置, Windows系统需要注释以下语句
  // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})
conn.connect()
module.exports = conn