<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'QTechDosageControlGit',
  data() {
    return {
      url: 'https://gitee.com/y_project/qtech-dosage-control-Vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
