import request from '@/utils/request'

// 查询标准模版明细列表
export function listDetail(query) {
  return request({
    url: '/wbcomparison/detail/list',
    method: 'get',
    params: query
  })
}

// 查询标准模版明细详细
export function getDetail(id) {
  return request({
    url: '/wbcomparison/detail/' + id,
    method: 'get'
  })
}

// 新增标准模版明细
export function addDetail(data) {
  return request({
    url: '/wbcomparison/detail',
    method: 'post',
    data: data
  })
}

// 修改标准模版明细
export function updateDetail(data) {
  return request({
    url: '/wbcomparison/detail',
    method: 'put',
    data: data
  })
}

// 删除标准模版明细
export function delDetail(id) {
  return request({
    url: '/wbcomparison/detail/' + id,
    method: 'delete'
  })
}
