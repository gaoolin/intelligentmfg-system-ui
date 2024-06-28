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

export function getParamsStdModels(query) {
  return request({
    url: '/aa/params/model/list',
    method: 'get',
    params: query
  })
}

export function updateParamsStdModel(data) {
  return request({
    url: '/aa/params/model/update',
    method: 'post',
    data
  })
}


