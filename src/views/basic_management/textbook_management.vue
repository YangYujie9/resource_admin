<template>
  <div class="textbook">
    <rightNav>
      <div slot="left">
        <p class="right-header">组织架构 </p>
        <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
        <div class="tree-wrap">
          <basicTree :tree-data="data" :filterText="filterText"  @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
        </div>
      </div>
      <div slot="right">
        <div class="right-header">
          <span>用书管理 </span>
          
          
        </div>
        <div style="height: 36px;">
        	<span>学校：{{schoolsName}}</span>
        	<el-button size="mini" type="primary" style="margin-left: 20px;" @click="getCommonTree">复制模板</el-button>
        </div>
        <div class="wrap" ref="wrap">
        	<div class="table-wrap">
            <el-table
              v-loading="loading"
              border
              :height="table_height"
              :data="tableData"
              cell-class-name="cell-class""
              style="width: 100%">
              <el-table-column
                prop="value"
                label="年级/科目"
                fixed
                width="100">
              </el-table-column>
              <el-table-column
                v-for="list in subjectList"
                :label="list.subjectName">
                <template slot-scope="scope" >

                  <div class="cursor" @click="getVersionList(scope.row.key,scope.row[list.code])">
                    <el-popover
                      :ref="`popover-${scope.row.key}-${list.code}`"
                      width="600"
                      trigger="click"
                      popper-class="popver-wrap">
                      <div class="popver-class" >
                        <div style="" >
                          <p>教材版本</p>
                          <el-radio-group v-model="version" size="mini" @change="getvolumeList(scope.row.key,scope.row[list.code],true)">
                            <el-radio-button :label="list.oeseId" :key="list.oeseId" v-for="list in versionList">{{list.name}}</el-radio-button>
                          
                          </el-radio-group>
                        </div>

                        <div class="part-two">
                          <p>册别</p>
                          <el-checkbox-group v-model="books" size="mini">
                            <el-checkbox-button v-for="list in bookList" :label="list.oeseId" :key="list.oeseId">{{list.name}}</el-checkbox-button>
                          </el-checkbox-group>
                        </div>
                        <div style="text-align: center; margin-top: 10px;">
                          <el-button size="mini" type="text" @click="$refs[`popover-${scope.row.key}-${scope.row[list.code].code}`][0].doClose()">取消</el-button>
                          <el-button type="text" size="mini" @click="setBooks(scope.row.key,scope.row[list.code])">确定</el-button>
                        </div>
                      </div>
                      <div slot="reference" style="width: 100%;min-height: 80px;" class="td-class">
                        <div><span v-if="scope.row[list.code]">{{scope.row[list.code].oeseName}}</span></div>
                        <div><span v-if="scope.row[list.code]">{{scope.row[list.code].volumesName}}</span></div>
                      </div>
                    </el-popover>
                  </div>
                  
                  
                </template>
              </el-table-column>
             
            </el-table>

        		<!-- <table cellpadding="0" cellspacing="0">
        			<thead>
        				<tr>
        					<td style="width: 80px;">年级/科目</td>
        					<td v-for="list in subjectList">{{list.subjectName}}</td>
        				</tr>
        			</thead>

        			<tbody>
        				<tr v-for="item in tableData">
        					<td>{{item.value}}</td>

        					<td v-for="item1 in item.list" class="cursor" @click="getVersionList(item.key,item1)">
         
        					  <el-popover
					
                      :ref="`popover-${item.key}-${item1.code}`"
									    width="600"
                      trigger="click"
									    popper-class="popver-wrap"
									    @show="setBookShow(item1)">
									    <div class="popver-class" >
									    	<div style="" >
									    		<p>教材版本</p>
									    		<el-radio-group v-model="version" size="mini" @change="getvolumeList(item.key,item1,true)">
											      <el-radio-button :label="list.oeseId" :key="list.oeseId" v-for="list in versionList">{{list.name}}</el-radio-button>
											    
											    </el-radio-group>
									    	</div>

									    	<div class="part-two">
									    		<p>册别</p>
											    <el-checkbox-group v-model="books" size="mini">
											      <el-checkbox-button v-for="list in bookList" :label="list.oeseId" :key="list.oeseId">{{list.name}}</el-checkbox-button>
											    </el-checkbox-group>
									    	</div>
								    	  <div style="text-align: center; margin-top: 10px;">
											    <el-button size="mini" type="text" @click="$refs[`popover-${item.key}-${item1.code}`][0].doClose()">取消</el-button>
											    <el-button type="text" size="mini" @click="setBooks(item.key,item1)">确定</el-button>
											  </div>
									    </div>
									    <div slot="reference" style="width: 100%;" >
                        <div>{{item1.oeseName}}</div>
                        <div>{{item1.volumesName}}</div>
                      </div>
									  </el-popover>
									</td>
        				</tr>
        			</tbody>
        		</table> -->
        	</div>

        </div>





      </div>
    </rightNav>




    <el-dialog
      title="复制模板"
      :visible.sync="dialogVisible"
      width="85%"
      @close="handleClose">
      <div class="copy-wrap">
        <div class="copy-tree-wrap">

          <basicTree :tree-data="commonData"  @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
          
        </div>

        <div class="copy-content-wrap" ref="copy_wrap">
            <p style="margin-bottom: 10px;">学校：{{copyedSchoolsName}}</p>
            <el-table
              v-loading="copyloading"
              border
              :height="copy_table_height"
              :data="copyTableData"
              cell-class-name="cell-class"
              style="width: 100%">
              <el-table-column
                prop="value"
                label="年级/科目"
                fixed
                width="100">
              </el-table-column>
              <el-table-column
                v-for="list in copySubjectList"
                :label="list.subjectName">
                <template slot-scope="scope" >
                  <div style="min-height: 60px;" class="td-class">
                    <div><span v-if="scope.row[list.code]">{{scope.row[list.code].oeseName}}</span></div>
                    <div><span v-if="scope.row[list.code]">{{scope.row[list.code].volumesName}}</span></div>
                  </div>

                  <!-- <div class="cursor" @click="getVersionList(scope.row.key,scope.row[list.code])">

                    <el-popover
                      :ref="`popover-${scope.row.key}-${list.code}`"
                      width="600"
                      trigger="click"
                      popper-class="popver-wrap">
                      <div class="popver-class" >
                        <div style="" >
                          <p>教材版本</p>
                          <el-radio-group v-model="version" size="mini" @change="getvolumeList(scope.row.key,scope.row[list.code],true)">
                            <el-radio-button :label="list.oeseId" :key="list.oeseId" v-for="list in versionList">{{list.name}}</el-radio-button>
                          
                          </el-radio-group>
                        </div>

                        <div class="part-two">
                          <p>册别</p>
                          <el-checkbox-group v-model="books" size="mini">
                            <el-checkbox-button v-for="list in bookList" :label="list.oeseId" :key="list.oeseId">{{list.name}}</el-checkbox-button>
                          </el-checkbox-group>
                        </div>
                        <div style="text-align: center; margin-top: 10px;">
                          <el-button size="mini" type="text" @click="$refs[`popover-${scope.row.key}-${scope.row[list.code].code}`][0].doClose()">取消</el-button>
                          <el-button type="text" size="mini" @click="setBooks(scope.row.key,scope.row[list.code])">确定</el-button>
                        </div>
                      </div>
                      <div slot="reference" style="min-height: 60px;" class="">
                        
                      </div>
                    </el-popover>
                  </div> -->
                  
                  
                </template>
              </el-table-column>
             
            </el-table> 
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="copyBooksConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'
  import {uploadFilesBySteaps} from '@/utils/upload.js'
  import { VueDebounce } from '@/utils/public.js'
