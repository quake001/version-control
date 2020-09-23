import request from '@/utils/request'
// 获取版本信息
export function getversion(data) {
  return request({
    url: '/versionData',
    method: 'get',
    params: {
      projectId: data.projectId || ''
    }
  })
}
// 新增版本信息
export function addVersion(data) {
  return request({
    url: '/versionData',
    method: 'post',
    data
  })
}
// 删除版本信息
export function delVersion(data) {
  return request({
    url: `/versionData/${data}`,
    method: 'delete'
  })
}
// 查找到指定版本信息
export function getversionById(data) {
  return request({
    url: `/versionData/${data}`,
    method: 'get'
  })
}


