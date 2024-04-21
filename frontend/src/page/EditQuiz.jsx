import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import NavbarQuiz from '../components/NavbarQuiz';
import { FaCheck } from 'react-icons/fa';
import { IoCloudUpload } from 'react-icons/io5';
 

const EditQuiz = () => {
  const { quizId } = useParams();
  const [title, setTitle] = useState('');
  const [jumlahSoal, setJumlahSoal] = useState('');
  const [link, setLink] = useState('');
  const [userId, setUserId] = useState('');
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [showQuizizView, setShowQuizizView] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const customStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: 'orange',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'white',
    }),
  };

  const handleNextClick = () => {
    setIsLoading(false);
    setShowQuizizView(true);
  };

  const handlePrevClick = () => {
    setIsLoading(false);
    setShowQuizizView(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleTagChange = (selectedOptions) => {
    setTags(selectedOptions);
  };

  const handleKeyDown = (event) => {
    if (event.key === ' ' && event.target.value.trim() !== '') {
      const newTag = { value: event.target.value.trim(), label: event.target.value.trim() };
      setTags([...tags, newTag]);
      event.target.value = '';
      event.preventDefault();
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setSelectedFileName(droppedFile.name);
  };

  const getAllTag = async () => {
    try {
      const response = await axios.get("http://194.233.93.124:3030/quiz/tags");
      setTags(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('jumlahSoal', jumlahSoal);
      formData.append('link', link);
      formData.append('userId', userId);
      formData.append('image', file);

      tags.forEach((tag, index) => {
        formData.append(`tags[${index}][nameTag]`, tag.value);
      });

      const response = await axios.patch(`http://194.233.93.124:3030/quiz/edit-quiz/${quizId}`, formData);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setErrMsg(error.response.data.msg);
    }
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://194.233.93.124:3030/quiz/quizzes/${quizId}`);
        const { title, jumlahSoal, link, userId, tags } = response.data;
        setTitle(title);
        setJumlahSoal(jumlahSoal);
        setLink(link);
        setUserId(userId.toString());
        setTags(tags.map((tag) => ({ value: tag.nameTag, label: tag.nameTag })));
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
    getAllTag();
  }, [quizId]);

    return (
        <div>
            {/* <NavbarQuiz /> */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '20px', marginTop: '20px' }}>
                <h2>Quiz Kreatif</h2>
            </div>    
            <div className="container mx-auto p-8">
                {!showQuizizView ? (
                    <>
                    <div style={{marginLeft: '20px', marginBottom: '30px', marginRight:'20px' }}>
                        <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                            <li class="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                                <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    Data <span class="hidden sm:inline-flex sm:ms-2">Quiz</span>
                                </span>
                            </li>
                            <li class="flex items-center">
                                <span class="me-2">2</span>
                                Link <span class="hidden sm:inline-flex sm:ms-2">Quiziz</span>
                            </li>
                        </ol>
                    </div>
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
                                Tags
                            </label>
                            <Select
                                id="tags"
                                value={tags}
                                onChange={handleTagChange}
                                options={tagOptions}
                                isMulti
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
                                Jumlah Quiz
                            </label>
                            <input
                                type="text"
                                id="userId"
                                value={jumlahSoal}
                                onChange={e => setJumlahSoal(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                File Upload
                            </label>
                            <div className="flex items-center">
                                <IoCloudUpload className="text-3xl text-gray-400" />
                                <input
                                    type="file"
                                    onChange={handleFileInputChange}
                                    className="ml-4"
                                />
                            </div>
                            {selectedFileName && <div className="mt-2 text-sm text-gray-600">Selected file: {selectedFileName}</div>}
                        </div>
                            <div className="flex justify-end gap-4">
                            <button
                                onClick={handlePrevClick}
                                className="bg-white text-gray-700 hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleNextClick}
                                className="bg-green-300 hover:bg-green-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                    <div style={{marginLeft: '20px', marginBottom: '20px', marginRight:'20px' }}>
                    <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                        <li class="flex md:w-full items-center text-gray-500 dark:text-gray-400 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                        <span class="me-2">1</span>
                            Data <span class="hidden sm:inline-flex sm:ms-2">Quiz</span>
                        </li>
                        <li class="flex items-center text-blue-600 dark:text-blue-500">
                        <span class="me-2">
                            <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                            Link <span class="hidden sm:inline-flex sm:ms-2">Quiziz</span>
                        </li>
                    </ol>
                    </div>
                        <div>
                            <div className="mt-4">
                                {isLoading && (
                                    <div className="flex justify-center items-center">
                                        <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                <div className="mx-auto p-4">
                                <a href="https://quizizz.com/admin?modal=contentCreation&type=quiz&ctaSource=quizmaker-main&fromPage=quizmaker&lng=en" target="_blank" class="block hover:bg-4CAEA3 text-white font-bold py-2 px-4 rounded mt-4 text-center" style={{ backgroundColor: '#38B0AB', width: '20vw', marginTop:'20px', marginBottom:'20px' }}>
                                    Lanjutkan Pada Quiziz
                                </a>
                                    <label htmlFor="link" className="block text-gray-700 text-sm font-bold mb-2">
                                        Link Quiz
                                    </label>
                                    <input
                                        type="text"
                                        id="link"
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                {errMsg && <div className="text-red-500 text-xs italic mt-4">{errMsg}</div>}
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={handlePrevClick}
                                        className="bg-white text-gray-700 hover:bg-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-300 hover:bg-green-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditQuiz;