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
	                <p v-if="filter.grade">{{filter.grade.value}}</p><p>{{filter.subject}}</p>
	              </div>
	              <div slot="popover">
	                <div>
	                	<p>学段：</p>
	                  <el-radio-group v-model="filter.learningSection" size="mini" @change="getGrades">
	                    <el-radio-button v-for="list in sectionList" :label="list.key" :key="list.key">{{list.value}}</el-radio-button>
	                  </el-radio-group>
	                  <p>年级：</p>
	                  <el-radio-group v-model="filter.grade" size="mini" @change="getPonitTree">
	                    <el-radio-button v-for="list in gradesList" :label="list" :key="list.key">{{list.value}}</el-radio-button>
	                  </el-radio-group>

	                  <p>科目：</p>
	                  <el-radio-group v-model="filter.subject" size="mini" @change="getPonitTree">
	                    <el-radio-button :label="item" v-for="item in subjectsList"></el-radio-button>
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
          <span style="margin-left: 20px;">{{schoolsName}}</span>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="类型">
                <el-select v-model="search.type"class="search-class" @change="getTableData" clearable placeholder="类型">
                  <el-option v-for="list in typeList" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公开">
                <el-select v-model="search.openState" placeholder="公开" class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in openList" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.applyState" placeholder="状态" class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in statusLiist" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传时间">
						    <el-date-picker
						      v-model="search.time"
						      style="width: 220px;"
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
              border>
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                  label="文件名"
                  prop="name"
                  sortable>
                </el-table-column>
  <!--             <el-table-column
                prop="resourceName"
                sortable
                label="栏目">
              </el-table-column>  -->
              <el-table-column
                prop="resourceName"
                label="类型"
                width="200">
              </el-table-column>
              <el-table-column
                prop="applyName"
                label="状态"
                sortable>
                
              </el-table-column>

              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
                  	<!-- <el-button type="text">详情</el-button> -->
                  	<el-button type="text" @click="deleteResource(scope.row)">删除</el-button>
                  	<el-button type="text" @click="groundResource(scope.row)" v-if="scope.row.applyState=='Undercarriage'||scope.row.applyState=='Audit'" >上架</el-button>
                  	<el-button type="text" @click="underResource(scope.row)" v-else>下架</el-button>
                  	<el-button type="text" @click="recommendResource(scope.row)"v-if="scope.row.applyState=='Grounding'" >推荐</el-button>
                  	<el-button type="text" @click="notRecommendResource(scope.row)" v-if="scope.row.applyState=='Recommend'">取消推荐</el-button>
                  	<el-button type="text" @click="rejectResource(scope.row)" v-if="scope.row.applyState=='Audit'">打回</el-button>
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
            	<el-button type="text" @click="groundResource()" v-show="search.applyState=='已下架'||search.applyState=='待审核'">上架</el-button>
            	<el-button type="text" @click="underResource()" v-show="search.applyState=='已上架'||search.applyState=='已推荐'">下架</el-button>
            	<el-button type="text" @click="recommendResource()" v-show="search.applyState=='已上架'">推荐</el-button>
            	<el-button type="text" @click="notRecommendResource()" v-show="search.applyState=='已推荐'">取消推荐</el-button>
            	<el-button type="text" @click="rejectResource()" v-show="search.applyState=='待审核'">打回</el-button>
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
    	typeList:['课件','学案','教案','套题试卷','微课','教学反思'],
    	openList:['私有','学校共享','完全公开'],
    	statusLiist:['待审核','已上架','已下架','已推荐'],
    	currentPoint:'',
    	currentNode:'',
    	schoolsName:'',








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
    	this.activeType = tab
    	this.getTableData()
    },


    defaultSelectNode(node) {
    	this.currentNode = node
    	this.schoolsName = node.name
    	this.getTableData()
    },

    orgNodeClick(data) {
    	this.currentNode = data
    	this.schoolsName = data.name
    	this.getTableData()
    },

    defaultPointNode(node) {
    	this.currentPoint = node

    	if(node.memberType == this.knowType) {
    		this.getTableData()
    	}
    	
    },

    pointNodeClick(data) {
    	this.currentPoint = data
    	this.getTableData()
    },

  	getlearningSection() {

      this.$http.get(`/api/internal/dictionaries/learningSection`)
      .then((data)=>{
        if(data.status == '200') {


        	this.sectionList = data.data
        	this.filter.learningSection = 	this.sectionList[0].key
        	this.getGrades()
        	

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


  	getGrades() {


      this.$http.get(`/api/open/common/grades?learningSection=${this.filter.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {

        	this.gradesList = data.data
        	this.filter.grade = this.gradesList[0]


        	this.getSubject()


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

  	getSubject() {

      this.$http.get(`/api/open/common/subjects?learningSection=${this.filter.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {


        	this.subjectsList = data.data
        	this.filter.subject = this.subjectsList[0]
        	this.getPonitTree()


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

  	getPonitTree() {

  		this.pointData = []
  		if(this.knowType == "Chapter") {
	      this.$http.get(`/api/internal/chapter/chapterTree?subjectName=${this.filter.subject}&grade=${this.filter.grade.key}`)
	      .then((data)=>{
	        if(data.status == '200') {
	        	this.pointData = data.data


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
	    }else {
	      this.$http.get(`/api/internal/knowledge/knowledgeTree?subjectName=${this.filter.subject}&grade=${this.filter.grade.key}`)
	      .then((data)=>{
	        if(data.status == '200') {
	        	this.pointData = data.data


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
      console.log(`每页 ${val} 条`);
      this.getTableData()
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableData()
    },


    getTableData() {

    	if(!this.currentNode && !this.currentPoint && !this.filter.subject) {
    		setTimeout(this.getTableData(),1000)
    	}

      this.tableData = []
      let params = {
      	schoolId: this.currentNode.id,

				resourceType: this.search.type,
				chapterId: this.currentPoint.id,
				knowledgeId: this.currentPoint.id,
				openState: this.search.openState,
				applyState: this.search.applyState,
				startTime: this.search.time[0],
				endTime: this.search.time[1],
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
    
      this.$http.get(`/api/internal/resources/resourceList`,{params})
      .then((data)=>{
        if(data.status == '200') {

          this.tableData = data.data.content
          this.total = data.data.totalElements


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
		    }else {


          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.delete(`/api/internal/resources/batchDelete`,{
            data: ids
          })
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "删除成功",
		              type:'success'
		          })


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

		    }
		  })
	      
    },
    //上架
    groundResource(row) {
    	if(row) {
					this.$http.put(`/api/internal/resources/${row.resourceId}/grounding`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "上架成功",
		              type:'success'
		          })


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
		    }else {

		    	
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.put(`/api/internal/resources/batchGrounding`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "上架成功",
		              type:'success'
		          })


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

		  }
    },
    //下架
    underResource(row) {
    	if(row) {
					this.$http.put(`/api/internal/resources/${row.resourceId}/undercarriage`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


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
		    }else {

		    	
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.put(`/api/internal/resources/batchUndercarriage`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


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

		  }
    },
    //推荐
    recommendResource(row) {
    	if(row) {
					this.$http.put(`/api/internal/resources/${row.resourceId}/recommend`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "推荐成功",
		              type:'success'
		          })


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
		    }else {

		    	
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.put(`/api/internal/resources/batchRecommend`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "推荐成功",
		              type:'success'
		          })


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

		  }
    },
    //取消推荐
    notRecommendResource(row) {
    	if(row) {
					this.$http.put(`/api/internal/resources/${row.resourceId}/notRecommend`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "取消推荐成功",
		              type:'success'
		          })


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
		    }else {

		    	
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.put(`/api/internal/resources/batchNotRecommend`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "取消推荐成功",
		              type:'success'
		          })


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

		  }
    },
    //打回
    rejectResource(row) {
   	if(row) {
					this.$http.put(`/api/internal/resources/${row.resourceId}/reject`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "打回成功",
		              type:'success'
		          })


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
		    }else {

		    	
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.resourceId)
            return prev
          },[])


					this.$http.put(`/api/internal/resources/batchReject`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "打回成功",
		              type:'success'
		          })


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
