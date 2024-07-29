<template>
  <title-bar
    id="titlebar"
    windowtitle="windowTitle"
    supportfullscreen
    :class="[cIsMac ? 'h-32px' : 'h-26px', isDarkMode ? 'dark-mode' : 'light-mode']"
    class="titlebar flex"
  >
    <template v-if="authStore.isLoggedIn">
      <div id="setting" class="window__control" ref="settingControl">
        <i id="setting-icon" class="el-icon" ref="settingContainer">
          <el-icon><Setting /></el-icon>
        </i>
      </div>

      <div id="control" class="window__control" ref="control">
        <i id="icon" class="el-icon" ref="iconContainer"></i>
      </div>

      <div id="pin-control" class="window__control" ref="pinControl">
        <i id="pin-icon" class="el-icon" ref="pinIconContainer" v-html="pinIcon"></i>
      </div>
    </template>

  </title-bar>
</template>

<script setup lang="ts">

import '@electron-uikit/titlebar/renderer'
import { ref, computed, onMounted, watch, h, createApp } from 'vue';
import { Moon, Sunny, Setting } from '@element-plus/icons-vue';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const isLoggedIn = ref(authStore.isLoggedIn);

const isDarkMode = ref(false);
const isPinned = ref(false);
const settingControl = ref(null);
const control = ref<HTMLElement | null>(null);
const iconContainer = ref<HTMLElement | null>(null);
const pinControl = ref<HTMLElement | null>(null);
const pinIconContainer = ref<HTMLElement | null>(null);
const cIsMac = ref(false);
const windowTitle = ref('');  // 初始化为非 null 值


let currentApp: any = null;

const updateIcon = () => {
  const IconComponent = isDarkMode.value ? Moon : Sunny;
  const app = createApp({
    render() {
      return h(IconComponent);
    }
  });

  if (iconContainer.value) {
    iconContainer.value.innerHTML = '';

    if (currentApp) {
      currentApp.unmount();
    }

    currentApp = app;
    app.mount(iconContainer.value);
  }
};

const defaultSvg = `<svg t="1719671483594" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31200" data-spm-anchor-id="a313x.search_index.0.i61.351e3a81YkDxXO" width="48" height="48"><path d="M144.016 806.272l-32.88 67.616-32.896 67.6 67.6-32.896 67.6-32.88 172.912-172.912-69.424-69.424zM618.528 82.496l-37.024 103.824 124.112 124.112 124.096 124.112 103.824-37.04z" fill="#bfbfbf" p-id="31201" data-spm-anchor-id="a313x.search_index.0.i58.351e3a81YkDxXO" class=""></path><path d="M555.952 725.664l248.128-316.768-196.944-196.928-316.768 248.112" fill="#dbdbdb" p-id="31202" data-spm-anchor-id="a313x.search_index.0.i59.351e3a81YkDxXO" class=""></path><path d="M552.96 869.392c45.904-45.904 41.088-125.84-10.704-177.632L327.968 477.488c-51.792-51.792-131.728-56.624-177.632-10.704L552.96 869.392zM433.776 458.304l153.936-120.576" fill="#dbdbdb" p-id="31203" data-spm-anchor-id="a313x.search_index.0.i60.351e3a81YkDxXO" class=""></path></svg>`;
const pinnedSvg = `<svg t="1719671567511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31888" width="48" height="48"><path d="M144.016 806.272l-32.88 67.616-32.896 67.6 67.6-32.896 67.6-32.88 172.912-172.912-69.424-69.424zM618.528 82.496l-37.024 103.824 124.112 124.112 124.096 124.112 103.824-37.04z" fill="#5981C1" p-id="31889"></path><path d="M555.952 725.664l248.128-316.768-196.944-196.928-316.768 248.112" fill="#8CAEDC" p-id="31890"></path><path d="M552.96 869.392c45.904-45.904 41.088-125.84-10.704-177.632L327.968 477.488c-51.792-51.792-131.728-56.624-177.632-10.704L552.96 869.392zM433.776 458.304l153.936-120.576" fill="#8CAEDC" p-id="31891"></path></svg>`;

const pinIcon = computed(() => {
  return isPinned.value ? pinnedSvg : defaultSvg;
});

const updatePinIcon = () => {
  if (pinIconContainer.value) {
    pinIconContainer.value.innerHTML = pinIcon.value;
  }
};

watch(pinIcon, (newVal) => {
  if (pinIconContainer.value) {
    pinIconContainer.value.innerHTML = newVal;
  }
});



onMounted(() => {

  window.electron.ipcRenderer.on('window-title-updated', (_, title) => {
    windowTitle.value = title;
  });

  window.electron.ipcRenderer.on('login-success', () => {
    console.log('login-success event received in TitleBar.vue'); // 添加调试日志
    isLoggedIn.value = true;
  });

  window.electron.ipcRenderer.on('window-title-updated', (_, { title, logo }) => {
    const titlebarElement = document.getElementById('titlebar');
    const titleDom = titlebarElement?.shadowRoot?.querySelector('.titlebar__title');
    if (titleDom) {
      if (logo) {
        titleDom.innerHTML = `<span style="margin-right: 3px;margin-bottom: 3px;font-size: 17px;">${logo}</span>${title}`;
      } else {
        titleDom.innerHTML = `${title}`;
      }
    }
  });

  if (window.api && typeof window.api.isMacintosh === 'function') {
    cIsMac.value = window.api.isMacintosh();
    console.log(`当前系统是${cIsMac.value ? 'MacOS' : 'Windows'}`);
  } else {
    console.error('window.api.isMacintosh不是函数或window.api未定义');
  }

  if (control.value) {
    control.value.addEventListener('click', () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      }
      updateIcon();
    });
  }
  updateIcon();

  if (pinControl.value) {
    pinControl.value.addEventListener('click', () => {
      isPinned.value = !isPinned.value;
      window.api.toggleAlwaysOnTop();
      updatePinIcon();
    });
  }
  updatePinIcon();



});
</script>



<style lang="scss" scoped>

.window__control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 5em;
  height: 5em;
  transition: fill 0.3s;
}

</style>
