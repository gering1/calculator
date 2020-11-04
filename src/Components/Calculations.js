import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import { Menu } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
   container: {
       display: "flex",
       justifyContent: "center",
       marginTop: "10px",
       overflowY: "hidden",
       height: "280px",
       width: "40%",
       margin: "auto"
   }
}))
export default function Calculations(props) {
    const classes = useStyles()
    return (
        <div>
             <Paper className = {classes.container}>
            <MenuList className = {classes.calculations_list}>
            {
                
            props.calculations.map(calculation => (
            [
                
               <MenuItem>{calculation}</MenuItem>
              
            ]

    ))
            }
            </MenuList>
            </Paper>
        </div>
    )
}


