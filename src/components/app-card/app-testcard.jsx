"use client";
import { get, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";

const TestModel = ({ isOpen, onClose, title, questionType }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    testId: 0,
    additionMark: 0,
    subtractionMark: 0,
    multiplicationMark: 0,
    divisionMark: 0,
  });

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setInputAnswer("");
    setShowResults(false);
    fetchQuestions();
  }, [questionType]);

  const fetchQuestions = async () => {
    try {
      const response = await get(
        `${API.getAllTest}?questionType=${questionType}`
      );
      if (response.code === 200 && response.data) {
        const testData = response.data[0];
        setQuestions(testData[questionType] || []);
        setFormData((prev) => ({ ...prev, testId: testData.id }));
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  if (!isOpen) return null;

  const filteredQuestions = questions;
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleNext = () => {
    const answer = parseInt(inputAnswer);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      question: currentQuestion.question,
      userAnswer: answer,
    };
    setUserAnswers(updatedAnswers);
    localStorage.setItem(questionType, JSON.stringify(updatedAnswers));
    setInputAnswer("");

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      submitTestResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer =
        userAnswers[currentQuestionIndex - 1]?.userAnswer || "";
      setInputAnswer(previousAnswer.toString());
    }
  };

  const renderResults = () => {
    const correctAnswersCount = userAnswers.filter(
      (ans, index) => ans.userAnswer === filteredQuestions[index].answer
    ).length;
    const totalScore = `${correctAnswersCount}/${filteredQuestions.length} (${(
      (correctAnswersCount / filteredQuestions.length) *
      100
    ).toFixed(2)}%)`;

    return (
      <div className="mt-4">
        <h2 className="text-xl font-semibold py-5">
          Total Score: {totalScore}
        </h2>
        <ul>
          {filteredQuestions.map((q, index) => {
            const userAnswer = userAnswers[index]?.userAnswer || null;
            const isCorrect = userAnswer === q.answer;
            const questionText = q.question.join(
              " " + getOperatorSymbol(questionType) + " "
            );
            return (
              <li key={index} className="mt-2">
                <p className="text-3xl font-semibold">
                  Q {index + 1}. {questionText}
                </p>
                <div className="flex justify-between items-center text-xl py-2">
                  <span className="flex-1 text-green-500">
                    <strong>Correct Answer:</strong> {q.answer}
                  </span>
                  <span
                    className={`flex-1 text-lg font-semibold ${
                      isCorrect ? "text-green-500" : "text-red"
                    }`}
                  >
                    <strong>Your Answer:</strong> {userAnswer}
                    {isCorrect ? "(Correct)" : "(Incorrect)"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const getOperatorSymbol = (type) => {
    switch (type) {
      case "addition":
        return "+";
      case "multiplication":
        return "x";
      case "subtraction":
        return "-";
      case "division":
        return "/";
      default:
        return "";
    }
  };

  const submitTestResults = async () => {
    try {

      const token = localStorage.getItem("t");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const decoded = jwt.decode(token);
      console.log(decoded.id); 
    const studentId = decoded.id;

      const correctAnswersCount = userAnswers.filter(
        (ans, index) => ans.userAnswer === filteredQuestions[index].answer
      ).length;

      const questionCount = `${correctAnswersCount}/${filteredQuestions.length}`;

      const updatedFormData = {
        studentId: studentId,
        testId: formData.testId,
        additionMark:
          questionType === "addition" ? questionCount : formData.additionMark,
        subtractionMark:
          questionType === "subtraction"
            ? questionCount
            : formData.subtractionMark,
        multiplicationMark:
          questionType === "multiplication"
            ? questionCount
            : formData.multiplicationMark,
        divisionMark:
          questionType === "division" ? questionCount : formData.divisionMark,
      };

      const response = await post(API.getReport, updatedFormData, token);
      if (response.code === 200) {
        console.log("Test results submitted successfully:", response.data);
      } else {
        console.error("Error submitting test results:", response.message);
      }
    } catch (error) {
      console.error("Error submitting test results:", error);
    }
  };

  return (
    <div className="fixed z-9999 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-strokedark p-4 rounded shadow-lg max-w-screen-md max-h-[90vh] overflow-auto w-full relative">
        <button
          className="absolute top-2 right-2 rounded-full"
          onClick={onClose}
        >
          <i className="las la-times"></i>
        </button>
        <div className="w-full">
          <div className="block mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </div>
          {showResults ? (
            renderResults()
          ) : (
            <>
              {currentQuestion && (
                <div className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded w-full">
                  <div>
                    {currentQuestion.question.map((num, index) => (
                      <p key={index} className="text-center text-4xl">
                        {index > 0 && getOperatorSymbol(questionType)} {num}
                      </p>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded"
                    placeholder="Your answer"
                  />
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 bg-gray-500 text-white rounded"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="p-2 bg-blue-500 text-white rounded"
                  onClick={handleNext}
                  disabled={!inputAnswer}
                >
                  {currentQuestionIndex === filteredQuestions.length - 1
                    ? "Submit"
                    : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestModel;
