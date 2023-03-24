<template>
    <el-container>
        <el-header>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-row class="tac">
                    <el-col>
                        <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen"
                            @close="handleClose" background-color="#545c64" @select="handleSelect" text-color="#fff"
                            active-text-color="#ffd04b" router>
                            <!-- <el-menu-item index="/">首页</el-menu-item> -->
                            <el-menu-item index="/library_info">软件库信息</el-menu-item>
                            <el-menu-item index="/library_api_mapping">API映射</el-menu-item>
                            <el-menu-item index="/migration">API迁移</el-menu-item>
                            <el-menu-item index="/record">操作记录</el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main><router-view/></el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1'
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleOpen(key, keyPath) {

        },
        handlen(key, keyPath) {

        },
    }
}
</script>

<style>
.el-container {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0;
    bottom: 0;
}

.el-header {
    padding: 0;
    z-index: 1000;
}

.el-header .fr {
    float: right;
}

.el-header .el-menu {
    border-bottom: none;
}

.el-aside,
.el-main {
    padding-top: 60px;
}

.el-aside {
    background: #545c64;
}

.el-aside .el-menu {
    border-right: none;
}
</style>