import Square from "./Square";
import styles from "./Board.module.css";

type Props = {
  squares: (boolean | null)[][];
  handlePutSquare: (rowIndex: number, colIndex: number) => void;
  canPutArea: boolean[][];
};

const Board = ({ squares, handlePutSquare, canPutArea }: Props) => {
  return (
    <div className={styles.boardOuter}>
      <div className={styles.boardInner}>
        {squares.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.boardRow}>
            {row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                square={square}
                onSquareClick={() => handlePutSquare(rowIndex, colIndex)}
                isPossibleToPut={canPutArea[rowIndex][colIndex]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
