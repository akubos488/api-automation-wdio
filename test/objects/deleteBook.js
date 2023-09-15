const supertest = require('supertest');
const env = require('dotenv');
const headers = require('../../data/header');
env.config();
const request = supertest(process.env.accountService_URL);

const deleteBooks = async (userId, token) => {
  const response = await request
    .delete(`/BookStore/v1/Books?UserId=${userId}`)
    .set(headers.commonHeaders)
    .set('Authorization', `Bearer ${token}`)
    .send()
    
  return response;
};

module.exports = deleteBooks;