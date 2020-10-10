<template>
	<div class="collapsible-point">
		<div class="collapsible-point-wrap" :class="{hiddenclass:isHidden}">

			<div class="aside-class"  @click="isHidden = !isHidden" >
				<i class="iconfont iconxiangzuo1 aside-icon" v-show="!isHidden"></i>
				<i class="iconfont iconxiangyou2 aside-icon" style="top: 16%;" v-show="isHidden"></i>
			</div>


			<div v-show="!isHidden">
		    <topTabs :tabsList="headList" @changeTabs="changeTabs">
		      <div slot="tab-content">
		        <div v-show="activeType == 'organizations'">
		          <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
		          <div class="tree-class">
		            
		            <basicTree :tree-data="orgData" :filterText="filterText" @selectnode="orgNodeClick" @handleNodeClick="orgNodeClick"></basicTree>
		          </div>
		        </div>

		        <div v-show="activeType == 'knowledge'">
		          <top-popover :chooseType="knowType" ref="filter" @setparams="setparams" @clearData="clearData">
		            <div slot="reference" class="search-class">
		              <span v-if="$refs.filter">{{$refs.filter.learningSection.value}}</span>
		              <span v-if="$refs.filter">{{$refs.filter.subject.value}}</span>
		              <span v-if="$refs.filter && knowType=='chapter'">{{$refs.filter.oese.name}}</span>
		            </div>

		          </top-popover>
		          <div class="search-wrap">
		            <el-radio-group v-model="knowType" size="mini">
		              <el-radio-button label="chapter">章节目录</el-radio-button>
		              <el-radio-button label="knowledge">知识点</el-radio-button>
		            </el-radio-group>
		          </div>
		          <div class="tree-class point-tree">
		          	<div v-show="knowType == 'chapter'">
		            	<pointTree :tree-data="chapterData" @handleNodeClick="chapterNodeClick" @selectnode="chapterNodeClick"></pointTree>
		            </div>

		            <div v-show="knowType == 'knowledge'">
		            	<pointTree :tree-data="knowledgeData" @handleNodeClick="knowNodeClick" @selectnode="knowNodeClick"></pointTree>
		            </div>
		          </div>
		        </div>
		      </div>
		    </topTabs>
		  </div>

		  <div v-show="isHidden" class="hidden-wrap">
	    	<div>组织架构 & 章节知识点</div>
	    </div>
    </div>


	</div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import topTabs from '@/components/Nav/topTabs'
  import basicTree from '@/components/Tree/basicTree'
  import pointTree from '@/components/Tree/pointTree'
  import topPopover from "@/components/Popover/topPopover";

export default {
	props: {


	},
  data() {

    return {
    	orgData: [],
      filterText:'',
    	currentNode:'',
    	isHidden: false,
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
      activeType:'organizations',
      knowType:"chapter",
      chapterData:[],
      knowledgeData:[],
      filter: {
        gradeId:'',
        subjectId:'',
        learningSection:'',
        oese:'',
        volume:'',
        subjectCode:'',
      },



    }
  },
  components: {
  	topTabs,
    basicTree,
    pointTree,
    topPopover
    
  },
  watch: {
  	activeType() {
  		this.setActiveType()
  	},

  	knowType() {
  		this.setActiveType()
  	}
  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

  },
  mounted() {


  	this.setActiveType()
    this.getOrgTree()



  },
  methods: {

  	setActiveType() {
  		this.$emit('setActiveType',this.activeType,this.knowType)
  	},


  	clearData() {

  		this.chapterData = []
  		this.$emit('clearData')
  	},
    setparams(learningSection,volumeId,subjectCode) {

    	// if(!volumeId) {
    	// 	this.chapterData = []

    	// }


    		if(volumeId && this.filter.volumeId != volumeId) {

    			this.filter.volumeId = volumeId
    			this.getChapterTree()
    		}else {
    			this.filter.volumeId = ''

    		}

    		if(learningSection && subjectCode && (this.filter.learningSection != learningSection || this.filter.subjectCode != subjectCode)) {

		      this.filter.learningSection = learningSection
		       
		      this.filter.subjectCode = subjectCode

		      this.getKnowledgeTree()
    		}


	    

	    this.$emit('getSubjectCode', this.filter.learningSection,this.filter.subjectCode)

       


    },
    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {
          this.orgData = data.data
        }
      })

    },

    getChapterTree() {

      // this.chapterData = []
      

      this.$http.get(`/api/internal/chapter/chapterTree/${this.filter.volumeId}`)
      .then((data)=>{
        if(data.status == '200') {
          this.chapterData = data.data
        }    
      })


    },


    getKnowledgeTree() {

    	this.knowledgeData = []

  	  this.$http.get(`/api/internal/knowledge/knowledgeTree?learningSection=${this.filter.learningSection}&subjectCode=${this.filter.subjectCode}`)
      .then((data)=>{
        if(data.status == '200') {
          this.knowledgeData = data.data
        }    
      })
    },

    orgNodeClick(data) {
    	this.$emit('orgNodeClick',data)
    },

    chapterNodeClick(data) {

      this.$emit('chapterNodeClick',data)
    },
    knowNodeClick(data) {

    	// console.log(data)
      this.$emit('knowNodeClick',data)
    },

    changeTabs(tab) {
      this.activeType = tab
      
    },


  }
}
</script>

<style lang="less" scoped>
.collapsible-point {
	height: 100%;

	.collapsible-point-wrap {
		height: 100%;
		width: 300px;
		padding: 0 20px;
		position: relative;
		transition: width 0.2s;

		&:hover {
			.aside-class {
				// display: block;
				visibility: visible;
      	opacity: 1;
			}
		}

		.aside-class {
			position: absolute;
			width: 16px;
			height: 50px;
			border-radius: 5px 0 0 5px;
			background-color: #e9ebef;
			right: 0px;
			top: 46%;
			cursor: pointer;
			// padding-top: 16px;
			transition: all 0.5s;
			opacity: 0;
      visibility: hidden;


			.aside-icon {
				color: #ffffff;
				position: relative;
				top: 30%;
				
			}
		}


    .tree-class {
      height: calc(100vh - 250px);
      overflow-y: auto;
      margin-top: 10px;
    }

    .point-tree {
      height: calc(100vh - 280px);
      padding-left:-10px;
    }
	}


	.hiddenclass {
		// width: 40px;
		width: 52px;
		line-height: 32px;
		animation: foldSider .2s ease-in-out;
		.hidden-wrap {
			padding-top: 20px;

		}
	}




}
</style>