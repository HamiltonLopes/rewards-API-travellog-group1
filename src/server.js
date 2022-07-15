import App from './app.js';

App.listen(process.env.PORT, process.env.URL, 
    () => console.log(`Server runing on http://localhost:${process.env.PORT}/${process.env.API_NAME}/${process.env.API_VERSION}`));