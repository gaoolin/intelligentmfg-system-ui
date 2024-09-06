<template>
  <div class="login-container">
    <!-- 公告栏 -->
    <notice-bar v-show="showNotice" :notices="notices" :speed="60" :headway="80" :pauseOnHover="true">
      <template v-slot="{ notices }">
        <span v-for="(notice, index) in notices" :key="index">{{ notice }}</span>
      </template>
    </notice-bar>

    <div class="login-box">
      <h2 class="title">智能制造管理系统</h2>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            auto-complete="off"
            placeholder="请输入账号"
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            auto-complete="off"
            type="password"
            placeholder="请输入密码"
            class="input-field"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item class="remember-me">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
          >登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import { Message } from 'element-ui'
import NoticeBar from '@/views/biz/common/NoticeBar'

export default {
  name: 'Login',
  // import引入的组件需要注入到对象中才能使用
  components: { NoticeBar },
  data() {
    return {
      notices: [
        "公告1：本系统原有登入方式将在近期停止使用。",
        "公告2：原qcp参数监控系统将在2024年2月6日关闭。",
        "公告3：请各位同事使用本系统对应模块查看相关数据。"
      ],
      showNotice: false,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      redirect: undefined,
      styleChange: {
        height: '',
        width: ''
      }
    }
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', this.loginForm).then(() => {
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
                  this.$router.push({ path: this.redirect === '/' || this.redirect === '/index' || this.redirect === undefined ? pathIndex : this.redirect }).catch(() => {
                  }) // 跳转重定向页面或跳到默认首页indexPage
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
      })
    }
  },

  created() {
    this.getCode()
    this.getCookie()
  },

  mounted() {
    const that = this
    that.styleChange.height = window.innerHeight + 'px' // 屏幕高度
    that.styleChange.width = window.innerWidth + 'px' // 屏幕宽度
    console.log('高度', that.styleChange.height)
    console.log('宽度', that.styleChange.width)
  },

  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.login-box {
  width: 400px;
  padding: 20px 40px 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.title {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
}

.input-field {
  margin-bottom: 20px;

  input {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    height: 45px;
    font-size: 16px;
  }
}

.remember-me {
  color: #fff;
  text-align: left;
}

.login-button {
  margin:0px 0px 0px 0px;
  width: 100%;
  height: 50px;
  background-color: #1b6acf;
  color: #fff;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #1456a8;
}
</style>
