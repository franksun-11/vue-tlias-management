<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept';
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询函数
const search = async () => {
  // const result = await axios.get('https://m1.apifoxmock.com/m1/7116608-6839408-6228127/depts?apifoxApiId=357935821').then()
  // if(result.data.code){ // js当中隐式类型转换 0 - false 其他数字 - true; null/undefined - false; 非空字符串 - true; 空字符串 - false
  //   deptList.value = result.data.data
  // } else {
  //   console.log(result.data.msg)
  // }
  const result = await queryAllApi();
  if (result.code) {
    deptList.value = result.data
  } else {
    console.log(result.msg)
  }

}

//钩子函数
onMounted(() => {
  search()
})



const deptList = ref([])

// dialog对话框
const dialogFormVisible = ref(false);
const dept = ref({ name: '' });
const formTitle = ref('');
const deptFormRef = ref();

//编辑操作
const edit = async (id) => {
  formTitle.value = '修改部门';
  // 重置表单检验规则
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
  const result = await queryByIdApi(id);
  if (result.code) {
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
}

const deleteById = async (id) => {
  // 弹出确认对话框
  ElMessageBox.confirm('您确认删除该部门吗？', '提示',
  {confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning'})
    .then(async () => { // 确认
      const result = await deleteByIdApi(id);
      if (result.code) {
        ElMessage.success('删除成功');
        search();
      }else {
        ElMessage.error(result.msg);
      }
    })
    .catch(() => { // 取消
      ElMessage.info('您已取消删除');
    })
}

// 保存部门
const save = async () => {
  // 表单检验
  if (!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => { //valid 表示是否通过表单校验
    if (valid) {
      //通过
      let result;
      if (dept.value.id) { //修改
        result = await updateApi(dept.value);
      } else { //新增
        result = await addApi(dept.value);
      }

      if (result.code) {
        // 1.提示信息
        ElMessage.success('操作成功');
        // 2.关闭对话框
        dialogFormVisible.value = false;
        // 3.查询表格
        search();
      } else { //失败
        ElMessage.error(result.msg);
      }
    } else { //未通过
      ElMessage.error('表单校验失败');
      return false;
    }
  })
}


// 表单校验相关
const rules = ref({
  name: [
    { required: true, message: '请输入部门名称！', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称长度须在2-10位之间！', trigger: 'blur' }
  ]
})

// 新增部门
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = '新增部门';
  dept.value = { name: '' };
  // 重置表单检验规则
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
}
</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept">新增部门</el-button>
  </div>
  <!-- 表格 -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="部门名称" width="260" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click='edit(scope.row.id)'><el-icon>
              <EditPen />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="small" @click='deleteById(scope.row.id)'><el-icon>
              <Delete />
            </el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- dialog对话框组件 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click=save>确定</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
