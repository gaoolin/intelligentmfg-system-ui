import request from '../../../utils/request'

// 查询金线用量列表
export function listWire(query) {
  return request({
    url: '/biz/wire/list',
    method: 'get',
    params: query
  })
}

// 查询金线用量详细
export function getWire(partSpec) {
  return request({
    url: '/biz/wire/' + partSpec,
    method: 'get'
  })
}

// 新增金线用量
export function addWire(data) {
  return request({
    url: '/biz/wire',
    method: 'post',
    data: data
  })
}

// 修改金线用量
export function updateWire(data) {
  return request({
    url: '/biz/wire',
    method: 'put',
    data: data
  })
}

// 删除金线用量
export function delWire(partSpec) {
  return request({
    url: '/biz/wire/' + partSpec,
    method: 'delete'
  })
}
