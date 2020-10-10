<template>
  <div class="resource">
    <rightNav>
      <div slot="left" class="left">

        <collapsiblePonitTree @setActiveType="setActiveType" @orgNodeClick="orgNodeClick" @chapterNodeClick="chapterNodeClick" @knowNodeClick="knowNodeClick" @getSubjectCode="getSubjectCode" @clearData="clearData"></collapsiblePonitTree>
				<!-- <topTabs :tabsList="headList" @changeTabs="changeTabs">
					<div slot="tab-content">
						<div v-show="activeType == 'organizations'">
							<el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
							<div class="tree-class">
	            	
	              <basicTree :tree-data="orgData" :filterText="filterText" @selectnode="defaultSelectNode" @handleNodeClick="orgNodeClick"></basicTree>
	            </div>
						</div>

						<div v-show="activeType == 'knowledge'">
							<top-popover :chooseType="knowType" ref="filter" @setparams="setparams">
	              <div slot="reference" class="search-class">
                  <span v-if="$refs.filter">{{$refs.filter.learningSection.value}}</span>
                  <span v-if="$refs.filter">{{$refs.filter.subject.value}}</span>
                  <span v-if="$refs.filter && knowType=='chapter'">{{$refs.filter.oese.name}}</span>
	              </div>
	            </top-popover>
	            <div class="search-wrap">
	              <el-radio-group v-model="knowType" size="mini" @change="getPonitTree">
	                <el-radio-button label="chapter">章节目录</el-radio-button>
	                <el-radio-button label="knowledge">知识点</el-radio-button>
	              </el-radio-group>
              </div>
	            <div class="tree-class point-tree">
	              <pointTree :tree-data="pointData" @handleNodeClick="pointNodeClick" @selectnode="defaultPointNode"></pointTree>
	            </div>
						</div>
					</div>
				</topTabs> -->



      </div>
      <div slot="right">
        <div class="right-header">
          <span>题目纠错 </span>
          <span style="margin-left: 20px;" v-show="activeType == 'organizations'">{{schoolsName}}</span>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="错误类型" v-show="activeType == 'organizations'">
                <el-select v-model="search.errorType" placeholder="错误类型" class="search-class" @change="getQuestionType" clearable 		value-key="subjectId.id">
                  <el-option v-for="list in errorTypeList" :label="list.value" :value="list.key" :key="list.key" ></el-option>
                </el-select>
              </el-form-item>
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
			          显示详情
			        </span>
			        <span class="ansbtn" v-show="isAnswer" @click="isAnswer=false">
			          <i class="iconfont iconyincang"></i> 
			          隐藏详情
        			</span>
              </el-form-item>
            </el-form>

 
          </div>
			    <div class="content-wrap"  ref="table_warp" :style="{height:table_height+'px'}">
            <div v-if="tableData.length==0">
              <div style="height: 300px;line-height: 300px;text-align: center;">暂无数据</div>
            </div>
			      <div v-else>
			        <el-card class="box-card" shadow="hover" v-for="list in tableData">
			        	<el-checkbox v-model="list.check" style="" class="check-class" @change="handleCheckedChange"></el-checkbox>
                <div class="" >
  			          <section class="content cursor"  style="padding-bottom: 0px;" @click="list.showDetail=!list.showDetail">
  			            <div class="qt1" v-html="list.name">
  	
  			            </div>
  			            <div class="qt2" v-if="list.options.length">
  			              <ul>
  			                <li style="width: 100%;" class="selectoption" v-for="item in list.selectoption">

                          <span>{{item.key}}</span>
                          <span>、</span>
                          <span v-html="item.value"></span> 
  			                </li>

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
  			                <p class="title">【错误内容】</p>
  			                <p>
  			                	<span>{{list.content}}</span>
  			                </p>
  			              </div>
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
                        <span>上传：{{list.createTime}}</span>
                        <span>难度：{{list.difficultyTypeName}}</span>
                        <span>题型：{{list.questionTypeName}}</span>
                      </div>
  			              <!-- <div>状态：{{list.applyStateName}}</div> -->
  			              <div>
                        <el-button type="text" @click="list.showDetail = !list.showDetail">{{list.showDetail?'收起':'详情'}}</el-button>
  			              	<el-button type="text" @click="checkQuestionError(true,list.errorCorrectionId)">审核通过</el-button>
  			              	<el-button type="text" @click="checkQuestionError(false,list.errorCorrectionId)">审核拒绝</el-button>
  			              	<el-button type="text" @click="continueError(list.questionId, list.errorCorrectionId)">继续修改</el-button>
  			              	
  			              	<el-button type="text" @click="deleteQuestion(list.errorCorrectionId)">删除</el-button>
                        
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
            	<el-button type="text" @click="checkQuestionError(true)">审批通过</el-button>
            	<el-button type="text" @click="checkQuestionError(false)">审批拒绝</el-button>
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="search.page"
              :page-sizes="[30, 50, 80, 100]"
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
  import collapsiblePonitTree from '@/components/Nav/collapsiblePonitTree'
  import { debounce } from '@/utils/public.js'
  // import topTabs from '@/components/Nav/topTabs'
  // import basicTree from '@/components/Tree/basicTree'
  // import pointTree from '@/components/Tree/pointTree'
  // import topPopover from "@/components/Popover/topPopover";
