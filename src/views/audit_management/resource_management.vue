<template>
  <div class="resource">
    <rightNav>
      <div slot="left" class="left">
<!--       	  <el-tabs stretch v-model="activeType">
            <el-tab-pane label="组织架构" name="organization">
	            <div class="tree-class">
	            	<el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>

	              <basicTree :tree-data="orgData" :filterText="filterText" @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
	            </div>

	          </el-tab-pane>
            <el-tab-pane label="章节知识" name="knowledge">
            	<div style="z-index: 1000;">
		            <top-popover>
		              <div slot="reference" class="search-class">
		                <p>七年级下</p><p>数学</p>
		              </div>
		              <div slot="popover">
		                <div>
		                  <p>版本：</p>
		                  <el-radio-group v-model="filter.gradeId" size="mini">
		                    <el-radio-button :label="item" v-for="item in list"></el-radio-button>
		                  </el-radio-group>

		                  <p>年级：</p>
		                  <el-radio-group v-model="filter.subjectId" size="mini">
		                    <el-radio-button :label="item" v-for="item in list"></el-radio-button>
		                  </el-radio-group>
		                </div>
		              </div>
		            </top-popover>
		          </div>
	            <div class="tree-class">
	              <pointTree :tree-data="orgData"></pointTree>
	            </div>
            </el-tab-pane>
          </el-tabs>  -->
       <!-- <div class="right-header" > -->
 
				<topTabs :tabsList="headList" @changeTabs="changeTabs">
					<div slot="tab-content">
						<div></div>
					</div>
				</topTabs>

        <!-- </div> -->
     <!--    		    <top-popover>
		              <div slot="reference" class="search-class">
		                <p>七年级下</p><p>数学</p>
		              </div>
		              <div slot="popover">
		                <div>
		                  <p>版本：</p>
		                  <el-radio-group v-model="filter.gradeId" size="mini">
		                    <el-radio-button :label="item" v-for="item in list"></el-radio-button>
		                  </el-radio-group>

		                  <p>年级：</p>
		                  <el-radio-group v-model="filter.subjectId" size="mini">
		                    <el-radio-button :label="item" v-for="item in list"></el-radio-button>
		                  </el-radio-group>
		                </div>
		              </div>
		            </top-popover>  -->


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
  import topTabs from '@/components/Nav/topTabs'
  import basicTree from '@/components/Tree/basicTree'
  import pointTree from '@/components/Tree/pointTree'
  import topPopover from "@/components/Popover/topPopover";
export default {

  data() {

    return {
    	activeType:'knowledge',
    	orgData: [],
    	filterText:'',
    	filter: {
    		gradeId:'',
    		subjectId:''
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



    	tableData:[],
    	table_height:300,
    	
    	data:[],
    	currentNode:'',
    	subjects:[],
    	dialogVisible:false,
    	subject:{
    		learningSection:'',
    		subjectName: ''
    	},
    	schoolsName:'',
    	list:[1,2,3]



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

          this.orgData = data.data


        } else {
          return this.$message({
            message: data.msg,
            type:'error'
          })
        }
        
      })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })

    },

    changeTabs(tab) {
    	console.log(tab)
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


        } else {
          return this.$message({
            message: data.msg,
            type:'error'
          })
        }
        
      })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })
    },

    add_subject() {
    	this.dialogVisible = true
    }

  }
}
</script>
<style lang="less">
.resource {

	.el-tabs__nav.is-stretch>* {
		// height: 60px;
		// line-height: 60px;
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
	    height: calc(100vh - 240px);
	    overflow-y: auto;
	  }

	  .search-class {
			display: flex;
			height: 36px;
			line-height: 36px;
			color: #409EFF;
			justify-content: space-around;
			cursor: pointer;
	  }

	}



  .table-wrap {
    height: calc(100vh - 200px);
  }


  }
</style>
