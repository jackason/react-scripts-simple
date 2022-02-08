这是基于 `webpack` 的一个简易的 `react-scripts` 用于打包构建 `react` 项目  
This is a simple `react-scripts` based on `webpack`, which is used to package and build `react` projects

更新内容：  
&emsp;&emsp;v1.0.5 支持 css module  
&emsp;&emsp;v1.0.6 支持可以通过官方 create-react-app 生成

update content:  
&emsp;&emsp;v1.0.5 support CSS module  
&emsp;&emsp;v1.0.5 support can be generated through the official create react app

# 安装 (install)

```
npm install react-scripts-simple -D
yarn add react-scripts-simple
```

或者通过官方渠道安装

```
npx create-react-app holle-app --scripts-version react-scripts-simple
yarn create react-app holle-app --scripts-version react-scripts-simple
```

# 使用 (use)

在 `package.json` 的 `scripts` 下配置

```
{
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build"
    }
}
```

# 代理 (proxy)

在项目根目录新建 `proxy.config.js` 文件设置代理内容

```
module.exports = {
    '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    }
}
```

# 其他 (order)

您还可以在在项目根目录新建 `.env` 文件来配置端口 `PORT`

```
PORT=3010
```
