import React, {useState, useEffect} from 'react'
import { makeStyles} from '@material-ui/core/styles';
import RunningTotal from './RunningTotal';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import io from 'socket.io-client'

import Paper from '@material-ui/core/Paper'
import Calculations from './Calculations'

const useStyles = makeStyles(theme => ({
    root: {
        width: "35%",
        margin: "auto",
        marginTop: "100px",
       padding: "20px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
   
 
    operator_button: {
        backgroundColor: "#ffb74d",
        width: "90%",
    },
    number_button: {
        backgroundColor: "#64b5f6",
        width: "90%",
        borderRadius: "10px"
    },
    inner: {
       
    },
    row_container : {
        
    },
    row: {
       
    },
    operator_container: {
        display:"flex",
        flexdirection: "column"
    }

}))
    

function Number() {
    const classes = useStyles()
    const [storedValue,setStoredValue] = useState(null)
    const [displayValue,setDisplayValue] = useState("0")
    const [calculations, setCalculations] = useState([]) 
    const [isNewNumber, setNewNumber] = useState(true)
    const [currentOperator,setCurrentOperator] = useState(null)
    let calcLayout = [{id:0},{type: "operator",id: "AC"},{type: "operator",id: "*"},{type: "operator",id:"÷"},{id:"1"},{id:"2"},{id:"3"},{type: "operator",id:"+"},{id:"4"},{id:"5"},{id:"6"},{type: "operator",id:"-"},{id:"7"},{id:"8"},{id:"9"},{type: "operator",id:"="}]
    const socket = io('http://127.0.0.1:5000/')
    const setCurrentNum = (num) => {
        //if it is first number clicked, replace the 0 with number, else add to end of num
    
       
            if(isNewNumber || displayValue === "Err") {
                setDisplayValue(num)
                setNewNumber(false)
            }
            else{
                setDisplayValue(displayValue+num)
            }
            
        
    }
    useEffect(() => {
        socket.on('calculation_made', calculation => {
            setCalculations(calculations => [calculation, ...calculations])
            if(calculations.length === 10) {
                calculations.pop()
            }
        })
    },[])

    const calculateNums = (fn,sn,op )=>  {
        switch(op) {
            case '+': 
                return fn + sn
            case '-':
                return fn - sn
            case '*':
                return fn * sn
            case '÷':
                return fn / sn  
            default: //if the operator is "=", just return the second number
                return sn
        } 
    }
    const clearNums = () => {
        setCurrentOperator(null)
        setStoredValue(null)
        setDisplayValue("0")
        setNewNumber(true)
    }

 
    const handleOperator = (op) => {
        //if operator exists, make previous calculation
        console.log(currentOperator)
        
        setStoredValue(parseFloat(displayValue))
        if(currentOperator) {
            let res = calculateNums(storedValue,parseFloat(displayValue),currentOperator)
            setDisplayValue(String(res))
            if(currentOperator !== "=")
            socket.emit('calculation_made',[storedValue,currentOperator,displayValue,"=",res])
        }
        if(calculations.length === 10) {
            calculations.pop()
        }
        
        setNewNumber(true)
        setCurrentOperator(op) 
    }
    return (
        <>
        <Paper className = {classes.root} >
        <div className = {classes.inner}>
           <p>{displayValue}</p>
        </div>
        
        <Grid style = {{display: "flex",justifyContent: "center"}}container spacing={1} >
        {calcLayout.map(item => (
              <Grid item xs ={3} spacing={2} style = {{flexGrow: 1}} >
                  {
                      item.id === "AC" ? <Button className = {classes.operator_button} onClick = {() => clearNums()}>AC</Button> :

                      item.type === "operator"  ? <Button className = {classes.operator_button} onClick  = {() => handleOperator(item.id)}>{item.id}</Button> : <Button className = {classes.number_button}onClick = {() => setCurrentNum(item.id)}>{item.id}</Button> 
                  }
                           
             </Grid>  
            ))}     
        </Grid> 
     </Paper>
     <>
    
     <Calculations calculations = {calculations}></Calculations>
    </> 
    </>

       
    )
}

export default Number

