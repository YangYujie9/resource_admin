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
	                  <el-radio-group v-model="filter.subject" size="mini" @change="changeSubject">
	                    <el-radio-button :label="item" :key="item" v-for="item in subjectsList"></el-radio-button>
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
          <span>题目审核 </span>
          <span style="margin-left: 20px;" v-show="activeType == 'organizations'">{{schoolsName}}</span>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="学科" v-show="activeType == 'organizations'">
                <el-select v-model="search.subject" placeholder="学科" class="search-class" @change="getQuestionType" clearable 		value-key="subjectId.id">
                  <el-option v-for="list in orgSubjectsList" :label="list.subjectName" :value="list" :key="list.subjectId.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题型">
                <el-select v-model="search.type"class="search-class" @change="getTableData" clearable placeholder="题型">
                  <el-option v-for="list in questionTypeList" :label="list" :value="list" :key="list"></el-option>
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
			        <el-card class="box-card" shadow="hover" v-for="list in tableData">
			        	<el-checkbox v-model="list.check" style="" class="check-class" @change="handleCheckedChange"></el-checkbox>
			          <section class="content"   v-show="!isAnswer">
			            <div class="qt1">
			              <!-- <img src="@/assets/test1.png" /> -->
			              {{list.name}}
			            </div>
			            <div class="qt2" v-if="list.options.length">
			              <ul>
			                <li style="width: 24%;" class="selectoption" v-for="item in list.selectoption">

                        <span>{{item.word}}</span>
                        <span>、</span>
                        <span>{{item.value}}</span> 
			                  <!-- <img src="@/assets/test1.png" /> -->
			                </li>
			                <!-- <li style="width: 24%;" class="selectoption">
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
			                </li> -->
			              </ul>
			            </div>

                  <!-- 小题 -->
                  <div class="" v-if="list.smallQuestions.length" style="margin-top: 10px;">
                    <div v-for="(list1,index1) in list.smallQuestions">

                      <div class="qt1">
                        <!-- <img src="@/assets/test1.png" /> -->
                        <span>{{index1+1}}</span><span>、</span>
                        {{list1.name}}
                      </div>
                      <div class="qt2" v-if="list1.options.length">
                        <ul>
                          <li style="width: 24%;" class="selectoption" v-for="item in list1.selectoption">

                            <span>{{item.word}}</span>
                            <span>、</span>
                            <span>{{item.value}}</span> 
                            <!-- <img src="@/assets/test1.png" /> -->
                          </li>
                          <!-- <li style="width: 24%;" class="selectoption">
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
                          </li> -->
                        </ul>
                      </div>
                    </div>
                  </div>
			          </section>


			          <section class="content" v-show="isAnswer">
			            <div class="qt2 top"></div>

			            <div class="middle">
			              <div>
			                <p class="title">【知识点】</p>
			                <p>
			                	<span>{{list.knowledgesPoint.join('')}}</span>
			                </p>
			              </div>

			              <div v-if="list.fillAnswers.length ||list.smallQuestions.length">
			                <p class="title">【答案】</p>
			                <p>
			                	<span v-for="(item,index1) in list.answers">
                         <span v-if="list.smallQuestions.length"  style="margin-left: 0px;">{{index1+1}}、</span>
                         <span style="margin-left: 0px;">{{item}}</span>
                        </span>
			                </p>
			              </div>
			              <div>
			                <p class="title">【分析】</p>
			                <p>{{list.analysis}}</p>
			              </div>
			              <div>
			                <p class="title">【详解】</p>
			                <p>{{list.detailedAnalysis}}</p>
			              </div>

			            </div>
			          </section>
			          <section class="foot-wrap">
			            <div class="pt1">
			              <div>状态：{{list.applyStateName}}</div>
			              <div>
			              	<el-button type="text" v-if="list.applyState == 'Audit' || list.applyState == 'Undercarriage'" @click="groundQuestion(list.questionId)">上架</el-button>
			              	<el-button type="text" v-if="list.applyState == 'Grounding'" @click="underQuestion(list.questionId)">下架</el-button>
			              	<el-button type="text" v-if="list.applyState == 'Audit'" @click="rejectQuestion(list.questionId)">审批打回</el-button>
			              	<el-button type="text" @click="deleteQuestion(list.questionId)">删除</el-button>
			              </div>
			              <div>
			              	<span>上传：{{list.createTime}}</span>
			              	<span>难度：{{list.difficultyTypeName}}</span>
			              	<span>题型：{{list.questionTypeName}}</span>
			              </div>
			            </div>

			          </section>
			        </el-card>
			      </div>


			    </div>

          <div class="pagination">
            <div>
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange" :indeterminate="isIndeterminate">全选</el-checkbox>
       				<el-button type="text" @click="deleteQuestion()" style="margin-left: 20px;">删除</el-button>
            	<el-button type="text" @click="groundQuestion()">上架</el-button>
            	<el-button type="text" @click="underQuestion()">下架</el-button>
            	<el-button type="text" @click="rejectQuestion()">打回</el-button>
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
    	isIndeterminate:false,
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
      	subject:'',
      	applyState:'',
      	difficultyType:'',
      	time:'',
      	page:1,
      	size:10
      },
      total:0,
      checkAll:'',
    	tableData:[],
    	table_height:300,
    	questionTypeList:[],
    	statusLiist:['待审核','已上架','已下架'],
    	difficultyLiist: ['易','较易','一般','较难','难'],
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
    	this.getQuestionType()
    	this.$nextTick(()=>{
	      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40
	      // 
	    })
    },

    changeSubject() {
    	this.getPonitTree()
    	this.getQuestionType()
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
        	this.getQuestionType()
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

  	getQuestionType() {
  		let subjectName = ''
      this.questionTypeList = []
  		if(this.activeType == 'organizations') {
  			subjectName = this.search.subject.subjectName
  		}else {
  			subjectName = this.filter.subject
  		}

  		if(!subjectName) {
  			return false
  		}

      this.$http.get(`/api/open/common/subjectQuestionType?subjectName=${subjectName}`)
      .then((data)=>{
        if(data.status == '200') {


        	this.questionTypeList = data.data
        	this.getTableData()



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

  	//全选
    handleCheckAllChange(val) {
    	if(val) {
    		this.tableData.forEach(item=>{
    			item.check = true
    		})
    	}else {
    		this.tableData.forEach(item=>{
    			item.check = false
    		})    	
    	}
      this.isIndeterminate = false;
    },


    handleCheckedChange() {
  	  let checked = this.tableData.filter(item=>{
  			return item.check
  		})

      this.checkAll = checked.length === this.tableData.length;
      this.isIndeterminate = checked.length > 0 && checked.length < this.tableData.length;
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
      	subjectId: this.search.subject?this.search.subject.subjectId.id:'',
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
    		params.subjectId = ''

    		if(this.knowType == "Chapter") {
    			params.knowledgeId = ''
    		}else {
    			params.chapterId = ''
    		}
    	}
    
      this.$http.get(`/api/internal/question/questions`,params)
      .then((data)=>{
        if(data.status == '200') {
        	data.data.content.forEach(item=>{
            item.answers = []
            this.handleQuestion(item,item)




        		item.check = false
        	})
          console.log(data.data.content)

          this.tableData = data.data.content
          this.total = data.data.totalElements
          this.checkAll = false


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

    handleQuestion(item,item0) {
      //选项
      item.selectoption = []
      console.log(item)
      if(item.options && item.options.length) {
        item.options.forEach(item1=>{
          for(let key in item1) {
            item.selectoption.push({word:key,value:item1[key]})
          }
        })
      }
      //答案
      //item.answers = []
      if(item.fillAnswers && item.fillAnswers.length) {
        item.fillAnswers.forEach(item1=>{
          for(let key in item1) {
            item0.answers.push(item1[key])
          }
        })
      }

      //知识点
      item.knowledgesPoint = []
      if(item.knowledges && item.knowledges.length) {
        item.knowledges.forEach(item1=>{
          item.knowledgesPoint.push(item1.name)
        })
      }

      if(item.smallQuestions && item.smallQuestions.length) {
        item.smallQuestions.forEach(item1=>{
          this.handleQuestion(item1,item)
        })
        
      }
    },
    //删除
    deleteQuestion(questionId) {
    	this.$confirm('确认删除资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
	    	if(questionId) {
					this.$http.delete(`/api/internal/question/${questionId}`)
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





          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.delete(`/api/internal/question/batchDelete`,{
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
    groundQuestion(questionId) {
    	if(questionId) {
					this.$http.put(`/api/internal/question/${questionId}/grounding`)
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

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })

					this.$http.put(`/api/internal/question/batchGrounding`,ids)
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
    underQuestion(questionId) {
    	if(questionId) {
					this.$http.put(`/api/internal/question/${questionId}/undercarriage`)
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

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.put(`/api/internal/question/batchUndercarriage`,ids)
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

    //打回
    rejectQuestion(questionId) {
   		if(questionId) {
					this.$http.put(`/api/internal/question/${questionId}/reject`)
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

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.put(`/api/internal/question/batchReject`,ids)
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

  .foot-wrap {
    .el-button{
      font-size: 0.8rem;
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

    .content-wrap {
	    // margin-top: 20px;
	    border: 1px solid #e2e2e2;
	    padding: 0 20px 20px 36px;
	    // background-color: #f2f5fc;
	    overflow-y: auto;


		  .box-card {
		    margin-top: 15px;
		    border-radius: 8px;
		    position: relative;
		    overflow: visible;
				
				.check-class {
					position: absolute;
					left: -25px;
					top:20px;
				}

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
		        padding-bottom: 10px;
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
		      	margin-top: 10px;
		        div {
		          display: flex;
		          font-size: 0.9rem;

		          .title {
		            flex-shrink: 0;
		            color: #22a9e8;
		            font-weight: 550;
		            // font-size: 0.8rem;
		          }

		          span {
		          	margin-left: 10px;

		          	&:first-clild {
									margin-left: 0px;
		          	}
		          }
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
