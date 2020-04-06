Setting up Postman

1 -> Download Chrome postman Extension (not the postman offical app)
2 -> Import the postman json file attched in mail

Create an environment
3 -> on the top left side select manage environements and add 
      url = localhost:3000

Open save user API 
4 -> In body select raw json and the following body 

{
	"email" : "ajayyadav@gmail.com",
	"password" : "Ajay123",
	"registerAs" : "Both",
	"designer" : {
		"capacity" : 5,
		"typeOfDesigner": "Architect",
		"training": "None"
	},
	"maker": {
		"capacity" : 8,
		"material" : ["Wood", "Metal"],
		"location" : "US"
	}
}

5 -> in save user in test add the following script

if (responseCode.code === 201) {
    var jsonData = JSON.parse(responseBody);
    postman.setEnvironmentVariable("authToken", jsonData.token);    
}

6 -> start thr server and database
to start the server  npm i > npm run dev

(hit the save user api data should be cisible in database)



For saving images use upload images

select body > formdata   

then set key=upload (on its left change text to file ) now a choose file option should appear 

choose an image to upload  then hit the api

(image gets uploaded on server in image directory)

now check the database for current user a link should be visible in imgUrls field