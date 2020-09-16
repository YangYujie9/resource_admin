<template>
  <div class="resource">
    <rightNav>
      <div slot="left" class="left">

 
        <topTabs :tabsList="headList" @changeTabs="changeTabs">
          <div slot="tab-content">
            <div v-show="activeType == 'organizations'">
              <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
              <div class="tree-class">
                
                <basicTree :tree-data="orgData" :filterText="filterText" @selectnode="defaultSelectNode" @handleNodeClick="orgNodeClick"></basicTree>
              </div>
            </div>

            <div v-show="activeType == 'knowledge'">
              <top-popover>
                <div slot="reference" class="search-class">
                  <p v-if="filter.subject">{{filter.subject.value}}</p>
                  <p v-if="filter.oese && knowType == 'Chapter'">{{filter.oese.name}}</p>
                  <p v-if="filter.volume && knowType == 'Chapter'">{{filter.volume.name}}</p>
                </div>
                <div slot="popover">
                  <div>
                    <p>学段：</p>
                    <el-radio-group v-model="filter.learningSection" size="mini" @change="getSubject">
                      <el-radio-button v-for="list in sectionList" :label="list.key" :key="list.key">{{list.value}}</el-radio-button>
                    </el-radio-group>
                  </div>
                  <!-- <p>年级：</p>
                  <el-radio-group v-model="filter.grade" size="mini" @change="getPonitTree">
                    <el-radio-button v-for="list in gradesList" :label="list" :key="list.key">{{list.value}}</el-radio-button>
                  </el-radio-group> -->
                  <div>
                    <p>科目：</p>
                    <el-radio-group v-model="filter.subject" size="mini" @change="getVersionList">
                      <el-radio-button :label="item" :key="item.key" v-for="item in subjectsList">{{item.value}}</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div v-show="knowType == 'Chapter'">
                    <p>教材版本：</p>
                    <el-radio-group v-model="filter.oese" size="mini" @change="getvolumeList">
                      <el-radio-button :label="item" :key="item.oeseId" v-for="item in versionList">{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div v-show="knowType == 'Chapter'">
                    <p>册别：</p>
                    <el-radio-group v-model="filter.volume" size="mini" @change="getPonitTree">
                      <el-radio-button :label="item" :key="item.oeseId" v-for="item in volumeList">{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </div>

                </div>
              </top-popover>
              <div class="search-wrap">
                <el-radio-group v-model="knowType" size="mini" @change="getPonitTree">
                  <el-radio-button label="Chapter">章节目录</el-radio-button>
                  <el-radio-button label="Knowledge">知识点</el-radio-button>
                </el-radio-group>
              </div>
              <div class="tree-class point-tree">
                <pointTree :tree-data="pointData" @handleNodeClick="pointNodeClick" @selectnode="defaultPointNode"></pointTree>
              </div>
            </div>
          </div>
        </topTabs>



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
                <el-table-column label="文件名" prop="name" sortable> </el-table-column>
    <!--             <el-table-column prop="resourceName" sortable label="栏目"> </el-table-column>  -->
                <el-table-column prop="resourceName" label="类型" > </el-table-column>
                <el-table-column prop="userName" label="上传人"> </el-table-column>
                <el-table-column prop="createTime" label="上传时间"> </el-table-column>
                <el-table-column prop="openStateName" label="公开状态"> </el-table-column>
                <el-table-column prop="applyName" label="审核状态" sortable> </el-table-column>

              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.openState!='Privately'" style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">

                    <!-- <el-button type="text">详情</el-button> -->
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
            <div>
              <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
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

<!--         <el-dialog
          title="添加学科"
          :visible.sync="dialogVisible"
          :close-on-click-modal='false'
          width="500px">
          <div>
            <div class="input-wrap"><p class="label-class"><span class="require-class">*</span>所属学段：</p>
              <el-input v-model="subject.learningSection" placeholder="请输入内容" class="input-class" size="small"></el-input>
            </div>
            <div class="input-wrap"><p class="label-class"><span class="require-class">*</span>学科名称：</p>
              <el-input v-model="subject.subjectName" placeholder="请输入内容" class="input-class" size="small"></el-input>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
          </span>
        </el-dialog> -->
      </div>
    </rightNav>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import topTabs from '@/components/Nav/topTabs'
  import basicTree from '@/components/Tree/basicTree'
  import pointTree from '@/components/Tree/pointTree'
  import topPopover from "@/components/Popover/topPopover";
export default {

  data() {

    return {
      activeType:'organizations',
      orgData: [],
      filterText:'',
      filter: {
        gradeId:'',
        subjectId:'',
        learningSection:'',
        oese:'',
        volume:'',
      },
      headList: [{
          label:'组织架构',
          value:'organizations',
          check:true
        },{
          label:'章节知识',
          value:'knowledge',
          check:false
        }
      ],
      sectionList:[],
      gradesList:[],
      subjectsList:[],
      versionList:[],
      pointData:[],
      knowType:"Chapter",
      current: {
        gradeName:'',
        subjectName:''
      },
      search: {
        type:'',
        openState:'',
        applyState:'',
        time:'',
        page:1,
        size:10
      },
      total:0,
      checked:'',
      tableData:[],
      table_height:300,
      typeList:[],
      openList:[{'id':'Privately','name':'私有'},{'id':'SemiOvert','name':'学校共享'},{'id':'Open','name':'完全公开'}],
      statusLiist:[{'id':'Audit','name':'待审核'},{'id':'Grounding','name':'已上架'},
                  {'id':'Undercarriage','name':'已下架'},{'id':'Recommend','name':'已推荐'}],
      currentPoint:'',
      currentNode:'',
      schoolsName:'',
      volumeList:[],
    }
  },
  components: {
    rightNav,
    topTabs,
    basicTree,
    pointTree,
    topPopover
    
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

    this.getOrgTree()
    this.getlearningSection()
    this.getResourceType()



  },
  methods: {

    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {
          this.orgData = data.data
        }
      })

    },

    changeTabs(tab) {
      this.activeType = tab
      this.resetPage()
    },


    defaultSelectNode(node) {
      this.currentNode = node
      this.schoolsName = node.name
      this.getTableData()
    },

    orgNodeClick(data) {
      this.currentNode = data
      this.schoolsName = data.name
      this.resetPage()
    },

    defaultPointNode(node) {
      this.currentPoint = node

      if(node.memberType == this.knowType) {
        this.getTableData()
      }
      
    },

    pointNodeClick(data) {
      this.currentPoint = data
      this.resetPage()
    },

    getlearningSection() {

      this.$http.get(`/api/internal/dictionaries/learningSection`)
      .then((data)=>{
        if(data.status == '200') {

          this.sectionList = data.data
          this.filter.learningSection =   this.sectionList[0].key
          this.getSubject()
          
        }
          
      })

    },


    // getGrades() {

    //   this.$http.get(`/api/open/common/grades?learningSection=${this.filter.learningSection}`)
    //   .then((data)=>{
    //     if(data.status == '200') {

    //       this.gradesList = data.data
    //       this.filter.grade = this.gradesList[0]
    //       this.getSubject()
    //     }
    //   })

    // },

    getSubject() {

      this.$http.get(`/api/open/common/subjects?learningSection=${this.filter.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {
          this.subjectsList = data.data
          this.filter.subject = this.subjectsList[0]
          
          this.getVersionList()
        }    
      })

    },

    getVersionList() {
      this.versionList = []
      this.$http.get(`/api/open/common/oeses/${this.filter.learningSection}/${this.filter.subject.key}`)
      .then((data)=>{
        if(data.status == '200') {
          this.versionList = data.data
          this.filter.oese = this.versionList[0]

          if(!this.filter.oese) {
            this.pointData = []
            this.volumeList = []
            this.filter.volume = ''
          }else {
            this.getvolumeList()
          }
        }    
      })
    },
    getvolumeList() {
      this.volumeList = []
      this.$http.get(`/api/open/common/oeseList/${this.filter.oese.oeseId}`)
      .then((data)=>{
        if(data.status == '200') {
          this.volumeList = data.data
          this.filter.volume = this.volumeList[0]
          if(!this.filter.volume) {
            this.pointData = []
          }else {
            this.getPonitTree()
          }
          
        }    
      })
    },
    getResourceType() {

      this.$http.get(`/api/open/common/getResourceType`)
      .then((data)=>{
        if(data.status == '200') {
          this.typeList = data.data;
          }  
        })

    },

    getPonitTree() {

      this.pointData = []
      if(this.knowType == "Chapter") {

        this.$http.get(`/api/internal/chapter/chapterTree/${this.filter.volume.oeseId}`)
        .then((data)=>{
          if(data.status == '200') {
            this.pointData = data.data
            // this.resetPage()
          }    
        })
      
      }else {
        this.$http.get(`/api/internal/knowledge/knowledgeTree?learningSection=${this.filter.learningSection}&subjectCode=${this.filter.subject.key}`)
        .then((data)=>{
          if(data.status == '200') {
            this.pointData = data.data
            // this.resetPage()
          }    
        })

      }

    },

    toggleSelection() {

      // this.$refs.multipleTable.toggleAllSelection()
        if (this.checked) {
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
      this.resetPage()
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

    getTableData() {

      // if(!this.currentNode && !this.currentPoint && !this.filter.subject) {
      //   setTimeout(this.getTableData(),1000)
      // } 


      this.tableData = []
      this.checked = false
      let params = {
        schoolId: this.currentNode.id,

        resourceType: this.search.type,
        chapterId: this.currentPoint.id,
        knowledgeId: this.currentPoint.id,
        openState: this.search.openState,
        applyState: this.search.applyState,
        startTime:this.search.time? this.search.time[0]:'',
        endTime: this.search.time?this.search.time[1]:'',
        page: this.search.page - 1,
        size: this.search.size,
      }

      if(this.activeType == 'organizations') {
        params.chapterId = ''
        params.knowledgeId = ''

      }else if(this.activeType == 'knowledge') {
        params.schoolId = ''

        if(this.knowType == "Chapter") {
          params.knowledgeId = ''
        }else {
          params.chapterId = ''
        }
      }
    
      this.$http.get(`/api/internal/resources/resourceList`,params)
      .then((data)=>{
        if(data.status == '200') {

          this.tableData = data.data.content
          this.total = data.data.totalElements
          this.search.page = 1

        }   
      })

    },
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

  }
}
</script>
<style lang="less">
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

    .search-class {
      display: flex;
      height: 36px;
      line-height: 36px;
      color: #409EFF;
      justify-content: space-around;
      cursor: pointer;
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
