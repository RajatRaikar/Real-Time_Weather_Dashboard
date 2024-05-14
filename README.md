step to run server
1. npm i
2. add .env config
3. npm start

authomatically db and required model, procedure and view get initialize

api list
1. To login
    method: POST
    input: native_id(string and unique)
    url: {{url}}/user/login
    ex: http://localhost:3000/login
2. To get list
    method: GET
    url: {{url}}/user/
3. To update user preference
    method: POST
    input: id (number), preference(give location here)
    url: {{url}}/user/
4. CRON is running for every one sec. we can change timer using PERIODIC_WEATHER_REFRESH_TIMER in .env file