## 介绍
```bash
# 版本发布管理由福州夸克科技有限公司开发

# 介绍
应用版本发布管理平台：前端由vue+element+admin框架实现，后端为Spring Cloud+es+对象存储，针对APP、桌面端软件的版本进行灰度发布控制及管理。

该项目采用json-server生成的数据


模拟数据都是存在根目录/mock/mockDATA.JSON文件内

登录的账号密码也是使用假数据。账号：admin 密码：123456

# 这个程序能做什么
它可以通过后端接口将数据存储在服务器上,然后设置线上版本或者测试版本(灰度版本)来实现发布

# 灰度
通过设置适配机型以及适配机型系统实现简单的灰度功能

# 回滚
它可以对线上版本实现回滚功能

```
## Build
```bash

# 安装依赖
npm install

# 启动服务
npm run start
```

线上版本可以访问:http://1to2to3.cn/update

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其他

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```