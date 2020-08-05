<template>
  <div class="point">
    <el-tree
      :data="originalTreeData"
      :show-checkbox="showCheckbox"
      node-key="id"
      check-on-click-node
      ref="tree"
      default-expand-all
      class="pageTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      :highlight-current="true"
      @check="getCheckedNodes"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="nodetree">
          
          {{ node.label }}
        </span>
        <span class="active-wrap" v-if="enableEdit">
          
          <i class="iconfont iconiconjia actclass"  @click.prevent.stop="appendNode(node,data)"></i>
          <i class="iconfont iconbianji actclass" @click.prevent.stop="editNode(node,data)"  v-if="data.parentId.id!='0'"></i>
          <i class="iconfont iconshanchu-copy" @click.prevent.stop="deleteNode(node,data)" v-if="data.parentId.id!='0'"></i>
          <!-- <el-button type="text" size="mini" @click="() => append(data)"><i class="iconfont iconbianji"></i></el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)"><i class="iconfont iconshanchu-copy"></i></el-button> -->
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>


export default {

  props: {

    showCheckbox: {
      type:Boolean,
      default:false,
    },
    treeData: {
      type: [Object, Array],
      default: {}
    } /*树数据*/,
    enableEdit: {
      type: Boolean,
      default: false
    } /*是否允许编辑，默认不允许*/,
    filterText: {
      type:String,
      default:''
    },
    orgSelectable: {
      type:Boolean,
      default: false
    },//是否允许选中组织
    defaultRoot:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        memberType: 'memberType',
      },

      originalTreeData:[],/*初始树数据*/
      currentSelectedNode:null,/*当前选中的节点*/
      defaultSelectedNode:"",/*默认选中的节点*/
      defaultSelectedId:this.selectedId,/*默认选中的节点id*/
      isInit:false,/*是否已初始化*/
      currentComponentId:null,/*树UUID*/
      firstSchool:null,/*第一个学校节点*/
      currenttNode:''
      
    };
  },
  created() {
    if(this.originalTreeData && this.originalTreeData.length > 0){
      this.initTreeData(JSON.parse(JSON.stringify(this.originalTreeData)));
    }
  },

  mounted() {

  },

  watch: {
    keyword(val) {

      this.$refs.tree.filter(val);
    },
    treeData: {
      handler: function(newVal, oldVal) {

          this.initTreeData(JSON.parse(JSON.stringify(newVal)));
          this.currenttNode = this.defaultSelectedNode
          this.$emit('selectnode',this.currenttNode )
          
          this.$nextTick(()=>{
            this.currenttNode?this.$refs.tree.setCurrentKey(this.currenttNode.resourceId.id):null
            // 
            
          })
          
      }

    },

  },
  methods: {
    getCheckedNodes(node, data) {


      let arr = [];
      data.checkedNodes.forEach(node => {
        node.children && node.children.length ? null : arr.push(node);
      });
      // console.log(arr)
      this.$emit('check',arr) ;

    },


    /*初始化树数据*/
    initTreeData(data) {
      let treeData = [];
      if (data.hasOwnProperty("members")) {
        let node = data.root;
        if (node) {
          // node.selected = true; /*默认选中根节点*/
          // node.isRoot = true; /*标记是是顶级节点*/
          // node.expand = true; /*默认展开顶级节点*/
          this.defaultSelectedNode = node;
          this.constructTreeData(node, data.members);
          treeData.push(node);
          if (!this.defaultRoot) {
            this.firstSchool = this.deepFirstSearch(node);
          }
          this.originalTreeData = treeData;

        }

      }
      
    },
    /*重构树数据格式*/
    constructTreeData(node, data) {
      node.title = node.name;
      node.id = node.resourceId.id;
      (node.memberType == "Organization" && !this.orgSelectable) ? node.disabled = true:null
      // console.log(node)
      let nodeChildren = data.filter(function(item) {
        return item.parentId && item.parentId.id === node.resourceId.id;
      });
      if (nodeChildren && nodeChildren.length > 0) {
        node.children = nodeChildren;
        
        for (let i = 0; i < node.children.length; i++) {
          let newNode = node.children[i];
          this.constructTreeData(newNode, data);
        }
      }
    },
    /*依次深度优先遍历--递归式*/
    deepFirstSearch(node) {
      let result;
      let isNotFound = true;
      if (node.children) {
        for (let n = 0; n < node.children.length; n++) {
          if (isNotFound) {
            result = this.deepFirstSearch(node.children[n]);
            isNotFound = result.memberType !== "School";
          }
        }
        return result;
      } else {
        return node;
      }
    },

    editNode(node,data) {
      this.$emit('editnode',node,data)
    },

    appendNode(node,data) {
      this.$emit('appendnode',node,data)
    },
    deleteNode(node,data) {
      this.$emit('deletenode',node,data)
    },

    // addscholl(node,data) {
    //   this.$emit('addscholl',node,data)
    // },
    
    //筛选
    filterNode(value, data) {

      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleNodeClick(data) {


      this.$emit('handleNodeClick',data)
      // if(data.memberType == "Organization" && !this.orgSelectable) {
      //     this.$nextTick(()=>{
      //       this.$refs.tree.setCurrentKey(this.currenttNode .resourceId.id);
            
      //     })
      // }else {
      //   this.currenttNode = data
      //   
      // }
      
    },

  }
};
</script>
<style lang="less">

