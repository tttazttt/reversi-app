import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Board from "./componentes/Board";

function App() {
  const WHITE = true;
  const BLACK = false;
  // 6x6の二次元配列
  const [squares, setSquares] = useState<(boolean | null)[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(6).fill(null))
  );
  // 先攻が白、後攻が黒で固定。trueの場合白のターン
  const [isNextFirst, setIsNextFirst] = useState(true);
  const [canPutArea, setCanPutArea] = useState<boolean[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(6).fill(false))
  );
  const [finishFrag, setFinishFrag] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    initBoard();
  }, []);

  useEffect(() => {
    if (squares.some((row) => row.some((cell) => cell !== null))) {
      judgeCanPut(isNextFirst);
    }
  }, [isNextFirst, squares]);

  useEffect(() => {
    if (finishFrag) {
      return;
    }
    // 盤面が埋まっているか、片方の色が埋まったかを確認
    const isBoardFull = squares.every((r) =>
      r.every((square) => square !== null)
    );
    const isOneColorFull =
      squares.every((r) => r.every((square) => square === WHITE)) ||
      squares.every((r) => r.every((square) => square === BLACK));

    if (isBoardFull || isOneColorFull) {
      setFinishFrag(true); // ゲーム終了
    }
  }, [squares]); // squaresが更新されたらこのuseEffectが動く

  // 置ける場所がない場合の処理
  useEffect(() => {
    if (finishFrag) {
      return;
    }

    const whiteCanPut = canPutArea.some((row) =>
      row.some((cell) => cell === WHITE)
    );
    const blackCanPut = canPutArea.some((row) =>
      row.some((cell) => cell === BLACK)
    );

    // 両方の色が置けない場合、ゲーム終了
    if (!whiteCanPut && !blackCanPut) {
      setFinishFrag(true); // ゲーム終了
    }
    if (!whiteCanPut || !blackCanPut) {
      setIsNextFirst((prev) => !prev); // 次のターンへ
    }
  }, [canPutArea, finishFrag]);

  const initBoard = () => {
    const newArray = Array(6)
      .fill(null)
      .map(() => Array(6).fill(null));
    // 初期のコマ配置
    newArray[2][2] = WHITE;
    newArray[2][3] = BLACK;
    newArray[3][2] = BLACK;
    newArray[3][3] = WHITE;
    setSquares(newArray);
  };

  const handlePutSquare = (rowIndex: number, colIndex: number) => {
    if (finishFrag) {
      // ゲーム終了時には操作を受け付けない
      return;
    }
    if (squares[rowIndex][colIndex] != null) {
      // 駒が既に存在したらリターン
      return;
    }
    if (!canPutArea[rowIndex][colIndex]) {
      // もし置けない場所なら、何もしない
      return;
    }
    const newArray = squares.map((r, i) =>
      i === rowIndex
        ? r.map((square, j) =>
            j === colIndex ? (isNextFirst ? WHITE : BLACK) : square
          )
        : r
    );
    const flipped = flipPieces(newArray, rowIndex, colIndex, isNextFirst);

    if (flipped) {
      // 駒をひっくり返した後、盤面を更新
      setSquares(newArray);

      const isBoardFull = newArray.every((r) =>
        r.every((square) => square !== null)
      );
      const isOneColorFull =
        newArray.every((r) => r.every((square) => square === WHITE || null)) ||
        newArray.every((r) => r.every((square) => square === BLACK || null));

      if (isBoardFull || isOneColorFull) {
        setFinishFrag(true); // ゲーム終了フラグを立てる
      } else {
        // 次のターンへ
        setIsNextFirst((prev) => !prev);
      }
    }
  };

  const judgeCanPut = (isNowTurn: boolean) => {
    const directions = [
      [-1, 0], //上
      [1, 0], //下
      [0, -1], //左
      [0, 1], //右
      [-1, -1], //左上
      [1, 1], //右下
      [-1, 1], //右上
      [1, -1], //左した
    ];

    const newCanPutArea = Array(6)
      .fill(null)
      .map(() => Array(6).fill(false));

    // let canPlayerPut = false;

    //同じ色の駒の位置を探す
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (squares[row][col] === isNowTurn) {
          directions.forEach(([dr, dc]) => {
            let r = row + dr;
            let c = col + dc;
            let foundOpponent = false;

            if (
              r >= 0 &&
              r < 6 &&
              c >= 0 &&
              c < 6 &&
              squares[r][c] === !isNowTurn
            ) {
              foundOpponent = true;
              while (
                r >= 0 &&
                r < 6 &&
                c >= 0 &&
                c < 6 &&
                squares[r][c] === !isNowTurn
              ) {
                r += dr;
                c += dc;
              }
              if (
                r >= 0 &&
                r < 6 &&
                c >= 0 &&
                c < 6 &&
                squares[r][c] === null &&
                foundOpponent
              ) {
                newCanPutArea[r][c] = true;
                // canPlayerPut = true;
              }
            }
          });
        }
      }
    }
    setCanPutArea(newCanPutArea);
    // if (!canPlayerPut && !finishFrag) {
    //   setIsNextFirst((prev) => !prev); // 置けない場合はターンをスキップ
    // }
  };

  const flipPieces = (
    newArray: (boolean | null)[][],
    rowIndex: number,
    colIndex: number,
    isNowTurn: boolean
  ): boolean => {
    const directions = [
      [-1, 0], //上
      [1, 0], //下
      [0, -1], //左
      [0, 1], //右
      [-1, -1], //左上
      [1, 1], //右下
      [-1, 1], //右上
      [1, -1], //左下
    ];

    let flipped = false;

    directions.forEach(([dr, dc]) => {
      let r = rowIndex + dr;
      let c = colIndex + dc;
      let foundOpponent = false;

      // 相手の駒があるか確認
      while (
        r >= 0 &&
        r < 6 &&
        c >= 0 &&
        c < 6 &&
        newArray[r][c] === !isNowTurn
      ) {
        foundOpponent = true;
        r += dr;
        c += dc;
      }

      // ひっくり返すためには、自分の駒が最後に来ないといけない
      if (
        r >= 0 &&
        r < 6 &&
        c >= 0 &&
        c < 6 &&
        newArray[r][c] === isNowTurn &&
        foundOpponent
      ) {
        // 対象の駒をひっくり返す
        while (r !== rowIndex || c !== colIndex) {
          r -= dr;
          c -= dc;
          newArray[r][c] = isNowTurn;
        }
        flipped = true;
      }
    });

    return flipped;
  };

  const countPieces = () => {
    let whiteCount = 0;
    let blackCount = 0;

    squares.forEach((row) => {
      row.forEach((square) => {
        if (square === WHITE) whiteCount++;
        if (square === BLACK) blackCount++;
      });
    });

    if (whiteCount > blackCount) {
      setResultMessage(`白の勝利! 白: ${whiteCount}枚、黒: ${blackCount}枚`);
    } else if (blackCount > whiteCount) {
      setResultMessage(`黒の勝利! 白: ${whiteCount}枚、黒: ${blackCount}枚`);
    } else {
      setResultMessage(`引き分け! 白: ${whiteCount}枚、黒: ${blackCount}枚`);
    }
  };

  useEffect(() => {
    if (finishFrag) {
      countPieces();
    }
  }, [finishFrag]);

  return (
    <div className={styles.container}>
      <p className={styles.nowTurn}>{isNextFirst ? "白" : "黒"}のターン!!</p>
      {finishFrag && <p className={styles.result}>{resultMessage}</p>}
      <Board
        squares={squares}
        handlePutSquare={handlePutSquare}
        canPutArea={canPutArea}
      />
    </div>
  );
}

export default App;
