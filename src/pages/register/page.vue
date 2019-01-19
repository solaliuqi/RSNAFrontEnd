<template>
    <div class="login-page">
        <div class="layer bg" id="login"></div>
        <div class="layer flex-center">
            <!-- logo部分 -->
            <div class="logo-group">
                <img src="./image/logo.png" alt="logo">
            </div>
            <!-- 表单部分 -->
            <div class="form-group">
                <el-card>
                    <el-form ref="loginForm" :rules="rules" :model="formLogin" label-position="top" size="default">
                        <el-form-item prop="select">
                            <el-select  v-model="formLogin.type" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="username">
                            <el-input type="text"  v-model="formLogin.username" placeholder="用户名">
                                <i slot="prepend" class="fa fa-user-circle-o"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="formLogin.password" placeholder="输入密码">
                                <i slot="prepend" class="fa fa-keyboard-o"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password2">
                            <el-input type="password" v-model="formLogin.password2" placeholder="再次输入密码">
                                <i slot="prepend" class="fa fa-keyboard-o"></i>
                            </el-input>
                        </el-form-item>
                        <el-button size="default" @click="submit" type="primary" class="button-login">注册</el-button>
                    </el-form>
                </el-card>
            </div>


        </div>
        <el-dialog
                title="快速选择用户"
                :visible.sync="dialogVisible"
                width="400px">
            <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
                <el-col v-for="(user, index) in users" :key="index" :span="8">
                    <div class="user-btn" @click="handleUserBtnClick(user)">
                        <d2-icon name="user-circle-o"/>
                        <span>{{user.name}}</span>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
    /* eslint-disable */
    require('particles.js')
    import config from './config/default'
    import {mapActions} from 'vuex'
    import {userRegister} from '@/api/sys/main'
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value !== this.formLogin.password || value === "") {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                options: [{
                    value: 'patient',
                    label: 'patient'
                }, {
                    value: 'doctor',
                    label: 'doctor'
                }],
                // 快速选择用户
                dialogVisible: false,
                users: [
                    {
                        name: '管理员',
                        username: 'admin',
                        password: 'admin',
                        password2: 'admin'
                    }
                ],
                // 表单
                formLogin: {
                    username: '',
                    password: '',
                    password2: '',
                    type: ''
                },
                // 校验
                rules: {
                    select: [
                        {required: true, message: '请选择用户类型', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '两次密码不一致', validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            // 初始化例子插件
            particlesJS('login', config)
        },
        beforeDestroy() {
            // 销毁 particlesJS
            if (pJSDom && pJSDom.length > 0) {
                pJSDom[0].pJS.fn.vendors.destroypJS()
                pJSDom = []
            }
        },
        methods: {
            ...mapActions('d2admin/account', [
                'login'
            ]),
            /**
             * @description 接收选择一个用户快速登录的事件
             * @param {Object} user 用户信息
             */
            handleUserBtnClick(user) {
                this.formLogin.username = user.username
                this.formLogin.password = user.password
                this.formLogin.password2 = user.password2
                this.submit()
            },

            /**
             * @description 提交表单
             */
            // 提交登录信息
            submit() {
                console.log(this.formLogin.username + this.formLogin.password + this.formLogin.password2)
                userRegister({
                    username: this.formLogin.username,
                    password: this.formLogin.password,
                    usertype: this.formLogin.type
                }).then(async res => {

                });
            }
        }
    }
</script>

<style lang="scss">
    @import './style.scss';
</style>
