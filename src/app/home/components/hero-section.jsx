"use client";
import { useEffect, useState } from "react";
import TestModel from "./test-model";
import ImageUploadModel from "./image-upload";
import { get } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import jwt from "jsonwebtoken";
import StudentLesson from "./lesson-section";
import StudentNotice from "./notice-section";
import StudentRating from "./student-rating";
import PracticeCard from "./test-card";

export default function HeroSection() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [cardCounts, setCardCounts] = useState({
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
  });

  const openModal = (cardType) => {
    setSelectedCard(cardType);
    setIsModalOpen(true);
  };

  const openImageUploadModal = () => {
    setIsImageUploadOpen(true);
  };

  const fetchCardCounts = async () => {
    try {
      const response = await get(API.getAllTest);
      if (response.code === 200 && response.data?.length > 0) {
        const token = localStorage.getItem("t");
        const decoded = jwt.decode(token);
        const studentLevel = decoded?.level;

        const activeTests = response.data.filter(
          (test) => test.status === true && test.level === studentLevel
        );
        if (activeTests.length > 0) {
          const testData = activeTests[0];
          setCardCounts({
            addition: testData?.addition?.length || 0,
            subtraction: testData?.subtraction?.length || 0,
            multiplication: testData?.multiplication?.length || 0,
            division: testData?.division?.length || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching card counts:", error);
    }
  };

  useEffect(() => {
    fetchCardCounts();
  }, []);

  return (
    <>
      <StudentNotice />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-5">
        <StudentLesson />
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
        <PracticeCard
          title="Addition"
          iconSrc="/assets/logo/addition3d.png"
          totalCount={cardCounts.addition}
          onClick={openModal}
          modalIdentifier="addition"
        />
        <PracticeCard
          title="Subtraction"
          iconSrc="/assets/logo/substraction3d2.png"
          totalCount={cardCounts.subtraction}
          onClick={openModal}
          modalIdentifier="subtraction"
        />
        <PracticeCard
          title="Multiplication"
          iconSrc="/assets/logo/multiplication3d.png"
          totalCount={cardCounts.multiplication}
          onClick={openModal}
          modalIdentifier="multiplication"
        />
        <PracticeCard
          title="Division"
          iconSrc="/assets/logo/division3d.png"
          totalCount={cardCounts.division}
          onClick={openModal}
          modalIdentifier="division"
        />
      </div>

      <div className="container mx-auto grid grid-cols-1  gap-4 p-5">
        <div className="block w-full h-full p-6 bg-white border border-custom-blue rounded-lg shadow">
          <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Student Home Work Image & Practice Link
          </h5>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              className="py-2 bg-custom-blue text-white rounded-lg"
              onClick={openImageUploadModal}
            >
              Student Home Work Image
            </button>
            <a
              href="https://www.sorobanexam.org/mentalcalculation.html?fullscreen=1"
              target="_blank"
              className="block p-4 bg-custom-blue rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <p className="text-white">
                Explore Mental Calculation techniques.
              </p>
            </a>
            <a
              href="https://abacus.tss.net.in/"
              target="_blank"
              className="block p-4 bg-custom-blue rounded-lg shadow-md"
            >
              <p className="text-white">
                Learn Abacus and sharpen your skills.
              </p>
            </a>
          </div>
        </div>
      </div>
      <StudentRating />
      {isImageUploadOpen && (
        <ImageUploadModel
          isModalOpen={isImageUploadOpen}
          setIsModalOpen={setIsImageUploadOpen}
          selectedCard={selectedCard}
        />
      )}
      {selectedCard && !isImageUploadOpen && (
        <TestModel
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedCard={selectedCard}
        />
      )}
    </>
  );
}
