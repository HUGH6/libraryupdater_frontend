import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Layout from '@/pages/layout'
import Main from '@/pages/main'
import LibraryInfo from '@/pages/LibraryInfo'
import LibraryApiMapping from '@/pages/LibraryApiMapping'
import Migration from '@/pages/Migration'
import Record from '@/pages/Record'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [{
        // 这里不设置值，是把main作为默认页面
        path: '/', 
        name: 'LibraryInfo',
        component: LibraryInfo
      },{
        path: '/library_info',
        name: 'LibraryInfo',
        component: LibraryInfo
      },{
        path: '/library_api_mapping',
        name: 'LibraryApiMapping',
        component: LibraryApiMapping
      },{
        path: '/migration',
        name: 'Migraion',
        component: Migration
      },{
        path: '/record',
        name: 'Record',
        component: Record
      }]
    }
  ]
})
