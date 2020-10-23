<template>
  <div class="resource">
    <rightNav>
      <div slot="left" class="left">

      <collapsiblePonitTree @setActiveType="setActiveType" @orgNodeClick="orgNodeClick" @chapterNodeClick="chapterNodeClick" @knowNodeClick="knowNodeClick" @clearData="clearData" @getSubjectCode="getSubjectCode"></collapsiblePonitTree>




      </div>
      <div slot="right">
        <div class="right-header">
          <span>资源审核列表 </span>
          <span style="margin-left: 20px;" v-show="activeType == 'organizations'">{{schoolsName}}</span>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="类型">
                <el-select v-model="search.type"class="search-class" @change="resetPage" clearable placeholder="类型">
                  <el-option v-for="list in typeList" :label="list.name" :value="list.id" :key="list.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公开">
                <el-select v-model="search.openState" placeholder="公开" class="search-class" @change="resetPage" clearable>
                  <el-option v-for="list in openList" :label="list.name" :value="list.id" :key="list.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.applyState" placeholder="状态" class="search-class" @change="resetPage" clearable>
                  <el-option v-for="list in statusLiist" :label="list.name" :value="list.id" :key="list.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传时间">
                <el-date-picker
                  v-model="search.time"
                  @change="resetPage"
                  style="width: 220px;"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

            </el-form>
          </div>
          <div class="table-wrap" ref="table_warp">
            <el-table
              :data="tableData"
              :height="table_height"
              ref="multipleTable"
              :cell-style="tableCellStyle"
              border>
                <el-table-column type="selection"> </el-table-column>
                <el-table-column label="文件名" prop="name" sortable :show-overflow-tooltip="true"> 
                  <template slot-scope="scope">
                    <div style="cursor: pointer;" @click="resourcePreview(scope.row.resourceId)">
                      {{scope.row.name}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="resourceName" label="类型" > </el-table-column>
                <el-table-column prop="userName" label="上传人"> </el-table-column>
                <el-table-column prop="createTime" label="上传时间"> </el-table-column>
                <el-table-column prop="openStateName" label="公开状态"> </el-table-column>
                <el-table-column prop="applyName" label="审核状态" sortable> </el-table-column>

              <el-table-column
                prop=""
                width="200"
                label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.openState!='Privately'" style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">

                    <el-button type="text" @click="resourcePreview(scope.row.resourceId)">详情</el-button>
                    <el-button type="text" @click="deleteResource(scope.row)">删除</el-button>

                    <el-button type="text" @click="resourceStateChange(scope.row,'Grounding','')" v-if="scope.row.applyState=='Undercarriage'||scope.row.applyState=='Audit'" >上架</el-button>

                    <el-button type="text" @click="resourceStateChange(scope.row,'Undercarriage','')" v-else>下架</el-button>
                    
                    <el-button type="text" @click="resourceStateChange(scope.row,'Recommend','on')" v-if="scope.row.applyState=='Grounding'" >推荐</el-button>

                    <el-button type="text" @click="resourceStateChange(scope.row,'Recommend','cancel')" v-if="scope.row.applyState=='Recommend'">取消推荐</el-button>

                    <el-button type="text" @click="resourceStateChange(scope.row,'Reject','')" v-if="scope.row.applyState=='Audit'">打回</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <div class="pagination">
            <div  style="flex-shrink: 0">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
       <!--        /*/*<el-button type="text" @click="deleteResource()" >删除</el-button>*/*/ -->
              <el-button type="text" @click="deleteResource()" style="margin-left: 20px;">删除</el-button>
              <el-button type="text" @click="resourceStateChange('','Grounding','')">上架</el-button>
              <el-button type="text" @click="resourceStateChange('','Undercarriage','')">下架</el-button>
              <el-button type="text" @click="resourceStateChange('','Recommend','on')">推荐</el-button>
              <el-button type="text" @click="resourceStateChange('','Recommend','cancel')">取消推荐</el-button>
              <el-button type="text" @click="resourceStateChange('','Reject','')">打回</el-button>
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="search.page"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="search.size"
              layout="total, prev, pager, next, sizes , jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>


      </div>
    </rightNav>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  // import topTabs from '@/components/Nav/topTabs'
  // import basicTree from '@/components/Tree/basicTree'
  // import pointTree from '@/components/Tree/pointTree'
  import collapsiblePonitTree from '@/components/Nav/collapsiblePonitTree'
  import { debounce } from '@/utils/public.js'
  // import topPopover from "@/components/Popover/topPopover";
export default {

  data() {

    return {
      activeType:'',
      knowType:'',
      isIndeterminate: false,

      sectionList:[],
      gradesList:[],
      subjectsList:[],
      versionList:[],
      pointData:[],
      
      current: {
        gradeName:'',
        subjectName:''
      },
      search: {
        type:'',
        subjectCode:'',
        openState:'',
        applyState:'',
        time:'',
        page:1,
        size:10
      },
      total:0,
      checkAll:'',
      tableData:[],
      table_height:300,
      typeList:[],
      openList:[{'id':'Privately','name':'私有'},{'id':'SemiOvert','name':'学校共享'},{'id':'Open','name':'完全公开'}],
      statusLiist:[{'id':'Audit','name':'待审核'},{'id':'Grounding','name':'已上架'},
                  {'id':'Undercarriage','name':'已下架'},{'id':'Recommend','name':'已推荐'}],
      currentChapter:'',
      currentKnowledge:'',
      currentNode:'',
      schoolsName:'',
      volumeList:[],
    }
  },
  components: {
    rightNav,
    // topTabs,
    // basicTree,
    // pointTree,
    // topPopover,
    collapsiblePonitTree
    
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40
      // 
    })

    // this.getOrgTree()
    // this.getlearningSection()
    this.getResourceType()

      
    window.onresize = () => {
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40
    }


  },

  destroyed(){
    window.onresize = null;
  },
  methods: {

    setActiveType(type1,type2) {

      if(this.activeType != type1) {
        this.activeType = type1
        this.resetPage()
      }
      if(this.knowType != type2) {
        this.knowType = type2
        this.getSubjectCode()
      }
      

      // 
    },
    clearData() {

      this.tableData = []
    },

    orgNodeClick(data) {
      this.currentNode = data
      this.schoolsName = data.name
      this.resetPage()
    },



    chapterNodeClick(data) {
      // console.log(data,888)
      this.currentChapter = data
      this.currentChapter && this.activeType == 'knowledge' && this.knowType == 'chapter'?this.resetPage():null
    },


    knowNodeClick(data) {
      this.currentKnowledge = data
      this.currentKnowledge && this.activeType == 'knowledge' && this.knowType == 'knowledge'?this.resetPage():null
    },



    getResourceType() {

      this.$http.get(`/api/open/common/getResourceType`)
      .then((data)=>{
        if(data.status == '200') {
          this.typeList = data.data;
          }  
        })

    },
    getSubjectCode(learningSection,code) {

      if(this.search.subjectCode != code) {
        // this.learningSection = learningSection
        this.search.subjectCode = code
        this.getTableData()   
      }

    },


    handleSelectionChange(rows) {
        let checkedCount = rows.length;
        this.checkAll = checkedCount === this.tableData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
    },

    handleCheckAllChange() {

      // this.$refs.multipleTable.toggleAllSelection()
        if (this.checkAll) {
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }

    },

    // 分页
    handleSizeChange(val) {
      this.search.size = val
      // console.log(`每页 ${val} 条`);
      this.resetPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.search.page = val
      // console.log(`当前页: ${val}`);
      this.getTableData()
    },

    tableCellStyle({row, column, rowIndex, columnIndex}) {
      if(columnIndex == 6) {
        if(row.applyState == "Grounding") {
          return {'background': "#00b0f0"}
        }else if(row.applyState == "Undercarriage") {
          return {'background': "#ff0000"}
        }else if(row.applyState == "Recommend") {
          return {'background': "#92d050"}
        }else if(row.applyState == "Audit") {
          return {'background': "#ffff00"}
        }
      }
    },
    resetPage() {
      this.search.page = 1
      this.getTableData()
    },

    getTableData: debounce(function() {

      if(!this.currentNode && (!this.currentChapter || !this.currentKnowledge)) {
        return false
      } 


      this.tableData = []
      this.checkAll = false
      let params = {
        schoolId: this.currentNode.id,

        resourceType: this.search.type,
        subject: this.activeType == 'knowledge'? this.search.subjectCode:'',
        chapterId: this.currentChapter.id,
        knowledgeId: this.currentKnowledge.id,
        openState: this.search.openState,
        applyState: this.search.applyState,
        startTime:this.search.time? this.search.time[0]:'',
        endTime: this.search.time?this.search.time[1]:'',
        page: this.search.page - 1,
        size: this.search.size,
      }

      // console.log(params)

      if(this.activeType == 'organizations') {
        params.chapterId = ''
        params.knowledgeId = ''

      }else if(this.activeType == 'knowledge') {
        params.schoolId = ''

        if(this.knowType == "chapter") {
          params.knowledgeId = ''
        }else {
          params.chapterId = ''
        }
      }

    
      this.$http.get(`/api/internal/resources`,params)
      .then((data)=>{
        if(data.status == '200') {

          this.tableData = data.data.content
          this.total = data.data.totalElements
          // this.search.page = 1
          this.checkAll = false

        }   
      })

    }),
    //删除
    deleteResource(row) {
      this.$confirm('确认删除资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(row) {
          this.$http.delete(`/api/internal/resources/${row.resourceId}`)
          .then((data)=>{
            if(data.status == '200') {
              this.getTableData()
              this.$message({
                  message: "删除成功",
                  type:'success'
              })
            }   
          })
    
        }else {

          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])

          this.$http.delete(`/api/internal/resources/batchDelete`,{},ids)
          .then((data)=>{
            if(data.status == '200') {
              this.getTableData()
              this.$message({
                  message: "删除成功",
                  type:'success'
              })
            }  
          })

        }
      })
        
    },  

    //资源状态更新:上架、下架、拒绝、推荐、取消推荐
    resourceStateChange(row,applyState,recommend) {
      recommend = recommend ? recommend : '';
      if(row) {
          this.$http.put(`/api/internal/resources/status/${row.resourceId}?applyState=${applyState}&recommend=${recommend}`)
            .then((data)=>{
              if(data.status == '200') {
                this.getTableData()
                this.$message({
                    message: "更新成功",
                    type:'success'
                })
              }  
            })
    
      } else {
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
              prev.push(current.resourceId)
              return prev
            },[])

          this.$http.put(`/api/internal/resources/batch/status?applyState=${applyState}&recommend=${recommend}`,ids)
            .then((data)=>{
              if(data.status == '200') {
                this.getTableData()
                this.$message({
                    message: "更新成功",
                    type:'success'
                })
              } 
          })
      }
    },

    resourcePreview(resourceId) {
      this.$router.push({path: '/administrator/resourcePreview', query: {id:resourceId}})
    },

  }
}
</script>
<style lang="less">
.admini .content-wrap .content  {
  .left {
    display: block;
  }
}
.resource {
  .search-wrap {
    .el-radio-group {
      width: 100%;
      text-align: center;
    }
  }

}
</style>
<style lang="less" scoped>
.resource{
  height: 100%;

  .left {
    height: 100%;
    //padding-top: 10px;

    .tree-class {
      height: calc(100vh - 250px);
      overflow-y: auto;
      margin-top: 10px;
    }

    .point-tree {
      height: calc(100vh - 300px);
    }



    .search-wrap {
      margin-top: 10px;
    }

  }

  .wrap {

    height: calc(100vh - 200px);
    
    .search-class {
      width: 160px;
    }

  }
}
</style>
