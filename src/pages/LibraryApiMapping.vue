<template>
    <div id="mapping">
        <div id="mapping">
            <h1 id="title">LibraryUpdater</h1>
            <P id="description">LibraryUpdater是一个软件库自动升级工具</P>
        </div>
        <br></br>
        <div style="margin-top: 15px">
            <el-form :inline="true" :model="libraryParam" class="demo-form-inline">
                <el-form-item label="软件库">
                    <el-select v-model="libraryParam.name" placeholder="软件库名称" @change="searchLibraryVersionRule">
                        <el-option v-for="item in libraryNames" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本迁移规则">
                    <el-select v-model="libraryParam.versionRule" placeholder="版本迁移规则">
                        <el-option v-for="item in libraryVersions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchLibraryApiMapping">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div id="statistic">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="6">
                        <div>
                            <el-statistic group-separator="," :value="libraryMappingInfo.sourceLibraryInfo.loc"
                                title="代码行数"></el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-statistic title="方法数量">
                                <template slot="formatter">
                                    {{ libraryMappingInfo.sourceLibraryInfo.moc }}
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-statistic group-separator="," :value="libraryMappingInfo.sourceLibraryInfo.coc"
                                title="类数量">
                            </el-statistic>
                        </div>
                    </el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="6">
                        <div>
                            <el-statistic group-separator="," :value="libraryMappingInfo.targetLibraryInfo.loc"
                                title="代码数量"></el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-statistic title="方法数量">
                                <template slot="formatter">
                                    {{ libraryMappingInfo.targetLibraryInfo.moc }}
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-statistic group-separator="," :value="libraryMappingInfo.targetLibraryInfo.coc"
                                title="类数量">
                            </el-statistic>
                        </div>
                    </el-col>
                </el-col>
            </el-row>
        </div> -->
        <!-- <row>
            <h1>未变更API</h1>
            <el-table :data="libraryMappingInfo.unchangeApiMappings" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="代码">
                                <pre><code>{{ props.row.code }}</code></pre>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="方法签名" prop="signature">
                </el-table-column>
            </el-table>
        </row> -->

        <br />

        <row>
            <h1>API迁移规则</h1>
            <el-table :data="libraryMappingInfo.apiMappings" style="width: 100%">
                <el-table-column prop="source" label="源方法">
                </el-table-column>
                <el-table-column prop="target" label="目标方法">
                </el-table-column>
                <el-table-column prop="similarity" label="相似度" width="80px">
                </el-table-column>
            </el-table>
        </row>

        <br />
        <row>
            <h1>API映射图</h1>
            <div id="container">
                <div id="newCharts"></div>
            </div>
        </row>
    </div>
</template>

<script>
import {fetchLibrary, fetchLibraryVersionPair, fetchLibraryVersionApiMapping} from '@/api/index'

export default {
    name: 'LibraryInfo',
    data() {
        return {
            libraryParam: {
                name: '',
                versionRule: ''
            },
            libraryNames: [],
            libraryVersions: [],
            libraryMappingInfo: {
                apiMappings: []
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
            let apiMappings = []
            fetchLibraryVersionApiMapping(param).then((response) => {
                let data = response.data
                for (let idx in data) {
                    apiMappings.push({
                        source: data[idx].sourceApi,
                        target: data[idx].targetApi,
                        similarity: data[idx].similarity
                    })
                }
                this.libraryMappingInfo.apiMappings = apiMappings

                // 构建画图需要的数据结构
                let graph = {
                    nodes: [],
                    links: [],
                    categories: [{
                        name: "源方法"
                    },{
                        name: "目标方法"
                    }]
                }

                let nodes = new Map()
                let sourceType = new Map()
                let targetType = new Map()
                let id = 0
                for (let idx in apiMappings) {
                    if (!nodes.has(apiMappings[idx].source)) {
                        nodes.set(apiMappings[idx].source, id++)
                        sourceType.set(apiMappings[idx].source, id)
                    }
                    if (!nodes.has(apiMappings[idx].target)) {
                        nodes.set(apiMappings[idx].target, id++)
                        targetType.set(apiMappings[idx].target, id)
                    }
                }
                console.log(nodes)
                nodes.forEach((k, v) => {
                    let cate = 0
                    let x = -10
                    if (targetType.has(v)) {
                        cate = 1
                        x = 10
                    }
                    graph.nodes.push({
                        id: k,
                        name: v,
                        symbolSize: 4,
                        x: x,
                        y: Math.random() * 10,
                        value: 500,
                        category: cate 
                    })
                })

                for (let idx in apiMappings) {
                    let sourceId = nodes.get(apiMappings[idx].source)
                    let targetId = nodes.get(apiMappings[idx].target)

                    graph.links.push({
                        source: sourceId,
                        target: targetId
                    })
                }

                console.log(graph)

                this.showMappingChart(graph)
            })
        },
        searchLibraryMappingInfo() {
            // 查询软件库版本间的API映射
            console.log('submit!');
        },
        showMappingChart(graph) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('newCharts'));//也可以通过$refs.newCharts的方式去获取到dom实例。
            // 绘制图表
            myChart.setOption({
                title: { text: 'API映射' },//图标的标题
                tooltip: {},
                legend: [
                    {
                        data: graph.categories.map(function (a) {
                            return a.name;
                        })
                    }
                ],
                series: [
                    {
                        name: 'Les Miserables',
                        type: 'graph',
                        layout: 'none',
                        data: graph.nodes,
                        links: graph.links,
                        categories: graph.categories,
                        roam: true,
                        symbolSize: 80,
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        },
                        labelLayout: {
                            hideOverlap: true
                        },
                        scaleLimit: {
                            min: 0.4,
                            max: 2
                        },
                        lineStyle: {
                            color: 'source',
                            curveness: 0,
                            width: 1,
                            opacity: 0.5
                        }
                    }
                ]
            })
        }
    }

}

</script>
   
<style>
#title {
    margin: 30px;
    font-size: 70px;
}

#description {
    font-size: larger;
}

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

#container {
    width: 100%;
    height: 100vh;
    padding-top: 100px;
}

#newCharts {
    margin: 0 auto;
    width: 1400px;
    height: 800px;
    border: #99a9bf;
}
</style>