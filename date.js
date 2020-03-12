
exports.date = function(){

    
let date = new Date();
let today = date.getDay();



let options = {
    weekday: `long`,
    month: `long`,
    day: `numeric`
}
let day = date.toLocaleDateString(`en-US`, options);

return day;

};