export default {

  data() {

    return {
    
    	version:'',
    	books:[],
      bookList: [],
    	versionList: [],
      tableData:[],
      table_height:300,
      filterText:'',
      data:[], 
      commonData:[],
      currentNode:'',
      dialogVisible:false,
      copyedSchoolsName:'',
      schoolsName:'',
      editBooksId: '',
      gradeList:[],
      subjectList:[],
      loading: false,
      learningSection:'',
      copy_table_height:300,
      isCoping: false,
      currentCopyNode:'',
      copyGradeList: [],
      copySubjectList: [],
      copyTableData:[],
      copyloading:false,
      copyEmpty: false,







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
      'getlearningSection',

    ]),

  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  - 20
      
    })


    this.getOrgTree()
    // this.getCommonTree()
    // this.getVersionTree()



  },
  methods: {

    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{

          this.data = data.data

        
      })


    },
    getCommonTree() {

      this.isCoping = true


      this.$http.get(`/api/internal/organizations/commonTree/${this.currentNode.id}`)
      .then((data)=>{
        if(data.status == '200') {

          this.commonData = data.data
          this.dialogVisible = true

          this.$nextTick(()=>{
            this.copy_table_height = this.$refs.copy_wrap.offsetHeight  - 30
          })
        }

        
      })
    },
    copyDialogShow() {

      this.dialogVisible = true
      
    },

    handleClose() {
      this.isCoping = false
      this.dialogVisible = false
      this.getTableData()
    },


    defaultSelectNode(node) {
      if(this.isCoping) {
        this.currentCopyNode = node
        this.copyedSchoolsName = node.name
      }else {
        this.currentNode = node
        this.schoolsName = node.name
      }

      this.get_grade_list()
      this.get_subject_list()
      // this.getTableData()  
    },

    handleNodeClick(data) {
      if(this.isCoping) {
        this.currentCopyNode = data
        this.copyedSchoolsName = data.name
      }else {
        this.currentNode = data
        this.schoolsName = data.name
      }
      this.get_grade_list()
      this.get_subject_list()
      // this.getTableData()  

    },

    get_grade_list() {

      let schoolId = this.isCoping?this.currentCopyNode.id:this.currentNode.id
      this.$http.get(`/api/open/common/grades/${schoolId}`)
      .then((data)=>{

          this.isCoping?this.copyGradeList = data.data:this.gradeList = data.data
        
      })

    },





    get_subject_list() {
      let schoolId = this.isCoping?this.currentCopyNode.id:this.currentNode.id
      this.$http.get(`/api/internal/schools/${schoolId}/subjects`)
      .then((data)=>{

          this.isCoping?this.copySubjectList = data.data.content:this.subjectList = data.data.content
          // this.subjectList = data.data.content
          
          this.getTableData()

        
      })

    },
    getTableData() {
      
      
      let schoolId = ''
      if(this.isCoping) {
        // this.copyTableData = []
        this.copyloading = []
        schoolId = this.currentCopyNode.id
      }else {
        // this.tableData = []
        this.loading = true
        schoolId = this.currentNode.id

      }

      this.$http.get(`/api/internal/schools/${schoolId}/books`) 
      .then(data=>{


        if(data.status == '200') {

          let list = []
          // for(let i=0;i<this.gradeList.length;i++) {

          //   list[i] = this.gradeList[i]
          //   list[i].list = []

          //   for(let j=0;j<this.subjectList.length;j++) {
          //     // console.log(this.subjectList[j])
          //     list[i].list.push({
          //       ...this.subjectList[j],
          //       booksId:'',
          //       oeseId: '',
          //       oeseName: '',
          //       volume: '',
          //       volumes: [],
          //       volumesName: ''
          //     })

          //   }
          // }

          // for(let i=0;i<list.length;i++) {

          //   for(let j=0;j<list[i].list.length;j++) {

          //     for(let k=0;k<data.data.length;k++) {

          //       if(list[i].key == data.data[k].grade && list[i].list[j].code == data.data[k].subjectCode) {
          //         list[i].list[j].booksId = data.data[k].booksId
          //         list[i].list[j].oeseId = data.data[k].oese.id
          //         list[i].list[j].oeseName = data.data[k].oese.name
          //         list[i].list[j].volume = data.data[k].volume
          //         list[i].list[j].volumes = data.data[k].volumes
          //         let arr = []
          //         for(let n=0;n<data.data[k].volumes.length;n++) {
          //           arr.push(data.data[k].volumes[n].name)
          //         }

          //         list[i].list[j].volumesName = arr.join(";")
          //       }
          //     }


          //   }
          // }




          //el-table


          let gradeList = []
          let subjectList = []

          if(this.isCoping) {
            gradeList = this.copyGradeList
            subjectList = this.copySubjectList
          }else {
            gradeList = this.gradeList
            subjectList = this.subjectList
          }

          for(let i=0;i<gradeList.length;i++) {

            list[i] = gradeList[i]
            list[i].list = []

            for(let j=0;j<subjectList.length;j++) {
              // console.log(subjectList[j])
              list[i][subjectList[j].code] = {
                ...subjectList[j],
                booksId:'',
                oeseId: '',
                oeseName: '',
                volume: '',
                volumes: [],
                volumesName: ''
              }

            }
          }
          // console.log(list)
    

          for(let i=0;i<list.length;i++) {


              for(let j=0;j<data.data.length;j++) {

                if(list[i].key == data.data[j].grade) {
                  list[i][data.data[j].subjectCode].booksId = data.data[j].booksId
                  list[i][data.data[j].subjectCode].oeseId = data.data[j].oese.id
                  list[i][data.data[j].subjectCode].oeseName = data.data[j].oese.name
                  list[i][data.data[j].subjectCode].volume = data.data[j].volume
                  list[i][data.data[j].subjectCode].volumes = data.data[j].volumes
                  let arr = []
                  for(let n=0;n<data.data[j].volumes.length;n++) {
                    arr.push(data.data[j].volumes[n].name)
                  }

                  list[i][data.data[j].subjectCode].volumesName = arr.join(";")
                }
              }


            
          }

          if(this.isCoping) {
            this.copyEmpty = data.data.length?false:true
            this.copyTableData = list
            this.copyloading = false
          }else {
            this.tableData = list
            this.loading = false
          }
          
          // console.log(this.isCoping,this.copyTableData,this.tableData,list)
        }
      })
    },

    copyBooksConfirm() {
     
      if(!this.copyEmpty) {
        this.$confirm('复制的模板为空模版，继续操作将原模版清空，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.copyBooks()

        }).catch(() => {
         
        });


      }else {


        this.copyBooks()
      }



    },

    copyBooks() {

      this.$http.post(`/api/internal/schools/${this.currentNode.id}/books/copyBooks/${this.currentCopyNode.id}`)
      .then(data=>{
        if(data.status == '200') {
          this.$message.success('复制成功')
          this.dialogVisible = false
        }
      })


    },
    getVersionList(grade,list) {
      // console.log(list)
      this.versionList = []
      this.bookList = []
      this.books = []
      this.$http.get(`/api/open/common/oeses/${list.learningSection}/${list.code}`)
      .then((data)=>{
        if(data.status == '200') {
          this.versionList = data.data
          if(list.booksId) {
            this.editBooksId = list.booksId
            this.version = list.oeseId
            this.getvolumeList(grade,list,false)
          }else {
            this.editBooksId = ''
            this.version = ''
            this.$refs[`popover-${grade}-${list.code}`][0].doShow()
          }
          
          
          
        }
      })
    },
    getvolumeList(grade,list,flag) {
      // console.log(list)
      
      this.$http.get(`/api/open/common/oeseList/${this.version}`)
      .then((data)=>{
        if(data.status == '200') {
          this.bookList = data.data
          this.books = flag?[]: list.volume.split(',')
          this.$refs[`popover-${grade}-${list.code}`][0].doShow()
        }
      })
    },





    setBooks(grade,list) {
      if(!this.version) {return this.$message.warning('教材版本不可以为空')}

      if(this.editBooksId) {
        this.$http.put(`/api/internal/schools/${this.currentNode.id}/books/${this.editBooksId}`,{
          subjectCode: list.code,
          grade: grade,
          oeseId: this.version,
          volume:this.books.join()
        })
        .then(data=>{
          if(data.status == '200') {
            this.$message.success('编辑成功')
            this.getTableData()
            this.$refs[`popover-${grade}-${list.code}`][0].doClose()
           
          }
        })
      }else {
        this.$http.post(`/api/internal/schools/${this.currentNode.id}/books`,{
          subjectCode: list.code,
          grade: grade,
          oeseId: this.version,
          volume:this.books.join()
        })
        .then(data=>{
          if(data.status == '200') {
            this.$message.success('新增成功')
            this.getTableData()
            this.$refs[`popover-${grade}-${list.code}`][0].doClose()
           
          }
        })
      }
    },




  }
}
</script>
<style lang="less">
.textbook {

  .el-dialog__body {
    padding-bottom: 0px;
  }

  .el-table__fixed-body-wrapper {
    top: 47px !important;
  }


}

