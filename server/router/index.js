
let express = require("express")
let path = require("path")
let userDao = require("../dao/user")


const WebSocket = require('ws');
const crypto = require('crypto');
const querystring = require('querystring');
const url = require('url');
// 创建路由实例
let router = express.Router()

// 路由到登录页面，加载展示登录页面
router.get("/login", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/login/login.html"))
})

// 路由到about页面，加载展示about页面
router.get("/about", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/about/about.html"))
})
// 路由到mine页面，加载展示mine页面
router.get("/mine", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/mine/mine.html"))
})
// 路由到contact页面，加载展示contact页面
router.get("/contact", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/contact/contact.html"))
})
// 路由到chat页面，加载展示chat页面
router.get("/chat", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/chat/chat.html"))
})
// 路由到services页面，加载展示services页面
router.get("/services", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/services/services.html"))
})
// 路由到首页，加载首页
router.get("/home", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/home/home.html"))
})
// 路由到notice页面，加载展示notice页面
router.get("/notice", function (request, response) {
  response.sendFile(path.join(__dirname, "../../web/views/notice/notice.html"))
})
// 登录验证处理
router.post("/loginAction", function (request, response) {
  let account = request.body.account
  let password = request.body.password
  console.log(account, password);
  userDao.login(account, password, function (result) {
    // 返回数据
    // console.log(result);
    response.send(result)
  })

})

// 用户注册处理
router.post("/registerAction", function (request, response) {
  let username = request.body.username;
  let email = request.body.email;
  let password = request.body.password;
  userDao.register(username, email, password, function () {
    // 注册成功后的处理逻辑，如返回注册成功的消息
    response.send("注册成功");
  });
});

// 用户购买处理
router.post("/updateMoney", function (request, response) {
  let uid = request.body.uid;
  let money = request.body.money;
  userDao.updateMoney(uid, money, function (result) {
    response.send(result);
  });
});

router.post("/updateFlow", function (request, response) {
  let uid = request.body.uid;
  let flow = request.body.flow;
  userDao.updateFlow(uid, flow, function (result) {
    response.send(result);
  });
});
// 获取用户话费，流量
router.post("/inquire", function (request, response) {
  let uid = request.body.uid;
  userDao.inquireInfo(uid, function (result) {
    response.send(result);
  });
});
// 发送反馈
router.post("/sendFeedback", function (request, response) {
  let uid = request.body.uid;
  let text = request.body.text;
  userDao.sendFeedback(uid, text, function (result) {
    response.send(result);
  });
});
// 我的反馈
router.post("/myFeedback", function (request, response) {
  let uid = request.body.uid;
  userDao.getFeedback(uid, function (result) {
    response.send(result);
  });
});
// 删除反馈
router.post("/deleteFeedback", function (request, response) {
  let tid = request.body.tid;
  userDao.deleteFeedback(tid, function (result) {
    response.send(result);
  });
});

// 使用星火大模型实现聊天
router.post("/chat", async function (request, response) {
  // 获取问题内容
  let question = request.body.question
  // 配置api
  let appid = "07af6702"
  let api_secret = "MzY3ZTA4Y2I0OTcxMGExM2Q5YzIwMTQy"
  let api_key = "0aeebf1f4eb038d5b01e1858477bc0da"
  let gpt_url = "ws://spark-api.xf-yun.com/v1.1/chat"
  // 准备websocket请求的参数
  const wsParam = new Ws_Param(appid, api_key, api_secret, gpt_url);
  const wsUrl = wsParam.create_url();
  const ws = new WebSocket(wsUrl);

  ws.appid = appid;
  ws.question = question;

  let messages = []; // 用于存储websocket拿到的所有的消息

  // 收到websocket消息的处理
  ws.on('message', function (message) {
    const data = JSON.parse(message);
    const code = data['header']['code'];
    if (code != 0) {
      console.log(`请求错误: ${code}, ${data}`);
      this.close();
    } else {
      const choices = data["payload"]["choices"];
      const status = choices["status"];
      const content = choices["text"][0]["content"];
      console.log(content);
      messages.push(content); // 由于websocket会多次返回消息，因此需要将消息存储在数组中，方便后续一次性返回
      if (status == 2) {
        this.close();
      }
    }
  });
  // 收到websocket连接建立的处理
  ws.on('open', function () {
    const data = JSON.stringify(gen_params(appid, question));
    ws.send(data);
  });
  // 收到websocket关闭的处理
  ws.on('close', function () {
    console.log("### closed ###");
    response.send(JSON.stringify(messages.join('\n'))); // 在 WebSocket 连接关闭时返回 HTTP 响应
  })
  // 收到websocket错误的处理
  ws.on('error', function (error) {
    console.log("### error:", error);
  });
})
/**
 * websocket 参数类，通过该类来快速构造参数
 */
class Ws_Param {
  // 初始化
  constructor(APPID, APIKey, APISecret, gpt_url) {
    this.APPID = APPID;
    this.APIKey = APIKey;
    this.APISecret = APISecret;
    this.host = url.parse(gpt_url).hostname;
    this.path = url.parse(gpt_url).pathname;
    this.gpt_url = gpt_url;
  }

  // 生成url
  create_url() {
    const now = new Date();
    const date = now.toUTCString();
    // 拼接字符串
    let signature_origin = "host: " + this.host + "\n";
    signature_origin += "date: " + date + "\n";
    signature_origin += "GET " + this.path + " HTTP/1.1";
    // 进行hmac-sha256进行加密
    const signature_sha = crypto.createHmac('sha256', this.APISecret).update(signature_origin).digest();
    const signature_sha_base64 = Buffer.from(signature_sha).toString('base64');
    const authorization_origin = `api_key="${this.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature_sha_base64}"`;
    const authorization = Buffer.from(authorization_origin).toString('base64');
    // 将请求的鉴权参数组合为字典
    const v = {
      "authorization": authorization,
      "date": date,
      "host": this.host
    };
    // 拼接鉴权参数，生成url
    const url = this.gpt_url + '?' + querystring.stringify(v);
    return url;
  }
}

// 通过appid和用户的提问来生成请参数
function gen_params(appid, question) {
  return {
    "header": {
      "app_id": appid,
      "uid": "1234"
    },
    "parameter": {
      "chat": {
        "domain": "general",
        "random_threshold": 0.5,
        "max_tokens": 2048,
        "auditing": "default"
      }
    },
    "payload": {
      "message": {
        "text": [
          { "role": "user", "content": question }
        ]
      }
    }
  };
}


//将路由暴露出去
module.exports = router