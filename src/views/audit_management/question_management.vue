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
          <span>题库审核 </span>
          <span style="margin-left: 20px;" v-show="activeType == 'organizations'">{{schoolsName}}</span>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="学科" v-show="activeType == 'organizations'">
                <el-select v-model="search.subjectId" placeholder="学科" class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in orgSubjectsList" :label="list.subjectName" :value="list.subjectId.id" :key="list.subjectId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题型">
                <el-select v-model="search.type"class="search-class" @change="getTableData" clearable placeholder="题型">
                  <el-option v-for="list in typeList" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.applyState" placeholder="状态" class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in statusLiist" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="难度">
                <el-select v-model="search.difficultyType" placeholder="难度" class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in difficultyLiist" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传时间">
						    <el-date-picker
						      v-model="search.time"
						      @change="getTableData"
						      style="width: 220px;"
						      value-format="yyyy-MM-dd"
						      type="daterange"
						      range-separator="-"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
              </el-form-item>
             <el-form-item >
	            <span class="ansbtn" v-show="!isAnswer" @click="isAnswer=true">
			          <i class="iconfont iconxianshi" style="position: relative;top:1px"></i> 
			          显示答案
			        </span>
			        <span class="ansbtn" v-show="isAnswer" @click="isAnswer=false">
			          <i class="iconfont iconyincang"></i> 
			          隐藏答案
        			</span>
              </el-form-item>
            </el-form>

 
          </div>
			    <div class="content-wrap"  ref="table_warp" :style="{height:table_height+'px'}">
			      <div>
			        <el-card class="box-card" shadow="hover" v-for="i in 10">
			          <section class="content"   v-show="!isAnswer">
			            <div class="qt1">
			              <img src="@/assets/test1.png" />
			              When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are
			              $x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$
			              1、“实际平均续航里程”是指电动汽车的行驶总里程与充电次数的比值，是反映电动汽车性能的重要指标．某汽车生产厂家为了解某型号电动汽车的“实际平均续航里程”，收集了使用该型号电动汽车1年以上的部分客户的相关数据，按年龄不超过40岁和年龄在40岁以上将客户分为A，B两组，从A，B组各抽取10位客户的电动汽车的“实际平均续航里程”数据整理成图，其中“⊙”表示A组的客户，“*”表示B组的客户．
			            </div>
			            <div class="qt2">
			              <ul>
			                <li style="width: 24%;" class="selectoption">
			                  A.
			                  <img src="@/assets/test1.png" />
			                </li>
			                <li style="width: 24%;" class="selectoption">
			                  B.
			                  <img src="@/assets/test1.png" />
			                </li>
			                <li style="width: 24%;" class="selectoption">
			                  C.
			                  <img src="@/assets/test1.png" />
			                </li>
			                <li style="width: 24%;" class="selectoption">
			                  D.
			                  <img src="@/assets/test1.png" />
			                </li>
			              </ul>
			            </div>
			          </section>


			          <section class="content" v-show="isAnswer">
			            <div class="qt2 top"></div>

			            <div class="middle">
			              <div>
			                <p class="title">【知识点】</p>
			                <p>B．教室内课桌的高度约为80dmB．教室内课桌的高度约为80dmB．教室内课桌的高度约为80dmB．教室内课桌的高度约为80dmB．教室内课桌的高度约为80dm</p>
			              </div>

			              <div>
			                <p class="title">【答案】</p>
			              </div>
			              <div>
			                <p class="title">【分析】</p>
			              </div>
			              <div>
			                <p class="title">【详解】</p>
			              </div>
			              <div>
			                <p class="title">【点睛】</p>
			              </div>
			              <p class="tag">2019~山东省高中二期中</p>
			            </div>
			          </section>
			          <section class="foot-wrap">
			            <div class="pt1">
			              <div>状态：待审核</div>
			              <div>
			              	<el-button type="text">审批打回</el-button>
			              	<el-button type="text">删除</el-button>
			              </div>
			              <div>
			              	<span>上传：2020/04/08</span>
			              	<span>难度：一般</span>
			              	<span>题型：单选题</span>
			              </div>
			            </div>

			          </section>
			        </el-card>
			      </div>


			    </div>

          <div class="pagination">
            <div>
              <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
       				<el-button type="text" @click="deleteResource()" style="margin-left: 20px;">删除</el-button>
            	<el-button type="text" @click="groundResource()">上架</el-button>
            	<el-button type="text" @click="underResource()">下架</el-button>
            	<el-button type="text" @click="recommendResource()">推荐</el-button>
            	<el-button type="text" @click="notRecommendResource()">取消推荐</el-button>
            	<el-button type="text" @click="rejectResource()">打回</el-button>
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
      	subjectId:'',
      	applyState:'',
      	difficultyType:'',
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
    	difficultyLiist: ['容易','较易','一般','较难','难'],
    	currentPoint:'',
    	currentNode:'',
    	schoolsName:'',
    	isAnswer:false,
    	orgSubjectsList:[],








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
    	this.$nextTick(()=>{
	      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40
	      // 
	    })
    },


    defaultSelectNode(node) {
    	this.currentNode = node
    	this.schoolsName = node.name
    	this.getSubjectByOrg()
    	this.getTableData()
    },

    orgNodeClick(data) {
    	this.currentNode = data
    	this.schoolsName = data.name
    	this.getSubjectByOrg()
    	this.getSubjectByOrg()
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
  	getSubjectByOrg() {
  		

      this.$http.get(`/api/internal/schools/${this.currentNode.id}/subjects`)
      .then((data)=>{
        if(data.status == '200') {


        	this.orgSubjectsList = data.data.content
        	// this.search.subjectId = this.subjectsList[0].
        	// this.getPonitTree()


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
    	this.search.size = val
      // console.log(`每页 ${val} 条`);
      this.getTableData()
    },
    // 分页
    handleCurrentChange(val) {
    	this.search.page = val
      // console.log(`当前页: ${val}`);
      this.getTableData()
    },

    tableCellStyle({row, column, rowIndex, columnIndex}) {
    	if(columnIndex == 3) {
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


    getTableData() {

    	if(!this.currentNode && !this.currentPoint && !this.filter.subject) {
    		setTimeout(this.getTableData(),1000)
    	}	

      this.tableData = []
      this.checked = false
      let params = {
      	schoolId: this.currentNode.id,
      	subjectId: this.search.subjectId,
				questionType: this.search.type,
				difficultyType: this.search.difficultyType,
				chapterId: this.currentPoint.id,
				knowledgeId: this.currentPoint.id,
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
    
      this.$http.get(`/api/internal/question/questions`,{params})
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

	.el-card__body {
		padding:0px;
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

    .content-wrap {
	    // margin-top: 20px;
	    border: 1px solid #e2e2e2;
	    padding: 0 20px 20px 20px;
	    // background-color: #f2f5fc;
	    overflow-y: auto;


		  .box-card {
		    margin-top: 15px;
		    border-radius: 8px;
		    position: relative;


		    .content {
		      font-size: 1rem;
		      display: block;
		      padding: 20px;
		      line-height: 28px;
		      letter-spacing: 1px;
		      word-break: break-all;
		      font-family: "JyeMath", "JyeMathLetters", "Times New Roman", "微软雅黑",
		        Arial, "宋体";
		      -webkit-font-smoothing: antialiased;
		      // border-radius: 50% 0;

		      .qt1 {
		        overflow: hidden;
		        zoom: 1;
		        clear: both;
		        line-height: 28px;
		        font-size: 1rem;
		        //padding: 20px;
		        position: relative;
		        word-break: break-word;
		        padding-bottom: 20px;
		        cursor: pointer;

		        img {
		          float: right;
		          position: relative;
		        }
		      }

		      .qt2 {
		        //padding: 0px 20px 20px 20px;

		        ul {
		          display: flex;
		          flex-wrap: wrap;
		          justify-content: space-around;

		          .selectoption {
		            vertical-align: middle;
		            font-size: 14px;
		            padding: 2px;

		            label {
		              line-height: 24px;
		            }
		          }
		        }
		      }

		      .top {
		        border-bottom: 1px dashed #dbdee4;
		        padding-bottom: 20px;
		      }

		      .middle {
		        div {
		          display: flex;

		          .title {
		            flex-shrink: 0;
		            color: #22a9e8;
		            font-weight: 600;
		          }
		        }

		        .tag {
		          padding-left: 10px;
		          color: #828282;
		          font-size: 0.9rem;
		        }
		      }
		    }

		    .foot-wrap {
		      padding: 5px 20px;
		      background-color: #eee;
		      display: flex;
		      justify-content: space-between;
		      line-height: 24px;
		      color: #828282;
		      font-size: 0.8rem;

		      .pt1 {
		      	width: 100%;
		        display: flex;
		        justify-content: space-between;
		        align-items:center;

		        span {
		        	margin-left: 20px;
		        }
		      }

		      .pt2 span {
		        margin-right: 15px;
		        cursor: pointer;

		        i {
		          font-size: 1rem;
		        }
		      }

		      .iconcolor {
		        color: #789ef6;
		      }
		    }
		  }
    }
    
    .search-class {
      width: 160px;
    }

  
		.ansbtn {
			cursor: pointer;
			font-size: 0.9rem;
		}

  }





  }
</style>
