## How to setup a new TypeScript Express . 

1. 
`````````
npm init -y

`````````
2. 
`````````
npm install -D typesript
npm install concurrently

`````````
3. 
`````````
tsc --init

`````````
4. 
`````````
Add the following scripts to the package.json

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "tsc -w",
        "build": "tsc",
        "prestart": "npm run build",
        "start": "npx nodemon dist/index.js",
        "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""
    }

`````````
Note: Make relevant changes to your tsconfig.json file.

5. 
`````````
npm run dev

`````````