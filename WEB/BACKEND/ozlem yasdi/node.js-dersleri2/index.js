const express = require ("express"); // kütüphaneye aldık expressi

const app = express(); // elimizde artık uygulamamız var
// send. file diye dosya göndermemizi saglayan bi şey var ama bunu kullanırken dosyanın yolunu da vermek zorundayız biz dosyanın yolune vermekle ugrasmamak için ejs temple engine kuracagız.
// ejs olmak zorunda değil yerine kullanabileceğimiz baska temple engineler de var : teacup , doT , handlebars 
// sadece dosya göndermeye yaramaz bi sürü özelliği vardır. 


app.set ("view engine","ejs");

app.use("/products/:id" , function(req,res){  //routes yapısı 
res.render("urun-details") ;
}); // middle ware


app.use("/products" , function(req,res){ 
res.render("urunler");        
}); // middle ware


app.use("/" , function(req,res){ 
res.render("index");        
}); // middle ware
   

app.listen (5000 , () => {
console.log("5000 portu bizi dinlemekte");
});
  
//!   app.use("/products/:id" , function(req,res){         //routes yapısı 
//!   res.send("products details" + req.params.id) ;
//!   });                                                 // middle ware

//!  app.use("/products/5" , function(req,res){ 
//!  res.send("products 5");        
//!  }); // middle ware


//!   app.use("/products" , function(req,res){ 
//!   res.send("products");        
//!   }); // middle ware

//!   app.use("/" , function(req,res){    //ilk parametre olarak / geldiğinde urlden function fonksiyonu çağırılır ve res.send görevini yapar 
//!   res.send("anasayfa");               // response.send metodu aracılıgıyla sayfayı direkt anasayfaya gönderme
//!   }); // middle ware