.point {
  /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
    border-left: none;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,
  .el-tree-node__content:hover {
    cursor: pointer;
    color:#409EFF;
    background-color: transparent;
    // .active-wrap {
    //   display: block;
    // }
  }


  //横向
  .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
}
.pageTree {
  .el-tree-node__content {
    height: 36px;
    padding-left:0px !important;
  }
  .el-tree-node__expand-icon {
    color: #333333;
  }
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
  }


  .el-tree-node:focus>.el-tree-node__content {
    background-color: transparent;
  }



  /* 树形结构节点添加连线 */
   /deep/ .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
   
   /deep/ .el-tree-node__children {
    padding-left: 16px;
  }
   
   /deep/ .el-tree-node :last-child:before {
    height: 36px;
  }
   
   /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
   

   
   /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
   
   /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  //  /deep/ .el-tree-node__expand-icon.is-leaf {
  //   display: none;
  // }
   
   /deep/ .el-tree-node:before {
    border-left: 1px dashed #b8b9bb;
    bottom: 0px;
    height: 100%;
    top: -18px;
    width: 1px;
  }
   
   /deep/ .el-tree-node:after {
    border-top: 1px dashed #b8b9bb;
    height: 36px;
    top: 18px;
    width: 18px;
  }
  /deep/ .el-tree-node.is-leaf:after {

    width: 28px;
  }

    //    更换下拉图标
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    color: #2489f6;
    background-color:transparent;
  }
  .el-tree {
    background: transparent !important;
  }
  [class*=" el-icon-"],
  [class^="el-icon-"] {
    // 更换图标库
    font-family: "iconfont" !important;
  }

  .el-tree-node__expand-icon.expanded {
    // 动画取消
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .el-icon-caret-right:before {
    // 收起
    content: "\e6b5";
    font-size: 14px;
    color: #409eff;
  }
  .el-tree-node__expand-icon.is-leaf.el-icon-caret-right:before {
    color: transparent;
  }
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    // 展开
    content: "\e605";
    font-size: 14px;
  }

  // .el-tree-node__content {
  //   height: 28px;
  // }
}
</style>
<style scoped lang="less">

.point {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;

      &:hover {

        .active-wrap {
          display: block;

        }
      }
    }

    .customclass {
      //color: red;
      &:hover {
        cursor: default;
        color: #606266 !important;
      }

      .nodetree {
        color: #606266 !important;
      }
    }

    .active-wrap {
      display: none;

      .actclass {
        margin-right: 10px;
      }
    }
}
</style>