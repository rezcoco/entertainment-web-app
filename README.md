# Entertainment Web App

## Installation

Install the dependencies and devDependencies
```
npm i
```

For production environments...
```
npm install --production
```

## Setting up the .env file
```
cp .env.example .env
```

## Build
Compile the Typescript files with this command or simply use ``tsc``
```
npm run build
```

## Run
Run the server with this command
```
npm start
```
### __Important note: change the value of `secure` to `false` on `controller/AuthController.ts` if you're on http connection__