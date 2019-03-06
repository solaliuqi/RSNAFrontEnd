<template>
    <d2-container type="card">
        <template slot="header">
            <el-tag>基本信息</el-tag>
        </template>
        <div class="user-profile" >
            <div class="user-profile-left" >
                <el-form ref="form" :model="userForm" :rules="rules" label-position="right" label-width="100px"
                         size="medium">

                    <el-form-item label="昵称" prop="username" style="width:200px">
                        <el-input v-model="userForm.username" :disabled = "true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="username" style="width:200px">
                        <el-tag v-if="type==='doctor'">医生</el-tag>
                        <el-tag v-if="type!=='doctor'">病人</el-tag>
                    </el-form-item>

                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="userForm.gender">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="birthday" style="width:500px">
                        <el-col :span="11">
                            <el-form-item prop="date1">
                                <el-date-picker
                                        v-model="userForm.birthDate"
                                        type="date"
                                        placeholder="选择日期"
                                        style="width: 100%;"/>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="常用邮箱" prop="email" style="width:300px">
                        <el-input v-model="userForm.email" placeholder="name@example.com"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" style="width:300px">
                        <el-input v-model="userForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="住址">
                        <el-cascader
                                size="large"
                                :options="options"
                                v-model="selectedOptions"
                                @change="handleChange">
                        </el-cascader>

                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input placeholder="具体地址" v-model="userForm.address" style="width:600px"></el-input>
                    </el-form-item>

                    <el-form-item prop="submit">
                        <el-button size="default" @click="userUp" type="primary" class="button">更新信息</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="user-profile-right">
                <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8081/RSNA_SHOW/userinfo/headup.do"
                        :with-credentials = "true"
                        name="myHead"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
        </div>
        <template slot="footer">footer</template>
    </d2-container>
</template>

<script>
    // import {AreaSelect} from "vue-area-linkage";
    // import AreaData from "area-data";
    // import {pca, pcaa} from "area-data";
    import { regionData } from 'element-china-area-data'
    import {mapGetters} from 'vuex'
    import {userUpdate} from "@/api/sys/login"
    import {Message} from 'element-ui'

    export default {
        name: 'profile',
        // component: {
        //     AreaSelect: AreaSelect
        // },
        data() {
            return {
                userForm: {
                    username: 'xiaying',
                    gender: null,
                    email: "xiaying@xy.com",
                    phone: 123456789,
                    address: "",
                    birthDate:null,
                },
                type:null,
                baseUrl :  'http://localhost:8081/RSNA_SHOW/',
                // pca: pca,
                // pcaa: pcaa,
                // placeholder: [" ", " ", " "],
                // selected: [],
                options: regionData,
                selectedOptions: [],
                rules: {},
                data1:{},
                imageUrl: '',
                newimageUrl:''
            }
        },
        methods: {
            ...mapGetters('d2admin/user', [
                'getUserInfo'
            ]),
            handleChange (value) {
                console.log(value)
            },
            updateLoca(data){
                var list = data.trim().split(" ")
                if (list.length>=3){
                    this.selectedOptions.push(list[0]);
                    this.selectedOptions.push(list[1]);
                    this.selectedOptions.push(list[2]);
                }
                if (list.length==4){
                    this.userForm.address= list[3];
                }

            },
            userUp: function (event) {
                var str ="";
                for (var i in this.selectedOptions)
                    str = str+this.selectedOptions[i]+" ";
                str = str+this.userForm.address;
                this.data1["phone"] = this.userForm.phone
                this.data1["email"] = this.userForm.email
                this.data1["gender"]=this.userForm.gender
                this.data1["birthday"] = this.userForm.birthDate
                this.data1["location"] = str
                this.data1["hosptial"] = null
                this.data1["headpic"] = this.newimageUrl
                console.log(this.data1)
                userUpdate(JSON.stringify(this.data1)).then(async res =>{
                    Message({
                        message: "信息更新成功",
                        type: 'success',
                        duration: 2 * 1000
                    })
                    await this.$store.dispatch('d2admin/user/set', {
                        name: res.username,
                        other: res
                    }, {root: true})
                })
            },
            handleAvatarSuccess(res, file) {
                this.newimageUrl = res.data
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        },
        mounted: function () {
            this.type = this.getUserInfo().other.usertype;
            this.userForm.gender =  this.getUserInfo().other.gender;
            this.userForm.birthDate = this.getUserInfo().other.birthday;
            this.userForm.username = this.getUserInfo().name
            this.userForm.phone = this.getUserInfo().other.phone
            this.userForm.email = this.getUserInfo().other.email
            this.updateLoca(this.getUserInfo().other.location)
            this.imageUrl = 'http://localhost:8081/RSNA_SHOW/'+ this.getUserInfo().other.headpic
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .user-profile{ display:table;width:100%}
    .user-profile-left{  display:table-cell;width: 80%}
    .user-profile-right{ display:table-cell; }
</style>