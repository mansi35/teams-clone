import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Sketch from 'react-p5';
import io from "socket.io-client";
import DeleteIcon from '@material-ui/icons/Delete';
import './Blackboard.scss';
import { IconButton } from '@material-ui/core';

const Blackboard = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [weight, setWeight] = useState(3);
    const [color, setColor] = useState('#ffffff');
    const [p5, setP5] = useState();
    const socketRef = useRef();
    const { roomId } = useParams();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const setup = (p5, canvasParentRef) => {
        setP5(p5);
        // eslint-disable-next-line
        const canvas = p5.createCanvas(1920, 1080).parent(canvasParentRef);
        p5.background("rgb(31, 31, 31)");

        socketRef.current = io.connect("http://localhost:5000");
        socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name });

        socketRef.current.on('mouse', (data) => {
            p5.stroke(data.color);
            p5.strokeWeight(data.weight);
            p5.line(data.x, data.y, data.px, data.py);
        });
        socketRef.current.on('erase', () => {
            p5.background("rgb(31, 31, 31)");
        });
    }

    const changeToRed = () => {
        setColor('#f44336');
        setWeight(3);
    }
    
    const changeToBlue = () => {
        setColor('#008cba');
        setWeight(3);
    }
    
    const changeToWhite = () => {
        setColor('#ffffff');
        setWeight(3);
    }
    
    const erase = () => {
        setColor('#1f1f1f');
        setWeight(30);
    }

    const mouseDragged = (p5) => {
        const data = {
            x: p5.mouseX,
            y: p5.mouseY,
            px: p5.pmouseX,
            py: p5.pmouseY,
            color: color,
            weight: weight
        }
        socketRef.current.emit('mouse', data);
        p5.stroke(color);
        p5.strokeWeight(weight);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    }

    const resetSketch = (p5) => {
        p5.background("rgb(31, 31, 31)");
        socketRef.current.emit('erase');
    }

    return (
        <div className="blackboard__canvas">
            <h2>Collaborative Board</h2>
            <Sketch setup={setup} mouseDragged={mouseDragged} resetSketch={resetSketch} className="blackboard__canvas" />
            <div className="options">
                <button className="colorbutton" onClick={() => {changeToWhite()}} style={{ backgroundColor: "#ffffff" }}></button>
                <button className="colorbutton" onClick={() => {changeToBlue()}} style={{ backgroundColor: "#008cba" }}></button>
                <button className="colorbutton" onClick={() => {changeToRed()}} style={{ backgroundColor: "#f44336" }}></button>
                <div className="stroke">
                    <label for="weight">Stroke:</label>
                    <input type="number" id="weight" min="2" max="200" value={weight} onChange={(e) => {setWeight(e.target.value)}} />
                </div>
                <div onClick={() => {erase()}}>
                    <img src="https://img.icons8.com/android/24/ffffff/eraser.png" alt="erase" />
                </div>
                <IconButton onClick={() => {resetSketch(p5)}}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Blackboard
