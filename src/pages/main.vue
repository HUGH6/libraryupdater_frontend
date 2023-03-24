<template>
    <div id="mapping">
        <h1 id="title">LibraryUpdater</h1>
        <P id="description">LibraryUpdater是一个软件库自动升级工具</P>
        <div style="margin-top: 15px">
            <el-autocomplete
                style="width: 800px;"
                v-model="libraryName"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                >
                <el-button slot="append" icon="el-icon-search" @click="searchLibraryMapping"></el-button>
            </el-autocomplete>
        </div>
        <div id="container">
            <div id="newCharts"></div>
        </div>
    </div>
</template>
   
<script>
export default {
    name: 'main',
    data() {
        return {
            libraryName: '',
            mappingRelation: {},
        }
    },
    mounted() {
        // this.showCharts();
        this.showMappingChart();
    },
    methods: {
        querySearch(queryString, cb) {
            console.log(queryString)
            // axios请求映射规则
            let result = [{
                'value':'mokito:1.2.1:3.2.1'
            }, {
                'value':'mokito:1.3.2:2.3.1'
            }]
            // 调用 callback 返回建议列表的数据
            cb(result)
        },
        searchLibraryMapping() {
            console.log('search library mapping call')

            if (this.libraryName == '') {
                return
            }

            // axios搜索
            this.mappingRelation = ""

            if (this.mappingRelation != "") {
                this.showMappingChart(this.mappingRelation)
            }

        },
        showMappingChart(mappingRelation) {
            let graph = require('@/assets/relation_demo.json')
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('newCharts'));//也可以通过$refs.newCharts的方式去获取到dom实例。
            // 绘制图表
            myChart.setOption({
                title: { text: 'API映射' },//图标的标题
                tooltip: {},
                // legend: [
                //     {
                //         data: graph.categories.map(function (a) {
                //             return a.name;
                //         })
                //     }
                // ],
                series: [
                    {
                        name: 'Les Miserables',
                        type: 'graph',
                        layout: 'none',
                        data: graph.nodes,
                        links: graph.links,
                        categories: graph.categories,
                        roam: true,
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
                            curveness: 0.3
                        }
                    }
                ]
            })
        },
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

#container {
    width: 100%;
    height: 100vh;
    padding-top: 100px;
}

#newCharts {
    margin: 0 auto;
    width: 800px;
    height: 800px;
}

.el-select .el-input {
    width: 130px;
}

.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>