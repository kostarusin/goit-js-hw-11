import axios from 'axios';

export async function fetchImages(requestUrl) {
  try {
    const response = await axios.get(requestUrl);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
