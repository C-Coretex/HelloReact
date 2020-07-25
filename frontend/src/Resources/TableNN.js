import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(trainingSets, iteration, errorSum, sw) {
  return { trainingSets, iteration, errorSum, sw };
}

var rows = [];

class DenseTable extends React.Component {
  
  componentDidUpdate(prevProps)
  {
    if (prevProps.NNstate.trainingSets > this.props.NNstate.trainingSets || (prevProps.NNstate.trainingSets === this.props.NNstate.trainingSets && prevProps.NNstate.iteration > this.props.NNstate.iteration)) {
      rows = []
      return
    }
    rows.push(createData(this.props.NNstate.trainingSets, this.props.NNstate.iteration, this.props.NNstate.errorSum, this.props.NNstate.sw))
  }
  
  render() {
    return (
      <TableContainer component={Paper}>
        <Table className={() => useStyles()} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Training&nbsp;sets</TableCell>
              <TableCell align="right">Iterations</TableCell>
              <TableCell align="right">Error&nbsp;summ</TableCell>
              <TableCell align="right">Training&nbsp;time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sw}>
                <TableCell align="right">{row.trainingSets}</TableCell>
                <TableCell align="right">{row.iteration}</TableCell>
                <TableCell align="right">{row.errorSum}</TableCell>
                <TableCell align="right">{row.sw}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default DenseTable