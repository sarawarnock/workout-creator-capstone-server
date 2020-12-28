module.exports = {
  PORT: process.env.PORT || 8800,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://efrsurfkehinmz:644eaee35558101fec69e27320f4f2dff029dfea5c05d9f06185fea0d1511040@ec2-34-193-117-204.compute-1.amazonaws.com:5432/d5950790ursikh',
  //DATABASE_URL: 'postgresql://postgres@localhost/workout-creator-capstone-server',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/workout-creator-capstone-server-test',
  JWT_SECRET: process.env.JWT_SECRET || 'abc234',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  CLIENT_ORIGIN: 'https://workout-creator-capstone-client.vercel.app' || 'https://vercel.com/sarawarnock/workout-creator-capstone-client/q70n8e1vz' || 'https://workout-creator-capstone-client.sarawarnock.vercel.app' || 'https://workout-creator-capstone-client-q70n8e1vz.vercel.app'
}
