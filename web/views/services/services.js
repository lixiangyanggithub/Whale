const uid = GetCookie("uid")

if (uid.length < 1) {
    alert("未登录")
    location.href = "/login"
}

$(document).ready(
    ()=>{
        // 获取 textarea 元素
        const textarea = document.getElementById('chat-input');
        // 监听 textarea 的输入事件
        textarea.addEventListener('input', function() {
            // 调整 textarea 的高度
            textarea.style.height = '40px'; // 先将高度设置为 auto，以便重新计算高度
            // textarea.style.height = textarea.scrollHeight + 'px'; // 设置为内容的实际高度
        });
    },
    $.ajax({
        type: "POST",
        url: "/inquire",
        data: { "uid": uid },
        success: function (response) {
            if (response.length >= 1) {
                document.getElementById("money").innerHTML = response[0].money + "元"
                document.getElementById("flow").innerHTML = response[0].flow + "M"
            } else {
                alert("未登录")
                location.href = "/login"
            }
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
)

function updateFlow(flow) {
    const uid = GetCookie("uid")
    if (uid.length < 1) {
        alert("未登录")
        location.href = "/login"
    }
    let inputFlow = flow
    if (flow < 0) {
        inputFlow = document.getElementById("input-flow").value
    }
    $.ajax({
        type: "POST",
        url: "/updateFlow",
        data: { "uid": uid, "flow": inputFlow },
        success: function (response) {
            if (response.code === 1001) {
                alert("购买成功")
                location.reload()
            } else if (response.code === 1002) {
                alert("话费不足")
            }
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
}

function updateMoney(money) {
    const uid = GetCookie("uid")
    if (uid.length < 1) {
        alert("未登录")
        location.href = "/login"
    }
    let inputMoney = money
    if (money < 0) {
        inputMoney = document.getElementById("input-money").value
    }
    $.ajax({
        type: "POST",
        url: "/updateMoney",
        data: { "uid": uid, "money": inputMoney },
        success: function (response) {
            if (response.code === 1001) {
                alert("充值成功")
                location.reload()
            }
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
}

function myFeedback() {
    let html = ""
    $.ajax({
        type: "POST",
        url: "/myFeedback",
        data: { "uid": uid },
        success: function (response) {
            response.forEach(r=>{
                html += `<li>
                    <span>`+ r.text +`</span>
                    <button onclick="deleteFeedback(`+ r.fid +`)">删除</button>
            </li>`
            })
            if (html.length <= 0) {
                html = "无反馈"
            }
            document.getElementById("my-feedback-list").innerHTML = html
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
}

function sendFeedback() {
    const text = document.getElementById("chat-input").value
    $.ajax({
        type: "POST",
        url: "/sendFeedback",
        data: { "uid": uid, "text": text},
        success: function (response) {
            if (response.code === 1001) {
                alert("发送成功")
                document.getElementById("chat-input").value = ""
            }
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
}

function deleteFeedback(tid) {
    $.ajax({
        type: "POST",
        url: "/deleteFeedback",
        data: { "tid": tid},
        success: function (response) {
            if (response.code === 1001) {
                alert("删除成功")
                location.reload()
            }
        },
        fail: function (err) {
            // 请求失败
            console.log(err);
        }
    })
}