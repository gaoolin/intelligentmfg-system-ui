import request from '@/utils/request'

// 查询智慧打线图列表
export function listComparison(query) {
  return request({
    url: '/wbcomparison/info/list',
    method: 'get',
    params: query
  })
}

// 查询智慧打线图详细
export function getComparison(sid) {
  return request({
    url: '/wbcomparison/info/' + sid,
    method: 'get'
  })
}

// 新增智慧打线图
export function addComparison(data) {
  return request({
    url: '/wbcomparison/info',
    method: 'post',
    data: data
  })
}

// 修改智慧打线图
export function updateComparison(data) {
  return request({
    url: '/wbcomparison/info',
    method: 'put',
    data: data
  })
}

// 删除智慧打线图
export function delComparison(sid) {
  return request({
    url: '/wbcomparison/info/' + sid,
    method: 'delete'
  })
}
