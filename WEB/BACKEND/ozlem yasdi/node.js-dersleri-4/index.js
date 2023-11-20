const express = require ("express"); // kütüphaneye aldık expressi

const app = express(); // elimizde artık uygulamamız var
// send. file diye dosya göndermemizi saglayan bi şey var ama bunu kullanırken dosyanın yolunu da vermek zorundayız biz dosyanın yolune vermekle ugrasmamak için ejs temple engine kuracagız.
// ejs olmak zorunda değil yerine kullanabileceğimiz baska temple engineler de var : teacup , doT , handlebars 
// sadece dosya göndermeye yaramaz bi sürü özelliği vardır. 


app.use(express.static('public'));
app.use(express.static('node_modules'));

app.set ("view engine","ejs");
  


const data = [
    {id:1 , name:"iphone14" , price: 30000 , isActive: true , imageurl:"48175.webp"},
    {id:2 , name:"iphone15" , price: 40000 , isActive: true, imageurl:"download.jpg"},
    {id:3 , name:"iphone16" , price: 50000 , isActive: false, imageurl:"imagees.jpeg"},


]

app.use("/products/:id" , function(req,res){  //routes yapısı 
    const urun = data.find(u => u.id == req.params.id ) ;
    res.render("product-details",urun) ;
}); // middle ware


app.use("/products" , function(req,res){ 
res.render("products", {
    urunler: data
});  

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
