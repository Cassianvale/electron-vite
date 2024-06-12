<template>
  <div :class="{'login-container': true, 'electron': isElectron}"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="drag-region"></div>
    <el-form ref="formRef" class="login-form" :model="loginForm" :rules="rules" @submit.native.prevent="handleLogin">
      <h1 class="login-title">登录</h1>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" class="round-input"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="密码" class="round-input"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
        <a href="#" class="forgot-password">忘记密码?</a>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-button" @click="handleLogin">登录</el-button>
      </el-form-item>
      <div class="register-link">
        你还没有账号？<a href="#">注册</a>
      </div>
    </el-form>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElInput, ElButton, ElCheckbox, ElNotification } from 'element-plus'
import backgroundImage from '../assets/macos-4K.jpg'

// 检测是否在 Electron 环境中
const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;


const formRef = ref<InstanceType<typeof ElForm> | null>(null);

interface LoginForm {
  username: string;
  password: string;
}

const router = useRouter()
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const rememberMe = ref<boolean>(false)

const handleLogin = async () => {
  if (formRef.value) {
    await formRef.value.validate((valid: boolean) => {
      if (valid) {
        // 模拟登录请求
        setTimeout(() => {
          // 假设登录成功，显示通知并跳转到主页面
          ElNotification({
            title: '成功',
            message: '登录成功！',
            type: 'success',
            duration: 2000
          })
          router.push({ name: 'MainPage' })
        }, 100)
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0; /* 移除默认边距 */
  height: 100%; /* 设定body高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 隐藏滚动条 */
}

.login-container {
  width: 100%; /* 设定宽度 */
  height: 100%; /* 设定高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* 对于WebKit内核的浏览器 */
}

.login-container.electron {
  margin-top: 0; /* Electron 环境中移除顶部边距 */
}

.login-container:not(.electron) {
  margin-top: 300px; /* 在网页端增加顶部边距 */
}

.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px; /* 定义拖动区域的高度 */
  -webkit-app-region: drag;
}

.login-form {
  width: 230px;
  padding: 50px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.el-form-item {
  margin-bottom: 15px;
}

.round-input .el-input__inner {
  border-radius: 15px; /* 调整输入框的圆角 */
}

.el-button.login-button {
  width: 50%;
  background: #7d4cdb;
  border: none;
  border-radius: 15px;
  margin: 0 auto;
}

.forgot-password {
  color: #7d4cdb;
  font-size: 14px; /* 调整字体大小 */
  text-decoration: none;
  margin-left: auto; /* 将其推到容器的右边 */
}


.register-link {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: #7d4cdb;
  text-decoration: none;
}
</style>
