# TSOA Node.js Template (CJS)

- โปรเจคนี้เป็นโครงโปรเจคสามารถโคลนและนำไปปรับใช้ได้ทันที
- โปรเจคนี้ใช้ `tsoa` `express` และ `swaggerui` เป็นหลัก
- โปรเจคนี้มีการตั้งค่า `docker` และ `prettier` ให้พร้อมแล้ว

## Step to Reproduce

> [!TIP]
>
> ในที่นี้จะใช้ `pnpm` ที่ดีกว่า `npm` แทน โดย `pnpm add` จะมีค่าเท่ากับ `npm i`
>
> หากต้องการใช้ `pnpm` สามารถลงได้โดย `npm i -g pnpm`
>
> ข้อมูลเพิ่มเติม: [pnpm](https://pnpm.io/installation)

1. เตรียมและติดตั้งแพคเกจ
   - `pnpm init`
   - `pnpm add -D @types/cors @types/express @types/node @types/swagger-ui-express nodemon prettier ts-node typescript` แพคเกจนี้เป็นเพียงแพคเกจทีจะถูกใช้เฉพาะตอนพัฒนาระบบเท่านั้น และไม่ถูกนำไปใช้เพื่อให้ระบบสามารถทำงานได้ แพคเกจเหล่านี้จะไม่ถูกติดตั้งเมื่อนำไปใช้งานจริงบน production
   - `pnpm add @tsoa/runtime cors dotenv express fast-jwt mysql2 promise.any reflect-metadata swagger-ui-express tsoa typeorm` แพคเกจนี้เป็นแพคเกจที่จำเป็นสำหรับการทำงานของระบบ หากไม่มีจะไม่สามารถทำให้ระบบทำงานได้เมื่อติดตั้งไม่ครบ
2. ตั้งค่าโปรเจค
   - [.dockerignore](./.dockerignore)
   - [.env](./.env.example)
   - [.gitignore](./.gitignore)
   - [.prettierignore](./.prettierignore)
   - [.prettierrc](./.prettierc)
   - [Dockerfile](./Dockerfile)
   - [nodemon.json](./nodemon.json)
   - [package.json](./package.json)
   - [tsconfig.json](./tsconfig.json)
   - [tsoa.json](./tsoa.json)
3. ขึ้นโครงแอปพลิเคชัน
   - [src/app.ts](./src/app.ts)
   - [src/database/data-source.ts](./src/database/data-source.ts)
   - [src/middlewares/auth.ts](./src/middlewares/auth.ts)
   - [src/middlewares/error.ts](./src/middlewares/error.ts)
   - [src/interfaces/http-error.ts](./src/interfaces/http-status.ts)
   - [src/interfaces/http-status.ts](./src/interfaces/http-error.ts)
   - [src/controllers/MyAppController.ts](./src/controllers/MyAppController.ts)

> [!NOTE]
>
> ชื่อไฟล์ปกติจะใช้เป็น kebab-case แต่สำหรับ controllers ต่างๆ ใช้เป็น PascalCase

> [!CAUTION]
>
> การตั้งค่า [src/database/data-source.ts](./src/database/data-source.ts) ก่อนขึ้น production ปรับ `synchronize` เป็น `false` และเริ่มทำ migrations
