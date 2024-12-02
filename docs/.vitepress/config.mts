import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Obsidian Upload Plugin",
  description: "专用于 Obsidian 上传插件",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
    ],
		aside: true,

    sidebar: [
      {
        text: '介绍',
        items: [
          { text: '快速开始', link: '/getting-started' },
          { text: '安装', link: '/api-examples' }
        ]
      },
      {
        text: '操作指南',
        items: [
          { text: 'Github', link: '/github' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Appleec/e-obsidian-upload-plugin' }
    ]
  }
})
