// 快捷设置 cookie
// 获取当前时间
let now = new Date();
// 计算 24 小时后的时间
let expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
// 设置 cookie
function SetCookie(name, value) {
    document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=/';
}
// 获取 cookie
function GetCookie(name) {
    // 获取所有的 cookie
    let cookies = document.cookie;
    // 将字符串分割成 cookie 数组
    let cookieArray = cookies.split(';');
    // 遍历 cookie 数组，找到名为 cookieName 的 cookie
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        // 判断是否是目标 cookie
        let cookieName = name+'='
        if (cookie.indexOf(cookieName) === 0) {
            // 获取 cookie 值
            let cookieValue = cookie.substring(cookieName.length)
            return cookieValue
        }
    }
    return ""
}
// 清除所有 cookie
function ClearCookie() {
    // 获取当前页面的所有 cookie
    let cookies = document.cookie.split(';');

    // 遍历 cookie 数组
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf('=');
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // 将过期时间设置为过去的时间，以清除 cookie
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}