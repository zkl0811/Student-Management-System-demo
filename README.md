# Student Management  System -Vue-demo

# 1.0 Introduction

```
  This is a front-end focused Vue project  demo for a backend management system. Vue-Cli was used to define the structure. The site was deployed at https://kzsmsdemo.netlify.app.  Due to the forced SSL rule by Netlify, the project used another mock api called beeceptors which had the exact same design as the one described in this doc, but it only accept 50 requests per day.
```

2.0 Structure

```
|---dist                      //source for production
|---node_modules              //node modules
|---public                    //public static assets
|---src						//resources for development
   |---api					//contains functions t retrieve data
   |---assets                 //static assets
   |---comonents			//Vue components for Layout
   |---store                 //Vuex state control
   |---utils                 // customized functions and objects
   |---views				//Vue components for router
   |---App.vue				//components entrance
   |---main.js				//js files entrance
   |---permission.js		// permission for router
   |---router.js			//router tables
|---.browserslistrc			//The config to share target browsers and Node.js versions between 							  //different front-end tools 
|---.env.development        //config variables for development mode
|---.env.production         //config variables for production mode
|---.eslintrc.js            //config for lint check
|---.gitignore              //files that won't be pushed to github remote repo
|---babel.config.js         //configuration for babel
|---package-lock.json       //version lock down for dependencies
|---package.json            //basic info about the project adn dependencies
|---postcss.config.js       //can define compilers for css files
|---vue.config.js           //configuration for proxy and rewrite rules and development server
```

# 3.0  Project setup

### install  all required dependencies

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

# 4.0  Mock API Design

```
mock api in development mode was deployed on easy-mock
```

![](./public/1.png)

![](./public/2.png)

![](./public/3.png)





