<template>
    <div id="mapping">
        <div id="mapping">
            <h1 id="title">LibraryUpdater</h1>
            <P id="description">LibraryUpdater是一个软件库自动升级工具</P>
        </div>
        <br></br>
        <el-row>
            <el-col :span="12">
                <div style="margin-top: 15px">
                    <el-form :inline="true" :model="libraryParam" class="demo-form-inline">
                        <el-form-item label="软件库">
                            <el-select v-model="libraryParam.name" placeholder="软件库名称" @change="searchLibraryVersion">
                                <el-option v-for="item in libraryNames" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本选择">
                            <el-select v-model="libraryParam.version" placeholder="软件库版本">
                                <el-option v-for="item in libraryVersions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchLibraryInfo">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </el-col>
            <el-col :span="12">
                <div style="margin-top: 15px">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="新软件库导入">
                            <el-upload class="upload-demo" action="http://localhost:8080/upload"
                                :on-preview="handlePreview" :on-remove="handleRemove"
                                :limit="1" :on-exceed="handleExceed" :file-list="fileList"
                                :on-success="handleSucess">
                                <el-button size="small" type="primary">点击导入</el-button>
                                <div slot="tip" class="el-upload__tip">只能导入zip格式</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="parseLibraryInfo">解析</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <!-- <div id="statistic">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div>
                        <el-statistic title="方法数量">
                            <template slot="formatter">
                                {{ libraryInfo.aoc }}
                            </template>

                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <el-statistic group-separator="," decimal-separator="." :value="libraryInfo.coc" title="类数量">
                        </el-statistic>
                    </div>

                </el-col>
            </el-row>
        </div> -->
        <row>
            <el-table :data="libraryInfo.apis" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="方法签名">
                                <span>{{ props.row.signature }}</span>
                            </el-form-item>
                            <el-form-item label="注释文档">
                                <span>{{ props.row.javadoc }}</span>
                            </el-form-item>
                            <el-form-item label="代码">
                                <div v-highlight><pre><code>{{ props.row.code }}</code></pre></div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="方法签名" prop="signature">
                </el-table-column>
            </el-table>
        </row>
    </div>
</template>

<script>
import {getLibraryInfo, parseLibraryInfo, fetchLibrary, fetchLibraryVersions, fetchLibraryInfoAndApis, parseLibrary} from '@/api/index'

export default {
    name: 'LibraryInfo',
    data() {
        return {
            libraryParam: {
                name: '',
                version: '',
            },
            libraryNames: [],
            libraryVersions: [],
            libraryInfo: {
                name: '',
                version: '',
                aoc: 1322,
                coc: 481,
                apis: []
            },
            fileList: [],
            uploadedFilePath: "",
        }
    },
    mounted() {
        this.getLibraryNames();
    },
    methods: {
        getLibraryNames() {
            this.libraryNames = []
            fetchLibrary().then((response) => {
                let data = response.data
                for (let idx in data) {
                    this.libraryNames.push({
                        value: data[idx].name,
                        label: data[idx].name
                    })
                }
            })
        },
        searchLibraryInfo() {
            // 搜索软件库信息，填充到libraryInfo
            if (this.libraryParam.name == '' || this.libraryParam.version == '') {
                return
            }

            let param = {
                name: this.libraryParam.name,
                version: this.libraryParam.version
            }
            fetchLibraryInfoAndApis(param).then((response) => {
                let data = response.data

                let libraryInfo = {
                    name: param.name,
                    version: param.version,
                    aoc: data.aoc,
                    coc: data.coc,
                    apis: []
                }

                for (let idx in data.apis) {
                    libraryInfo.apis.push({
                        signature: data.apis[idx].signature,
                        code: data.apis[idx].code,
                        javadoc: data.apis[idx].javadoc,
                        // returnType: data.apis[idx].returnType
                    })
                }

                console.log(libraryInfo)

                this.libraryInfo = libraryInfo
            })
        },
        searchLibraryVersion() {
            if (this.libraryParam.name == '') {
                return
            }

            this.libraryVersions = []
            let queryParam = {
                name: this.libraryParam.name
            }
            fetchLibraryVersions(queryParam).then((response) => {
                let data = response.data
                for (let idx in data) {
                    this.libraryVersions.push({
                        value: data[idx].version,
                        label: data[idx].version
                    })
                }
            })
        },
        parseLibraryInfo() {
            if (this.uploadedFilePath == "") {
                return
            }

            let param = {
                filePath: this.uploadedFilePath
            }
            parseLibrary(param).then((response) => {
                let data = response.data
                console.log(data)
            })
            // 发送请求解析
        },
        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePreview(file) {
            // console.log(file);
        },
        handleExceed(files, fileList) {
            // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleSucess(result) {
            console.log("存储路径:"+result.virtualPath)
            console.log("文件名:"+result.fileName)
            this.uploadedFilePath = result.virtualPath
        },
    }

}

</script>
   
<style>
.el-select .el-input {
    width: 130px;
}

.input-with-select .el-input-group__prepend {
    background-color: #fff;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
}

#statistic {
    margin: 50px;
    padding: 30px;
}
</style>