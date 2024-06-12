<template>
  <div>
    <el-switch
      v-model="isDarkMode"
      class="ml-2"
      @change="toggleTheme"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    ></el-switch>
  </div>
</template>

<script>
import { ElSwitch } from 'element-plus';

export default {
  data() {
    return {
      isDarkMode: false,
    };
  },
  computed: {
    theme() {
      return this.isDarkMode ? 'dark' : 'light';
    },
  },
  methods: {
    toggleTheme() {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          }
        });
      });
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.toggleTheme();
    } else {
      // 初始主题设置
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.toggleTheme();
    }
  },
  watch: {
    isDarkMode(newValue) {
      const theme = newValue ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    },
  },
};
</script>

<style>
html, body {
  transition: background-color 0.5s, color 0.5s;
}

.theme-light {
  background-color: #ffffff;
  color: #000000;
}

.theme-dark {
  background-color: #000000;
  color: #ffffff;
}

.dark {
  background-color: #000;
  color: #fff;
}

.light {
  background-color: #fff;
  color: #000;
}
</style>
