import request from '@/utils/request'

// 查询qcp参数
export function listQcpParams(query) {
  return request({
    url: '/qcp/params/list',
    method: 'get',
    params: query
  })
}

// 查询qcp无参数模版明细
export function listQcpParamsIsNull(query) {
  return request({
    url: '/qcp/params/isnull',
    method: 'get',
    params: query
  })
}
