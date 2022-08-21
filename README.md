#### This is server repo of Zblog web-app

This apk is made using `Typescript`, `GraphQL`, `Apollo-server` and some other frameworks.

<hr style="height:1px;background-color:#000"/>

#### To run this into your machine :-

- In your terminal :
  `$ git clone repo URL`
  `$ npm install` (in the project folder)

**Note**: **Typescript** must be installed into your system.

`$ tsc -W` or `$ tsc --watch` (to compile .ts files)

- You can update the `tsconfig.json`

- After compiling the files, `dist` folder will be created in your root directory, this is where all your **.ts** files are compiled into **.js**
- you can update the `outDir` and `rootDir` keys in `tscongig.json` file to change the directory.

<hr style="height:1px;background-color:#000"/>

- All the schemas are written in `schema.graphql` file.
- Run `$ npm start` in to your terminal and the server will be started at `localhost:4000`.
- your **GraphQL** server will be on `localhost:4000/graphql`.

<hr style="height:1px;background-color:#000"/>

#### .env Content :-

create a `.env` file in your root directory and add :-

> - PORT= **4000**
> - JWT_SECRET= **YOUR JWT SECRET**
> - MONGO_URL= **mongodb://localhost:27017/blog**

This **Mongo URL** is for the **local DB**, you can upadte this URL with your <br /> `Atlas cloud URL`.
