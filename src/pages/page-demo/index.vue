/* eslint-disable */
<template>
    <d2-container better-scroll>

        <el-row :gutter="5">
            <el-col :span="5">
                <div class="grid-content bg-purple">
                    <!--<el-container style="height: 500px; border: 1px solid #eee">-->
                    <el-container>
                        <el-container>
                            <el-header style="text-align: right; font-size: 12px">
                            </el-header>
                            <el-main>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-main>

                        </el-container>
                    </el-container>

                </div>
            </el-col>
            <el-col :span="19">
                <div class="grid-content bg-purple">

                </div>
            </el-col>

        </el-row>


    </d2-container>
</template>


<style>
    .el-row {
        margin-bottom: 20px;
    &
    :last-child {
        margin-bottom: 0;
    }

    }
    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        /*line-height: 60px;*/
    }

</style>



