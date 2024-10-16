# Obsidian Upload Plugin

## 介绍

这是 [Obsidian](https://obsidian.md) 插件，专用于上传文件到存储仓库。目前支持 Lskypro（兰空图床），后续有需求会引入其它存储方式，如：Github/Gitee等等。

## 功能

- 支持多平台配置（Lskypro、Halo等）
- 支持右键菜单上传

## 使用

### 通过 Obsidian 社区插件中搜索并安装

尝试在 Obsidian 社区插件中搜索 `Upload Plugin`，若找到该插件，按照提示直接安装即可。

### 通过源码仓库或发布的文件下载安装

- 从 Release 或源码中下载文件，包含：`main.js`，`manifest.json`，`styles.css`
- 复制或移动 `main.js`, `styles.css`, `manifest.json` 到 `[VaultFolder]/.obsidian/plugins/[your-plugin-id]/`
- 找到该插件进行相应配置即可（重启 Obsidian ）

> **注意:** `[VaultFolder]` 是根目录、`[your-plugin-id]` 是插件 id（`manifest.json => id`）

### 通过第三方下载并安装

可尝试使用第三方插件进行安装，如：[BRAT](https://github.com/TfTHacker/obsidian42-brat)

## 开发

该项目使用 TypeScript 提供类型检查和文档。 该存储库依赖于 TypeScript 定义格式的最新插件 API (obsidian.d.ts)，其中包含描述其功能的 TSDoc 注释。

### 启动项目

```sh
git clone https://github.com/Appleec/e-obsidian-upload-plugin.git obsidian-upload-plugin

cd obsidian-upload-plugin

npm i

npm run dev
```

### 发布项目

- 更新 `manifest.json` 版本，如：`1.0.1`
- 更新 `versions.json` 中的 `version` 和 `minAppVersion` 版本
- 打一个版本标签并在代码仓库中创建一个发布任务，如：GitHub Release
- 将打包好的 `manifest.json`, `main.js`, `styles.css` 上传
- 查看是否发布成功


### API 文档

查看 https://github.com/obsidianmd/obsidian-api

## 下一步

- [ ] 添加选中图片上传命令行
- [ ] 添加所有图片上传命令行
- [ ] 支持 GitHub 配置上传

## 致谢

- [obsidian-image-upload-toolkit](https://github.com/addozhang/obsidian-image-upload-toolkit)
- [obsidian-image-uploader](https://github.com/Creling/obsidian-image-uploader)
- [obsidian-image-auto-upload-plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin)
- [obsidian-image-uploader](https://github.com/sancijun/obsidian-image-uploader)
- [obsidian-wordpress](https://github.com/devbean/obsidian-wordpress)
