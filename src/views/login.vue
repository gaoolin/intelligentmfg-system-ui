<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">智能制造管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <div class="el-login-profile">
<!--      <div>今日访问量：-</div>
      <div>历史访问量：-</div>-->
      <div>系统问题联系人：钉钉-高志林</div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2024 智能制造部 </span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { Message } from 'element-ui'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          // }).catch(() => {
          //   this.loading = false;
          //   if (this.captchaEnabled) {
          //     this.getCode();
          //   }
          // });


            // 1、跳到登录后指定跳转的页面或者登录后跳到首页
            // this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            // 2、登录后跳到路由默认的第一个路由页面
            this.$store.dispatch('GetInfo').then(res => {
              // 拉取完user_info信息
              const roles = res.roles
              this.$store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
                // 根据roles权限生成可访问的路由表
                // console.log(accessRoutes)
                this.$router.addRoutes(accessRoutes) // 动态添加可访问路由表
                let pathIndex = ''
                pathIndex = accessRoutes[0].path + '/' + accessRoutes[0].children[0].path // 设置默认首页地址indexPage
                // console.log(this.redirect, pathIndex)
                // 1、this.redirect == undefined,主要针对直接从http://172.16.6.205:9090/login，登入系统。
                // 2、this.redirect == '/'、 '/index'，主要针对直接从这个http://172.16.6.205:9090/login?redirect=%2F，登入系统。因为没有设置重定向的路由
                // 如果登录的时候出现1、2两种情况，那么就跳到路由的第一个路由页面，如果登录的时候，有设置可以访问的重定向地址，那么登录后就跳到重定向地址。
                if (pathIndex !== '') {
                  this.$router.push({ path: this.redirect === '/' || this.redirect === '/index' || this.redirect === undefined ? pathIndex : this.redirect }).catch(() => {}) // 跳转重定向页面或跳到默认首页indexPage
                }
              })
            }).catch(err => {
                this.$store.dispatch('LogOut').then(() => {
                  Message.error(err)
                  next({ path: '/login' })
                })
              })
          }).catch(error => {
              this.errorMsg = error
              this.loading = false
              this.getCode()
            })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/*.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}*/

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
}
.login-form {
  border-radius: 6px;
  background: rgba(0,0,0,0);
  width: 380px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-profile {
  height: 60px;
  line-height: 20px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  text-align: left;
  color: #fff;
  font-family: Arial,sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial,sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.login-btn{
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  font-size: 16px;
}
</style>
