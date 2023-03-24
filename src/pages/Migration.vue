<template>
    <div>
        <div id="mapping">
            <h1 id="title">LibraryUpdater</h1>
            <P id="description">LibraryUpdater是一个软件库自动升级工具</P>
        </div>
        <br></br>
        <el-row>
            <el-col :span="11">
            <h1 style="margin-bottom: 10px;">迁移配置</h1>
            <el-form ref="libraryParam" :model="libraryParam" label-width="140px" title="迁移配置">
                <el-form-item label="项目导入">
                    <el-upload class="upload-demo" action="http://localhost:8080/upload"
                        :on-preview="handlePreview" :on-remove="handleRemove"
                        :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                        <el-button size="small" type="primary">点击导入</el-button>
                        <div slot="tip" class="el-upload__tip">只能导入zip格式</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="软件库">
                    <el-select v-model="libraryParam.name" placeholder="软件库名称" @change="searchLibraryVersionRule">
                        <el-option v-for="item in libraryNames" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本迁移规则">
                    <el-select v-model="libraryParam.versionRule" placeholder="版本迁移规则" @change="searchLibraryApiMapping">
                        <el-option v-for="item in libraryVersions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="方法映射">
                    <el-select v-model="libraryParam.apiMapping" placeholder="方法映射">
                        <el-option v-for="item in apiMappings" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生成验证优化">
                    <el-switch v-model="libraryParam.generate_validate"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="parseProject">start</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="13">
                <h1 style="margin-bottom: 10px;">调用点列表</h1>
                <el-table :data="callPoint" style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="调用点代码">
                                    <prism-editor
                                        class="my-editor height-300 editor_width"
                                        v-model="props.row.code"
                                        :highlight="highlighter"
                                        :line-numbers="lineNumbers"
                                    ></prism-editor>
                                    <!-- <pre><code>{{props.row.code}}</code></pre> -->
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="代码行数" prop="linenum">
                    </el-table-column>
                    <el-table-column label="操作" width="80px;">
                        <template slot-scope="scope" >
                            <el-button
                            size="mini"
                            @click="handleSelect(scope.$index, scope.row)">选择</el-button>
                    </template>
                        </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="10">
                <prism-editor
                    class="my-editor height-300"
                    v-model="transfer_param.sourcecode"
                    :highlight="highlighter"
                    :line-numbers="lineNumbers"
                ></prism-editor>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="getTransferCode">
                    生成迁移补丁
                </el-button>
            </el-col>
            <el-col :span="10">
                <prism-editor
                    class="my-editor height-300"
                    v-model="transfer_param.targetcode"
                    :highlight="highlighter"
                    :line-numbers="lineNumbers"
                ></prism-editor>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import {fetchLibrary, fetchLibraryVersionPair, fetchLibraryVersionApiMapping, getClientApiCallPoints, getTransferedCode, parseClient} from '@/api/index'

export default {
    components: {
        PrismEditor
    },
    data() {
        return {
            libraryParam: {
                name: '',
                versionRule: '',
                apiMapping: '',
                generate_validate: false,
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
                value: '1.2.2=>1.2.3',
                label: '1.2.2=>1.2.3'
            }, {
                value: '1.2.1=>1.2.3',
                label: '1.2.1=>1.2.3'
            }, {
                value: '1.3.4=>1.3.5',
                label: '1.3.4=>1.3.5'
            }],
            apiMappings: [
                {
                    value: "public void fatal(java.lang.Object, java.lang.Throwable) => public abstract void error(java.lang.String, java.lang.Object)",
                    label: "public void fatal(java.lang.Object, java.lang.Throwable) => public abstract void error(java.lang.String, java.lang.Object)",
                },
            ],
            callPoint: [],
            transfer_param: {
                sourcecode: "",
                targetcode: "",
                callPointId: 0,
                name: "",
                version: "",
            },
            lineNumbers: true,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
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
        searchLibraryVersionRule() {
            if (this.libraryParam.name == '') {
                return
            }

            this.libraryVersions = []
            let queryParam = {
                name: this.libraryParam.name
            }
            fetchLibraryVersionPair(queryParam).then((response) => {
                let data = response.data
                for (let idx in data) {
                    let rule = data[idx].sourceVersion + '=>' + data[idx].targetVersion
                    this.libraryVersions.push({
                        value: rule,
                        label: rule
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        searchLibraryApiMapping() {
            if (this.libraryParam.name == '' || this.libraryParam.versionRule == '') {
                return
            }

            let splitIdx = this.libraryParam.versionRule.indexOf('=>')
            let param = {
                name: this.libraryParam.name,
                sourceVersion: this.libraryParam.versionRule.substring(0, splitIdx),
                targetVersion: this.libraryParam.versionRule.substring(splitIdx+2)
            }
            this.apiMappings = []
            fetchLibraryVersionApiMapping(param).then((response) => {
                let data = response.data
                for (let idx in data) {
                    let apiMapping = data[idx].sourceApi + "=>" + data[idx].targetApi
                    this.apiMappings.push({
                        value: apiMapping,
                        label: apiMapping
                    })
                }
                console.log(this.apiMappings)
            })
        },
        onSubmit() {
            console.log('submit!');
        },
        parseProject() {
            let param = {
                name: this.libraryParam.name,
                version: this.libraryParam.versionRule,
                generate_validate: this.libraryParam.generate_validate
            }
            this.callPoint = []
            parseClient(param).then((response) => {
                let data = response.data
                for (let idx in response.data) {
                    this.callPoint.push({
                        id: data[idx].id,
                        name: data[idx].name,
                        version: data[idx].version,
                        linenum: data[idx].linenum,
                        code: data[idx].code
                    })
                }

            })
        },
        handleSelect(index, row) {
            this.transfer_param.sourcecode = row.code
            this.transfer_param.callPointId = row.id
            this.transfer_param.name = row.name
            this.transfer_param.version = row.version
        },
        getTransferCode() {
            this.transfer_param.targetcode = ''
            let param = {
                name: this.transfer_param.name,
                version: this.transfer_param.version,
                id: this.transfer_param.callPointId,
                generate_and_validate: this.libraryParam.generate_validate,
            }
            getTransferedCode(param).then((response) => {
                let data = response.data
                this.transfer_param.targetcode = data.transferedCode
            })
        },
        highlighter(code) {
            return highlight(code, languages.js)
        }
    }
}
</script>

<style>
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

/* required class */
.my-editor {
  background: #2d2d2d;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* not required: */
.height-300 {
  height: 300px;
}

.editor_width {
    width: 900px;
}
</style>