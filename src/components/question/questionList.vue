<template>
  <div class="question-list">
    <div v-if="questionList.length==0">
      <div style="height: 300px;line-height: 300px;text-align: center;">暂无数据</div>
    </div>
    <div v-else>
      <el-card class="box-card" shadow="hover" v-for="list in questionList">
      	<el-checkbox v-model="list.check" style="" class="check-class" @change="handleCheckedChange"></el-checkbox>
        <div class="" >
          <section class="content cursor"  style="padding-bottom: 0px;" @click="list.showDetail=!list.showDetail">
            <div class="qt1" v-html="list.name">

            </div>
            <div class="qt2" v-if="list.options.length && list.questionTypeTemplate!='BoolenQuestionTemplate'">
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
                <div :class="{qtwrap:list.questionTypeTemplate=='GestaltFillsUpTemplate'||list1.questionType=='NoAloneEnter'}" v-if="list1.questionType!='NoAloneEnter'">
                  <div class="qt1">
                    <div class="small-one">
                      <span class="order">{{index1+1}}、</span>
                      <span v-html="list1.name" ></span>
                    </div>
                  </div>
                  <div class="qt2" v-if="list1.options.length && list1.questionType!='BoolenQuestion'" style="padding-left: 20px;">
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
            </div>
          </section>


          <section class="content" v-show="list.showDetail" style="padding-top: 0px;border-top: 1px dashed #dbdee4;">

            <div class="middle">
              <div v-if="isError">
                <p class="title">【错误内容】</p>
                <p>
                	<span>{{list.content}}</span>
                </p>
              </div>
              <div>
                <p class="title">【知识点】</p>
                <p>
                	<span v-if="list.knowledgesPoint && list.knowledgesPoint.length">{{list.knowledgesPoint.join()}}</span>
                </p>
              </div>

              <div v-if="list.answers.length">
                <p class="title">【答案】</p>
                <p>
                	<span v-for="(item,index1) in list.answers">
                    <span v-if="list.smallQuestions.length"  style="margin-left: 0px;">{{item.index}}.</span>
                    <span style="margin-left: 3px;" v-html="item.name"></span>
                  </span>
                </p>
              </div>
              <div>
                <p class="title">【分析】</p>
                <p v-html="list.analysis" style="width: 100%;"></p>
              </div>
              <div>
                <p class="title">【详解】</p>
                <p v-html="list.detailedAnalysis" style="width: 100%;"></p>
              </div>

            </div>
          </section>
          <section class="foot-wrap">
            <div class="pt1">
              <div>
              	<span v-if="!isError">状态：{{list.applyStateName}}</span>
                <span>上传：{{list.createTime}}</span>
                <span>难度：{{list.difficultyTypeName}}</span>
                <span>题型：{{list.questionTypeName}}</span>
              </div>
              <!-- <div>状态：{{list.applyStateName}}</div> -->
              <div>
                <el-button type="text" @click="list.showDetail = !list.showDetail">{{list.showDetail?'收起':'详情'}}</el-button>
                <span  v-if="isError" style="margin-left: 10px;">
	              	<el-button type="text" @click="checkQuestionError(true,list.errorCorrectionId)">审核通过</el-button>
	              	<el-button type="text" @click="checkQuestionError(false,list.errorCorrectionId)" v-if="isError">审核拒绝</el-button>
	              	<el-button type="text" @click="continueError(list.questionId, list.errorCorrectionId)" v-if="isError">继续修改</el-button>
	              	
	              	<el-button type="text" @click="deleteError(list.errorCorrectionId)" v-if="isError">删除</el-button>
              	</span>
              	<span v-if="!isError" style="margin-left: 10px;">
	              	<el-button type="text" v-if="!isError && (list.applyState == 'Audit' || list.applyState == 'Undercarriage')" @click="groundQuestion(list.questionId)">上架</el-button>
	              	<el-button type="text" v-if="!isError && list.applyState == 'Grounding'" @click="underQuestion(list.questionId)">下架</el-button>
	              	<!-- <el-button type="text" v-if="list.applyState == 'Audit'" @click="rejectQuestion(list.questionId)">审批打回</el-button> -->
	              	<el-button type="text" @click="deleteQuestion(list.questionId)">删除</el-button>
	                <el-button type="text" @click="errorCorrect(list.questionId)">纠错</el-button>
                </span>
              </div>

            </div>

          </section>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import { handleQuestion } from '@/utils/public.js';
