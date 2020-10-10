<template>
  <div class="resource">
    <rightNav>
      <div slot="left" class="left">
        <collapsiblePonitTree @setActiveType="setActiveType" @orgNodeClick="orgNodeClick" @chapterNodeClick="chapterNodeClick" @knowNodeClick="knowNodeClick" @getSubjectCode="getSubjectCode" @clearData="clearData"></collapsiblePonitTree>



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
                <el-select v-model="search.type"class="search-class" @change="resetPage" clearable placeholder="题型">
                  <el-option v-for="list in questionTypeList" :label="list.name" :value="list.code" :key="list.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.applyState" placeholder="状态" class="search-class" @change="resetPage" clearable>
                  <el-option v-for="list in statusLiist" :label="list" :value="list" :key="list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="难度">
                <el-select v-model="search.difficultyType" placeholder="难度" class="search-class" @change="resetPage" clearable>
                  <el-option v-for="list in difficultyLiist" :label="list" :value="list" :key="list"></el-option>
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
            <div v-if="tableData.length==0">
              <div style="height: 300px;line-height: 300px;text-align: center;">暂无数据</div>
            </div>
			      <div v-else>
			        <el-card class="box-card" shadow="hover" v-for="list in tableData" >
			        	<el-checkbox v-model="list.check" style="" class="check-class" @change="handleCheckedChange"></el-checkbox>
                <div>
  			          <section class="content cursor" style="padding-bottom: 0px;" @click="list.showDetail = !list.showDetail">
  			            <div class="qt1" v-html="list.name">
  			              <!-- <img src="@/assets/test1.png" /> -->
  	
  			            </div>
  			            <div class="qt2" v-if="list.options.length">
  			              <ul>
  			                <li style="width: 100%;" class="selectoption" v-for="item in list.selectoption">

                          <span>{{item.key}}</span>
                          <span>、</span>
                          <span v-html="item.value"></span> 
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

                        <div class="qt1" v-if="list1.name">
                          <div class="small-one">
                            <span>{{index1+1}}</span><span>、</span>
                            <span v-html="list1.name" ></span>
                          </div>
                        </div>
                        <div class="qt2" v-if="list1.options.length">
                          <ul>
                            <li style="width: 100%;" class="selectoption" v-for="item in list1.selectoption">

                              <span>{{item.key}}</span>
                              <span>、</span>
                              <span v-html="item.value"></span> 
                              <!-- <img src="@/assets/test1.png" /> -->
                            </li>
       
       
                          </ul>
                        </div>
                      </div>
                    </div>
  			          </section>


  			          <section class="content" v-show="list.showDetail" style="padding-top: 0px;">
  			            <div class="qt2 top"></div>

  			            <div class="middle">
  			              <div>
  			                <p class="title">【知识点】</p>
  			                <p>
  			                	<span>{{list.knowledgesPoint.join()}}</span>
  			                </p>
  			              </div>

  			              <div v-if="list.fillAnswers.length ||list.smallQuestions.length">
  			                <p class="title">【答案】</p>
  			                <p>
  			                	<span v-for="(item,index1) in list.answers">
                           <span v-if="list.smallQuestions.length"  style="margin-left: 0px;">{{index1+1}}.</span>
                           <span style="margin-left: 0px;">{{item}}</span>
                          </span>
  			                </p>
  			              </div>
  			              <div>
  			                <p class="title">【分析】</p>
  			                <p v-html="list.analysis"></p>
  			              </div>
  			              <div>
  			                <p class="title">【详解】</p>
  			                <p v-html="list.detailedAnalysis"></p>
  			              </div>

  			            </div>
  			          </section>
  			          <section class="foot-wrap">
  			            <div class="pt1">
  			              <div>
                        <span>状态：{{list.applyStateName}}</span>

                        <span>上传：{{list.createTime}}</span>
                        <span>难度：{{list.difficultyTypeName}}</span>
                        <span>题型：{{list.questionTypeName}}</span>
                      </div>
  			              <div>
                        <el-button type="text" @click="list.showDetail = !list.showDetail">{{list.showDetail?'收起': '详情'}}</el-button>
  			              	<el-button type="text" v-if="list.applyState == 'Audit' || list.applyState == 'Undercarriage'" @click="groundQuestion(list.questionId)">上架</el-button>
  			              	<el-button type="text" v-if="list.applyState == 'Grounding'" @click="underQuestion(list.questionId)">下架</el-button>
  			              	<!-- <el-button type="text" v-if="list.applyState == 'Audit'" @click="rejectQuestion(list.questionId)">审批打回</el-button> -->
  			              	<el-button type="text" @click="deleteQuestion(list.questionId)">删除</el-button>
                        <el-button type="text" @click="errorCorrect(list.questionId)">纠错</el-button>
  			              </div>

  			            </div>

  			          </section>
                </div>
			        </el-card>
			      </div>


			    </div>

          <div class="pagination" ref="pagination">
            <div style="flex-shrink: 0">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange" :indeterminate="isIndeterminate">全选</el-checkbox>
       				<el-button type="text" @click="deleteQuestion()" style="margin-left: 20px;">删除</el-button>
            	<el-button type="text" @click="groundQuestion()">上架</el-button>
            	<el-button type="text" @click="underQuestion()">下架</el-button>
            	<!-- <el-button type="text" @click="rejectQuestion()">打回</el-button> -->
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="search.page"
              :page-sizes="[30, 50, 80, 150]"
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
  import collapsiblePonitTree from '@/components/Nav/collapsiblePonitTree'
  import { debounce } from '@/utils/public.js'
