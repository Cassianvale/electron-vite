<template>
  <div :class="{'background-wrapper':true, 'electron': isElectron}">
    <div :class="{'login-container': true, 'electron': isElectron}">
      <div class="drag-region"></div>
      <el-form ref="formRef" class="login-form" :model="loginForm" :rules="rules" @submit.native.prevent="handleLogin">
        <h1 class="login-title">Login</h1>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="UserName" class="round-input"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="PassWord" class="round-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <a href="#" class="forgot-password">忘记密码?</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin">登录</el-button>
        </el-form-item>
        <div class="register-link">
          你还没有账号？
          <a href="#">
            注册
          </a>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import { ElForm, ElInput, ElButton, ElCheckbox, ElNotification } from 'element-plus'


// 检测是否在 Electron 环境中
const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;


const formRef = ref<InstanceType<typeof ElForm> | null>(null);

interface LoginForm {
  username: string;
  password: string;
}

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
    await formRef.value.validate((valid: boolean, _fields: any) => {
      if (valid) {
        // 模拟登录
        setTimeout(() => {
          ElNotification({
            title: '成功',
            message: '登录成功！',
            type: 'success',
            duration: 2000
          });
          // window.electron.ipcRenderer.invoke('create-generic-window', {
          //   route: '/home',
          //   width: 800,
          //   height: 600,
          //   title: 'OVO - 主页'
          // });
        setTimeout(() => {
            window.electron.ipcRenderer.send('login-success');
          }, 500); // 延迟2秒后发送'login-success'事件
        }, 100); // 出现通知的时间
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
  height: 0vh; /* 设定body高度 */
  margin: 0;
  padding: 0;
  font-family: "Monaco", sans-serif, "Noto Sans";
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 隐藏滚动条 */
}

.background-wrapper {
  background: url('../assets/macosbackground.jpg') no-repeat center center fixed; /* 添加背景图片 */
  background-size: cover; /* Cover to ensure it fills the area */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Position relative to overlay the container */
  overflow: hidden;
}

.background-wrapper:not(.electron) {
  height: 100vh; /* 设定高度 */
  margin-top: 0px;
}

.background-wrapper.electron {
  height: 100%;
  width: 100%;
}

.login-form {
  max-width: 335px; /* 设定宽度 */
  padding: 50px;
}

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-container.electron {
  margin:auto;
}

.login-container:not(.electron) {
  margin: 400px;
  overflow: hidden; /* 隐藏滚动条 */
}

.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px; /* 定义拖动区域的高度 */
  -webkit-app-region: drag;
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
  background: rgb(226, 157, 211);
  color: rgb(66, 66, 66); /* White text for the login button */
  border: none;
  border-radius: 15px;
  margin: 0 auto;
}

:deep(.el-checkbox__label) {
  color: rgb(0, 0, 0);
}

.forgot-password {
  color: rgb(0, 0, 0);
  font-size: 14px;
  text-decoration: none;
  margin-left: auto; /* 将其推到容器的右边 */
}


.register-link {
  color: rgb(0, 0, 0);
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: rgb(0, 183, 255);
  text-decoration: none;
  font-weight:bold;
}
</style>