export default {
  name:'questionList',
  props: {

  	isError: {
  		type: Boolean,
  		default:false
  	},
    isAnswer:{
      type:Boolean,
      default: false
    },
    checkAll: {
      type:Boolean,
      default: false
    },

    tableData: {
      type: Array,
    },


  },
  components: {

  },
  data() {
    return {
      questionList:[],
      isIndeterminate:false, 
      checkedAll: false,
    };
  },
  computed: {
    ...mapGetters([
      'paperId',

    ]),

  },
  watch: {

    isAnswer(value) {
      if(value) {
        this.questionList.forEach(item=>{
          item.showDetail = true
        })
      }else {
        this.questionList.forEach(item=>{
          item.showDetail = false
        })
      }
    },
    tableData(value) {
      if(value.length) {
        this.initTableData(JSON.parse(JSON.stringify(value)));
      }else {
        this.questionList = []
      }
    },

    isIndeterminate(val) {
    	this.$emit('isIndeterminateChange',val)
    },

    checkedAll(val) {
    	this.$emit('checkAllchange',val)
    }
  },
  mounted() {

  },

  activated() {

    this.$nextTick(() => {

      let that = this
      // 禁用右键
      document.oncontextmenu = new Function("event.returnValue=false");
      // 禁用选择
      // document.onselectstart = new Function("alert('select')");

      document.oncopy = function() {
        that.$alert('本页内容禁止复制，谢谢', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            
          }
        });
        return false;      
      }
    });
    
  },
  deactivated() {
    document.oncontextmenu = null;
    document.oncopy = null
  },
  destroyed(){
    document.oncontextmenu = null;
    document.oncopy = null
  },
  methods: {
    initTableData(data) {

      let arr = []

      data.forEach((item,index)=>{
        // 
        item.showDetail = this.isAnswer

        item.answers = []

        this.handleQuestion(item,item)

        if(this.isError) {
	        item.content = item.errorCorrection.content
	        item.errorCorrectionId = item.errorCorrection.errorCorrectionId.id
        }

        item.check = false
        arr.push(item)
      })

      this.questionList = arr

      this.$nextTick(()=>{
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

      })
    },
    handleQuestion(item,item0,index) {
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
        item0.answers.push({index:index+1,name:''})
        item.fillAnswers.forEach(item1=>{
          // item0.answers.push({index: index+1,name: item1.value.name})
          item0.answers[item0.answers.length-1].name += item1.value.name + ' '
          // for(let key in item1) {
          //   item0.answers.push(item1[key])
          // }
        })
      }

      //章节
      item.chapterPoint = [] 
      if(item.chapters && item.chapters.length) {
        item.chapters.forEach(item1=>{
          item.chapterPoint.push(item1.name)
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
        item.smallQuestions.forEach((item1, index1)=>{
          
          this.handleQuestion(item1,item,index1)
        })
        
      }

      // console.log(item)
    },

  	handleCheckAllChange(value) {
    	if(value) {
    		this.questionList.forEach(item=>{
    			item.check = true
    		})
    	}else {
    		this.questionList.forEach(item=>{
    			item.check = false
    		})    	
    	}

    	this.checkedAll = value

    	this.isIndeterminate = false
  	},
    handleCheckedChange() {

  	  let checked = this.questionList.filter(item=>{
  			return item.check
  		})
      this.checkedAll	 = checked.length === this.questionList.length

      this.isIndeterminate = checked.length > 0 && checked.length < this.questionList.length;
    },
    //删除
    deleteQuestion(questionId) {


      let ids = []
      this.questionList.forEach(item=>{
        item.check? ids.push(item.questionId):null
      })

      if(!ids.length && !questionId) {
        return this.$message.warning('未选择任何试题，请重新选择！') 
      }

    	this.$confirm('确认删除该题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
	    	if(questionId) {
					this.$http.delete(`/api/internal/question/${questionId}`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.$emit('getData')
		        	this.$message({
		              message: "删除成功",
		              type:'success'
		          })


		          } 
		          
		      })
   	
		    }else {

					this.$http.delete(`/api/internal/question/batchDelete`,{},ids)
		      .then((data)=>{
		        if(data.status == '200') {

              // this.checkAll = false
		        	this.$emit('getData')
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
      let ids = []
      this.questionList.forEach(item=>{
        item.check? ids.push(item.questionId):null
      })

      if(!ids.length && !questionId) {
        return this.$message.warning('未选择任何试题，请重新选择！') 
      }



    	if(questionId) {
					this.$http.put(`/api/internal/question/status/${questionId}?applyState=Grounding`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.$emit('getData')
		        	this.$message({
		              message: "上架成功",
		              type:'success'
		          })


		          }
		          
		        })
   	
		    }else {

		    	
          // let ids = []
          // this.questionList.forEach(item=>{
          //   item.check? ids.push(item.questionId):null
          // })

					this.$http.put(`/api/internal/question/batch/status?applyState=Grounding`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.$emit('getData')
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

      let ids = []
      this.questionList.forEach(item=>{
        item.check? ids.push(item.questionId):null
      })

      if(!ids.length && !questionId) {
        return this.$message.warning('未选择任何试题，请重新选择！') 
      }
      
    	if(questionId) {
          this.$http.put(`/api/internal/question/status/${questionId}?applyState=Undercarriage`)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.$emit('getData')
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


		          } 
		          
		        })
   	
		    }else {

		    	
          // let ids = []
          // this.questionList.forEach(item=>{
          //   item.check? ids.push(item.questionId):null
          // })


					this.$http.put(`/api/internal/question/batch/status?applyState=Undercarriage`,ids)
		      .then((data)=>{
		        if(data.status == '200') {
		        	this.$emit('getData')
		        	this.$message({
		              message: "下架成功",
		              type:'success'
		          })


		          } 
		          
		        })


		  }
    },

    //审核
    checkQuestionError(enabled,errorId) {
      let ids = []


    	if(errorId) {
        ids.push(errorId)
 	
	    }else {

	    	
        
        this.questionList.forEach(item=>{
          item.check? ids.push(item.errorCorrectionId):null
        })
      }

      if(!ids.length){
        return this.$message.warning('未选择任何试题，请重新选择！')
      }

			this.$http.put(`/api/internal/errorCorrection/batch/${enabled}`,ids)

      .then((data)=>{
        if(data.status == '200') {
        	this.$emit('getData')
        	this.$message({
              message: "操作成功",
              type:'success'
          })


          } 
          
      })


		
    },



    //继续纠错
    continueError(questionId,errorId) {

      this.$router.push({path:'/administrator/questionCorrection', query: {questionId: questionId,errorId:errorId}})
    },

    getCheckedIds() {
      let selectData = this.$refs.multipleTable.store.states.selection
      let ids = selectData.reduce((prev,current)=>{
        prev.push(current.resourceId)
        return prev
      },[])

      return ids
    },
      //删除纠错
    deleteError(errorId) {


    	let ids = []


    	if(errorId) {
				
				ids.push(errorId)
 	
	    }else {

        
        this.questionList.forEach(item=>{
          item.check? ids.push(item.errorCorrectionId):null
        })
      }

      if(!ids.length){
        return this.$message.warning('未选择任何试题，请重新选择！')
      }

      this.$confirm('确认删除试题纠错记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.$http.delete(`/api/internal/errorCorrection`,{},ids)
	      .then((data)=>{
	        if(data.status == '200') {

            // this.checkAll = false
	        	this.$emit('getData')
	        	this.$message({
	              message: "删除成功",
	              type:'success'
	          })


	        } 
	          
	      })


	    
	   })
	      
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


        if(!ids.length){
          return this.$message.warning('未选择任何试题，请重新选择！')
        }

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
};
</script>
<style lang="less">
.question-list {
  .MathJye {
    direction: ltr;
    display: inline-block;
    float: none;
    font-family: "Times New Roman","宋体";
    font-size: 15px;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 1px;
    line-height: normal;
    text-align: left;
    text-indent: 0px;
    text-transform: none;
    white-space: nowrap;
    word-spacing: normal;
    overflow-wrap: normal;
    text-size-adjust: none;
    border-width: 0px;
    border-style: none;
    border-color: initial;
    border-image: initial;
    margin: 0px;
    padding: 0px;

    table {
      display: inline-block;
      vertical-align: middle;

      td {
        text-align: center;
      }
    }

    span {
      display: inline;
      position: static;
      border: 0;
      padding: 0;
      margin: 0;
      vertical-align: 0;
      line-height: normal;
      text-decoration: none;
    }
  }
    .el-card__body {
      padding: 0px;
    }

  // .el-radio-button:first-child .el-radio-button__inner, .el-radio-button:last-child .el-radio-button__inner   
    .el-radio-button__inner {
      border: 0px;
      background-color: transparent;
      border-radius: 3px;
      font-size: 14px;
      color: #666;
    }
    .el-input__inner {
      background: transparent;
    }

    .el-radio-button:first-child .el-radio-button__inner,.el-radio-button:last-child .el-radio-button__inner {
      // border-left: 0px;
      border-radius: 3px;
    }

    .content {

      .MathJye {
          direction: ltr;
          display: inline-block;
          float: none;
          font-family: "Times New Roman","宋体";
          font-size: 15px;
          font-style: normal;
          font-weight: normal;
          letter-spacing: 1px;
          line-height: normal;
          text-align: left;
          text-indent: 0px;
          text-transform: none;
          white-space: nowrap;
          word-spacing: normal;
          overflow-wrap: normal;
          text-size-adjust: none;
          border-width: 0px;
          border-style: none;
          border-color: initial;
          border-image: initial;
          margin: 0px;
          padding: 0px;

          table {
            display: inline-block;
            vertical-align: middle;

            td {
              text-align: center;
              border: 0px;
            }
          }

          span {
            display: inline;
            position: static;
            border: 0;
            padding: 0;
            margin: 0;
            vertical-align: 0;
            line-height: normal;
            text-decoration: none;
          }
      }

      table {
        border-collapse:collapse;
      }
      
      .table, .edittable {

          td {
            padding: 3px 5px;
            border: 1px solid #333;
          }
 
      }

      
      p,div,span {
        // line-height: 1 !important;
        background-color:transparent !important;
        font-size: 1rem;
        font-family: "JyeMath", "JyeMathLetters", "Times New Roman", "微软雅黑",
            Arial, "宋体" !important;
      }


      
    }

  .el-card {
    // border: 1px solid #e2e2e2;
    .qt1 img {
      vertical-align: middle;
      float: right;
      max-height: 200px;
      width: auto;
    }
  }
}
</style>
<style scoped lang="less">
.question-list {

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
      .order {
        flex-shrink: 0;
      }
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
        width: 100%;

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
      .qtwrap {
        display: flex;
        align-items: center;

        .qt1 {
          padding-bottom: 0px;
        }

        .qt2 ul {
          flex-wrap: nowrap;
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
</style>