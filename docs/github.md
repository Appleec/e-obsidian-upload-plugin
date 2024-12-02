---
outline: deep
---

# Github 设置

本章节主要介绍 Github 上传设置。

- [Rest API](https://docs.github.com/zh/rest/repos/contents?apiVersion=2022-11-28)

## 准备工作

### 注册账户

### 生成 Token 令牌

`Settings => Developer settings => Token(Classic)`

开始配置 Tokens，注意需要把作用域（Scopes）中的 repo 勾选

### 创建一个文件存储仓库

1. 点击 【+】，配置项目（New repository）
2. 选择一个【Owner】，并输入合法仓库名称
3. 开始创建项目

## 配置说明

### API

- 请求地址

```
https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**路径**

| Name        | Type               | Required | Description           |
|-------------|--------------------|----------|-----------------------|
| owner    | string | Y        | The account owner of the repository. The name is not case sensitive.    |
| repo   | string | Y        | The name of the repository without the .git extension. The name is not case sensitive.    |
| path   | string | Y        | path parameter   |

- 请求方式 - PUT

- 请求头

```json
{
	"Accept": "application/vnd.github+json", 
	"Authorization": "token xxxxxx"
}
```

- 请求体

```json
{
	"message": "From uploader Github",
	"content": "$CONTENT",
	"branch": "master"
}
```


| Name        | Type               | Required | Description           |
|-------------|--------------------|----------|-----------------------|
| message    | string | Y        | The commit message.   |
| content   | string | Y        |  The new file content, using Base64 encoding.    |
| branch   | string | N        | The branch name. Default: the repository’s default branch.  |

## FAQ

## 其它

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
