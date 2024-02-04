

/*   登录注册切换功能   */
const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());
/*   登录注册切换功能   */



// Dom树加载完后调用
$(document).ready(
	// 登录按钮点击
	$("#login_btn").on('click', function () {
		// 收集页面用户输入的数据
		let account = $("#account").val()
		let password = $("#password").val()
		// 发起Ajax请求，将数据提交到服务端
		$.ajax({
			type: "POST",
			url: "/loginAction",
			data: { "account": account, "password": password },
			success: function (response) {
				console.log(response);
				// 根据返回的数据判断结果
				if (response.length < 1) {
					alert("用户名或密码错误")
				} else {
					// 验证成功，则跳转到主页
					SetCookie("uid", response[0].id) // 充值使用
					location.href = "/home"
				}
			},
			fail: function (err) {
				// 请求失败
				console.log(err);
			}
		})
	})
)


// Dom树加载完后调用
$(document).ready(function () {
	// 注册按钮点击
	$(".container--signup .btn").on("click", function () {
	  // 收集页面用户输入的数据
	  let username = $(".container--signup input[placeholder='User']").val();
	  let email = $(".container--signup input[placeholder='Email']").val();
	  let password = $(".container--signup input[placeholder='Password']").val();
  
	  // 发起 Ajax 请求，将数据提交到服务端
	  $.ajax({
		type: "POST",
		url: "/registerAction", // 注册接口的路径
		data: {
		  username: username,
		  email: email,
		  password: password
		},
		success: function (response) {
		  console.log(response);
		  // 根据返回的数据判断结果
		  if (response.error) {
			// 注册失败，提示错误信息
			alert("注册失败: " + response.error);
		  } else {
			// 注册成功，跳转到登录页面
			alert("注册成功，请登录");
			location.href = "/login";
		  }
		},
		error: function (xhr, status, error) {
		  // 请求失败
		  console.log("请求失败:", error);
		}
	  });
	});
  });
  