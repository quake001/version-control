import request from '@/utils/request'

// 添加新建项目
export function addProject(data) {
  return request({
    url: '/projectData',
    method: 'post',
    data
  })
}

// 查看项目
export function queryProject(data) {
  if(data){
    return request({
      url: '/projectData',
      method: 'get',
      params:{
        projectId:data
      }
    })
  }
  else{
    return request({
      url: '/projectData',
      method: 'get',
    })
  }
}

// 删除项目
export function deleteProject(data) {
  return request({
    url: `/projectData/${data}`,
    method: 'delete',
  })
}
// 添加新增和删除操作信息
export function addInsertLog(data) {
  return request({
    url: '/logData',
    method: 'post',
    data
  })
}

// 查看新增删除操作信息
export function queryLog() {
  return request({
    url: '/logData',
    method: 'get'
  })
}

// 新建下载量信息
export function addDownloads(data) {
  return request({
    url: '/hbase/insertData',
    method: 'post',
    data: {
      thisMonth: data.thisMonth,
      lastMonth: data.lastMonth,
      userId: data.userId
    }
  })
}

// 获取下载量信息
export function queryDownloads(data) {
  return request({
    url: '/downloadsData',
    method: 'get'
  })
}

// 修改下载量信息
export function updateDownloads(data) {
  return request({
    url: '/hbase/updateByKeyValue',
    method: 'post',
    data: {
      table: 'downloads',
      condition: {
        userId: data.userId
      },
      thisMonth: data.thisMonth,
      lastMonth: data.lastMonth
    }
  })
}
