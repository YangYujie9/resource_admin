<template>
  <div class="system">
    <rightNav>
      <div slot="left" class="right-one-part">
        <p class="right-header">日志查看 </p>
        <div class="meau-wrap">
          <ul>
            <li v-for="list in meauList" :class="{activemeau:list.check}" @click="changeType(list)">{{list.label}}</li>
          </ul>
        </div>
      </div>

      <div slot="right">
        <p class="right-header">{{title}} </p>

        <div class="wrap" ref="wrap">

          <div v-show="title=='第三方服务同步日志'">
          
            <div class="search-wrap" ref="search_wrap1">
              <el-form :inline="true" :model="thirdSearch" class="demo-form-inline" size="mini">
                <el-form-item label="第三方服务">
                  <el-select v-model="thirdSearch.thirdPartyServerId"class="search-class" @change="resetPage" clearable placeholder="第三方服务">
                    <el-option v-for="list in thirdServerList" :label="list.serverName" :value="list.thirdPartyServerId.id" :key="list.thirdPartyServerId.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据模块">
                  <el-select v-model="thirdSearch.dataModule"class="search-class" @change="resetPage" clearable placeholder="数据模块">
                    <el-option v-for="list in thirdModuleList" :label="list" :value="list" :key="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="业务操作">
                  <el-select v-model="thirdSearch.businessType" placeholder="业务操作" class="search-class" @change="resetPage" clearable>
                    <el-option v-for="list in businessTypeList" :label="list" :value="list" :key="list"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="thirdSearch.status" placeholder="状态" class="search-class" @change="resetPage" clearable>
                    <el-option v-for="list in thirdStatusList" :label="list.name" :value="list.id" :key="list.id"></el-option>
                  </el-select>
                </el-form-item>

              </el-form>
            </div>

            <div class="table-warp" ref="table_warp">
              <el-table
                :data="thirdTableData"
                style="width: 100%"
                :height="table_height1"
                border>
                <el-table-column label="标题" prop="title"> </el-table-column>
                <el-table-column label="数据模块" prop="dataModule"> </el-table-column>
                <el-table-column label="业务操作" prop="businessType"> </el-table-column>
                <el-table-column label="状态" prop="statusName"> </el-table-column>
                <el-table-column label="提示信息" prop="message" > </el-table-column>
                <el-table-column
                  prop=""
                  label="操作"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span style="cursor: pointer">
                      <i class="iconfont iconbianji iconclass" style="margin-right: 20px;" @click="editTypeDialog(scope.row)"></i>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination">   
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="thirdSearch.page"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="thirdSearch.size"
                layout="total, prev, pager, next, sizes , jumper"
                :total="thirdTotal">
              </el-pagination>
            </div>

          </div> 

          <div v-show="title=='文件转换记录'">

             <div class="search-wrap" ref="search_wrap2">
              <el-form :inline="true" :model="fileSearch" class="demo-form-inline" size="mini">
                <el-form-item label="名称">
                  <el-input  v-model="fileSearch.name"  class="search-class" @change="resetPage" clearable placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="文件类型">
                  <el-select v-model="fileSearch.fileType"class="search-class" @change="resetPage" clearable placeholder="文件类型">
                    <el-option v-for="list in fileTypeList" :label="list.value" :value="list.key" :key="list.key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="fileSearch.status"class="search-class" @change="resetPage" clearable placeholder="状态">
                    <el-option v-for="list in fileStatusList" :label="list.value" :value="list.key" :key="list.key"></el-option>
                  </el-select>
                </el-form-item>

              </el-form>
            </div>

            <div class="table-warp">
              <el-table
                :data="fileTableData"
                style="width: 100%"
                :height="table_height2"
                border>
                <el-table-column label="类型" prop="covertType"> </el-table-column>
                <el-table-column label="名称" prop="name"> </el-table-column>
                <el-table-column label="文件类型" prop="fileType"> </el-table-column>
                <el-table-column label="更新时间" prop="updateTime" > </el-table-column>
                <el-table-column label="状态" prop="statusName"> </el-table-column>
                <el-table-column label="提示信息" prop="resultMsg" > </el-table-column>
              </el-table>
            </div>
            <div class="pagination">   
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="fileSearch.page"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="fileSearch.size"
                layout="total, prev, pager, next, sizes , jumper"
                :total="fileTotal">
              </el-pagination>
            </div>

          </div>
        </div>

        <el-dialog title="服务日志详情" :visible.sync="thirdDialogVisible" width="450px" :close-on-click-modal='false'>
          <el-form :model="thirdForm" label-width="120px" size="small" disabled>
            
            <el-form-item label="标题" prop="title">
              <el-input v-model="thirdForm.title" class="input-class" ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="statusName">
              <el-input v-model="thirdForm.statusName" class="input-class" ></el-input>
            </el-form-item>

            <el-form-item label="提示信息" prop="message">
              <el-input
                type="textarea"
                class="input-class"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="thirdForm.message">
              </el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="thirdDialogVisible = false">确 定</el-button>
          </div>
        </el-dialog>

      </div>
    </rightNav>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'
  import moment from 'moment'

