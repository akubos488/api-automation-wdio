const supertest = require('supertest');
const env = require('dotenv');
const faker = require('faker');
const header = require('../../data/header');
env.config();
const request = supertest(process.env.accountService_URL);

const generateRandomUserData = () => ({
  userName: faker.internet.userName(),
  password: faker.internet.password(),
});

const createUser = async () => {
  const { userName, password } = generateRandomUserData();

  process.env.TEST_USERNAME = userName;
  process.env.TEST_PASSWORD = password+"#";
  const response = await request
    .post('/Account/v1/User')
    .set(header.commonHeaders)
    .send({
      userName: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    });
  const userId = response.body.userID;
  return userId;
};

const generateToken = async () => {
  const response = await request
    .post('/Account/v1/GenerateToken')
    .set(header.commonHeaders)
    .send({
      userName: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    });

  const token = response.body.token;
  return token;
};

const createAccountAndGenerateToken = async () => {
  const userId = await createUser();
  const token = await generateToken();
  return { userId, token };
};

module.exports = createAccountAndGenerateToken;
