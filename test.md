npx sequelize-cli model:generate --name User --attributes email:string,first_name:string,last_name:string,password:string,profile_image:string

npx sequelize-cli model:generate --name Banner --attributes banner_name:string,banner_image:string,description:string

npx sequelize-cli model:generate --name Service --attributes service_code:string,service_name:string,service_icon:string,service_tarif:integer

npx sequelize-cli model:generate --name Balance --attributes balance:integer

npx sequelize-cli model:generate --name Balance --attributes balance:integer

npx sequelize-cli model:generate --name Topup --attributes userId:integer,top_up_amount:integer
