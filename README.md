#install 
npm i

#migrate
npm run prisma:migrate

#seed db
npx ts-node prisma/seeder/adminSeeder.ts
npx ts-node prisma/seeder/constantSeeder.ts 

#to generate your password, type: 
node
const bcrypt = require('bcrypt')
bcrypt.hashSync('your-password', 10)  #replace it in db

#generate fake properties, agents and offices
npx ts-node prisma/seeder/fakePropertySeeder.ts

#prisma commands 
npx prisma-multischema
npx prisma migrate reset