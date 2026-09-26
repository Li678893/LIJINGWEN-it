import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// emptyOutDir: false —— Windows 上清空 dist（里面有大体积视频）会被安全删除拦截，
// 导致构建直接中断。代价只是残留少量旧哈希文件，不影响功能。
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { emptyOutDir: false },
})
