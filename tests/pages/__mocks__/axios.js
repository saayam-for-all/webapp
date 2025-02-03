import axios from 'axios'
export default {
    create: jest.fn(() => axios),
    post : jest.fn(() => Promise.resolve({data:{}}))
}