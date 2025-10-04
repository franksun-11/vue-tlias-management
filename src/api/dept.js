import request from '@/utils/request'
//查询部门列表
export const queryAllApi = () => request.get('depts');

//新增部门
export const addApi = (dept) => request.post('depts', dept);
//修改部门
//删除部门