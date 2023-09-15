const supertest = require('supertest');
const env = require('dotenv');
const headers = require('../../data/header');
env.config();
const request = supertest(process.env.accountService_URL);
const getIsbn = async () => {
  const response = await request
    .get('/BookStore/v1/Books')
    .set(headers.commonHeaders)
    .send();
  const booksResponse = response.body;
  const isbn = booksResponse.books[0].isbn;
  return isbn;
};

module.exports = getIsbn;