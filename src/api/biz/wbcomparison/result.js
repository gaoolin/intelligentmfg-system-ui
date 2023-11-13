import request from '@/utils/request'

export function listEqInfo(query) {
  return request({
    url: 'wbcomparison/result/list/eqInfo',
    method: 'get',
    params: query
  })
}

export function listWbComparison(query) {
  return request({
    url: 'wbcomparison/result/list/wbComparison',
    method: 'get',
    params: query
  })
}
