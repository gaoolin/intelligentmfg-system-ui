import request from '@/utils/request'

// 查询pogopin治具共享列表
export function listPogopin(query) {
  return request({
    url: '/biz/fixture/manage/pogopin/list',
    method: 'get',
    params: query
  })
}

// 查询pogopin治具共享详细
export function getPogopin(id) {
  return request({
    url: '/biz/fixture/manage/pogopin/' + id,
    method: 'get'
  })
}

// 新增pogopin治具共享
export function addPogopin(data) {
  return request({
    url: '/biz/fixture/manage/pogopin',
    method: 'post',
    data: data
  })
}

// 修改pogopin治具共享
export function updatePogopin(data) {
  return request({
    url: '/biz/fixture/manage/pogopin',
    method: 'put',
    data: data
  })
}

// 删除pogopin治具共享
export function delPogopin(id) {
  return request({
    url: '/biz/fixture/manage/pogopin/' + id,
    method: 'delete'
  })
}
