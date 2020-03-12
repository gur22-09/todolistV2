const express = require('express');
const app = express();
const body = require('body-parser');
const mongoose = require('mongoose');
const  _ =require('lodash');

mongoose.connect('mongodb+srv://admin-gurprit:dickHEAD1@cluster0-8dsjj.mongodb.net/todolistsDB',{useNewUrlParser: true});

//mongoose
const listSchema = new mongoose.Schema({
    name:String
});

const itemSchema = new mongoose.Schema({
    name:String,
    item:[listSchema]
});



const List = mongoose.model('List',listSchema);
const Item = mongoose.model('Item',itemSchema);

const item1 = new List({
    name:`Welcome to your todoList !`
});

const item2= new List({
    name:`Hit + button to add a new item`
});

const item3 = new List({

    name:`<---- press here to remove list`
});

const defaultItems = [item1,item2,item3];

//List.insertMany([item1,item2,item3],(err)=> {err ?console.log(err):console.log(`successly added items`);

//});




app.use(body.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    

    List.find((err,items)=>{

        if(items.length ===0){
            List.insertMany(defaultItems,(err)=> {err ?console.log(err):console.log(`successly added items`)});

            res.redirect('/');

         
        }else{
           

        res.render(`lists`, {listTitle: 'Today',newItem: items});

        }

        
        
        
    });
    
    





});

app.get('/:category',function(req,res){
    const category = _.capitalize(req.params.category);


    


    Item.findOne({name:category},function(err,result){

        if(!err){
            if(result){
                
                res.render('lists',{listTitle: result.name,newItem: result.item});
                
            }else{
                
                const item = new Item({name:category,item:defaultItems});
                item.save();
                res.redirect('/'+category);
            }
        }
        
        
        
        
        
        
    });
    
});






app.post('/', function (req, res) {

   const newItem = req.body.addItem;
   const listName = req.body.button;


   const addItem = new List({name:newItem});



   if(listName === 'Today'){

   
    
    addItem.save();
 
    res.redirect('/');
 

   }else{
       Item.findOne({name:listName},function(err,result){
         
        result.item.push(addItem);
        result.save();
        res.redirect('/'+listName);

       });
   }
   
  

});


app.post('/delete',function(req,res){

    const  checkedItemId = req.body.checkbox;
    const listTitle = req.body.listName;
    console.log(listTitle);
    

    if(listTitle === 'Today'){

        List.findByIdAndRemove(checkedItemId,(err)=>{
        
            err?console.log(err):console.log('item successfully deleted');
            
            
            res.redirect('/');
    
    
    
        });

    }else{
        Item.findOneAndUpdate({name: listTitle},{$pull:{item:{_id:checkedItemId}}},function(err,result){
           
            if(!err){
                res.redirect('/' + listTitle);
            }
        });
    }

   
    
    

});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}





app.listen(port, function () {

    console.log(`server has started`);

});