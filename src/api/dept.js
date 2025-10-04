import request from '@/utils/request'
//查询部门列表
export const queryAllApi = () => request.get('depts');

//新增部门
export const addApi = (dept) => request.post('depts', dept);
// 根据id查询部门
export const queryByIdApi = (id) => request.get(`depts/${id}`);
//修改部门
export const updateApi = (dept) => request.put('depts', dept);
//删除部门