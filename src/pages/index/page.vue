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
                    </div>
                    <div class="plung">
                        <el-badge is-dot class="item"><i class="fa fa-clipboard" aria-hidden="true"></i> 肺炎图片</el-badge>
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/">
                            <el-button type="primary" class="btn1">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
                            <div slot="tip" class="el-upload__tip">上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <div class="showpic">
                            <el-button type="danger" class="btn1">显示图片 <i class="fa fa-eye" aria-hidden="true"></i></el-button>
                            <div slot="tip" class="el-upload__tip">查看上传的图片</div>
                        </div>
                    </div>
                </el-aside>
                <el-container>
                    <el-main>
                        <!--图像交互-->
                        <div id="dwv">
                            <md-progress-bar md-mode="determinate" :md-value="loaded"></md-progress-bar>
                            <div class="button-row">
                                <md-button class="md-raised md-primary" value="Scroll" v-on:click="onShowbox">显示结果</md-button>
                                <md-button class="md-raised md-primary" value="Draw" v-on:click="onModify">修改结果</md-button>
                                <md-button class="md-raised md-primary" value="WindowLevel" v-on:click="onClick">调整明暗/对比度</md-button>
                                <md-button class="md-raised md-primary" value="ZoomAndPan" v-on:click="onClick">缩放移动</md-button>
                                <md-button class="md-raised md-primary" value="Scroll" v-on:click="OnZoomreset">还原缩放</md-button>
                            </div>
                            <div class="layerContainer">
                                <div class="dropBox"></div>
                                <canvas class="imageLayer">仅适用于兼容HTML5的浏览器……</canvas>
                                <div class="drawDiv"></div>
                            </div>
                            <div class="legend">{{ legend }}</div>
                        </div>
                        <!--图像交互-->
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-main>
                    <el-footer height="55px">Copyright © 2018, Zhejiang University, All rights reserved.</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </d2-container>
</template>

<script>
    // import
    import Vue from 'vue'
    import MdButton from 'vue-material'
    import dwv from 'dwv'
    Vue.use(MdButton)
    // gui overrides
    // decode query(解码查询)
    dwv.utils.decodeQuery = dwv.utils.base.decodeQuery
    // progress
    dwv.gui.displayProgress = function () {}
    // window
    dwv.gui.getWindowSize = dwv.gui.base.getWindowSize
    // get element
    dwv.gui.getElement = dwv.gui.base.getElement
    // refresh element
    dwv.gui.refreshElement = dwv.gui.base.refreshElement
    // Image decoders (for web workers) 图像解码
    dwv.image.decoderScripts = {
        'jpeg2000': 'static/dwv/decoders/pdfjs/decode-jpeg2000.js',
        'jpeg-lossless': 'static/dwv/decoders/rii-mango/decode-jpegloss.js',
        'jpeg-baseline': 'static/dwv/decoders/pdfjs/decode-jpegbaseline.js'
    }
    export default {
        name: 'dwv',
        data: function () {
            return {
                legend: dwv.getVersion(),
                dwvApp: null,
                loaded: 0
            }
        },
        mounted () {
            // create app
            this.dwvApp = new dwv.App()
            // initialise app
            this.dwvApp.init({
                'containerDivId': 'dwv',
                'fitToWindow': true,
                'tools': ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
                'shapes': ['Rectangle'],
                'isMobile': false
            })
            // progress
            var self = this
            var whsbb = 0
            this.dwvApp.addEventListener('load-progress', function (event) {
                self.loaded = event.loaded
            })
            this.dwvApp.addEventListener('filter-run', function (event) {
                self.loaded = event.loaded
                var points = new Array()
                points[0] = new dwv.math.Point2D( 200, 200 )
                points[1] = new dwv.math.Point2D( 400, 400 )
                var finalShapeGroup =dwv.tool.RectangleFactory.prototype.create(points,new dwv.html.Style, this.dwvApp.getImage())
                finalShapeGroup.id( dwv.math.guid() );
                // get the position group
                var posGroup = this.dwvApp.getDrawController().getCurrentPosGroup();
                // add shape group to position group
                posGroup.add(finalShapeGroup);
                var drawLayer = this.dwvApp.getDrawController().getDrawLayer()
                // re-activate layer
                drawLayer.hitGraphEnabled(true);
                // draw shape command
                var command = new dwv.tool.DrawGroupCommand(finalShapeGroup, 'Rectangle', drawLayer);
                // command.onExecute = fireEvent;
                // command.onUndo = fireEvent;
                // execute it
                command.execute();
                // save it in undo stack
                this.dwvApp.addToUndoStack(command);
            })
        },
        methods: {
            OnZoomreset: function(event) {
                this.dwvApp.onZoomReset()
            },
            onModify: function (event) {
                this.dwvApp.deleteDraws()
                this.dwvApp.onChangeTool(event)
            },
            onShowbox: function (event) {
                this.dwvApp.deleteDraws()
                var points = new Array()
                points[0] = new dwv.math.Point2D( 200, 200 )
                points[1] = new dwv.math.Point2D( 400, 400 )
                var finalShapeGroup =dwv.tool.RectangleFactory.prototype.create(points,new dwv.html.Style, this.dwvApp.getImage())
                finalShapeGroup.id( dwv.math.guid() );
                // get the position group
                var posGroup = this.dwvApp.getDrawController().getCurrentPosGroup();
                // add shape group to position group
                posGroup.add(finalShapeGroup);
                var drawLayer = this.dwvApp.getDrawController().getDrawLayer()
                // re-activate layer
                drawLayer.hitGraphEnabled(true);
                // draw shape command
                var command = new dwv.tool.DrawGroupCommand(finalShapeGroup, 'Rectangle', drawLayer);
                // command.onExecute = fireEvent;
                // command.onUndo = fireEvent;
                // execute it
                command.execute();
                // save it in undo stack
                this.dwvApp.addToUndoStack(command);
            },
            onClick: function (event) {
                this.dwvApp.onChangeTool(event)
                // let group = dwv.tool.RectangleFactory.prototype.create(points,new dwv.html.Style, this.dwvApp.getImage())
                // console.log(group)
                //this.dwvApp.setDrawings().
                // var boxes_num = this.dwvApp.getDrawController().getCurrentPosGroup().children.length
                // var boxes=new Array()
                // for (var i=0 ;i < boxes_num; i++)
                // {
                //     let getChildren = this.dwvApp.getDrawController().getCurrentPosGroup()
                //     boxes[i] = getChildren.children[i].children[0].attrs.x + " " + getChildren.children[i].children[0].attrs.y + " "
                //                 + getChildren.children[i].children[0].attrs.width + " " + getChildren.children[i].children[0].attrs.height
                //     console.log(boxes[i])
                // }
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
