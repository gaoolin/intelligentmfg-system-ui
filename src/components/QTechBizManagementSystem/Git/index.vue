<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'QTechBizManagementSystemGit',
  data() {
    return {
      url: 'https://qtech.com'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
