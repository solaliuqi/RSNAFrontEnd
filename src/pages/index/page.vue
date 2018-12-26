<template>
    <d2-container better-scroll  style="position:absolute;width:100%;height:100%;">
        <el-container >
            <el-header height="55px" style="font-size:25px;font-family: 'Yapi SC';color:#EAEAEA">
                <i class="fa fa-folder-open-o" aria-hidden="true"></i>
                肺炎病灶自动检测系统
            </el-header>
            <el-container >
                <el-aside width="250px">
                    <div>
                        <el-badge is-dot class="item"><i class="fa fa-yelp" aria-hidden="true"></i> 肺炎检测结果</el-badge>
                        <div class="checkbox">
                            <el-button  class="btn0" type="primary" plain><i class="fa fa-crosshairs" aria-hidden="true"></i>
                                无框标记
                            </el-button><br>
                            <el-button  class="btn0" type="danger" plain ><i class="fa fa-plus-square" aria-hidden="true"></i>
                                有框标记</el-button>
                        </div>
                        <canvas id="canvas"></canvas>
                    </div>
                    <div class="plung">
                        <el-badge is-dot class="item"><i class="fa fa-clipboard" aria-hidden="true"></i> 肺炎图片</el-badge>
                        <el-upload class="upload-demo"
                                   action=""
                                   :before-upload="onUpload">
                            <el-button slot="trigger" size="small" type="primary" >选择图片<i class="el-icon-upload el-icon--right"></i></el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" >肺炎检测<i class="el-icon-upload el-icon--right"></i></el-button>
                            <div slot="tip" class="el-upload__tip">上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <div class="showpic">
                            <el-button type="danger" class="btn1" value="Draw" v-on:click="getBoxes">显示图片 <i class="fa fa-eye" aria-hidden="true"></i></el-button>
                            <div slot="tip" class="el-upload__tip">查看上传的图片</div>
                        </div>
                    </div>
                </el-aside>
                <el-container>
                    <el-main>
                        <!--图像交互-->
                        <dwvVue ref="dwv"></dwvVue>
                        <!--图像交互-->
                    </el-main>
                    <el-footer height="55px">Copyright © 2018, Zhejiang University, All rights reserved.</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </d2-container>
</template>

<script>
    import dwvVue from './components/dwv'
    import {upImage} from '@/api/sys/main'

    export default {
        name: 'App',
        components: {
            dwvVue
        },
        data(){
            return{
            Pic:null
            }
        },
        methods: {
            /*传回image像素值*/
            getFile: function(){
                return this.$refs.dwv.getFile()
            },
            /*传回一个json数组
            例如：[{"left_x":200,"left_y":200,"right_x":400,"right_y":600},{"left_x":600,"left_y":200,"right_x":800,"right_y":600}]*/
            getBoxes: function(){
                return this.$refs.dwv.getBoxes()
            },
            /*在影像上画框，传入JSON数组
            例如：[{"left_x":200,"left_y":200,"right_x":400,"right_y":600},{"left_x":600,"left_y":200,"right_x":800,"right_y":600}]*/
            OnShowbox: function(boxLists) {
                this.$refs.dwv.onShowbox(boxLists)
            },
            /*修改Boxes*/
            onModify: function(event) {
                this.$refs.dwv.onModify(event)
            },
            /*本地上传图片到浏览器*/
            onUpload: function(file) {
                this.$refs.dwv.onUpload(file)
            },



            /*浏览器上传图片到服务器*/
            submitUpload:function (event) {
                var _this= this;
                var cvs = document.createElement("canvas");
                cvs.width="1024"
                cvs.height="1024"
                var cts = cvs.getContext('2d')
                var imgdata = this.getFile()
                cts.putImageData(imgdata,0,0,0,0,1024,1024)
                cvs.toBlob(function(blob) {
                    var form = new FormData();
                    form.append("myImage", blob);
                    upImage(form)
                        .then(async res => {
                            if (res==null) return
                            _this.Pic = res.picid
                            _this.OnShowbox(res.data)
                        })
                },"image/jpeg")
            }
        }
    }

</script>

<style>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 55px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        /*text-align: center;*/
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .el-badge{
        margin: 30px 0px 15px 20px;
        font-size:25px;
        color:#999999

    }
    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .upload-demo {
        text-align: center;
        padding-top:10px;
    }
    .checkbox{
        text-align: center;
    }
    .btn0{
        width: 200px;
        height: 65px;
        margin-bottom: 15px;
        border-radius:10px;
        font-size: 20px;
    }
    .btn1{
        width:200px;
        font-size:20px;
    }
    .plung{
        margin-top:90px;
    }
    .showpic{
        text-align: center;
        padding-top: 25px;
    }
    /*图像交互css*/
    #dwv { font-family: Arial, Helvetica, sans-serif; }
    .button-row {
        text-align: center;
    }
    .legend {
        text-align: center;
        font-size: 8pt;
    }
    /* Layers */
    .layerContainer {
        position: relative; padding: 0;
        margin: auto; text-align: center; }
    .imageLayer {
        position: absolute;
        left: 0px; }
    .drawDiv {
        position: absolute; pointer-events: none; }
    /* drag&drop */
    .dropBox {
        border: 5px dashed #ccc;
        margin: auto; text-align: center; }
    .dropBox.hover { border: 5px dashed #cc0; }
</style>
