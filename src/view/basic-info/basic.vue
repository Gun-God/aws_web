<template>
  <div>
    <Tabs value="name1">
      <TabPane label="检测站信息" name="name1">
        <orgPage ></orgPage>
      </TabPane>
    

      <TabPane label="设备信息" name="name2">
        <scanPage ></scanPage>
      </TabPane>

    
    </Tabs>
  </div>
</template>
<script>

import orgPage from './org.vue'
import scanPage from './scan.vue'


export default {
  name: 'information_page',
  components: {
    orgPage,
    scanPage
  },
  data() {
    return{
      tableHeight: 0,
    }
  },
  mounted() {
    //this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80
  },
};
</script>