import request from '@/utils/request'

// 查询pogopin治具列表
export function listPogopin(query) {
  return request({
    url: '/biz/fixture/manage/pogopin/list',
    method: 'get',
    params: query
  })
}

// 查询pogopin治具详细
export function getPogopin(id) {
  return request({
    url: '/biz/fixture/manage/pogopin/' + id,
    method: 'get'
  })
}

// 新增pogopin治具
export function addPogopin(data) {
  return request({
    url: '/biz/fixture/manage/pogopin',
    method: 'post',
    data: data
  })
}

// 修改pogopin治具
export function updatePogopin(data) {
  return request({
    url: '/biz/fixture/manage/pogopin',
    method: 'put',
    data: data
  })
}

// 删除pogopin治具
export function delPogopin(id) {
  return request({
    url: '/biz/fixture/manage/pogopin/' + id,
    method: 'delete'
  })
}