.popver-wrap {



  .el-radio-button__inner {
    border: 0px;
    background-color: transparent;
    border-radius: 3px;
    font-size: 0.9rem;
    color: #666;
  }


  .el-radio-button:first-child .el-radio-button__inner {
    border-left: 0px;
    border-radius: 3px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 3px;
  }

  .el-checkbox-button__inner {
    border: 0px;
    background-color: transparent;
    border-radius: 3px;
    font-size: 0.9rem;
    color: #666;
  }


  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border-left: 0px;
    border-radius: 3px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 3px;
  }

}

</style>
<style lang="less" scoped>
 .textbook{
  height: 100%;

  .input-class {
    width: 280px;
  }
  .wrap {


    height: calc(100vh - 240px);
    // background-color: red;



    .table-wrap {
      .cell-class {
        td {
          height: 20px;
          line-height: 20px;
        }
      

      }
       height: calc(100vh - 240px);
       // overflow-y: auto;
      // table {
      //   width: 100%;
      // 	border: 1px solid #e2e2e2;
      // 	border-bottom:0;
      // 	border-right:0;
      //   word-wrap:bread-word;
      //   word-break:break-all;
      //   table-layout:fixed;

      //   td {
      //     min-width: 45px;
      //     text-align: center;
      //     border-bottom: 1px solid #e2e2e2;
      //     border-right: 1px solid #e2e2e2;

      //   }

      // 	tbody {
	     //    max-height: calc(100vh - 280px);
	     //    overflow-y: auto;

      //     td {
      //       height: 59px;
      //       padding:3px 8px;
      //       line-height: 26px;
      //       text-align: center;
      //       border-bottom: 1px solid #e2e2e2;
      //       border-right: 1px solid #e2e2e2;

      //     }
	     //  }
	     //   thead {
      //       width: calc( 100% - 1em);/*表头与表格垂直对齐*/


      //       td {
      //         height: 36px;
      //         line-height: 36px;
      //         background-color: #f5f7fc;

      //       }
      //   }


      // }

    }
  }


    .td-class {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

  .tree-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
  }


  .copy-wrap {
    display: flex;
    height: calc(60vh);

    .copy-tree-wrap {
      width: 280px;
      // border: 1px solid #e2e2e2;
      // padding:10px;
      flex-shrink: 0;
      margin-right: 20px;
      height: 100%;
      overflow-y: auto;
    }


    .copy-content-wrap {
      width: 90%;
      height: 100%;
      overflow-x: auto;
      // background-color: blue;
    }
  }


}


.popver-wrap {

	.popver-class {
		//padding: 10px;
	// background-color:red;
		// background-color: red;
	}
	
	.part-two {
		margin-top: 10px;

		border-top: 1px dashed #e2e2e2;
	}
	p {
		height: 36px;
		line-height: 36px;
		
	}

}
</style>
