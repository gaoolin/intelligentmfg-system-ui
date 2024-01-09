import request from '@/utils/request'

export function getWbComparisonIndexOverview(query) {
  return request({
    url: 'index/wbComparison/overview',
    method: 'get',
    params: query
  })
}

export function getWbComparisonIndexTrending(query) {
  return request({
    url: 'index/wbComparison/trending',
    method: 'get',
    params: query
    })
}


