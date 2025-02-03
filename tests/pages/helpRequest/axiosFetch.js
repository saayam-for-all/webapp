
  
  import axios from 'axios';

export const submitData = async (formData) => {
  try {
    const response = await axios.post( "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/help-request", formData);
    return response.data;  
  } catch (error) {
    throw new Error('Error al enviar los datos');
  }
};
