import React, {useState} from 'react';

import { createStage } from '../gameHelpers';
//styled components

import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetris';


//custom hooks 
import {usePlayer} from '../hooks/usePlayer.js'
import {useStage} from '../hooks/useStage'
import { useInterval } from '../hooks/useInterval';
//components
import Stage from './Stage'
import Display from './Display';
import StartButton from './StartButton';
import { checkCollision } from '../gameHelpers';

    const Tetris =() => {

           
        const [dropTime, setDropTime] = useState(null)
        const [gameOver, setGameOver] = useState(false);

        const[player, updatePlayerPos, resetPlayer, playerRotate]= usePlayer();
        const[stage, setStage]= useStage(player, resetPlayer);

        const movePlayer = dir =>{ //move left to right
            
            if(!checkCollision(player, stage, {x:dir, y:0})){
            updatePlayerPos({x:dir, y:0}) 
            }
        }
        const startGame = () => {
                // reset everything
            
                setStage(createStage());
                setDropTime(1000)
                resetPlayer();
                setGameOver(false)
                
        }
        const drop =() =>{
            if(!checkCollision(player, stage,{x:0, y:1})){
                console.log('hi')
                    
                updatePlayerPos({x: 0, y:1, collided:false})
            } else{
                if(player.pos.y < 1){
                    console.log('GAMEOVER')
                    setGameOver(true);
                    setDropTime(null);
                }
                updatePlayerPos({x:0, y:0, collided:true})

            }
        }

        const keyUp =({keyCode}) =>{
            if(!gameOver) {
                if(keyCode ===40){
                    console.log('Interval On')
                    setDropTime(1000)
                }
            }
        }

        const dropPlayer = () => {
            console.log("interval OFF")
            setDropTime(null);
            drop();

            
        }
        const move = ({keyCode}) =>{
            if (!gameOver){
                if (keyCode === 37){ //left key pressed 
                    movePlayer(-1)
                } else if (keyCode === 39){ // right key pressed
                    movePlayer(1)

                } else if( keyCode === 40) {  //move down
                    dropPlayer()
                } else if (keyCode===38) { // up arrow
                    playerRotate(stage, 1)
                }
            }
            

        }

        useInterval(() => {
            drop();
        }, dropTime)
        return (
            <StyledTetrisWrapper role="button" tabIndex="0" onKeyUp={keyUp} onKeyDown={e => move(e)}>
                <StyledTetris>
                    <Stage stage={stage}/>
                <aside>
                    {gameOver ? 
                    (<Display gameOver={gameOver} text ="Game Over"/>)
                        : (<div>
                        <Display text="Score"/>
                        <Display text="Rows"/>
                        <Display text="Level"/>
                    </div>) }
                
                <StartButton callBack={startGame} />
                </aside> 
                </StyledTetris>
            </StyledTetrisWrapper>
        )
        }
    export default Tetris