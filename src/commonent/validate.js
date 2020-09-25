module.exports = {
  projectId: [{ required: true, message: '项目ID不得为空' }],
  uri: [{ message: '下载路径不得为空', required: true }],
  version: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('版本号不得为空'))
    }
    if (value.match(/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/) === null) {
      callback(new Error('请输入正确的版本号'))
    } else {
      callback()
    }
  }, trigger: 'blur', required: true }],
  modelOptions: [{ message: '适配机型至少选择一项', required: true }],
  systemOptions: [{ message: '适配系统至少选择一项', required: true }],
  textarea: [{ message: '介绍不得为空', required: true }],
  hotUpdate: [{ message: '热更新下载路径不得为空', required: true }]
}