export default {

  data() {

    return {
    	isIndeterminate:false,
    	activeType:'organizations',
    	orgData: [],
    	filterText:'',
      versionList:'',
      errorTypeList:[],
      sectionList:[],
      gradesList:[],
      subjectsList:[],
      pointData:[],
      knowType:"chapter",
      current: {
      	gradeName:'',
      	subjectName:''
      },
      search: {
      	errorType:'',
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
    	difficultyLiist: ['易','较易','中档','较难','难'],
    	currentChapter:'',
      currentKnowledge:'',
    	currentNode:'',
    	schoolsName:'',
    	isAnswer:false,
    	orgSubjectsList:[],
      volumeList:[],
      isMounted: false,
      learningSection:'',
      subjectCode:'',








    }
  },
  components: {
    rightNav,
    collapsiblePonitTree,
    // topTabs,
    // basicTree,
    // pointTree,
    // topPopover
    
  },
  watch: {
    isAnswer(value) {
      if(value) {
        this.tableData.forEach(item=>{
          item.showDetail = true
        })
      }else {
        this.tableData.forEach(item=>{
          item.showDetail = false
        })
      }
    },

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

    // this.getlearningSection()
    this.geterrorType()

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

        this.getQuestionType()
        this.$nextTick(()=>{
          this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - this.$refs.pagination.offsetHeight
        })

        this.resetPage()
      }
      

      if(this.knowType != type2) {
        this.knowType = type2
        this.resetPage()
      }
      

 
    },
    clearData() {

      this.tableData = []
    },

    getSubjectCode(learningSection,code) {

      if(this.learningSection!=learningSection || this.subjectCode != code) {
        this.learningSection = learningSection
        this.subjectCode = code
        this.getQuestionType()   
      }

    },

    geterrorType() {


      this.$http.get(`/api/open/common/errorType`)
      .then(data=>{
        if(data.status == '200') {
          this.errorTypeList = data.data
          // this.search.errorType = this.errorTypeList[0].key
        }
      })
    },



    changeTabs(tab) {
    	this.activeType = tab
    	this.resetPage()
    	this.getQuestionType()
    	this.$nextTick(()=>{
	      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - this.$refs.pagination.offsetHeight
	      // 
	    })
    },

    changeSubject() {


      this.getQuestionType()
      
      this.getVersionList()
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
    // defaultPointNode(node) {
    // 	this.currentPoint = node

    // 	if(node.memberType == this.knowType) {
    // 		this.getTableData()
    // 	}
    	
    // },

    // pointNodeClick(data) {
    // 	this.currentPoint = data
    // 	this.resetPage()
    // },







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


    resetPage() {
      this.search.page = 1
      this.getTableData()
    },
    getTableData: debounce(function() {
    	if(!this.currentNode && !this.currentPoint) {
    		return
    	}	

      this.tableData = []
      this.checked = false
      let params = {
      	schoolId: this.currentNode.id,
      	subject: this.activeType == 'organizations'? this.search.subject.code:this.subjectCode,
				questionType: this.search.type,
				errorType: this.search.errorType,
				difficultyType: this.search.difficultyType,
				chapterId: this.currentChapter.id,
				knowledgeId: this.currentKnowledge.id,
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


      this.$http.get(`/api/internal/errorCorrection/errorList`,params)
      .then((data)=>{
        if(data.status == '200') {

        	let list = []
        	data.data.content.forEach(item=>{

        		item.questionDto.showDetail = false

            item.questionDto.answers = []
            this.handleQuestion(item.questionDto,item.questionDto)


            item.questionDto.content = item.errorCorrection.content

            item.questionDto.errorCorrectionId = item.errorCorrection.errorCorrectionId.id

        		item.questionDto.check = false

        		list.push(item.questionDto)
        	})

        	// console.log(list)

          this.tableData = list
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
    deleteQuestion(errorId) {
    	this.$confirm('确认删除试题纠错记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      	let ids = []


	    	if(errorId) {
					
					ids.push(errorId)
   	
		    }else {

          
          this.tableData.forEach(item=>{
            item.check? ids.push(item.errorCorrectionId):null
          })
        }


					this.$http.delete(`/api/internal/errorCorrection`,{},ids)
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


		    
		  })
	      
    },




    //审核
    checkQuestionError(enabled,errorId) {
      let ids = []


    	if(errorId) {
        ids.push(errorId)
   	
		    }else {

		    	
          
          this.tableData.forEach(item=>{
            item.check? ids.push(item.errorCorrectionId):null
          })
        }


					this.$http.put(`/api/internal/errorCorrection/batch/${enabled}`,ids)

		      .then((data)=>{
		        if(data.status == '200') {
		        	this.getTableData()
		        	this.$message({
		              message: "操作成功",
		              type:'success'
		          })


		          } 
		          
	        })


		
    },




      continueError(questionId,errorId) {

        this.$router.push({path:'/administrator/questionCorrection', query: {questionId: questionId,errorId:errorId}})
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
