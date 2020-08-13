<template>
  <div class="organozation">
    <rightNav>
      <div slot="left">
        <p class="right-header">组织架构 </p>
        <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="mini"></el-input>
        <div class="tree-wrap">
          <basicTree :tree-data="data" :filterText="filterText"  @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
        </div>
      </div>
      <div slot="right">
        <div class="right-header">
          <span>学科管理 </span>
          <span style="margin-left: 20px;">{{schoolsName}}</span>
<!--           <el-button size="mini" style="margin-left: 20px;" @click="add_subject"><i class="el-icon-plus"></i> 添加</el-button> -->
        </div>

        <div class="table-wrap" ref="table_warp">
          <el-table
            :data="tableData"
            :height="table_height"
            ref="multipleTable"
            border>
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
                label="学科名"
                prop="subjectName"
                sortable>
              </el-table-column>
            <el-table-column
              prop="learningSectionName"
              sortable
              label="所属学段">
            </el-table-column> 

<!--             <el-table-column
              prop=""
              label="操作"
              sortable
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div style="cursor: pointer;">
                  <i class="el-icon-delete" @click="deleteUser(scope.row)"></i>

                </div>
              </template>
            </el-table-column> -->
          </el-table>

        </div>
<!--         <div class="pagination">
          <div>
            <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
            <el-button type="text" @click="deleteUser()" style="margin-left: 20px;">删除</el-button>
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
        </div> -->

        <el-dialog
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
				</el-dialog>
      </div>
    </rightNav>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'

export default {

  data() {

    return {
    	tableData:[],
    	table_height:300,
    	filterText:'',
    	data:[],
    	currentNode:'',
    	subjects:[],
    	dialogVisible:false,
    	subject:{
    		learningSection:'',
    		subjectName: ''
    	},
    	schoolsName:''




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
      'getuserInfo',

    ]),

  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.table_warp.offsetHeight 
    })


    this.getOrgTree()



  },
  methods: {

    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {

          this.data = data.data


        } 
        
      })


    },


    defaultSelectNode(node) {
    	this.currentNode = node
    	this.schoolsName = node.name
      this.get_subject_list()
    },

    handleNodeClick(data) {
    	this.currentNode = data
    	this.schoolsName = data.name
      this.get_subject_list()
    },

    get_subject_list() {
    	this.$http.get(`/api/internal/schools/${this.currentNode.id}/subjects`)
    	.then((data)=>{

        if(data.status == '200') {

          this.tableData = data.data.content


        } 
        
      })

    },

    add_subject() {
    	this.dialogVisible = true
    }

  }
}
</script>

<style lang="less" scoped>
  .organozation{
	height: 100%;

  .input-class {
    width: 280px;
  }

  .search-class {
    width: 160px;
  }

  .tree-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
  }

  .table-wrap {
    height: calc(100vh - 200px);
  }


  }
</style>
