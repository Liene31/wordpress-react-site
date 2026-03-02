import { useState, useEffect } from "react";
import { decode } from "html-entities";
import axios from "axios";
import { nanoid } from "nanoid";
import { clsx } from "clsx";

function App() {
  const [questionsObject, setQuestionsObject] = useState([]);
  const [clickedAnswer, setClickedAnswer] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newGame, setNewGame] = useState(false);

  // fetch questions from Trivia API
  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=5&category=10&type=multiple`)
      .then((res) => {
        const results = res.data.results;

        const questions = results.map((question) => {
          const quizQuestion = decode(question.question);
          const wrongAnswers = question.incorrect_answers;
          const correctAnswer = question.correct_answer;
          const shuffledAnswers = shuffle([...wrongAnswers, correctAnswer]);
          const questions = {
            id: nanoid(),
            correctAnswer,
            quizQuestion,
            shuffledAnswers,
          };
          return questions;
        });

        setQuestionsObject(questions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [newGame]);

  //Function to shuffle Array
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function handleAnswers(id, userAnswer) {
    setClickedAnswer((prev) => {
      const answers = {
        ...prev,
        [id]: userAnswer,
      };

      return answers;
    });
  }

  function handleSubmit() {
    setIsSubmitted((prev) => !prev);
  }

  function newGameBtn() {
    setNewGame((prev) => !prev);
    setClickedAnswer({});
    setIsSubmitted(false);
  }

  return (
    <div className="container">
      <div className="quiz-card">
        <header>
          <h1>Books' Quiz</h1>
          <h2>Are you a bookworm ?</h2>
        </header>

        <main>
          <div className="questions-wrapper">
            {questionsObject.map((questions, index) => {
              return (
                <div key={index} className="question">
                  <h3>{questions.quizQuestion}</h3>

                  {
                    <div className="answers">
                      {questions.shuffledAnswers.map((answer, index) => {
                        const isSelected =
                          clickedAnswer[questions.id] === answer;
                        const isCorrect =
                          clickedAnswer[questions.id] ===
                          questions.correctAnswer;
                        const isWrong =
                          clickedAnswer[questions.id] !==
                          questions.correctAnswer;

                        const className = clsx({
                          correct: isSelected && isSubmitted && isCorrect,
                          wrong: isSelected && isSubmitted && isWrong,
                          selected: isSelected,
                        });

                        return (
                          <button
                            className={className}
                            key={index}
                            onClick={() => handleAnswers(questions.id, answer)}
                          >
                            {decode(answer)}
                          </button>
                        );
                      })}
                    </div>
                  }
                </div>
              );
            })}
          </div>
          {isSubmitted ? (
            <button onClick={newGameBtn} className="btn">
              New Game
            </button>
          ) : (
            <button
              disabled={Object.keys(clickedAnswer).length !== 5}
              onClick={handleSubmit}
              className="btn"
            >
              Submit
            </button>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
