import request from '@/utils/request'

export function listHistory(query) {
  return request({
    url: '/biz/fixture/history/list',
    method: 'get',
    params: query
  })
}

export function getHistory(id) {
  return request({
    url: '/biz/fixture/history' + id,
    method: 'get'
  })
}

export function addHistory(data) {
  return request({
    url: '/biz/fixture/history',
    method: 'post',
    data: data
  })
}

export function updateHistory(data) {
  return request({
    url: '/biz/fixture/history',
    method: 'put',
    data: data
  })
}

export function delHistory(id) {
  return request({
    url: 'biz/fixture/history' + id,
    method: 'delete'
  })
}