export default {

  data() {

    return {
    	isIndeterminate:false,
    	activeType:'',
      gradesList:[],
      subjectsList:[],
      knowType:"",
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
      	size:30
      },
      total:0,
      checkAll:'',
    	tableData:[],
    	table_height:300,
    	questionTypeList:[],
    	statusLiist:['待审核','已上架','已下架'],
    	difficultyLiist: ['易','较易','中档','较难','难'],
      currentChapter:'',
      currentKnowledge:'',    	
      currentNode:'',
    	schoolsName:'',
    	isAnswer:false,
    	orgSubjectsList:[],
      volumeList:[],
      isMounted: false,
      subjectCode:'',
      learningSection:'',








    }
  },
  components: {
    rightNav,
    collapsiblePonitTree,
    
  },
  watch: {
    isAnswer(val) {
      this.tableData.forEach(item=>{
        item.showDetail = val?true: false
      })
    }

  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),


  },
  mounted() {

    this.isMounted = true  
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - this.$refs.pagination.offsetHeight
       
    })

    // this.getOrgTree()
    // this.getlearningSection()

    // this.$nextTick(() => {
    //   // 禁用右键
    //   document.oncontextmenu = new Function("event.returnValue=false");
    //   // 禁用选择
    //   document.onselectstart = new Function("event.returnValue=false");
    // });


    window.onresize = () => {
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - this.$refs.pagination.offsetHeight     
  
    }

  },

  destroyed(){
    window.onresize = null;
  },
  methods: {
    setActiveType(type1,type2) {
      if(this.activeType != type1) {
        this.activeType = type1
        // this.resetPage()
        this.getQuestionType()
        this.$nextTick(()=>{
          this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - this.$refs.pagination.offsetHeight
          // 
        })

        // this.resetPage()
      }
      

      if(this.knowType != type2) {
        this.knowType = type2
        this.resetPage()
      }
      

 
    },
    getSubjectCode(learningSection,code) {

      if(this.learningSection!=learningSection || this.subjectCode != code) {
        this.learningSection = learningSection
        this.subjectCode = code
        this.getQuestionType()   
      }

    },


    clearData() {

      this.tableData = []
    },
    orgNodeClick(data) {
      this.search.subject = ''
    	this.currentNode = data
    	this.schoolsName = data.name
    	this.getSubjectByOrg()
    	this.resetPage()
    },


    chapterNodeClick(data) {
      this.currentChapter = data
      this.currentChapter && this.activeType == 'knowledge' && this.knowType == 'chapter'?this.resetPage():null
    },


    knowNodeClick(data) {
      this.currentKnowledge = data
      this.currentKnowledge && this.activeType == 'knowledge' && this.knowType == 'knowledge'?this.resetPage():null
    },



  	getSubjectByOrg() {
  		
      this.search.type = ''
      this.$http.get(`/api/internal/schools/${this.currentNode.id}/subjects`)
      .then((data)=>{
        if(data.status == '200') {


        	this.orgSubjectsList = data.data.content
        	// this.search.subjectId = this.subjectsList[0].
        	// this.getPonitTree()


          } 
          
        })

  	},

  	getQuestionType() {

      this.search.type = ''

  		let subjectCode = ''

      let learningSection = ''
      this.questionTypeList = []
  		if(this.activeType == 'organizations') {
  			subjectCode = this.search.subject.code
        learningSection = this.search.subject.learningSection
  		}else {
  			subjectCode = this.subjectCode
        learningSection = this.learningSection
  		}

  		if(!subjectCode) {
        this.activeType == 'organizations'?this.resetPage():null
  			return false
  		}

      this.$http.get(`/api/open/common/getQuestionType/${learningSection}/${subjectCode}`)
      .then((data)=>{
        if(data.status == '200') {


        	this.questionTypeList = data.data
        	// this.activeType == 'organizations'?this.resetPage():null
          this.resetPage()



          }
          
        })

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
      this.resetPage()
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

    resetPage() {
      this.search.page = 1
      this.getTableData()
    },
    getTableData: debounce(function() {
    	if(!this.currentNode && (!this.currentChapter || !this.currentKnowledge)) {
    		return false
    	}	

      this.tableData = []
      this.checked = false
      let params = {
      	schoolId: this.currentNode.id,
      	subject:  this.activeType == 'organizations'? this.search.subject.code:this.subjectCode,
				questionType: this.search.type,
				difficultyType: this.search.difficultyType,
				chapterId: this.currentChapter.id,
				knowledgeId: this.currentKnowledge.id,
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

    		// if(this.knowType == "chapter") {
    		// 	params.knowledgeId = ''
    		// }else {
    		// 	params.chapterId = ''
    		// }
    	}


    
      this.$http.get(`/api/internal/question/questions`,params)
      .then((data)=>{
        if(data.status == '200') {
        	data.data.content.forEach(item=>{

            item.showDetail = false
            item.answers = []
            this.handleQuestion(item,item)




        		item.check = false
        	})
          // console.log(data.data.content)

          this.tableData = data.data.content
          this.total = data.data.totalElements
          this.checkAll = false

          this.$nextTick(()=>{
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

          })

        } 
          
        })

    }),

    handleQuestion(item,item0) {
      item.selectoption = []
      if(item.options && item.options.length) {
        item.options.forEach(item1=>{
          item.selectoption.push({key:item1.key,id:item1.value.id,value:item1.value.name})
          // item.selectoption.push(item1)
          // for(let key in item1) {
          //   item.selectoption.push({key:key,id:item1[key].id,value:item1[key].name})
          // }
        })
      }
      //答案
      //item.answers = []
      if(item.fillAnswers && item.fillAnswers.length) {
        item.fillAnswers.forEach(item1=>{
          item0.answers.push(item1.value.name)
          // for(let key in item1) {
          //   item0.answers.push(item1[key])
          // }
        })
      }

      //知识点
      item.knowledgesPoint = []
      if(item.chapters && item.chapters.length) {
        item.chapters.forEach(item1=>{
          item.knowledgesPoint.push(item1.name)
        })
      }else if(item.knowledges && item.knowledges.length) {
        item.knowledges.forEach(item1=>{
          item.knowledgesPoint.push(item1.name)
        })
      }

      if(item.smallQuestions && item.smallQuestions.length) {
        item.smallQuestions.forEach(item1=>{
          
          this.handleQuestion(item1,item)
        })
        
      }

      // console.log(item)
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


		          } 
		          
		      })
   	
		    }else {



          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.delete(`/api/internal/question/batchDelete`,{},ids)
		      .then((data)=>{
		        if(data.status == '200') {

              this.checkAll = false
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


    //上架
    groundQuestion(questionId) {
    	if(questionId) {
					this.$http.put(`/api/internal/question/status/${questionId}?applyState=Grounding`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "上架成功",
		              type:'success'
		          })


		          }
		          
		        })
   	
		    }else {

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })

					this.$http.put(`/api/internal/question/batch/status?applyState=Grounding`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "上架成功",
		              type:'success'
		          })


		          } 
		          
		        })


		  }
    },

    //下架
    underQuestion(questionId) {
    	if(questionId) {
          this.$http.put(`/api/internal/question/status/${questionId}?applyState=Undercarriage`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


		          } 
		          
		        })
   	
		    }else {

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.put(`/api/internal/question/batch/status?applyState=Undercarriage`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


		          } 
		          
		        })


		  }
    },

    //打回
    rejectQuestion(questionId) {
   		if(questionId) {
					this.$http.put(`/api/internal/question/status/${questionId}?applyState=Reject`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "打回成功",
		              type:'success'
		          })


		          } 
		          
		        })
  	
		    }else {

		    	
          let ids = []
          this.tableData.forEach(item=>{
            item.check? ids.push(item.questionId):null
          })


					this.$http.put(`/api/internal/question/batch/status?applyState=Reject`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "打回成功",
		              type:'success'
		          })


		          } 
		          
		        })


			  }
	    },


      errorCorrect(questionId) {

        this.$router.push({path:'/administrator/questionCorrection', query: {questionId: questionId}})
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
  .content {
    p,span,div {
      font-family: "JyeMath", "JyeMathLetters", "Times New Roman", "微软雅黑",
              Arial, "宋体" !important;
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
            // display: flex;
            // flex-wrap: wrap;
		        //padding: 20px;
		        position: relative;
		        word-break: break-word;
		        padding-bottom: 10px;
		        cursor: pointer;

            .small-one {
              display: flex;
              // flex-wrap: wrap;
            }

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
                display: flex;

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
