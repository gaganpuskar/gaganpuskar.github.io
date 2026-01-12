// Scrolling back to top
let topButton = document.getElementById("topButton");

window.onscroll = function(){
    scrollToTop()
};
function scrollToTop (){
    if (document.documentElement.scrollTop>1300)
        topButton.style.display = "block";
    
    else
        topButton.style.display = "none";
}

function topFunc (){
    document.documentElement.scrollTop = 0;
}
topButton.addEventListener('click',topFunc);



// Collapse nav bar
// function dropDown(){
//     document.getElementById('myDropDown').classList.toggle('show');
// }


