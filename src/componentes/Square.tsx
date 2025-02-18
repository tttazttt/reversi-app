import styles from "./Board.module.css";
import blackSquare from "./img/black.png";
import whiteSquare from "./img/white.png";

type Props = {
  square: boolean | null;
  onSquareClick: () => void;
  isPossibleToPut: boolean;
};

const Square = ({ square, onSquareClick, isPossibleToPut }: Props) => {
  return (
    <div
      className={`${styles.square} ${
        isPossibleToPut ? styles.possibleToPut : ""
      }`}
      onClick={onSquareClick}
    >
      {square != null && (
        <img
          className={styles.squareItem}
          src={square ? whiteSquare : blackSquare}
          alt={square ? "White piece" : "Black piece"}
        />
      )}
    </div>
  );
};

export default Square;