export default {

  data() {
    return {
      table_height1:300,
      table_height2:300,
      curMeau : 'third',
      meauList: [{
          label:'第三方服务同步日志',
          type: 'third',
          check: true
        },{
          label:'文件转换记录',
          type: 'file',
          check: false
        } 
      ],
      title:'第三方服务同步日志',
      //第三方服务同步日志
      thirdDialogVisible: false,
      thirdForm:{
        title:'',
        dataModule:'',
        businessType:'',
        status:'',
        message:''
      },
      thirdSearch: {
        thirdPartyServerId:'',
        dataModule:'',
        businessType:'',
        status:'',
        page:1,
        size:10
      },
      thirdTotal:0,
      thirdTableData: [],
      thirdServerList:[],
      thirdModuleList:['Organization','School','SystemUser','Class',
              'Grade','Subject','Teacher','Student','Other'],
      businessTypeList:['INSERT','UPDATE','DELETE','QUERY',
              'IMPORT','EXPORT','LOGIN','LOGOUT','DISABLE','ENABLE','RESET_PASSWORD','OTHER'],
      thirdStatusList:[{'id':'false','name':'失败'},{'id':'true','name':'成功'}],
      //文件转换日志
      fileSearch: {
        name:'',
        fileType:'',
        status:'',
        page:1,
        size:10
      },
      fileTotal:0,
      fileTableData: [],
      fileStatusList:[{key:'Ready',value:'等待转换'},{key:'Converting',value:'转换中'},{key:'Done',value:'转换完成'},{key:'Failure',value:'转换失败'}],
      fileTypeList:[]

    }
  },
  components: {
    rightNav,
    basicTree
    
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getlearningSection',

    ]),

  },
  mounted() {

    this.$nextTick(()=>{
      this.table_height1 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap1.offsetHeight -40
      this.table_height2 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap2.offsetHeight -40


    })
      this.getFileTypeData();
      this.getThirdServerData()
      this.getThirdTableData()
      this.getFileTableData()

    window.onresize = () => {
      this.table_height1 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap1.offsetHeight -40
      this.table_height2 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap2.offsetHeight -40

    }
  },

  destroyed(){
    window.onresize = null;
  },
  methods: {
    changeType(list) {

      this.meauList.forEach(item=>{
        item.check = false
      })

      list.check = true
      this.title = list.label
      this.curMeau = list.type;

      this.$nextTick(()=>{
        this.table_height1 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap1.offsetHeight -40
        this.table_height2 = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap2.offsetHeight -40


      })
    },

    // 分页
    handleSizeChange(val) {
      if (this.curMeau == 'third'){
        this.thirdSearch.size = val
        this.getThirdTableData()
      } else {
        this.fileSearch.size = val
        this.getFileTableData()
      }
    },
    // 分页
    handleCurrentChange(val) {
      if (this.curMeau == 'third'){
        this.thirdSearch.page = val
        this.getThirdTableData()
      } else {
        this.fileSearch.page = val
        this.getFileTableData()
      }  
    },

    resetPage() {
      if (this.curMeau == 'third'){
        this.thirdSearch.page = 1
        this.getThirdTableData()
      } else {
        this.fileSearch.page = 1
        this.getFileTableData()
      }
      
    },

    // 编辑服务弹框
    editTypeDialog(row){
      this.thirdDialogVisible = true
      this.thirdForm = {
        title:row.title,
        statusName:row.statusName,
        message:row.message
      }
    },
    
    
    // 获取日志列表 
    getThirdTableData() {
        let params = {
          thirdPartyServerId:this.thirdSearch.thirdPartyServerId,
          dataModule:this.thirdSearch.dataModule,
          businessType:this.thirdSearch.businessType,
          status:this.thirdSearch.status,
          page: this.thirdSearch.page - 1,
          size: this.thirdSearch.size,
        }
        this.$http.get('/api/internal/thirdPartySyncLog/list',params)
        .then((result)=>{
          if(result.status == '200') {
            result.data.content.forEach(item=>{
              item.statusName = item.status ? '成功' :'失败'
            })
            this.thirdTableData = result.data.content
            this.thirdTotal = result.data.totalElements;
          } 
        })
    },

    // 获取第三方服务列表 
    getThirdServerData() {
        this.$http.get('/api/internal/thirdPartyServer/list',{})
        .then((result)=>{
          if(result.status == '200') {
            this.thirdServerList = result.data
          } 
        })
    },

    // 获取文件类型列表 
    getFileTypeData() {
        this.$http.get('/api/open/common/fileType',{})
        .then((result)=>{
          if(result.status == '200') {
            this.fileTypeList = result.data
          } 
        })
    },

    // 获取文件转换记录列表 
    getFileTableData() {
        let params = {
          name:this.fileSearch.name,
          fileType:this.fileSearch.fileType,
          status:this.fileSearch.status,
          page: this.fileSearch.page - 1,
          size: this.fileSearch.size,
        }
        this.$http.get('/api/internal/files/convert/list',params)
        .then((result)=>{
          if(result.status == '200') {
            result.data.content.forEach(item=>{
              item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            })
            this.fileTableData = result.data.content
            this.fileTotal = result.data.totalElements;
          } 
        })
    },

  }
}
</script>
<style lang="less">
.system {

	.el-radio-group {
		width: 400px;
	}

	.el-radio-button {
		width: 100%;
		position: relative;
    height: 40px;
    margin-bottom: 16px;
    border-radius: 4px;
    border: 1px solid #d8dbe4;
    overflow: hidden;
    cursor: pointer;
	}
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  	color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }
	.el-radio-button__inner {
		width: 100%;
		height: 100%;
    // height: 42px;
    text-align: left;
    // font-size: 14px;
    background: #f6f7fa;
    overflow: hidden;
    // cursor: pointer;
	}
}

</style>
<style lang="less" scoped>
 .system{
  height: 100%;

  .input-class {
    width: 280px;
  }

  .meau-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
    padding-left: 20px;

    .activemeau {
      color:#409EFF;
    }

    ul li {
      height: 40px;
      cursor: pointer;

      &:hover {
        color:#409EFF;
      }
    }
  }
  .wrap {
    height: calc(100vh - 200px);
    // background-color: red;
  	ul {
  		li {
  			line-height: 32px;
  			height: 32px;
  			display: flex;
  		}
  	}

    .logo-div {
      display: flex;
      align-items: center;

      &-left {
        width: 160px;
        flex-shrink: 0
      }

      &-right {
        margin-left: 20px;
        color: #b9c1d2;
      }
    }


  }
}
</style>
