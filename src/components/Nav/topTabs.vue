<template>


    <div class="tabs-nav-wrap">
      <div class="tabs-header">
        <p class="tabs-header-content" :class="{isActive:list.check}" :style="{}"
          v-for="(list,index) in tabsList" ref="tabs" @click="changeTab(index)">{{list.label}}
        </p>
        <span class="tabs-nav-bar" :style="{transform: 'translateX('+translateX + 'px)',width:itemWith+'%'}" ref="tabsBar"></span>
      </div>

      <div class="tabs-item-wrap">
        <slot name="tab-content"></slot>
      </div>
    </div>
</template>

<script>


export default {
		props: {
			tabsList: {
				type:Array,
			}
		},
    name: "report",
    components: {
        
    },
    data(){
        return{

          translateX:0,
        }

    },
    created() {
       
    },
    watch: {
    },
    computed: {
      
      
      itemWith() {
        return 100/this.tabsList.length
      }
    },
    mounted(){





        // this.el_tabs__navoffsetHeight = this.$refs.el_tabs_wrap.offsetHeight
        // this.el_tabs__navsetHeight = this.$refs.el_tabs__nav.offsetHeight
        // this.el_tabs__nav_scrollsetHeight = this.$refs.el_tabs__nav_scroll.offsetHeight


      
      // this.$nextTick(()=>{


      //   if (this.$route.fullPath.indexOf('reportcangchu')>0) {
      //     this.change(1)
      //   } else if (this.$route.fullPath.indexOf('reportpinkong')>0) {
      //     this.change(2)
      //   } else if (this.$route.fullPath.indexOf('reportthree')>0) {
      //     this.change(0)
      //   } else if (this.$route.fullPath.indexOf('reportdataview')>0) {
      //     this.change(3)
      //   } else if (this.$route.fullPath.indexOf('reportwechat')>0) {
      //     this.change(4)
      //   }
        
      //     //

      // })



     

       
    },
    methods:{

      changeTab(index){
        let oldIndex = 0
        this.tabsList.forEach((list,index)=>{
          list.check?oldIndex = index:null
          list.check = false
        })
        this.tabsList[index].check = true
        this.translateX +=this.$refs.tabsBar.offsetWidth*(index-oldIndex);

        this.$emit('changeTabs',this.tabsList[index].value)
        //this.translateX +=this.$refs.tabs[index].offsetWidth*2*(index-oldIndex);
      },
    },
}
</script>

<style lang="less" scoped>
.tabs-nav-wrap {
  margin-top: 5px;
  height: 100%;
  width: 100%;

  .tabs-header {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-around;
    position:relative;

    .tabs-header-content {
      
      cursor: pointer;


    }

    .isActive {
      color: #409EFF;
    }
      .tabs-nav-bar {
        // width: 120px;
        height: 2px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        background-color: #409EFF;
        position: absolute;
        transition: 0.3s;
      }

    
  }

  .tabs-item-wrap {
    margin-top: 20px;
    height: calc(100% - 100px);
    // background-color:red;
  }
}
</style>
<!-- <style>
  .report-form .el-tabs--left .el-tabs__active-bar.is-left, .el-tabs--left .el-tabs__nav-wrap.is-left::after {
    right: 2px;
  }


  .report-form .el-tabs--left .el-tabs__nav-wrap.is-left::after, .el-tabs--left .el-tabs__nav-wrap.is-right::after, .el-tabs--right .el-tabs__nav-wrap.is-left::after, .el-tabs--right .el-tabs__nav-wrap.is-right::after {
    width: 0px;
  }
  .report-form .el-tabs__item {
    padding: 0 10px;
    /* height: 40px; */
    height: auto;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
    writing-mode: vertical-lr;
    font-size: 14px;
    word-wrap: break-word;
    letter-spacing: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
    margin-bottom: 14px;
    line-height: 19px;
  }
</style> -->

