# E Obsidian Upload Plugin

## 介绍

这是 [Obsidian](https://obsidian.md) 插件，专用于上传文件到存储仓库。目前支持 Lskypro（兰空图床），后续有需求会引入其它存储方式，如：Github/Gitee等等。

## 功能特性

- 支持多平台配置
	- Lskypro（兰空图床）
  - Halo（blog）
  - Github
- 支持右键菜单点击上传

## 快速安装

### 通过 Obsidian 社区插件中搜索并安装

尝试在 Obsidian 社区插件中搜索 `EUpload`，若找到该插件，按照提示直接安装即可。

### 通过源码仓库或发布的文件下载安装

- 从 Release 或源码中下载文件，包含：`main.js`，`manifest.json`，`styles.css`
- 复制或移动 `main.js`, `styles.css`, `manifest.json` 到 `[VaultFolder]/.obsidian/plugins/[your-plugin-id]/`
- 找到该插件进行相应配置即可（重启 Obsidian ）

> **注意:** `[VaultFolder]` 是根目录、`[your-plugin-id]` 是插件 id（`manifest.json => id`）

### 通过第三方下载并安装

可尝试使用第三方插件进行安装，如：[BRAT](https://github.com/TfTHacker/obsidian42-brat)

## 操作指南

> 下面配置包含具体实例，请按需替换自己的内容。

### Lskypro 配置

- API 请求地址 - 上传文件 API 地址，注意末尾不添加 `/`

```shell
# 注意，URL 地址不添加 `/`
https://xxx.xxx.xxx/api/v1/upload
```

- API 请求头 - POST Header，JSON 格式

```json
{
	"Authorization": "Bearer Jq7mTKdjN7BxMjLoG8Jj8eaGGV2GuurwumOGFCBm",
	"Accept": "application/json",
	"Content-Type": "multipart/form-data"
}
```

> `Authorization` 必须，认证令牌，注意格式或空格，具体字段按需变更  
> `Content-Type` - 可选，类型

- API 请求体 - POST Body，JSON 格式

```json
{
	"file": "$FILE",
	"strategy_id": 2
}
```

> `file` - 必须，二进制文件，`$FILE` 为内置字段，不可变更  
> `strategy_id` - 可选，此处表示存储仓库ID，自行查阅 API

- 图片 URL 路径 - 返回数据（Response）中图片 URL 字段路径，以 JSON 对象为例，如：data.pathname

```
data.pathname
```

- 图片 URL 前缀 - 可选，当填入时，此值将插入到图片 URL 路径之前，即：URL = 前缀 + 图片 URL 路径

```shell
# 一般 API 只返回图片路径或者存在多个域名情况使用
# 注意，URL 地址添加 `/`
https://xxx.xxx.xxx/upload/eblog/
```

### Halo 配置

- API 请求地址 - 上传文件 API 地址，注意末尾不添加 `/`

```shell
# 注意，URL 地址不添加 `/`
https://xxx.xxx,xxx/apis/api.console.halo.run/v1alpha1/attachments/upload
```

- API 请求头 - POST Header，JSON 格式

```json
{
	"Authorization": "Bearer pat_eyJraWQiOiI1SG9MUWVvUW10bV9zd2JISFRSODFEd1dUWVNyUUlyc0N3NjE2R1dQTXpnIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2Jsb2cuZWxpbnp5LmNvbS8iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcxMTk1NjY5MiwianRpIjoiN2E5NDY3NjEtY2QzYi1kODc4LTJkOGMtZWQxNmUwZDk4NzFjIiwicGF0X25hbWUiOiJwYXQtYWRtaW4tbkdnZG0ifQ.cl7n0f9SqP5qwYUW2ZM6DL6Ex6Xh9GvxL_hwEDJuUn8tlyuzOhcjUqkGSCO1D8E0lqym7RtV7xDQzSLkQybKbSwRqeMEDbLbdLMDpzD2Vu1aptz5m0ifsm9pvpm2Wqnn_px68arhqHqmMwP-8N9F1m-fMu1ovBuXI2gzHA56Ne1yWsSObeasxqNP1CNsez_abdv0fPKxbBsV_2JrQeHYc0y90M8V0WZ9d3_zdrgOMg6Hm481VprrHUwB9nxrsVsCxd_ROwf93ZhGo_VPV5YG8_Pz4CwRGzkIABVHO1leUXyMD24nOpG9csGo-mauuik7oi1h6eLUMi2902qKFUctwRsF4lKQSP6h2Li9UUt0FYQp78uaTDbke3eAxLq1nqWfOn3Lplpe1tz8MPXtZGclx2xz4zkQWs5TdOU4cuukMIJoXfc1VCbAR9AuaG1BVMZYnL-scgg9I9GNHjtcfgFMskUaEKQlyYTNiIweaqQHMlBHvdxJjCMko9jdB2qnMNw9cs2QfMreK278A6ucHMOB9WGVh0thpor1gk2MvAcV3k-ai21BKUdOLooxftdXbI7V9xif_fLEZwFvtf2RtRqChJpXLyGS2-xoOwg00kz0khckv43vntSCPZ8pqHnTAWsy_ssf80WOajs2guY25l04PXAshEGndvziB0Aod3AoXdY"
}
```

> `Authorization` 必须，认证令牌，注意格式或空格，具体字段按需变更

- API 请求体 - POST Body，JSON 格式

```json
{
	"file": "$FILE",
	"policyName": "attachment-policy-gUpSV",
	"groupName": "attachment-group-JWlvm"
}
```

> `file` - 必须，二进制文件，`$FILE` 为内置字段，不可变更  
> `policyName` - 可选，此处表示存储仓库，自行查阅 API
> `groupName` - 可选，此处表示分组名称，自行查阅 API

- 图片 URL 路径 - 返回数据（Response）中图片 URL 字段路径，以 JSON 对象为例，如：data.pathname

```
["metadata", "annotations", "storage.halo.run/uri"]
```

- 图片 URL 前缀 - 可选，当填入时，此值将插入到图片 URL 路径之前，即：URL = 前缀 + 图片 URL 路径

```shell
# 一般 API 只返回图片路径或者存在多个域名情况使用
# 注意，URL 地址添加 `/`
https://xxx.xxx.xxx/
```

### Github 配置

> https://docs.github.com/zh/rest/repos/contents?apiVersion=2022-11-28

- API 请求地址 - 上传文件 API 地址，注意末尾不添加 `/`

```shell
# 注意，URL 地址不添加 `/`
https://api.github.com
```

- API 请求头 - POST Header，JSON 格式

```json
{
	"Accept": "application/vnd.github+json",
	"Authorization": "token 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"
}
```

> `Authorization` 必须，认证令牌，注意格式或空格，具体字段按需变更

- API 请求体 - POST Body，JSON 格式

```json
{
	"owner": "Appleec",
	"repo": "e-test",
	"branch": "master",
	"path": "img/$PATH",
	"message": "From uploader Github",
	"content": "$CONTENT"
}
```

> `content` - 必须，表示 base64 编码图片，`$CONTENT` 为内置字段，不可变更  
> `owner` - 必须，表示用户，自行查阅 API
> `repo` - 必须，表示仓库名，自行查阅 API
> `path` - 必须，表示文件路径，自行查阅 API
> `branch` - 可选，表示分支，自行查阅 API
> `message` - 必须，表示消息内容，自行查阅 API

- 图片 URL 路径 - 返回数据（Response）中图片 URL 字段路径，以 JSON 对象为例，如：data.pathname

```
["content", "download_url"]
```

- 图片 URL 前缀 - 可选，当填入时，此值将插入到图片 URL 路径之前，即：URL = 前缀 + 图片 URL 路径

```shell
# 一般 API 只返回图片路径或者存在多个域名情况使用
# 注意，URL 地址添加 `/`
https://xxx.xxx.xxx/
```

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
- [x] 支持 GitHub 配置上传

## 参考文档

- [obsidian-image-upload-toolkit](https://github.com/addozhang/obsidian-image-upload-toolkit)
- [obsidian-image-uploader](https://github.com/Creling/obsidian-image-uploader)
- [obsidian-image-auto-upload-plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin)
- [obsidian-image-uploader](https://github.com/sancijun/obsidian-image-uploader)
- [obsidian-wordpress](https://github.com/devbean/obsidian-wordpress)
- [obsidian-emo-uploader](https://github.com/yaleiyale/obsidian-emo-uploader)
