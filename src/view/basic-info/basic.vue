<style lang="less">
    // 很奇怪 模态框只能写内联样式 可能是因为less版本问题
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

    .ivu-radio{
      font-size: 2vh !important;
    }

     .ivu-modal{
        top: -5vh;
        width: 40vw !important;
        // height: 90vh !important;
      
    }

    .ivu-modal-header-inner{
      height: 40px;
      height: 40px;
      font-size: 21px;
      line-height: 40px;
    }

    .ivu-form .ivu-form-item-label
    {
        font-size: 2vh !important;
    }

    .ivu-input{
      height: 4vh;
      font-size: 2vh;
    }

     .ivu-radio-warpper{
      font-size: 2vh !important;
  
     }

    .xuanxiang{
      font-size: 2vh !important;
    }

    .anniu{
      font-size: 2vh !important;
      letter-spacing: 1px;
      font-weight: bold;
    }

    .ivu-button span{
      font-size: 2vh !important;
    }

    .ivu-select-single .ivu-select-input{
            font-size: 2vh !important;

    }

    .ivu-select-item{
      font-size: 2vh !important;
    }

    }

</style>

<template>
  <div class="basic-div">
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
import './basic.less'
import orgPage from './org.vue'
import scanPage from './scan.vue'

export default {
  name: 'information_page',
  components: {
    orgPage,
    scanPage
  },
  data() {
    return {
      tableHeight: 0,
    }
  },
  mounted() {
    // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80
  },
};
</script>