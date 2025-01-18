
  
  import axios from 'axios';

// Función que envía datos usando axios.post
export const submitData = async (formData) => {
  try {
    const response = await axios.post( "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/help-request", formData);
    return response.data;  // La función espera recibir data de la respuesta
  } catch (error) {
    throw new Error('Error al enviar los datos');
  }
};
