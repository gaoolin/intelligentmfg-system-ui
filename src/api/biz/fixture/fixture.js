import request from '@/utils/request'

// 查询治具列表
export function listFixture(query) {
  return request({
    url: '/fixture/search/list',
    method: 'get',
    params: query
  })
}

// 查询治具详细
export function getFixture(id) {
  return request({
    url: '/fixture/search/' + id,
    method: 'get'
  })
}

// 新增治具
export function addFixture(data) {
  return request({
    url: '/fixture/search/',
    method: 'post',
    data: data
  })
}

// 修改治具
export function updateFixture(data) {
  return request({
    url: '/fixture/search/',
    method: 'put',
    data: data
  })
}

// 删除治具
export function delFixture(label) {
  return request({
    url: '/fixture/search/' + label,
    method: 'delete',
  })
}

// 远程获取治具类型
export function fixtureCategoryList(query) {
  return request({
    url: '/fixture/category',
    method: 'get',
    params: query
  })
}

// 新增治具类型
export function addFixtureCategory(data) {
  return request({
    url: '/fixture/category',
    method: 'post',
    data: data
  })
}

// 修改治具类型
export function updateFixtureCategory(data) {
  return request({
    url: '/fixture/category',
    method: 'put',
    data: data
  })
}

// 删除治具类型
export function deleteFixtureCategory(id) {
  return request({
    url: '/fixture/category/' + id,
    method: 'delete'
  })
}

// 查询权限拥有的类别
export function getDeptIds() {
  return request({
    url: '/fixture/search/deptIds',
    method: 'get'
  })
}

// 查询所有料号
export function getFixtureMaterialIds(deptId) {
  return request({
    url: '/fixture/materialInfo/' + deptId,
    method: 'get'
  })
}

// 查询料号是否存在
export function materialIdRules(query) {
  return request({
    url: '/fixture/materialInfo/exist',
    method: 'get',
    params: query
  })
}

// 获取环形图数据
export function getFixturePanelData() {
  return request({
    url: '/fixture/statistics/panel',
    method: 'get'
  })
}

// 获取线性趋势图数据
export function getFixtureTrendingLineData() {
  return request({
    url: '/fixture/statistics/line',
    method: 'get'
  })
}
