<template>
  <div :class="className" :style="{height:height, width:width}" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from '../../../dashboard/mixins/resize'

export default {
  name: 'FixtureTrendingBar'
}
</script>

<style scoped>

</style>
