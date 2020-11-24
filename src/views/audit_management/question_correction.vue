<template>
  <div class="addques-home">
  	<rightNav>
      <div slot="left" class="left right-one-part" style="margin-top: 20px;">
				<top-popover v-if="topReady" :chooseType="activeType" ref="filter" @setparams="setparams" :isReset="true" :learningSectionKey="questionDetail.learningSection" :subjectCode="questionDetail.subjectCode" :oeseId="questionDetail.oeseId" :volumeId="questionDetail.volumeId">
          <div slot="reference" class="search-class">
            <span v-if="$refs.filter">{{$refs.filter.learningSection.value}}</span>
            <span v-if="$refs.filter">{{$refs.filter.subject.value}}</span>
            <span v-if="$refs.filter && $refs.filter.oese &&activeType=='chapter'">{{$refs.filter.oese.name}}</span>
          </div>
          <div slot="popover">

          </div>
        </top-popover>


        <div class="tab-content">
          <el-tabs stretch v-model="activeType" @tab-click="handleClick">
            <el-tab-pane label="按章节" name="chapter">
              <div class="tree-class">
                <pointTree :tree-data="chapterData" :isReset="true" :showCheckbox="true" @selectnode="defaultCheckChapters" @getCheckedNodes="getCheckedChapters" ref="chapterTree" ></pointTree>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按考点" name="knowledge" >
              <div class="tree-class">
                <pointTree :tree-data="knowledgeData":isReset="true" :showCheckbox="true" @selectnode="defaultCheckKnows" @getCheckedNodes="getCheckedKnows" ref="knowledgeTree"></pointTree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
    	</div>

      <div slot="right" style="margin-top: 20px;">
        <div class="content-class">
          <div class="form-class" style="margin-top: 0px;">
            <el-form>
              <el-form-item label="题型：">
                <el-radio-group v-model="questionType" size="mini" :disabled="typeDisable" @change="changeType()">
                  <el-radio-button
                    v-for="list in typeList"
                    :label="list.code"
                    :key="list.code"
                  >{{list.name}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="难度：">
                <el-radio-group v-model="form.difficulty" size="mini" :disabled="isError">
                  <el-radio-button v-for="list in difficultyList" :label="list.key" :key="list.key">{{list.value}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="div1">
            <div
              style="display:flex;justify-content: space-between;height:30px;align-items: center;"
            >
              <p>选择考核范围</p>
              <!-- <p>
                <el-button type="text" size="small">撤销操作</el-button>
                <el-button type="text" size="small">清空</el-button>
              </p> -->
            </div>
            <div class="tag-class">

              <el-tag v-for="(tag,index) in tagsList" :key="tag.id" type="warning" @close="closeTag(index)">{{tag.name}}</el-tag>
            </div>
          </div>

          <div>
            <p>题干内容</p>
            <ckeditor ref="ck0" :readOnly="isError&&stemReadonly"></ckeditor>
           
          </div>

          <div class="form-class">
            <el-form :model="form">
              <el-form-item label="选项数：" v-show="questionTemplate == 'MatchingTemplate'">
                <el-select
                  v-model="form.matchingNum"
                  placeholder="请选择"
                  style="width:60px;"
                  size="mini"
                  @change=""
                  :disabled="isError"
                >
                  <el-option
                    v-for="item in marchingOption"
                    :key="item.index"
                    :label="item.index"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </el-form-item>               
              <el-form-item label="题数：">
                <el-select
                  v-model="form.questionNum"
                  placeholder="请选择"
                  style="width:60px;"
                  size="mini"
                  :disabled="qnumDisable || isError"
                  @change="changequestionNum"
                >
                  <el-option
                    v-for="item in questionOtions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="序号："  class="custom-form">
                <el-button
                  v-for="(list,index) in questionOtions"
                  v-if="index<form.questionNum"
                  size="mini"
                  type="primary"
                  plain
                  :class="{active: list.check}"
                  @click="choose_quesnum(list)"
                >第{{list.label}}题</el-button>
              </el-form-item>
              <el-form-item label="小问模版："  class="custom-form" v-show="templateSelectShow">
                <el-select
                  v-model="form.templateType"
                  placeholder="请选择"
                  style="width:160px;"
                  size="mini"
                  :disabled="isError"
                  @change="changeOption"
                >
                  <el-option
                    v-for="item in templateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>

              </el-form-item>
            </el-form>
          </div>
          <div class="tab-card">
            <el-radio-group v-model="activeName" size="mini">
              <el-radio-button label="stems" v-show="showQuestionTab" >问题</el-radio-button>
              <el-radio-button label="analysis">分析</el-radio-button>
              <el-radio-button label="answer">详解</el-radio-button>
            </el-radio-group>
            <div v-show="activeName=='stems'">
              <ckeditor ref="ck1" :readOnly="isError&&stemReadonly"></ckeditor>
            </div>
            <div v-show="activeName=='analysis'">
              <ckeditor ref="ck2" :readOnly="isError&&analysisReadonly"></ckeditor>
            </div>
            <div v-show="activeName=='answer'">
              <ckeditor ref="ck3" :readOnly="isError&&detailedAnaReadonly"></ckeditor>
            </div>

          </div>

          <!-- <div class="form-class" v-show="showjudgmentOptions">
            <el-form :model="form" style="margin-bottom:10px;">

              <el-form-item label="选项内容">
                <el-button
                  v-for="(item,index) in optionList"
                  size="mini"
                  type="primary"
                  plain
                  :class="{active: item.check}"
                  @click="choose_judgment(item)"
                >{{item.label}}</el-button>
              </el-form-item>
            </el-form>
            <Ueditor :writeMsg="defaultMsgA" :id="ueditorA" :config="configA" ref="ueA"></Ueditor>
          </div>-->
          <div class="form-class" v-show="templateKey=='SingleChoose' ||templateKey=='MultipleChoose'">
            <el-form :model="form" style="margin-bottom:10px;">
              <el-form-item label="选项个数" v-show="templateKey=='SingleChoose' ||templateKey=='MultipleChoose'">
                <el-select
                  v-model="form.optionNum"
                  placeholder="请选择"
                  style="width:60px;"
                  size="mini"
                  :disabled="isError"
                >
                  <el-option v-for="item in ansOptions" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选项内容">
                <el-radio-group v-model="currentOption" size="mini"  @change="choose_qusoption">
                  <el-radio-button
                    v-for="(list,index) in optionList"
                    v-if="index<form.optionNum"
                    :label="list"
                    :key="list.label"
                  >{{list.label}}</el-radio-button>
                </el-radio-group>


                 <!--<el-button
                  v-for="(item,index) in optionList"
                  v-if="index<form.optionNum"
                  size="mini"
                  type="primary"
                  plain
                  :class="{active: item.check}"
                  @click="choose_qusoption(item)"
                >{{item.label}}</el-button> -->
              </el-form-item>
            </el-form>
            <div v-show="templateKey=='SingleChoose' ||templateKey=='MultipleChoose' ||templateKey=='BoolenQuestion'">
              <ckeditor ref="ckA" v-show="currentOption.label == 'A'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckB" v-show="currentOption.label == 'B'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckC" v-show="currentOption.label == 'C'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckD" v-show="currentOption.label == 'D'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckE" v-show="currentOption.label == 'E'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckF" v-show="currentOption.label == 'F'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckG" v-show="currentOption.label == 'G'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ckH" v-show="currentOption.label == 'H'" :readOnly="isError&&optionReadonly"></ckeditor>
              <!-- <ckeditor ref="ck✓" v-show="currentOption.label == '✓'" :readOnly="isError&&optionReadonly"></ckeditor>
              <ckeditor ref="ck×" v-show="currentOption.label == '×'" :readOnly="isError&&optionReadonly"></ckeditor> -->
            </div>
            <!-- <div v-if="templateKey=='BoolentemplateKey'">
              <ckeditor ref="ckY" v-show="currentOption.label == 'Y'"></ckeditor>
              <ckeditor ref="ckN" v-show="currentOption.label == 'N'"></ckeditor>

            </div> -->
          </div>
          <div
            style="display:flex;margin-top:20px;"
            v-show="(templateKey=='SingleChoose' ||templateKey=='MultipleChoose'||templateKey=='BoolenQuestion')"
          >
            <p v-show="templateKey=='MultipleChoose'">
              <span>答案个数：</span>
              <el-select
                v-model="form.relOptionNum"
                placeholder="请选择"
                style="width:60px;margin-right:20px;"
                size="mini"
                :disabled="templateKey=='SingleChoose'||templateKey=='BoolenQuestion' ||isError"
              >
                <el-option v-for="item in relOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </p>
            <p v-show="templateKey=='SingleChoose' ||templateKey=='MultipleChoose'||templateKey=='BoolenQuestion'">
              <span style="">正确选项: </span>
              <el-select
                v-model="answers[index].value"
                placeholder="请选择"
                style="width:60px;margin-right:10px;"
                size="mini"
                v-for="(i,index) in answers"
                v-if="index<form.relOptionNum"
                :disabled="isError&&answerReadonly"
              >
                <el-option
                  v-for="(item,index) in optionList"
                  v-if="index<form.optionNum"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"

                ></el-option>
              </el-select>
              <span style="margin-left: 20px;" v-if="templateKey=='BoolenQuestion'">（提示：A:正确; B:错误）</span>
            </p>
            <!-- <p style="margin-right:10px;" v-show="templateKey=='FillingtemplateKey'">
              <span style="margin-left:20px;">正确答案:</span>
              <el-button
                v-for="(item,index) in answers"
                v-if="index<form.relOptionNum"
                @click="getfillAnswer(index)"
                size="mini"
                v-html="item"
              ></el-button>
            </p> -->
          </div>
          <div v-show="templateKey=='MatchingTemplate'" style="margin-top: 20px;">
            <span>正确答案：</span>
              <el-select
                v-model="form.marchingAnsw"
                placeholder="请选择"
                style="width:60px;margin-right:10px;"
                size="mini"
              >
                <el-option
                  v-for="(item,index) in marchingOption"
                  v-if="index<form.matchingNum"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>

          </div>
          <div style="text-align:center;margin-top:20px">
            <el-button type="primary" size="mini" @click="errorCorrection">纠 错</el-button>
          </div>
        </div>
      </div>
    </rightNav>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import rightNav from '@/components/Nav/rightNav'
import topPopover from "@/components/Popover/topPopover";
import pointTree from '@/components/Tree/pointTree'
import ckeditor from '@/components/CKeditor/CKeditorVue';


export default {
  components: {
    topPopover,
    rightNav,
    ckeditor,
    pointTree
  },
  data() {
    return {
      editable: false,
      activeType: "chapter",
      activeName: "analysis",
      filter: {
      	learningSection:'',
      	subjectCode: '',
      	volumeId:'',
      },
      sectionList:[],
      topReady: false,
      // gradeList: getgradeList,
      fillanswerVisible: false,
      fillindex: 0,
      questionOtions: [
        { label: 1, check: true, ques: "", analyze: "", answ: "" },
        { label: 2, check: false, ques: "", analyze: "", answ: "" },
        { label: 3, check: false, ques: "", analyze: "", answ: "" },
        { label: 4, check: false, ques: "", analyze: "", answ: "" },
        { label: 5, check: false, ques: "", analyze: "", answ: "" },
        { label: 6, check: false, ques: "", analyze: "", answ: "" },
        { label: 7, check: false, ques: "", analyze: "", answ: "" },
        { label: 8, check: false, ques: "", analyze: "", answ: "" },
        { label: 9, check: false, ques: "", analyze: "", answ: "" },
        { label: 10, check: false, ques: "", analyze: "", answ: "" },
        { label: 11, check: false, ques: "", analyze: "", answ: "" },
        { label: 12, check: false, ques: "", analyze: "", answ: "" },
        { label: 13, check: false, ques: "", analyze: "", answ: "" },
        { label: 14, check: false, ques: "", analyze: "", answ: "" },
        { label: 15, check: false, ques: "", analyze: "", answ: "" },
        { label: 16, check: false, ques: "", analyze: "", answ: "" },
        { label: 17, check: false, ques: "", analyze: "", answ: "" },
        { label: 18, check: false, ques: "", analyze: "", answ: "" },
        { label: 19, check: false, ques: "", analyze: "", answ: "" },
        { label: 20, check: false, ques: "", analyze: "", answ: "" },
        { label: 21, check: false, ques: "", analyze: "", answ: "" },
        { label: 22, check: false, ques: "", analyze: "", answ: "" },
        { label: 23, check: false, ques: "", analyze: "", answ: "" },
        { label: 24, check: false, ques: "", analyze: "", answ: "" },
        { label: 25, check: false, ques: "", analyze: "", answ: "" },
      ],
      //chooseAns: "A",
      ansOptions: [ 2, 3, 4, 5, 6, 7, 8],
      optionList: [
        { label: "A", check: true, content: "" },
        { label: "B", check: false, content: ""  },
        { label: "C", check: false, content: "" },
        { label: "D", check: false, content: "" },
        { label: "E", check: false, content: "" },
        { label: "F", check: false, content: "" },
        { label: "G", check: false, content: "" },
        { label: "H", check: false, content: "" }
      ],
      currentOption:'',

      marchingOption: [
        {index: 1, label:'A'},
        {index: 2, label:'B'},
        {index: 3, label:'C'},
        {index: 4, label:'D'},
        {index: 5, label:'E'},
        {index: 6, label:'F'},
        {index: 7, label:'G'},
        {index: 8, label:'H'},
        {index: 9, label:'I'},
        {index: 10, label:'J'},
        {index: 11, label:'K'},
        {index: 12, label:'L'},
        {index: 13, label:'M'}
      ],
      // judgmentoptionList: [
      //   { label: "对", check: true, content: "" },
      //   { label: "错", check: false, content: "" }
      // ],
      //ansCotent:[],
      relOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      answers: [{value:"A"}, {value:"A"}, {value:"A"}, {value:"A"},{value:"A"}, {value:"A"}, {value:"A"}, {value:"A"}],
      questionType: "",
      form: {
        optionNum: 4,
        relOptionNum: 1,
        questionNum: 1,
        templateType:'',
        difficulty: "",
        subjectId: "",
        matchingNum:7,
        subjectName:'',
        version: "",
        knowledge: "",
        marchingAnsw:'A'
      },
      difficultyList: [],
      typeList: [],
      tagsList:[],
      chapterTags:[],
      knowledgeTags:[],
      isActual: false,
      gradeDetailList: [],
      typeDisable: false,
      actualPaper:{},
      query:{},
      volumeId:'',
      subjectCode:'',
      // qnumDisable:false,
      templateList: [],
      versionList:[],
      volumeList:[],
      isError: false,
      questionDetail: {},
      oldQuestionDetail: {},
      stemReadonly: true,
      analysisReadonly: true,
      detailedAnaReadonly: true,
      optionReadonly:true,
      answerReadonly: true,
      chapterReadonly: true,
      knowledgeReadonly: true,
      chapterData:[],
      knowledgeData: [],
      isContinue: false,
    };
  },

  watch: {




    questionType(val) {

      if(!this.editable) {

        this.changeOption()

        // if (val == "SingleChoose" || val == "MultipleChoose") {
        //   this.optionList = [
        //     { label: "A", check: true, content: "" },
        //     { label: "B", check: false, content: "" },
        //     { label: "C", check: false, content: "" },
        //     { label: "D", check: false, content: "" },
        //     { label: "E", check: false, content: "" },
        //     { label: "F", check: false, content: "" },
        //     { label: "G", check: false, content: "" },
        //     { label: "H", check: false, content: "" }
        //   ];
        //   this.form.optionNum = 4;
        //   this.answers = ["A", "A", "A", "A", "A", "A", "A", "A"];

        //   if (val == "SingleChoose") {
        //     this.form.relOptionNum = 1;
        //   }else {
        //     this.form.relOptionNum = 2;
        //   }
        // } else if (val == "BoolenQuestion") {
        //   this.optionList = [
        //     { label: "对", check: true, content: "" },
        //     { label: "错", check: false, content: "" }
        //   ];

        //   this.form.optionNum = 2;
        //   this.form.relOptionNum = 1;
        //   this.answers = ["对"];
        // } else if (val == "FillingQuestionTemplate") {
        //   this.answers = ["答案","答案","答案","答案","答案","答案","答案","答案","答案"];
        // }
      }

    }
  },
  computed: {

    ...mapGetters([
      'gradeList',
      'getuserInfo',
      'isReady'

    ]),

    qnumDisable() {
      return true
      // if(this.questionTemplate == 'SingleChooseTemplate' || this.questionTemplate =='MultipleChooseTemplate' || this.questionTemplate =='BoolenQuestionTemplate' || this.questionTemplate =='FillingQuestionTemplate') {
        
      //   return true
      // }else {
      //   return false
        
      // }
    },


    showQuestionTab() {
      /*
      {id: "SingleChoose",name: "单选题类型"}
      {id: "MultipleChoose",name: "多选题类型"}
      {id: "BoolenQuestion",name: "判断题类型"}
      {id: "SubjectiveQuestionEnter",name: "主观题录入类"}
      {id: "NoAloneEnter",name: "问题无需单独录入"}
      */
      if(this.form.templateType == 'NoAloneEnter' ||this.form.questionNum == 1 ||this.questionTemplate =='MatchingTemplate' ||this.questionTemplate =='GestaltFillsUpTemplate' || this.templateKey == "FillingQuestionTemplate") {
        return false
      }else {
        return true
      }
    },
    questionTemplate() {

      let t = []
      t = this.typeList.filter(item=>{
        return item.code == this.questionType
      })

      if(t.length) {
        return t[0].template.id
      }else {
        return false
      }


    },

    templateSelectShow() {
      if((this.questionTemplate == 'SolvingQuestionTemplate' || this.questionTemplate =='ReadingComprehensionTemplate' || this.questionTemplate =='GestaltFillsUpTemplate') && this.form.questionNum>1) {
        return true
      }else {
        return false
      }
    },
    templateKey() {
      let key = ''
      if(this.questionTemplate == 'SingleChooseTemplate' || this.form.templateType == 'SingleChoose') {
        key = 'SingleChoose'
      }else if(this.questionTemplate == 'MultipleChooseTemplate' || this.form.templateType == 'MultipleChoose') {
        key = 'MultipleChoose'
      }else if(this.questionTemplate == 'BoolenQuestionTemplate' || this.form.templateType == 'BoolenQuestion') {
        key = 'BoolenQuestion'
      }else {
        key = this.questionTemplate
      }
      return key
    },

    




    /*
    SingleChooseTemplate: 单选题模板
    MultipleChooseTemplate: 多选题模板
    BoolenQuestionTemplate: 判断题模板
    FillingQuestionTemplateTemplate: 填空题模板
    SolvingQuestionTemplate: 综合题模板
    ReadingComprehensionTemplate: 阅读理解模板
    GestaltFillsUpTemplate: 完型填空模板
    MatchingTemplate: 信息匹配模板
    */
  },

  mounted() {


      this.getSmallQuestionsType()
    
      this.versionList = []
      this.volumeList = []

      // this.currentOption = this.optionList[0]
      this.query = this.$route.query
      if(this.query && this.query.questionId) {
        // this.isError = true
        this.typeDisable = true
        this.editable = true

        if(this.query.errorId) {
          this.isContinue = true
        }else {
          this.isContinue = false
        }


        this.getQuestionDetail()



      }



      this.getdifficultyType();  

  },
  methods: {

    getSmallQuestionsType() {

      this.$http.get(`/api/open/common/getSmallQuestionsType`)
      .then(data=>{
        if(data.status == '200') {
          this.templateList = data.data
        }
      })
    },
    // getyongshu() {

    //   this.$http.get(`/api/open/common/books/${this.getuserInfo.school.id}?subjectCode=${this.subjectCode}&grade=${this.actualPaper.grade}`)
    //   .then(data=>{
    //     if(data.status == '200') {
    //       this.versionList.push({oeseId:data.data.oese.id,name:data.data.oese.name})

    //       let arr = []
    //       data.data.volumes.forEach(item=>{
    //         arr.push({oeseId:item.id,name:item.name})
    //       })
    //       this.volumeList = arr
    //       this.topReady = true
    //     }
    //   })
    // },
    // init() {

    //   this.currentOption = this.optionList[0]
    //   this.query = this.$route.query
    //   if(this.query && this.query.paperId) {
    //     this.actualPaper = this.query
    //     this.isActual = true
    //     this.typeDisable = true
    //     this.subjectCode = this.actualPaper.subjectCode
        
    //     this.$http.get(`/api/open/common/books/${this.getuserInfo.school.id}?subjectCode=${this.subjectCode}&grade=${this.actualPaper.grade}`)
    //     .then(data=>{
    //       if(data.status == '200') {

    //       }
    //     })

    //   }else {
    //     this.topReady = true
    //     this.activeType = this.query.activeType?this.query.activeType:'chapter'
    //     this.isActual = false

    //   } 

      
       
    // },
    handleClick(tab, event) {
      if(this.activeType == "chapter") {
        this.tagsList = this.chapterTags
      }else {
        this.tagsList = this.knowledgeTags
      }
    },


    setparams(learningSection,volumeId,subjectCode) {
      if(volumeId) {

        this.filter.volumeId = volumeId

        this.getChapterTree()
      }

    	if(learningSection && subjectCode) {
	      this.filter.learningSection = learningSection
	      

	      if(this.filter.subjectCode != subjectCode) {
	        this.filter.subjectCode = subjectCode
          // console.log(this.filter.subjectCode)
	        this.getquestionType()

	      }

	      this.getKonwladgeTree()
    	}

       



    },

  	getChapterTree() {
        		

      if(this.filter.volumeId) { 
        this.$http.get(`/api/internal/chapter/chapterTree/${this.filter.volumeId}`)
        .then((data)=>{
          if(data.status == '200') {
            this.chapterData = data.data

          } 
            
        }) 
      } 


  	},
    getKonwladgeTree() {
        this.$http.get(`/api/internal/knowledge/knowledgeTree?learningSection=${this.filter.learningSection}&subjectCode=${this.filter.subjectCode}`)
        .then((data)=>{
          if(data.status == '200') {
            this.knowledgeData = data.data


            } 
        })
    },
    changequestionNum(val) {

      this.activeName = this.showQuestionTab? 'stems': "analysis"
      // val == 1 ? (this.activeName = "analysis") : null;
    },

    // choose_difficulty(list) {
    //   this.difficultyList.forEach(item => {
    //     item.check = false;
    //   });
    //   list.check = true;
    //   this.form.difficulty = list.label;
    // },


    changeOption() {
      this.activeName = this.showQuestionTab? 'stems': "analysis"

      if(this.questionTemplate == 'SolvingQuestionTemplate' || this.questionTemplate =='ReadingComprehensionTemplate' || this.questionTemplate =='GestaltFillsUpTemplate' ) {
        // (!flag && this.form.questionNum>1)?this.form.templateType = this.templateList[0].id:null
        this.form.questionNum == 1?this.form.templateType = '':null
      }else {
        this.form.marchingAnsw = this.questionTemplate =='MatchingTemplate'?  "A":''
        this.form.templateType = ''
      }


        if (this.templateKey == "SingleChoose" || this.templateKey == "MultipleChoose") {
          // this.qnumDisable = false
          
          this.optionList = [
            { label: "A", check: true, content: "" },
            { label: "B", check: false, content: "" },
            { label: "C", check: false, content: "" },
            { label: "D", check: false, content: "" },
            { label: "E", check: false, content: "" },
            { label: "F", check: false, content: "" },
            { label: "G", check: false, content: "" },
            { label: "H", check: false, content: "" }
          ];

          this.currentOption = this.optionList[0]
          this.form.optionNum = 4;
          this.answers = [{value:"A"}, {value:"A"}, {value:"A"}, {value:"A"},{value:"A"}, {value:"A"}, {value:"A"}, {value:"A"}];

          if (this.templateKey == "SingleChoose") {
            this.form.relOptionNum = 1;
          }else {
            this.form.relOptionNum = 2;
            this.relOptions = [ 2, 3, 4, 5, 6, 7, 8]
          }
        } else if (this.templateKey == "BoolenQuestion") {
          // this.qnumDisable = false
          
          this.optionList = [
            { label: "A", content: "正确" },
            { label: "B", content: "错误" }
            // { label: "✓", content: "" },
            // { label: "×", content: "" }
          ];
          this.currentOption = this.optionList[0]
          this.form.optionNum = 2;
          this.form.relOptionNum = 1;
          this.answers = [{value:"✓"}];
        } else if (this.templateKey == "FillingQuestionTemplate") {
          
          this.form.questionNum = 1
          // this.qnumDisable = true
          this.form.optionNum = 0
          this.form.relOptionNum = 0
          // this.form.relOptionNum = 1
          // this.answers = ["答案","答案","答案","答案","答案","答案","答案","答案","答案"];
          // this.relOptions = [1, 2, 3, 4, 5, 6, 7, 8]
        } else {
          // this.qnumDisable = false
          this.form.optionNum = 0
          this.form.relOptionNum = 0

          // if(this.questionTemplate == ('SolvingQuestionTemplate'||'GestaltFillsUpTemplate')) {
          //   this.templateList: [
          //     {key:'SingleChoose',value:'单选题'},
          //     {key:'MultipleChoose',value:'多选题'},
          //     {key:'BoolenQuestion',value:'判断题'},
          //     {key:'SubjectiveItem',value:'主观题录入类'},
          //     {key:'NoSingleQues',value:'问题无需单独录入'},
          //   ]
          // }else if(this.questionTemplate == 'GestaltFillsUpTemplate') {
          //   this.templateList: [
          //     {key:'SingleChoose',value:'单选题'},
          //     {key:'MultipleChoose',value:'多选题'},
          //     {key:'BoolenQuestion',value:'判断题'},
          //     {key:'SubjectiveItem',value:'主观题录入类'},
          //     {key:'NoSingleQues',value:'问题无需单独录入'},
          //   ]
          // }
        }


    },

     changeType() {

      if(this.editable) {
        this.changeOption()
        // if (this.questionType == "SingleChoose" || this.questionType == "MultipleChoose") {
        //   this.optionList = [
        //     { label: "A", check: true, content: "" },
        //     { label: "B", check: false, content: "" },
        //     { label: "C", check: false, content: "" },
        //     { label: "D", check: false, content: "" },
        //     { label: "E", check: false, content: "" },
        //     { label: "F", check: false, content: "" },
        //     { label: "G", check: false, content: "" },
        //     { label: "H", check: false, content: "" }
        //   ];
        //   this.form.optionNum = 4;
        //   this.answers = ["A", "A", "A", "A", "A", "A", "A", "A"];

        //   if (this.questionType == "SingleChoose") {
        //     this.form.relOptionNum = 1;
        //   }else {
        //     this.form.relOptionNum = 2;
        //   }
        // } else if (this.questionType == "BoolenQuestion") {

        //   this.optionList = [
        //     { label: "对", check: true, content: "" },
        //     { label: "错", check: false, content: "" }
        //   ];

        //   this.form.optionNum = 2;
        //   this.form.relOptionNum = 1;
        //   this.answers = ["对"];
        // } else if (this.questionType == "FillingQuestionTemplate") {
        //   this.answers = ["答案","答案","答案","答案","答案","答案","答案","答案","答案"];
        // }
      }

      
    },

    choose_qusoption(list) {
      // let str = this.$refs.ckA.getData();

      // console.log(this.currentOption)
      // this.optionList.forEach(item => {
      //   item.check ? (item.content = str) : "";
      //   item.check = false;
      // });
      // list.check = true;
      // this.$refs.ueA.setData(list.content);
      // console.log(this.optionList);

      // this.chooseAns = list.label;
    },

    save_prev(flag) {
      // let option = this.$refs.ueA.getData();
      // this.optionList.forEach(item => {
      //   item.check ? (item.content = option) : "";
      //   item.check = false;
      // });

      if(this.templateKey == "SingleChoose" ||this.templateKey == "MultipleChoose" ) {
        this.optionList.forEach(item=>{
          let str = this.$refs[`ck${item.label}`].getData()
          item.content = str?str:''
        })
      }



      
      let ques = ''
      if(this.form.questionNum!=1 && this.form.templateType!='NoAloneEnter'){
        ques = this.$refs.ck1.getData()
        
      }
      // console.log(this.questionOtions)
      let analyze = this.$refs.ck2.getData();
      let answ = this.$refs.ck3.getData();
      this.questionOtions.forEach(item => {
        if (item.check) {
          item.edit = true;
          item.ques = ques;
          item.analyze = analyze;
          item.answ = answ;
          item.questionType = this.form.templateType;
          item.templateKey = this.templateKey;
          item.questionType = this.form.templateType;
          item.difficulty = this.form.difficulty;
          item.selectOptions = this.optionList;
          item.answers = this.answers;
          item.optionNum = this.form.optionNum;
          item.relOptionNum = this.form.relOptionNum;
          item.marchingAnsw = this.form.marchingAnsw;
          item.showQuestionTab = this.showQuestionTab
        }
        
        flag?item.check = false:null;
      });


      // this.$refs.ueA.setData("");
    },
    choose_quesnum(list) {
      this.save_prev(true);

      
      this.activeName = list.showQuestionTab? 'stems': "analysis"



      this.editable = list.edit ? true : false;

      this.form.templateType = list.questionType?list.questionType:''



        list.ques = list.ques?list.ques:''
        list.analyze = list.analyze?list.analyze:''
        list.answ = list.answ?list.answ:''
        if(this.form.templateType != 'NoAloneEnter') {
          this.$nextTick(()=>{
            this.$refs.ck1.setData(list.ques);
          })
        }
        
        this.$refs.ck2.setData(list.analyze);
        this.$refs.ck3.setData(list.answ);

      if(list.edit) {

        this.form.marchingAnsw = list.marchingAnsw
        // this.form.templateType = list.templateType
        
        this.optionList = list.selectOptions
        this.currentOption = (this.optionList && this.optionList.length)?this.optionList[0]:''
        // this.optionList[0].check = true
        this.form.optionNum = list.optionNum;

        this.form.relOptionNum = list.relOptionNum

        this.answers = list.answers
        
        if(this.templateKey == "SingleChoose" ||this.templateKey == "MultipleChoose" ||this.templateKey == "BoolenQuestion") {
          this.$nextTick(()=>{
            this.optionList.forEach(item=>{
              this.$refs[`ck${item.label}`].setData(item.content)
            })
          })
        }
        
        // this.$refs.ueA.setData(this.optionList[0].content);
        this.form.optionNum = list.optionNum;
        this.form.relOptionNum = list.relOptionNum
        this.answers = list.answers

      }else {
        this.form.marchingAnsw = ''
        // this.form.templateType = ''
        this.changeOption()
        // if(this.templateKey == "SingleChoose" ||this.templateKey == "MultipleChoose" ||this.templateKey == "BoolenQuestion") {
          this.$nextTick(()=>{
            this.optionList.forEach(item=>{
              // this.$refs.ueA.setData('')
              this.$refs[`ck${item.label}`].setData('')
            })
          })
          
        // }
        
      }
      //console.log(this.questionOtions,this.optionList)

      
      list.check = true;
    },

    // getfillAnswer(index) {
    //   let ans = this.answers[index] == "答案" ? "" : this.answers[index];

    //   this.fillanswerVisible = true;
    //   this.$refs.ckFill.setData(ans)
    //   this.fillindex = index;
    // },

    // setfillAnswer() {
    //   let answ = this.$refs.ueFill.getData();
    //   this.answers[this.fillindex] = answ;
    //   this.fillanswerVisible = false;
    // },

    defaultCheckChapters() {

      this.$refs.chapterTree.setNodesByIds(this.questionDetail.chapters)
    },

    defaultCheckKnows() {

      this.$refs.knowledgeTree.setNodesByIds(this.questionDetail.knowledges)
    },
    getCheckedChapters(list) {

      this.chapterTags = list

      this.activeType == "chapter"? this.tagsList = this.chapterTags:null

    },

    getCheckedKnows(list) {
      this.knowledgeTags = list
      this.activeType == "knowledge"?this.tagsList = this.knowledgeTags:null
    },


    closeTag(index) {

      if(this.activeType == "chapter") {

        // this.tagsList = this.chapterTags
        this.chapterTags.splice(index,1)
        this.$refs.chapterTree.setCheckedNodes(this.chapterTags)
        // console.log(this.chapterTags,this.tagsList)
      }else {
        this.knowledgeTags.splice(index,1)
        this.$refs.knowledgeTree.setCheckedNodes(this.knowledgeTags)
        // this.tagsList = this.knowledgeTags
      }
      // console.log(this.chapterTags)
    },
    getquestionType() {

      this.$http.get(`/api/open/common/getQuestionType/${this.filter.learningSection}/${this.filter.subjectCode}`)
      .then((data)=>{
        if (data.status == "200") {
          // let arr = []
          // data.data.forEach(item=>{
          //   item.value != '综合题'?arr.push(item):null
          // })
          this.typeList = data.data;
          // console.log(this.typeList)
          //真题试卷

            this.questionType = this.typeList.filter(item=>{
              return item.code == this.questionDetail.questionType
            })[0].code 

            if(this.templateKey == 'BoolenQuestion') {
              this.optionList = [
                { label: "A", content: "正确" },
                { label: "B", content: "错误" }
                // { label: "×", content: "" },
                // { label: "✓", content: "" }
              ];
              this.form.optionNum = 2;
            }

        } 
      })
    },

    getdifficultyType() {
      this.$http.get(`/api/open/common/difficultyType`)
        .then(data => {
          if (data.status == "200") {
            this.difficultyList = data.data;

            this.form.difficulty = this.form.difficulty? this.form.difficulty: this.difficultyList[0].key;
          }
        })
 
    },

    errorCorrection() {
      this.save_prev();
      let questions = [];
      let name = this.$refs.ck0.getData();

      if(!name) {
        return this.$message.warning('题干不可以为空！')
      }
      let knowledgeIds = []
      let chapterIds = []


      this.knowledgeTags.forEach(item=>{
        knowledgeIds.push(item.id)
      })


      this.chapterTags.forEach(item=>{
        chapterIds.push(item.id)
      })

      if(!knowledgeIds.length && !chapterIds.length) {
        return this.$message({
                  message:'必须选择章节或者知识点',
                  type:'warning'
                })
      }


      for (let i = 0; i < this.form.questionNum; i++) {

        if(this.form.questionNum > 1 && !this.questionOtions[i].questionType) {
          return this.$message.warning('请完善小题')
        }
        questions[i] = {}
        let selectOption = []
        let answerOption =[]
        let type = this.questionOtions[i].templateKey
        let temptype = this.questionOtions[i].templateType
        //  信息匹配的答案
        console.log(this.questionOtions[i])
        if ( type == "SingleChoose" ||type == "MultipleChoose" ||type == "BoolenQuestion") {
          // console.log(type,this.questionOtions)
          // if(type == "SingleChoose" ||type == "MultipleChoose") {
            let optionflag = false
            for (let j = 0; j < this.questionOtions[i].optionNum; j++) {
              if(this.questionOtions[i].selectOptions[j].content) {
                selectOption.push({word:this.questionOtions[i].selectOptions[j].label,content:this.questionOtions[i].selectOptions[j].content});
              }else {
                optionflag = true

              }
              
            }

            if(optionflag)  {
              return this.$message({
                message:'选项不可以为空',
                type:'warning'
              })
            } 
          // }
         
          

          
          let answerflag = false
          for (let j = 0; j < this.questionOtions[i].relOptionNum; j++) {
            if(this.questionOtions[i].answers[j].value) {
              answerOption.push({sort:j+1,content:this.questionOtions[i].answers[j].value});
            }else {

              answerflag = true

            }
            
          }
          if(answerflag) {
            return this.$message({
              message:'答案不可以为空',
              type:'warning'
            })
          }
        }else if(type == "MatchingTemplate") {
          answerOption.push({sort:1, content: this.questionOtions[i].marchingAnsw})
        }


        //this.questionOtions[i].questionOptions = selectOption
        //this.questionOtions[i].fillAnswers = answerOption


        questions[i] = {
          questionType: this.questionOtions[i].questionType,
          name: this.questionOtions[i].ques,
          questionId: this.questionOtions[i].questionId,
          //answer: this.optionList[i].,
          analysis: this.questionOtions[i].analyze,
          detailedAnalysis:this.questionOtions[i].answ,
          difficulty: this.form.difficulty,
          knowledgeId: knowledgeIds,
          chapterId: chapterIds,
          subjectCode: this.filter.subjectCode,
          oeseId:this.filter.volumeId,
          // subjectName: this.form.subjectName,
          //schoolId:'',
          // grade: this.form.grade.key,
          //learningSection:'',
          //userId:'',
          //edition:'',
          parentId: 0,
          //openState:'',
          //applyState:'',
          questionOptions: selectOption,
          fillAnswers: answerOption,
          //questions
        }

        // if(this.activeType == "chapter") {
        //   questions[i].knowledgeId = []
        // }else {
        //   questions[i].chapterId = []
        // }
        
      }
      // console.log(questions)
      

      // console.log(questions)


      let requestBody = {}
      if(questions.length == 1) {
        questions[0].name = name
        questions[0].questionType = this.questionType
        questions[0].questionId = this.query.questionId
        questions[0].optionNum = this.form.matchingNum?this.form.matchingNum:0  //信息匹配的选项数
        requestBody = questions[0]
      }else {
        requestBody = {
          name: name,
          questionType: this.questionType,
          questionId: this.query.questionId,
          difficulty: this.form.difficulty,
          knowledgeId: knowledgeIds,
          chapterId: chapterIds,
          subjectCode: this.filter.subjectCode,
          oeseId:this.filter.volumeId,
          // subjectName: this.form.subjectName,
          parentId: 0,
          optionNum: this.form.matchingNum?this.form.matchingNum:0,   //信息匹配的选项数
          questions: questions
        }
      }
      // console.log(requestBody);


      if(this.isContinue) {
        this.$http.put(`/api/internal/question/${this.query.questionId}/errorCorrection/${this.query.errorId}`,requestBody)
        .then((data)=>{
          if(data.status == '200') {

            this.$message.success('纠错成功')
            this.$router.go(-1)


          }

        })      
      }else {
        this.$http.put(`/api/internal/question/${this.query.questionId}`,requestBody)
        .then((data)=>{
          if(data.status == '200') {

            this.$message.success('纠错成功')
            this.$router.go(-1)


          }

        })  
      }

      




      
    },
    // errorCorrection() {


    //   this.save_prev();


    //   let errorContentList = []

    //   let flag = false
    //   if(this.query.errorType == 'StemError') { //题干错误
    //     let name = this.$refs.ck0.getData()
    //     if(name !== this.questionDetail.name) {
    //       flag = true
    //       errorContentList.push({questionContent:name})
    //     }
    //     if(this.form.questionNum>1) {
    //       for(let i=0;i<this.form.questionNum;i++) {
    //         if(this.questionOtions[i].showQuestionTab) {
    //           if(this.questionOtions[i].ques !== this.oldQuestionDetail[i].ques) {
    //             flag = true
    //             errorContentList.push({questionContent:this.questionOtions[i].ques, questionId:this.questionOtions[i].questionId})
    //           }
    //         }
    //       }
    //     }


    //   }else if(this.query.errorType == 'AnalysisError') {//分析错误
    //     if(this.form.questionNum == 1) {
    //       if(this.questionOtions[0].analyze !== this.oldQuestionDetail[0].analyze) {
    //         flag = true
    //         errorContentList.push({questionContent:this.questionOtions[0].analyze})
    //       }
    //     }else {
    //       for(let i=0;i<this.form.questionNum;i++) {
    //         if(this.questionOtions[i].analyze !== this.oldQuestionDetail[i].analyze) {
    //           flag = true
    //           errorContentList.push({questionContent:this.questionOtions[i].analyze, questionId:this.questionOtions[i].questionId})
    //         }
            
    //       }
    //     }
    //   }else if(this.query.errorType == 'DetailedAnalysisErrors') {//详解错误
    //     if(this.form.questionNum == 1) {
    //       if(this.questionOtions[0].answ !== this.oldQuestionDetail[0].answ) {
    //         flag = true
    //         errorContentList.push({questionContent:this.questionOtions[0].answ})
    //       }
    //     }else {
    //       for(let i=0;i<this.form.questionNum;i++) {
    //         if(this.questionOtions[i].answ !== this.oldQuestionDetail[i].answ) {
    //           flag = true
    //           errorContentList.push({questionContent:this.questionOtions[i].answ, questionId:this.questionOtions[i].questionId})
    //         }
            
    //       }
    //     }
    //   }else if(this.query.errorType == 'OptionError') {//选项错误
    //     if(this.form.questionNum == 1) {
    //       for(let i=0;i<this.questionOtions[0].selectOptions.length;i++) {
    //         if(this.questionOtions[0].selectOptions[i].content !== this.oldQuestionDetail[0].selectOptions[i].content) {
    //           flag = true
    //           errorContentList.push({
    //             questionContent:this.questionOtions[0].selectOptions[i].content, 
    //             marking: this.questionOtions[0].selectOptions[i].id
    //           })
    //         }            
    //       }
    //     }else {

    //       for(let i=0;i<this.form.questionNum;i++) {

    //         for(let j=0;j<this.questionOtions[i].selectOptions.length;j++) {
    //           if(this.questionOtions[i].selectOptions[j].content !== this.oldQuestionDetail[i].selectOptions[j].content) {
    //             flag = true
    //             errorContentList.push({
    //               questionContent:this.questionOtions[i].selectOptions[j].content, 
    //               questionId:this.questionOtions[i].questionId,
    //               marking: this.questionOtions[i].selectOptions[j].id
    //             })
    //           }            
    //         }

    //       }
    //     }
    //   }else if(this.query.errorType == 'AnswerError') {//答案错误
    //     if(this.form.questionNum == 1) {
    //       for(let i=0;i<this.questionOtions[0].answers.length;i++) {
    //         if(this.questionOtions[0].answers[i].value !== this.oldQuestionDetail[0].answers[i].value) {
    //           flag = true
    //           errorContentList.push({
    //             questionContent:this.questionOtions[0].answers[i].value, 
    //             marking: this.questionOtions[0].answers[i].id
    //           })
    //         }            
    //       }
    //     }else {

    //       for(let i=0;i<this.form.questionNum;i++) {

    //         for(let j=0;j<this.questionOtions[i].answers.length;j++) {
    //           if(this.questionOtions[i].answers[j].value !== this.oldQuestionDetail[i].answers[j].value) {
    //             flag = true
    //             errorContentList.push({
    //               questionContent:this.questionOtions[i].answers[j].value, 
    //               questionId:this.questionOtions[i].questionId,
    //               marking: this.questionOtions[i].answers[j].id
    //             })
    //           }            
    //         }

    //       }
    //     }
    //   }else if(this.query.errorType == 'ChapterError') {//章节错误

    //     let list = []
    //     this.questionDetail.chapters.forEach(item=>{
    //       list.push(item.id)
    //     })

    //     if(this.chapterTags.length != this.questionDetail.chapters.length) { flag = true }

    //     this.chapterTags.forEach(item=>{
    //       if(list.indexOf(item.id)==-1) {
    //         flag = true
    //       }
    //       errorContentList.push({
    //         questionContent:item.id, 
    //         marking: item.id
    //       })

    //     })

    //   }else if(this.query.errorType == 'KnowledgeError') {//知识点错误
    //     let list = []
    //     this.questionDetail.knowledges.forEach(item=>{
    //       list.push(item.id)
    //     })

    //     if(this.knowledgeTags.length != this.questionDetail.knowledges.length) { flag = true }

    //     this.knowledgeTags.forEach(item=>{
    //       if(list.indexOf(item.id)==-1) {
    //         flag = true
    //       }
    //       errorContentList.push({
    //         questionContent:item.id, 
    //         marking: item.id
    //       })

    //     })
    //   }

    //   if(!flag) {
    //     return this.$message.warning('未进行任何纠错，请确认')
    //   }

    //   this.$http.post(`/api/open/errorCorrection/addErrorCorrection`,{
    //     errorType: this.query.errorType,
    //     questionId: this.query.questionId,
    //     content: Cookies.get('errorContent'),
    //     errorContentList: errorContentList
    //   })
    //   .then(data=>{
    //     if(data.status == '200') {
    //       Cookies.set("errorContent", '')
    //       this.$message.success('纠错成功')
    //       this.$router.go(-1)
    //     }
    //   })

    // },

    getQuestionDetail() {


      if(this.isContinue) {

        this.$http.get(`/api/internal/errorCorrection/${this.query.errorId}`)
        .then(data=>{
          if(data.status == '200') {

            this.questionDetail = data.data

            this.handleQuestionDetail()
          }
        })


      }else {


        this.$http.get(`/api/open/question/${this.query.questionId}`)
        .then(data=>{
          if(data.status == '200') {

            this.questionDetail = data.data

            this.handleQuestionDetail()


          }
        })
      }


    },


    handleQuestionDetail() {

          // this.activeType = (this.questionDetail.chapters && this.questionDetail.chapters.length)?'chapter':'knowledge'

          this.$refs.ck0.setData(this.questionDetail.name)

          this.questionDetail.oeseId = this.questionDetail.oese && this.questionDetail.oese.id? this.questionDetail.oese.id:''
          this.questionDetail.volumeId = this.questionDetail.oeseBook && this.questionDetail.oeseBook.id? this.questionDetail.oeseBook.id:''

          if(this.questionDetail.smallQuestions && this.questionDetail.smallQuestions.length) {

            this.form.questionNum = this.questionDetail.smallQuestions.length

            for(let i=0;i<this.questionDetail.smallQuestions.length;i++) {

              this.questionOtions[i].edit = true;
              this.questionOtions[i].ques = this.questionDetail.smallQuestions[i].name;
              this.questionOtions[i].analyze = this.questionDetail.smallQuestions[i].analysis;
              this.questionOtions[i].answ = this.questionDetail.smallQuestions[i].detailedAnalysis;
              this.questionOtions[i].questionId = this.questionDetail.smallQuestions[i].questionId;
              this.questionOtions[i].questionType = this.questionDetail.smallQuestions[i].questionType
              this.questionOtions[i].difficulty = this.questionDetail.difficultyType;

              this.questionOtions[i].templateKey = this.getTemplateKey(this.questionDetail.smallQuestions[i].questionType)

              let arr = []

              for(let j=0;j<this.questionDetail.smallQuestions[i].options.length;j++) {

                arr[j] = {}

                for(let k=0;k<this.optionList.length;k++) {

                  if(this.questionDetail.smallQuestions[i].options[j].key == this.optionList[k].label) {

                    arr[j] = this.optionList[k]

                    arr[j].content = this.questionDetail.smallQuestions[i].options[j].value.name

                    arr[j].id = this.questionDetail.smallQuestions[i].options[j].value.id

                    break

                  }

                }

              }
              



              // if(this.questionDetail.smallQuestions[i].options && this.questionDetail.smallQuestions[i].options.length) {
              //   if(this.questionDetail.smallQuestions[i].fillAnswers.length > 1) {
              //     this.questionOtions[i].templateType = 'MultipleChoose'
              //   }else {
              //     this.questionOtions[i].templateType = 'SingleChoose'
              //   }
              // }else if(this.questionDetail.smallQuestions[i].fillAnswers && this.questionDetail.smallQuestions[i].fillAnswers.length) {
              //   this.questionOtions[i].templateType = 'BoolenQuestion'
              // }else if(!this.questionDetail.smallQuestions[i].name) {
              //   this.questionOtions[i].templateType = 'NoSingleQues'
              // }else {
              //   this.questionOtions[i].templateType = 'SubjectiveItem'
              // }

       
              this.questionOtions[i].selectOptions = JSON.parse(JSON.stringify(arr));
              this.questionOtions[i].answers = []
              for(let j=0;j<this.questionDetail.smallQuestions[i].fillAnswers.length;j++) {
                this.questionOtions[i].answers[j] = {}
                this.questionOtions[i].answers[j].value = this.questionDetail.smallQuestions[i].fillAnswers[j].value.name
                this.questionOtions[i].answers[j].id = this.questionDetail.smallQuestions[i].fillAnswers[j].value.id
              }
              // this.questionOtions[i].answers = 
              this.questionOtions[i].optionNum = this.questionDetail.smallQuestions[i].options.length;
              this.questionOtions[i].relOptionNum = this.questionDetail.smallQuestions[i].fillAnswers.length;
              // this.questionOtions[i].marchingAnsw = this.questionDetail.smallQuestions[i].name;
              this.questionOtions[i].showQuestionTab = this.questionDetail.smallQuestions[i].name?true:false;


            }
            
            // this.questionOtions[0].showQuestionTab?this.$refs.ck1.setData(this.questionOtions[0].ques):null
            // this.$refs.ck2.setData(this.questionOtions[0].analyze)
            // this.$refs.ck3.setData(this.questionOtions[0].answ)

            this.form.templateType = this.questionOtions[0].questionType
            if(this.questionOtions[0].showQuestionTab) {
              this.$refs.ck1.setData(this.questionOtions[0].ques)
              this.activeName = 'stems'
            }else {
              this.activeName = 'analysis'
            }


          }else {
            this.form.questionNum = 1
            this.questionOtions[0].edit = true;
            this.questionOtions[0].ques = this.questionDetail.name;
            this.questionOtions[0].analyze = this.questionDetail.analysis;
            this.questionOtions[0].answ = this.questionDetail.detailedAnalysis;
            this.questionOtions[0].difficulty = this.questionDetail.difficultyType;

            let arr = []

            for(let i=0;i<this.questionDetail.options.length;i++) {
              arr[i] = {}
              for(let j=0;j<this.optionList.length;j++) {

                if(this.questionDetail.options[i].key == this.optionList[j].label) {

                  arr[i] = this.optionList[j]
                  arr[i].content = this.questionDetail.options[i].value.name
                  arr[i].id = this.questionDetail.options[i].value.id
                  break

                }
              }
            }

            this.questionOtions[0].selectOptions = arr
            this.questionOtions[0].answers = []
            for(let i=0;i<this.questionDetail.fillAnswers.length;i++) {
              this.questionOtions[0].answers[i] = {}
              this.questionOtions[0].answers[i].value = this.questionDetail.fillAnswers[i].value.name
              this.questionOtions[0].answers[i].id = this.questionDetail.fillAnswers[i].value.id
            }
            this.questionOtions[0].optionNum = this.questionDetail.options.length;
            this.questionOtions[0].relOptionNum = this.questionDetail.fillAnswers.length;
            // this.questionOtions[0].marchingAnsw = this.questionDetail.smallQuestions[0].name;
            this.questionOtions[0].showQuestionTab = this.questionDetail.name?true:false;
            this.activeName = 'analysis'
          }


            // this.questionOtions[0].showQuestionTab?this.$refs.ck1.setData(this.questionOtions[0].ques):null
            this.$refs.ck2.setData(this.questionOtions[0].analyze)
            this.$refs.ck3.setData(this.questionOtions[0].answ)

            this.form.difficulty = this.questionOtions[0].difficulty
            this.form.optionNum = this.questionOtions[0].optionNum
            this.form.relOptionNum = this.questionOtions[0].relOptionNum
            this.answers = this.questionOtions[0].answers
            this.optionList = this.questionOtions[0].selectOptions
            this.questionOtions[0].selectOptions.forEach(item=>{
              this.$refs[`ck${item.label}`].setData(item.content)
            })

            this.form.matchingNum = this.questionDetail.optionNum

            if(this.questionOtions[0].selectOptions && this.questionOtions[0].selectOptions.length) {
              this.currentOption = this.optionList[0]
            }


          console.log(this.questionOtions)

          this.oldQuestionDetail = JSON.parse(JSON.stringify(this.questionOtions));
          // console.log(this.oldQuestionDetail)
          this.topReady = true
    },

    getTemplateKey(type) {
      let key = ''
      if(type == 'SingleChooseTemplate' || type == 'SingleChoose') {
        key = 'SingleChoose'
      }else if(type == 'MultipleChooseTemplate' || type == 'MultipleChoose') {
        key = 'MultipleChoose'
      }else if(type == 'BoolenQuestionTemplate' || type == 'BoolenQuestion') {
        key = 'BoolenQuestion'
      }else {
        key = type
      }
      return key
    },

  }
};
</script>
<style lang="less">
.addques-home {


  .custom-form {
    .el-form-item__label {
      flex-shrink: 0;
    }
    .el-button--mini, .el-button--mini.is-round {
      margin-left: 10px;
    }

    .el-form-item__content {
      margin-left: -10px
    }
  }

  .right-wrap {
    // width: 80% !important;
  }
  .el-form-item {
    margin-bottom: 0px;
    display: flex;
    align-items: center;
  }

  .el-form-item__label {
    min-width: 70px;
    text-align: left;
    flex-shrink: 0;
  }


  .form-class {


    .el-radio-button:first-child .el-radio-button__inner {
      border-left: 1px solid #b3d8ff;
    }

    .el-radio-button__orig-radio:disabled+.el-radio-button__inner {
      border-left: 1px solid #EBEEF5;
      margin-bottom: 10px;
    }
  }
  .el-dialog__wrapper {
    z-index: 1002 !important;
  }

  .v-modal {
    z-index:1000 !important;
  }

  .mutirow {
    .el-form-item__label {
      flex-shrink: 0;
      top: 5px;
      position: relative;
    }

    .el-radio-button {
      
      margin-top: 10px;
    }
  }
  .el-radio-button {
    margin-right: 10px;
    
  }

  .tab-card {
    .el-radio-button {
      margin-right: 0px;
      
    }

    .el-radio-button__inner {
      background: transparent;
      height: 30px;
      line-height: 1.2;
      border-left: 1px solid #e2e2e2;
    }
    // .el-radio-button:first-child .el-radio-button__inner {
    //   border-left: 1px solid #e2e2e2;
    // }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      color: #409EFF;
      border-color: #e2e2e2;
      box-shadow: 0px 0 0 0 #409EFF;
    }
  }
  // .el-radio-button:last-child .el-radio-button__inner {
  //   border-radius: 3px;
  // }

  .set-form {
    .el-tabs__header {
      margin: 0px;
    }

    .el-tabs--card > .el-tabs__header {
      border-bottom: 0px;
    }

    .el-form-item__content {
      line-height: 20px;
      width: 100%;
    }

    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      color: #606266;
    }
    .el-tabs__item:hover {
      color: #409eff;
    }
    .el-tabs__item.is-active {
      color: #409eff;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
      border-bottom: none;
    }
  }
}
</style>
<style lang="less" scoped>
.addques-home {

  .left {
    height: 100%;
    //padding-top: 10px;

    .tree-class {
      height: calc(100vh - 250px);
      overflow-y: auto;
      margin-top: 10px;
    }

    .point-tree {
      // height: calc(100vh - 300px);
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
  .content-class {
    font-size: 14px;
    margin-bottom: 20px;
    height: calc(100vh - 150px);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 20px;
    p {
      line-height: 30px;
    }

    .tag-class {
      margin-left: -10px;
      min-height: 42px;
    }

    .form-class {
      margin: 10px 0;
    }

    .active {
      background: #409eff;
      border-color: #409eff;
      color: #fff;
      outline: 0;
    }
  }
}
</style>