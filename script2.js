var board = []
board.push(["-","-","-"])
board.push(["-","-","-"])
board.push(["-","-","-"])
var player="X"
$(".turnlabel").text("Player's (X's) Turn")
var win=false
var tie=false
function place_player(player, row, col){
    if(board[row][col]=="-"){
        board[row][col]=player
        $("#s"+String(row*3+col+1)).text(player)
        $("#s"+String(row*3+col+1)).css("opacity","1")
        $("#s"+String(row*3+col+1)).animate({fontSize:"180px",width:"+=20px",height:"+=20px"},200)
        $("#s"+String(row*3+col+1)).animate({fontSize:"160px",width:"-=20px",height:"-=20px"},200)
        return true
    }else{
        return false
    }
}
function check_col_win(player){
    for(var a=0;a<3;a++){
        if(board[0][a]==board[1][a] && board[1][a]==board[2][a] && board[2][a]==player){
            return true
        }
    }
    return false
}
function check_row_win(player){
    for(var a=0;a<3;a++){
        if(board[a][0]==board[a][1] && board[a][1]==board[a][2] && board[a][2]==player){
            return true
        }
    }
    return false
}
function check_diag_win(player){
    if(board[0][0]==board[1][1] && board[1][1]==board[2][2] && board[2][2]==player){
        return true
    }
    else if(board[2][0]==board[1][1] && board[1][1]==board[0][2] && board[0][2]==player){
        return true
    }
    else{
        return false
    }
}
function check_win(player){
    if(check_row_win(player) || check_col_win(player) || check_diag_win(player)){
        return true
    }
    else{
        return false
    }
}
        
function check_tie(){
    tie=true
    for(var a=0;a<3;a++){
        for(var b=0;b<3;b++){
            if(board[a][b]!="-"){
                tie=true
            }
            else{
                tie=false
                break
            }
        }
        if(!tie){
            break
        }
    }
    return tie
}

function minimax(player,depth){
    if(check_win("O")){
        return [10,null,null]
    }else if(check_win("X")){
        return [-10,null,null]
    }else if(check_tie() || depth==0){
        return [0,null,null]
    }
    if(player=="O"){
        var best = -10000
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]=="-"){
                    board[row][col]="O"
                    value=minimax("X",depth-1)
                    if(best<value[0]){
                        best=value[0]
                        var optimalRow=row
                        var optimalCol=col
                    }
                    board[row][col]="-"
                }
            }
        }
        return [best,optimalRow,optimalCol]
    }
    if(player=="X"){
        var worst = 10000
        for(let row=0;row<3;row++){
            for(let col=0;col<3;col++){
                if(board[row][col]=="-"){
                    board[row][col]="X"
                    value=minimax("O",depth-1)
                    if(worst>value[0]){
                        worst=value[0]
                        var optimalRow=row
                        var optimalCol=col
                    }
                    board[row][col]="-"
                }
            }
        }
        return [worst,optimalRow,optimalCol]
    }
}
function check_status(player){
    if(check_win(player)){
        win=true
        game_end(player)
    }else if(check_tie()){
        tie=true
        game_end(null)
    }
}
function game_end(player){
    if(tie && !win){
        $(".popcontent").css("backgroundColor","rgb(65,190,245)").css("borderColor","rgb(65,190,245)")
        $(".reset").css("backgroundColor","rgb(65,190,245)").css("borderColor","rgb(65,190,245)")
        $(".bvtrigger").css("backgroundColor","rgb(65,190,245)").css("borderColor","rgb(65,190,245)")
        $(".popshadow").css("backgroundColor","rgba(65,190,245,0.3)").css("borderColor","rgba(65,190,245,0.3)")
        $(".popheader").text("It's a Tie!")
    }else if(player=="O"){
        $(".popcontent").css("backgroundColor","rgb(220,30,20)").css("borderColor","rgb(220,30,20)")
        $(".reset").css("backgroundColor","rgb(220,30,20)").css("borderColor","rgb(220,30,20)")
        $(".bvtrigger").css("backgroundColor","rgb(220,30,20)").css("borderColor","rgb(220,30,20)")
        $(".popshadow").css("backgroundColor","rgba(220,30,20,0.3)").css("borderColor","rgba(220,30,20,0.3)")
        $(".popheader").text("The A.I. Wins!")
    }else if(player=="X"){
        $(".popcontent").css("backgroundColor","rgb(0,220,35)").css("borderColor","rgb(0,220,35)")
        $(".reset").css("backgroundColor","rgb(0,220,35)").css("borderColor","rgb(0,220,35)")
        $(".bvtrigger").css("backgroundColor","rgb(0,220,35)").css("borderColor","rgb(0,220,35)")
        $(".popshadow").css("backgroundColor","rgba(0,220,35,0.3)").css("borderColor","rgba(0,220,35,0.3)")
        $(".popheader").text("Player Wins!")
    }
    $(".blur-bg").fadeIn()
}
$(".reset").click(function(){
    board = []
    board.push(["-","-","-"])
    board.push(["-","-","-"])
    board.push(["-","-","-"])
    win=false
    tie=false
    $("td").text("-")
    $(".blur-bg").slideUp()
})
$(".bvtrigger").click(function(){
    $(".blur-bg").slideUp()
    $(".viewlabel").fadeIn()
    $(".viewlabel").click(function(){
        $(".blur-bg").slideDown()
        $(".viewlabel").fadeOut()
    })

})
$("td").click(function take_turn(){
    if(!win && !tie){
        if(player=="X"){
            move=place_player(player,$(this).attr("row")-1,$(this).attr("col")-1)
            if(!move){
                return
            }
            check_status(player)
            if(!win && !tie){
                $(".turnlabel").animate({fontSize:"60px"},200)
                player="O"
                $(".turnlabel").text("A.I.'s (O's) Turn")
                $(".turnlabel").animate({fontSize:"50px"},200)
                var bd=minimax("O",6)
                setTimeout(function(){
                    place_player(player,bd[1],bd[2])
                    check_status(player)
                    $(".turnlabel").animate({fontSize:"50px"},200)
                    player="X"
                    $(".turnlabel").text("Player's (X's) Turn")
                    $(".turnlabel").animate({fontSize:"40px"},200)
                },500)
            }
        }
    }
})
$("td").hover(function(){
    if($(this).text()=="-" && !win){
        $(this).text(player)
        $(this).css("opacity","0.5")
    }
},function(){
    if($(this).css("opacity")=="0.5" && !win){
        $(this).text("-")
        $(this).css("opacity","1")
    }
})