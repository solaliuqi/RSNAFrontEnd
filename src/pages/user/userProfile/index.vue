<template>
    <d2-container type="card">
        <template slot="header">
            <el-tag>基本信息</el-tag>
        </template>
        <div class="user-profile">
            <div class="user-profile-left">
                <el-form ref="form" :model="userForm" :rules="rules" label-position="right" label-width="100px"
                         size="medium">

                    <el-form-item label="昵称" prop="username" style="width:200px">
                        <el-input v-model="userForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="userForm.resource">
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
                        <area-cascader type='all' placeholder="请选择" :level="1" :data="pcaa"
                                       v-model="selected"></area-cascader>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input placeholder="具体地址" v-model="userForm.address" style="width:600px"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="">

            </div>
        </div>
        <template slot="footer">footer</template>
    </d2-container>
</template>

<script>
    import {AreaSelect} from "vue-area-linkage";
    import AreaData from "area-data";
    import {pca, pcaa} from "area-data";
    import {mapGetters} from 'vuex'

    export default {
        name: 'profile',
        component: {
            AreaSelect: AreaSelect
        },
        data() {
            return {
                userForm: {
                    username: 'xiaying',
                    gender: null,
                    email: "xiaying@xy.com",
                    phone: 123456789,
                    address: null,
                },
                pca: pca,
                pcaa: pcaa,
                placeholder: [" ", " ", " "],
                selected: [],

                rules: {}
            }
        },
        methods: {
            ...mapGetters('d2admin/user', [
                'getUserInfo'
            ])
        },
        created: function () {
            this.userForm.username = this.getUserInfo().name
            this.userForm.phone = this.getUserInfo().other.phone
            this.userForm.email = this.getUserInfo().other.email
        }
    }
</script>
