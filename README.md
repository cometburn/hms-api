# install 
npm i

# migrate
npm run prisma:migrate

# seed db
npx ts-node prisma/seeder/admin-seeder.ts
npx ts-node prisma/seeder/constantSeeder.ts 

# to generate your password, type: 
node
const bcrypt = require('bcrypt')
bcrypt.hashSync('your-password', 10)  #replace it in db

# generate fake properties, agents and offices
npx ts-node prisma/seeder/fakePropertySeeder.ts

# prisma commands 
npx prisma-multischema
npx prisma migrate reset


#Rules 

controller -> service -> repository

# no collision — plain import
import { getUser } from "@/repositories/user.repository";

# one function, collision — alias
import { login as loginRepo } from "@/repositories/user.repository";

# many functions, collision — namespace
import * as UserRepository from "@/repositories/user.repository";