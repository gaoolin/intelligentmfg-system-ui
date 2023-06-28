import request from '@/utils/request'

export function listHistory(query) {
  return request({
    url: '/biz/fixture/manage/history/list',
    method: 'get',
    params: query
  })
}

export function getHistory(id) {
  return request({
    url: '/biz/fixture/manage/history' + id,
    method: 'get'
  })
}

export function addHistory(data) {
  return request({
    url: '/biz/fixture/manage/history',
    method: 'post',
    data: data
  })
}

export function updateHistory(data) {
  return request({
    url: '/biz/fixture/manage/history',
    method: 'put',
    data: data
  })
}

export function delHistory(id) {
  return request({
    url: 'biz/fixture/manage/history' + id,
    method: 'delete'
  })
}
