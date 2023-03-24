import request from '../utils/request';

export const fetchMapping = () => {
    return request({
        url: '/mapping',
        method: 'get'
    })
}

export const fetchLibrary = () => {
    return request({
        url: '/library',
        method: 'get'
    })
}

export const fetchLibraryVersionPair = (param) => {
    return request({
        url: '/library_version_rule',
        method: 'post',
        data: {
            name: param.name
        }
    })
}

export const fetchLibraryVersionApiMapping = (param) => {
    return request({
        url: '/library_version_api_mapping',
        method: 'post',
        data: {
            name: param.name,
            sourceVersion: param.sourceVersion,
            targetVersion: param.targetVersion
        }
    })
}

export const getClientApiCallPoints = (param) => {
    return request({
        url: '/client_api_call_points',
        method: 'get',
        data: param
    })
}

export const getTransferedCode = (param) => {
    return request({
        url: '/transfer_code',
        method: 'post',
        data: {
            name: param.name,
            version: param.version,
            id: param.id,
            generate_and_validate: param.generate_and_validate
        }
    })
}

// 根据软件库名称和版本信息查询软件库相关信息与方法信息
export const getLibraryInfo = (param) => {
    return request({
        url: '/transfered_code',
        method: 'get',
        data: {
            libraryName: param.libraryName,
            version: param.version,
        }
    })
}

// 解析软件库
export const parseLibraryInfo = (param) => {
    return request({
        url: '/transfered_code',
        method: 'get',
        data: {
            libraryName: param.libraryName,
            version: param.version,
        }
    })
}

// 解析客户端项目
export const parseClient = (param) => {
    return request({
        url: '/parse_client_code',
        method: 'get',
        params: {
            name: param.name
        }
    })
}

// 获取软件库所有版本号
export const fetchLibraryVersions = (param) => {
    return request({
        url: '/library_versions',
        method: 'get',
        params: {
            name: param.name
        }
    })
}

// 获取软件库相关信息和方法列表
export const fetchLibraryInfoAndApis = (param) => {
    return request({
        url: '/library_info_and_apis',
        method: 'post',
        data: {
            name: param.name,
            version: param.version
        }
    })
}

export const parseLibrary = (param) => {
    return request({
        url: '/parse_library',
        method: 'post',
        data: {
            filePath: param.filePath,
        }
    })
}

// 获取任务列表
export const fetchTasks = () => {
    return request({
        url: '/tasks',
        method: 'get',
    })
}