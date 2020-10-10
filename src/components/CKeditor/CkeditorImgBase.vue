<template>
	<div>
		<!-- 工具栏容器 -->
		<div id="toolbar-container"></div>
		<!-- 编辑器容器 -->
		<div id="editor" ></div>
	</div>
</template>
<script>
import DocumentEditor from '../../../public/ckeditor5-base/build/ckeditor'

export default {
    props: { },
	components: { },
    data() {
	    return {
	      editor: null
	    };
	  },   
    mounted() {
		this.initCKEditor();   
    },
    destoryed() { },
    methods:{
		initCKEditor() {
	        DocumentEditor.create(document.querySelector('#editor'), {
	        	toolbar: {
					items: [
						'heading',
						'|',
						'fontSize',
						'fontFamily',
						'|',
						'bold',
						'italic',
						'underline',
						'strikethrough',
						'|',
						'alignment',
						'indent',
						'outdent',
						'|',
						'numberedList',
						'bulletedList',
						'todoList',
						'horizontalLine',
						'|',
						'removeFormat',
						'specialCharacters',
						'MathType',
						'ChemType',
						'|',
						'blockQuote',
						'imageUpload',
						'insertTable',
						'|',
						'undo',
						'redo'
					]
				},
				language: 'zh-cn',
				image: {
					styles: [
		                'alignLeft', 'alignCenter', 'alignRight'
		            ],
		            resizeOptions: [
		                {
		                    name: 'imageResize:original',
		                    label: 'Original',
		                    value: null
		                },
		                {
		                    name: 'imageResize:50',
		                    label: '50%',
		                    value: '50'
		                },
		                {
		                    name: 'imageResize:75',
		                    label: '75%',
		                    value: '75'
		                }
		            ],
					toolbar: [
						'imageStyle:alignLeft',
						'imageStyle:alignCenter',
						'imageStyle:alignRight',
						'|',
						'imageResize',
						'|',
						'imageTextAlternative'
					]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells',
						'tableCellProperties',
						'tableProperties'
					]
				},
				licenseKey: ''
	         
	        }).then(editor => {
	          document.querySelector('#toolbar-container').appendChild(editor.ui.view.toolbar.element);
	          document.querySelector( '.ck-toolbar' ).classList.add( 'ck-reset_all' );

			  //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
	          this.editor = editor
	           
	        }).catch(error => {
	          console.error(error);
	        });
	    },

	    getData(){
	    	return this.editor.getData();
	    },

	    setData(data){
	    	this.editor.setData(data)
	    },  
    }
}
</script>

<style lang="less">
.ck.ck-editor__editable_inline>:last-child {
  min-height:200px;

}

.ck.ck-editor__editable_inline:focus {
  outline: 0px;
}

.ck .ck-editor__main:focus {
  outline: 0px;
}
</style>
