<template>
  <div class="dashboard-editor-container">
    <fixture-panel v-if="flag" :fixture-panel-data="fixturePanelData"/>

<!--    <fixture-trending-bar :fixtureTrendingBarData="fixtureTrendingBarData"/>-->
  </div>
</template>

<script>
import FixturePanel from './FixturePanel'
import FixtureTrendingBar from './FixtureTrendingBar'
import { getFixturePanelData } from '@/api/biz/fixture/fixture'

export default {
  name: 'index',
  components: { FixturePanel, FixtureTrendingBar },
  data() {
    return {
      fixturePanelData: [],
      fixtureTrendingBarData: [],
      flag: false
    }
  },
  methods: {
    getFixturePanelData() {
      getFixturePanelData().then(response => {
        let o3
        let o2
        let o1
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].deptId === 209) {
            o1 = {}
            o2 = {}
            o3 = {}
            o3.tips = response.data[i].ttlProdTypeCnt;
            o2.name = '共享治具';
            o2.value = response.data[i].sharedFixtureCnt;
            o1.name = '未共享治具';
            o1.value  = response.data[i].unSharedFixtureCnt
            let tmp1 = [o1, o2, o3]
            this.fixturePanelData.push(tmp1)
          } else if (response.data[i].deptId === 210) {
            o1 = {}
            o2 = {}
            o3 = {}
            o3.tips = response.data[i].ttlProdTypeCnt;
            o2.name = '共享治具';
            o2.value = response.data[i].sharedFixtureCnt;
            o1.name = '未共享治具';
            o1.value  = response.data[i].unSharedFixtureCnt
            let tmp2 = [o1, o2, o3]
            this.fixturePanelData.push(tmp2)
          } else if (response.data[i].deptId === 211) {
            o1 = {}
            o2 = {}
            o3 = {}
            o3.tips = response.data[i].ttlProdTypeCnt;
            o2.name = '共享治具';
            o2.value = response.data[i].sharedFixtureCnt;
            o1.name = '未共享治具';
            o1.value  = response.data[i].unSharedFixtureCnt
            let tmp3 = [o1, o2, o3]
            this.fixturePanelData.push(tmp3)
          }
        }
        console.log(this.fixturePanelData)
        console.log(this.fixturePanelData[0])
        console.log(this.fixturePanelData[0][0])
        console.log(this.fixturePanelData[0][2]["tips"])
        this.flag = true;
      })
    }
  },
  created() {
      this.getFixturePanelData();
  }
}
</script>

<style scoped>

</style>
