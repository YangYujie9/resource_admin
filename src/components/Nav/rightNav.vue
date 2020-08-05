<template>
	<div class="right-wrap">
		<div class="right-one contener">
			<slot name="left"></slot>
		</div>
		<div class="right-two contener">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.right-wrap {
		height: 100%;
		display: flex;
		.right-one {
			width: 300px;
			flex-shrink: 0;
			margin-right: 20px;
			padding: 0 20px;
		}

		.right-two {
			// width: calc(100vw - 300px);
			width: 100%;
			padding: 0 20px;
			overflow-x: hidden;
			position: relative;
		}
	}
</style>