<template>
    <div id="mapping">
        <row>
            <h1 style="margin-bottom: 10px;">任务记录</h1>
            <el-table :data="taskinfos" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="任务时间">
                                <span>{{ props.row.time }}</span>
                            </el-form-item>
                            <el-form-item label="任务类型">
                                <span>{{ props.row.tasktype }}</span>
                            </el-form-item>
                            <el-form-item label="任务输出" prop="">
                                <el-input type="textarea" v-model="props.row.output" :rows="20" style="width: 1000px;"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="任务时间" prop="time">
                </el-table-column>
                <el-table-column label="任务类型" prop="tasktype">
                </el-table-column>
            </el-table>
        </row>
    </div>
</template>

<script>
import {getLibraryInfo, parseLibraryInfo, fetchTasks, fetchLibraryVersions, fetchLibraryInfoAndApis, parseLibrary} from '@/api/index'

export default {
    name: 'LibraryInfo',
    data() {
        return {
            taskinfos: [
            ],
            libraryParam: {
                name: '',
                version: '',
            },
            libraryNames: [{
                value: 'mokito',
                label: 'mokito'
            }, {
                value: 'lucene',
                label: 'lucene'
            }, {
                value: 'mongodb-driver',
                label: 'mongodb-driver'
            }],
            libraryVersions: [{
                value: '1.2.2',
                label: '1.2.2'
            }, {
                value: '1.2.1',
                label: '1.2.1'
            }, {
                value: '1.3.4',
                label: '1.3.4'
            }],
            libraryInfo: {
                name: '',
                version: '',
                aoc: 1322,
                coc: 481,
                apis: [
                    { "signature": "public Node getChilds()", "code": "public static void main() {\n}", "javadoc": "12`3222221333`123`23\n`" },
                    { "signature": "public void insertChild(Node child)", "code": "", "javadoc": "1`3`1" },
                    { "signature": "public Node removeNode(Node node)", "code": "", "javadoc": "13`21`3`23`343324234131" },
                ]
            },
            fileList: [],
            uploadedFilePath: "",
        }
    },
    mounted() {
        this.getTasks();
    },
    methods: {
        getTasks() {
            this.libraryNames = []
            fetchTasks().then((response) => {
                this.taskinfos = []
                let data = response.data
                for (let idx in data) {
                    this.taskinfos.push({
                        time: new Date(data[idx].time).toString(),
                        tasktype: data[idx].tasktype,
                        output: data[idx].output,
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