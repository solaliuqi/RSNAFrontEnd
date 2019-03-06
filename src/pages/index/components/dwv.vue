<template>
    <div id="dwv">
        <div class="button-row" style="height: 55px">
            <!--<el-button style="margin-left: 10px;" size="small" type="primary" value="Scroll" v-on:click="onShowbox">显示结果</el-button>-->
            <el-button style="margin-left: 10px;" size="small" type="primary" value="Draw" v-on:click="onModify">修改结果</el-button>
            <el-button style="margin-left: 10px;" size="small" type="primary" value="WindowLevel" v-on:click="onClick">调整明暗/对比度</el-button>
            <el-button style="margin-left: 10px;" size="small" type="primary" value="ZoomAndPan" v-on:click="onClick">缩放移动</el-button>
            <el-button style="margin-left: 10px;" size="small" type="primary" value="Scroll" v-on:click="OnZoomreset">还原缩放</el-button>
        </div>
        <div class="layerContainer" style="height:548px;line-height: 0px">
            <div class="dropBox"></div>
            <canvas class="imageLayer" style="height: 0px">仅适用于兼容HTML5的浏览器……</canvas>
            <div class="drawDiv"></div>
        </div>

    </div>
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
    dwv.gui.displayProgress = function () {
    }
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
        mounted() {
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
            this.dwvApp.addEventListener('load-progress', function (event) {
                self.loaded = event.loaded
            })
        },
        methods: {
            getFile: function () {
                return this.dwvApp.getImageData()
            },
            getBoxes: function () {
                var boxes_num = this.dwvApp.getDrawController().getCurrentPosGroup().children.length
                let getChildren = this.dwvApp.getDrawController().getCurrentPosGroup()
                var datas = [];
                for (var i = 0; i < boxes_num; i++) {
                    var data = {};
                    data["left_x"] = getChildren.children[i].children[0].attrs.x;
                    data["left_y"] = getChildren.children[i].children[0].attrs.y;
                    data["right_x"] = getChildren.children[i].children[0].attrs.x + getChildren.children[i].children[0].attrs.width;
                    data["right_y"] = getChildren.children[i].children[0].attrs.y + getChildren.children[i].children[0].attrs.height;
                    datas.push(data);
                }
                return datas
            },
            OnZoomreset: function (event) {
                this.dwvApp.onZoomReset()
            },
            onModify: function (event) {
                this.dwvApp.deleteDraws()
                this.dwvApp.onChangeTool(event)
            },
            onShowbox: function (boxLists) {
                this.dwvApp.deleteDraws()
                var posGroup = this.dwvApp.getDrawController().getCurrentPosGroup();
                for (var i in boxLists) {
                    var scale = 1024.0/300
                    var points = new Array()
                    points[0] = new dwv.math.Point2D(boxLists[i].left_x*scale, boxLists[i].left_y*scale)
                    points[1] = new dwv.math.Point2D(boxLists[i].right_x*scale, boxLists[i].right_y*scale)
                    var finalShapeGroup = dwv.tool.RectangleFactory.prototype.create(points, new dwv.html.Style, this.dwvApp.getImage())
                    finalShapeGroup.id(dwv.math.guid());
                    posGroup.add(finalShapeGroup);
                }
                var drawLayer = this.dwvApp.getDrawController().getDrawLayer()
                // re-activate layer
                drawLayer.hitGraphEnabled(true);
                // draw shape command
                var command = new dwv.tool.DrawGroupCommand(finalShapeGroup, 'Rectangle', drawLayer);
                // execute it
                command.execute();
                // save it in undo stack
                this.dwvApp.addToUndoStack(command);
            },
            onClick: function (event) {
                this.dwvApp.onChangeTool(event)
            },
            onUpload: function (file) {
                this.dwvApp.loadFiles([file])
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #dwv {
        font-family: Arial, Helvetica, sans-serif;
    }

    .button-row {
        text-align: center;
    }

    .legend {
        text-align: center;
        font-size: 8pt;
    }

    /* Layers */
    .layerContainer {
        position: relative;
        padding: 0;
        margin: auto;
        text-align: center;
    }

    .imageLayer {
        position: absolute;
        left: 0px;
    }

    .drawDiv {
        position: absolute;
        pointer-events: none;
    }

    /* drag&drop */
    .dropBox {
        border: 5px dashed #ccc;
        margin: auto;
        text-align: center;
    }

    .dropBox.hover {
        border: 5px dashed #cc0;
    }
</style>
