const gameCon = document.querySelector('.memory-game-con');

let stopClicking = false;

const successAudio = document.getElementById('success');

const failAudio = document.getElementById('fail');

const winAudio = document.getElementById('win');

const flipAudio = document.getElementById('flip');

const levelBtn = document.querySelector('button.level')

let easy = true;


const images=['images/one.png','images/two.png','images/three.png',
'images/four.png','images/fife.png','images/six.png',
'images/seven.png','images/eight.png','images/nine.png'
,'images/ten.png','images/eleven.png','images/twelve.png'
]


function createElements(array){

    let blocksLength = easy? 6 : 12

    gameCon.innerHTML = '';

    array.slice(0, blocksLength).forEach((el,i)=>{
        gameCon.innerHTML+=`
            <div class='block-con' data-block='${i}'>
                <div class='face front'>
                </div>
                <div class='face back'>
                <img src='${el}' >  
                </div>
            </div>
            <div class='block-con' data-block='${i}'>
                <div class='face front'>
                </div>
                <div class='face back'>
                <img src='${el}'>  
                </div>
            </div>
        `
    })

}

createElements(images);//creates elements of images

/* after creating the elements make thes variables */
let arrayblocks = [...document.querySelectorAll('.block-con')];

let orderRange = [...Array(arrayblocks.length).keys()];

for(let el of arrayblocks){

    el.addEventListener('click',function(){

        successAudio.pause()
        successAudio.currentTime= 0

        flipAudio.pause()
        flipAudio.currentTime= 0
        flipAudio.play()

        if(!stopClicking && !this.classList.contains('matched')){
            
            this.classList.add('is-flipped');
            checkBlocks()
            
        }

    })

}

function reFillBlocksArray(){

    arrayblocks = [...document.querySelectorAll('.block-con')];

    orderRange = [...Array(arrayblocks.length).keys()];

    for(let el of arrayblocks){

        el.addEventListener('click',function(){

            successAudio.pause()
            successAudio.currentTime= 0

            flipAudio.pause()
            flipAudio.currentTime= 0
            flipAudio.play()

            if(!stopClicking && !this.classList.contains('matched')){
                
                this.classList.add('is-flipped');
                checkBlocks()
                
            }

        })

    }
}

levelBtn.addEventListener('click', ()=>{
    changeLevel()
})

function checkBlocks(){

    const flippedBlocks = arrayblocks.filter( el => el.classList.contains('is-flipped') )//collect flipped boxes its max length is 2

    if(flippedBlocks.length == 2){

        stopClicking = true;

        const firstBlockNum = flippedBlocks[0].dataset.block ;
        const secondBlockNum = flippedBlocks[1].dataset.block ;

        if( firstBlockNum === secondBlockNum ){

            successAudio.play()
            flippedBlocks.forEach( el => el.classList.add('matched') )

        }else{
            failAudio.play()
        }

        setTimeout(()=>{

            flippedBlocks.forEach( el => el.classList.remove('is-flipped') )
            flippedBlocks.forEach( (el, index) => flippedBlocks.splice(index, 1) )

            stopClicking=false;

        },800)  
    }

    const matchedBlocks = arrayblocks.filter(el => el.classList.contains('matched')).length/2;

    document.querySelector('.tries span').innerHTML = matchedBlocks;

    if( arrayblocks.every(el => el.classList.contains('matched')) ) winAudio.play()
}

function shuffledArray(array){

    let temp;
    let current=array.length;

    for(i=0; i< array.length; i++){

        let ran = Math.floor( Math.random()*current );

        current-- ;

        temp = array[current];

        array[current] = array[ran];

        array[ran] = temp;

    }

    arrayblocks.forEach((el, i)=>{

        el.style.order = array[i];

    })

}

shuffledArray(orderRange);


(async () => {

    const { value: theName } = await Swal.fire({
        title: 'Input Name Text',
        input: 'text',
        inputLabel: 'Your Name',
        inputPlaceholder: 'Enter Your Name Here'
    })
    
    if (theName) {
        Swal.fire(`Entered Name: ${theName}`)
        document.querySelector('.name span').innerHTML = theName
    }

})()

async function changeLevel(){

    const { value: option } = await Swal.fire({
        title: 'Select Deficulty',
        input: 'select',
        inputOptions: {
          'Dificulty': {
            "easy": 'Eesy',
            "hard": 'hard',
          }
        },
        inputPlaceholder: 'Select Deficulty',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value.trim().length) {
              resolve()
            } else {
              resolve('You need to select an option :)')
            }
          })
        }
      })
      
      if (option) {

        option == 'easy'? easy = true: easy = false;

        levelBtn.innerHTML = option + '?!';

        console.log(easy)

        Swal.fire(`You selected: ${option}`)

        createElements(images);//creates elements of images
        reFillBlocksArray()
        shuffledArray(orderRange)
      }
}