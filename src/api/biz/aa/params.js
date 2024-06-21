import request from '@/utils/request'

export function listHistoryCheckStatus(query) {
  return request({
    url: '/aa/params/history/status/list',
    method: 'get',
    params: query
  })
}

export function listLatestCheckStatus(query) {
  return request({
    url: '/aa/params/latest/status/list',
    method: 'get',
    params: query
  })
}

export function getFactoryNames() {
  return request({
    url: '/aa/params/latest/status/factoryNames',
    method: 'get'
  })
}

export function getGroupNames(query) {
  return request({
    url: '/aa/params/latest/status/groupNames',
    method: 'get',
    params: query
  })
}

