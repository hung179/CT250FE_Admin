export default function useInformationService() {
    const { $api } = useNuxtApp();
    
    const sendInformation = async (data: any) => {
      try {
        const plainData = JSON.parse(JSON.stringify(data));
        const dataProvince = await getAllInformation();
        const result =  dataProvince.data.filter((value: any) => {
          return value.tinh_VC==plainData.tinh_VC
        })
        if(result.length>0){
          return {success: false, data: 'Tỉnh trùng khớp'}
        }else
        return (await $api.post('/shippingInformation', plainData)).data;
      } catch (error) {
        throw error;
      }
    };
    const getAllInformation =  async () => {
      try{
        const result = await $api.get('/shippingInformation');
        return {
          success: true,
          data: result.data.data
        };
      }catch (error : any) {
        console.log('Chi tiết lỗi đầy đủ:', error);
        console.log('Response từ server nếu có:', error.response);
        return {
          success: false,
          error: error.response?.data || error.message
        };
      }
    }
     // GET method - lấy thông tin
  const getInformationById = async (id: string = '') => {
    try {
      const endpoint = id ? `/information/${id}` : '/information';
      const response = await $api.get(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error : any) {
      console.error('Error fetching information:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  };
  
  // PUT method - cập nhật thông tin
  const updateInformation = async (id : any, formData : any) => {
    try {
      const plainData = JSON.parse(JSON.stringify(formData));
      const response = await $api.put(`/shippingInformation/${id}`, plainData);
      return {
        success: true,
        data: response.data
      };
    } catch (error : any) {
      console.error('Error updating information:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  };
  
  // DELETE method - xóa thông tin
  const deleteInformation = async (id : any) => {
    try {
      const response = await $api.delete(`/shippingInformation/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error deleting information:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  };
  
  return {
    sendInformation,
    getAllInformation,
    getInformationById,
    updateInformation,
    deleteInformation
  };
}