const supertest = require('supertest');
const env = require('dotenv');
const headers = require('../../data/header');
env.config();
const request = supertest(process.env.accountService_URL);

const postBooks = async (userId, token, isbn) => {
  const response = await request
    .post('/BookStore/v1/Books')
    .set(headers.commonHeaders)
    .set('Authorization', `Bearer ${token}`)
    .send({
      "userId": `${userId}`,
      "collectionOfIsbns": [
        {
          "isbn": `${isbn}`,
        },
      ],
    });
    
  return response;
};

module.exports = postBooks;