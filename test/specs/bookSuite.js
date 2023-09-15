const { expect } = require('chai')
const createAccountAndGenerateToken = require('../helper/setupAccount.js');
const getIsbn = require('../objects/getBook.js');
const postBooks = require('../objects/postBook.js');
const deleteBooks = require('../objects/deleteBook.js');

const data = require('../../data/data.js');

describe.only('User Book Collection', function () {
  let userId;
  let token;
  let isbn;
  before(async function () {
    const result = await createAccountAndGenerateToken();
    userId = result.userId;
    token = result.token;
  });

  it('should successfully to add a book to the user collection with valid token', async function () {
    isbn = await getIsbn();
    const response = await postBooks(userId, token, isbn);
    await expect(response.body.books[0].isbn).equal(isbn)
    await expect(response.statusCode).equal(201)
  });

  it('should not able to add a book to the user collection using same ISBN with valid token', async function () {
    const response = await postBooks(userId, token, isbn);
    await expect(response.body.code).equal("1210")
    await expect(response.body.message).equal("ISBN already present in the User's Collection!")
    await expect(response.status).equal(400)
  });

  it('should not able to add a book to the user collection using not available ISBN with valid token', async function () {
    const response = await postBooks(userId, token, data.wrongIsbn);
    await expect(response.body.code).equal("1205")
    await expect(response.body.message).equal("ISBN supplied is not available in Books Collection!")
    await expect(response.status).equal(400)
  });

  it('should not able to add a book to the user collection using empty ISBN with valid token', async function () {
    const response = await postBooks(userId, token," ");
    console.log(response.body)
    await expect(response.body.code).equal("1205")
    await expect(response.body.message).equal("ISBN supplied is not available in Books Collection!")
    await expect(response.status).equal(400)
  });

  it('should not able to add a book to the user collection using wrong USERID with valid token', async function () {
    const response = await postBooks(data.wrongUserID, token," ");
    await expect(response.body.code).equal("1207")
    await expect(response.body.message).equal("User Id not correct!")
    await expect(response.status).equal(400)
  });

  it('should not able to add a book to the user collection with invalid token', async function () {
    const isbn = await getIsbn();
    const response = await postBooks(userId, data.wrongToken, isbn);
    await expect(response.body.code).equal("1200")
    await expect(response.body.message).equal("User not authorized!")
    await expect(response.statusCode).equal(401)
  });

  it('should successfully to delete a book from the user collection with valid token', async function () {
    const response = await deleteBooks(userId, token);
    await expect(response.statusCode).equal(204)
  });

  it('should not able to delete a book from the user collection with invalid USERID', async function () {
    const response = await deleteBooks(data.wrongUserID, token);
    await expect(response.body.code).equal("1207")
    await expect(response.body.message).equal("User not authorized!")
    await expect(response.statusCode).equal(401)
  });
  
  it('should not able to delete a book from the user collection with invalid Token', async function () {
    const response = await deleteBooks(userId, data.wrongToken);
    await expect(response.body.code).equal("1200")
    await expect(response.body.message).equal("User not authorized!")
    await expect(response.statusCode).equal(401)
  });
});
