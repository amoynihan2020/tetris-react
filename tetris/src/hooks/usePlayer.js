import {useState, useCallback} from 'react';
import { checkCollision, STAGE_WIDTH } from '../gameHelpers';
import { randomTetromino, TETROMINOS } from '../tetrominos';
export const usePlayer = () =>{
    const [player, setPlayer] = useState({
        pos: {x:0 ,y:0},
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });
    const rotate =(matrix, dir) =>{
         console.log(matrix)
        //basically make rows become columns, i think the scientific term is "transpose"
        const rotatedTetro = matrix.map((_, index)=>
            matrix.map(col => col[index]),
        );

        //reverse each row to get rotated matric(tetromino)

        if(dir > 0) return rotatedTetro.map(row=> row.reverse());

        return rotatedTetro.reverse();

    }
    const playerRotate = (stage, dir)=>{

        const playerCopy = JSON.parse(JSON.stringify(player));
        playerCopy.tetromino = rotate(playerCopy.tetromino, dir);


        const pos = playerCopy.pos.x;
        let offset = 1;
        while(checkCollision(playerCopy, stage,{x:0, y:0})){
            playerCopy.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1: -1)); //reverses/ checks to see if it would collide(idk got from tutorial)
            if(offset > playerCopy.tetromino[0].length){
                rotate(playerCopy.tetromino, -dir)
                playerCopy.pos.x = pos;
                return;

            }

        }

        setPlayer(playerCopy);


    }
    const updatePlayerPos = ({ x, y, collided }) => {
        console.log(player)
        setPlayer(prev => ({
          ...prev,
          pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
          collided,
        }));
      }; 

    const resetPlayer =useCallback(()=>{
          setPlayer ({
            pos: {x:STAGE_WIDTH / 2 - 2, y:0},  //sets tetromino to middle(ish) of stage
            tetromino:randomTetromino().shape,
            collided: false 
          })
    }, [])
  
    
    return [player, updatePlayerPos, resetPlayer, playerRotate]
   

}