<template>
  <el-tooltip class="item" effect="dark" :content="tooltip" placement="top">
    <span>{{ label }}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'HeaderWithTooltip',
  props: {
    label: String,
    tooltip: String,
  }
}
</script>
