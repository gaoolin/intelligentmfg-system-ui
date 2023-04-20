<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'QTechDosageControlDoc',
  data() {
    return {
      url: 'http://doc.qtech-dosage-control.vip/qtech-dosage-control-vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
