import axios from './axios';
// 域名  https://mallapi.duyiedu.com/ 


// 注册
export async function register(userInfo) {
  const resp = await axios.post('https://mallapi.duyiedu.com/passport/logon', {
    email: userInfo.email,
    password: userInfo.password,
    code: userInfo.captcha,
    username: userInfo.nickname,
  })
  return resp;
}

//获取验证码 
export async function getCode(email) {
  const resp = axios.post('https://mallapi.duyiedu.com/passport/getCode', {
    email: email,
  });
  return resp;
}

// 找回密码 忘记密码
export async function findBack(userInfo) {
  const resp = await axios.post('https://mallapi.duyiedu.com/passport/findBack', {
    email: userInfo.email,
    password: userInfo.password,
    code: userInfo.captcha,
  });
  return resp;
}

// 登录
export async function login(userInfo) {
  const resp = await axios.post('https://mallapi.duyiedu.com/passport/login', {
    email: userInfo.email,
    password: userInfo.password,
  });
  return resp;
}

// 刷新重新登录 whoAmI
export async function whoAmI() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const resp = await axios.post('https://mallapi.duyiedu.com/passport/login', {
      email: user.email,
      password: user.password,
    });
    return resp;
  }
}