```bash
# 邮箱
13960819008@163.com
# 介绍
采用vue-element-admin后台集成解决方案制作，实现对上传版本，控制线上版本发布灰度版本以及对版本的回滚 可视化操作
该项目采用json-server生成的数据
假数据都是存在根目录/mock/mockDATA.JSON文件内
登录的账号密码也是使用假数据。账号：admin 密码：123456
# 该程序的作用
它可以通过后端接口将数据存储在服务器上,然后设置线上版本或者测试版本(灰度版本)来实现发布，通过设置适配机型以及适配机型系统实现简单的灰度功能
```
## Build
```bash

# 安装依赖
npm install

# 启动服务
npm run start
```

浏览器访问 http://localhost:9528

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