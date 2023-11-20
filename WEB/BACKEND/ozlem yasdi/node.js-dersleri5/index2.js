const express = require ("express"); // kütüphaneye aldık expressi

const app = express(); // elimizde artık uygulamamız var
// send. file diye dosya göndermemizi saglayan bi şey var ama bunu kullanırken dosyanın yolunu da vermek zorundayız biz dosyanın yolune vermekle ugrasmamak için ejs temple engine kuracagız.
// ejs olmak zorunda değil yerine kullanabileceğimiz baska temple engineler de var : teacup , doT , handlebars 
// sadece dosya göndermeye yaramaz bi sürü özelliği vardır. 


app.set ("view engine","ejs");
  
const data = [
    {id:1 , name:"iphone14" , price: 30000 , isActive: true},
    {id:2 , name:"iphone15" , price: 40000 , isActive: true},
    {id:3 , name:"iphone16" , price: 50000 , isActive: false},


]

app.use("/products/:id" , function(req,res){  //routes yapısı 
res.render("product-details") ;
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



//! product.ejs 
/*
<!DOCTYPE html>                         
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Urunler </h1>

<p>
    <%= urunler[0].name %>
    <%= urunler[0].price %>

</p>


<ul>
  <% urunler.forEach(urun => { %>

    <li>  <%= urun.name %> - <%= urun.price %> </li>  

  <% }) %>     

</ul>


<ul>
    <% urunler.forEach(urun => { %>     

        <% if (urun.price >= 40000) { %>
            <li>  <%= urun.name %> - <%= urun.price %> </li>  
        <% } %>   
    
    <%  }); %>
</ul>

 <ul>
     <% urunler.forEach(urun => { %>     

        <% if (urun.price >= 40000  && urun.isActive ) { %>
           <li>  <%= urun.name %> - <%= urun.price %> </li>  
        <% } %>   
        
    <%  }); %>
</ul>


<ul>
    <% urunler.forEach(urun => { %>     

       <% if (urun.price >= 40000  && urun.isActive ) { %>
        <li> 
            <a href="/products/<%= urun.id %>">
             <%= urun.name %> - <%= urun.price %> 
            </a>
        </li>  
       <% } %>   
       
   <%  }); %>
</ul>

</body>
</html>
*/



//?  404.ejs
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> HATA </h1>
</body>
</html>
*/

//? index.ejs
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Kaynak Bulunamadı </h1>
</body>
</html>
*/


//?  products-details.ejs
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> Urun Detay</h1>
</body>
</html>
*/