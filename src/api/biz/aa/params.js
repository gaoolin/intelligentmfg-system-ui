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

export function getAaParamsStdModels(query) {
  return request({
    url: '/aa/params/model/detail/list',
    method: 'get',
    params: query
  })
}

export function updateAaParamsStdModel(data) {
  return request({
    url: '/aa/params/model/detail/edit',
    method: 'post',
    data
  })
}

export function updateAaParamsModelInfoStatus(data) {
  return request({
    url: '/aa/params/model/info/edit',
    method: 'post',
    data
  })
}

export function getAaParamsModelInfo(query) {
  return request({
    url: '/aa/params/model/info/list',
    method: 'get',
    params: query
  })
}

export function updateAaParamsModelInfo(data) {
  return request({
    url: '/aa/params/model/info/edit',
    method: 'post',
    data
  })
}

export function deleteAaParamsModelInfo(id) {
  return request({
    url: '/aa/params/model/info/remove/' + id,
    method: 'delete'
  })
}

export function uploadAaParamsModel(data) {
  return request({
    url: '/aa/params/model/upload/online',
    method: 'post',
    data
  })
}

export function getAaParamsParsed(query) {
  return request({
    url: '/aa/params/parsed/detail/list',
    method: 'get',
    params: query
  })
}

export function addAaParamsModel(data) {
  return request({
    url: '/aa/params/model/detail/add',
    method: 'post',
    data
  })
}

export function fetchFactoryName() {
  return request({
    url: '/aa/params/common/factoryName',
    method: 'get'
  })
}

export function fetchWorkshopName(query) {
  return request({
    url: '/aa/params/common/workshopName',
    method: 'get',
    params: query
  })
}


export function listAaEquipmentInfo(query) {
  return request({
    url: '/aa/params/eq/list',
    method: 'get',
    params: query
  })
}

export function updateAaEqReverseStat(data) {
  return request({
    url: '/aa/params/eq/ignore',
    method: 'post',
    data
  })
}

export function getFactoryNames() {
  return request({
    url: '/aa/params/common/factoryNames',
    method: 'get'
  })
}

export function getGroupNames(query) {
  return request({
    url: '/aa/params/common/workshopNames',
    method: 'get',
    params: query
  })
}
