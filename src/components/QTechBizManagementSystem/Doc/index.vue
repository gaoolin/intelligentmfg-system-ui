<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'QTechBizManagementSystemDoc',
  data() {
    return {
      url: 'http://qtech.com'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
