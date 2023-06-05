import request from "@/utils/request"

// 获取工厂名
export function factoryNameList() {
  return request({
    url: '/biz/factoryName',
    method: 'get'
  })
}

// 根据工厂名获取区名
export function workshopNameList(query) {
  return request({
    url: '/biz/workshopName',
    method: 'get',
    params: query
  })
}
