const pieces=[];

const board=document.getElementById('board');

const pieceSize=75;

let turn=0,puttableIndexes=getPuttableIndexes(2);

const w=4,h=4;

const vecs=[];

for(const i of [-1,0,1]){
    for(const j of [-1,0,1]){
        if(i||j)
           vecs.push([i,j]);
    }
}

const imgUrls=[
    'space.png',
    'https://3.bp.blogspot.com/-ZWsv1eBwP-8/XDXcFKGXH2I/AAAAAAABRGs/bAVhn3sVs2wkaFSaeTzvwdAD3CuS47ZUACLcBGAs/s800/fantasy_golem.png',
    'https://1.bp.blogspot.com/-DSgUUXrWoFw/XVKfz2Z_3XI/AAAAAAABUEs/a9QCrDh18-grpZCL0O_pD7r4KWC921gawCLcBGAs/s1600/fantasy_game_character_slime.png'
];

const STATE_SPACE=0;
const STATE_WHITE=1;
const STATE_BLACK=2;

const turnImg=document.getElementById('turn-img');

for(let i=0;i<h;i++){
    pieces.push([]);
    for(let j=0;j<w;j++){
        const img=document.createElement('img');
        img.className='piece';
        board.appendChild(img);
        img.style.left=`${j*pieceSize}px`;
        img.style.top=`${i*pieceSize}px`;
        const piece={
            state:NaN,
            img,
            x:j,
            y:i,
            setState:function(state){
                piece.state=state;
                piece.img.setAttribute('src',imgUrls[state]);
            }
        };
        img.onclick=()=>{
            if(piece.state!=0)
                return;
            const state=turn%2+1;
            const reversibleIndexes=getAllReversibleIndexes(piece.x,piece.y,state);
            console.log(reversibleIndexes);
            if(reversibleIndexes.length){
                piece.setState(state);
                for(const index of reversibleIndexes){
                    pieces[index[1]][index[0]].setState(state);
                }
                updateTurn();
                if(isPass()){
                    updateTurn();
                    if(isPass()){
                        gameover();
                    }
                }
            }
        }
        piece.setState(STATE_SPACE);
        pieces[i][j]=piece;
    }
}

updateTurn();


pieces[3][3].setState(1);
pieces[2][2].setState(1);
pieces[2][3].setState(2);
pieces[3][2].setState(2);


function getReversibleIndexes(x,y,dx,dy,state){
    const indexes=[];
    x+=dx;
    y+=dy;
    //敵の色
    while(x>=0&&x<w&&y>=0&&y<h&&pieces[y][x].state!=0&&pieces[y][x].state!=state){
        indexes.push([x,y]);
        x+=dx;
        y+=dy;
    }
    return (x>=0&&x<w&&y>=0&&y<h&&pieces[y][x].state===state)?indexes:[];
}

function getAllReversibleIndexes(x,y,state){
    let reversibleIndexes=[];
    for(const vec of vecs){
        reversibleIndexes=reversibleIndexes.concat(getReversibleIndexes(x,y,...vec,state));
    }
    return reversibleIndexes;
}

function updateTurn(){
    turn++;
    turnImg.setAttribute('src',imgUrls[turn%2+1]);

}

function isPass(){
    const state=turn%2+1;
    for(let i=0;i<h;i++){
        for(let j=0;j<w;j++){
            if(pieces[i][j].state==STATE_SPACE)
                if(getAllReversibleIndexes(j,i,state).length){
                    console.log(state,j,i);
                    return false;
                }
        }
    }
    return true;
}

function gameover(){
    board.innerHTML+=`<p class="message">Game Over!!</p>`;
}

function getPuttableIndexes(state){
    const indexes=[];
    for(let i=0;i<h;i++){
        for(let j=0;j<w;j++){
            if(getAllReversibleIndexes(j,i,state).length){
                indexes.push([j,i]);
            }
        }
    }
    return indexes;
}