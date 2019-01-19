<template>
    <d2-container type="card">
        <el-button type="danger" class="btn1" value="Draw" @click="loadPicture">加图片<i
                class="fa fa-eye" aria-hidden="true"></i></el-button>
        <el-row>
            <el-col :span="5" v-for="(value, key) in pictures" :key="key" :offset="1">
                <el-card :body-style="{ padding: '0px' }">
                    <img v-bind:src="value.url" @click="$imageViewer" class="image">
                    <div style="padding: 14px;">
                        <span>{{value.info}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import Vue from 'vue'
    import imageViewer from './imageViewer'
    Vue.use(imageViewer)
    export default {
        name: 'HelloWorld',
        data () {
            return {
                pictures:[
                    {
                        url: "http://localhost:8081/RSNA_SHOW/ImageData/blob1547734372727.jpg",
                        info: "王豪帮我动一下脑子1"
                    },
                    {
                        url: 'http://localhost:8081/RSNA_SHOW/ImageData/blob1547449994410.jpg',
                        info: "王豪帮我动一下脑子2"
                    },
                    {
                        url: "http://localhost:8081/RSNA_SHOW/ImageData/blob1547734372727.jpg",
                        info: "王豪帮我动一下脑子3"
                    },
                    {
                        url: 'http://localhost:8081/RSNA_SHOW/ImageData/blob1547449994410.jpg',
                        info: "王豪帮我动一下脑子4"
                    }
                ],
            }
        },
        methods:{
            loadPicture() {
                this.pictures.push({
                    url: 'http://localhost:8081/RSNA_SHOW/ImageData/blob1547449994410.jpg',
                    info: "王豪帮我动一下脑子4"
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    .image {
        width: 100%;
    }
</style>
