import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Menu, Home, List, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Base-Url';




export default function Dashboard() {

  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  // const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('add');

  const [delPopup, setDelPopup ] = useState(null);
  const [delId, setDelId] = useState();
  const [openPop, setOpenPop] = useState(false)
  
  const [formData, setFormData] = useState({
    topic: '',
    subTopic: '',
    question: '',
    answer: '',
    tags: []
  });


  // get all topics question API
  const allQuestion = async () => {
              try {
                const response = await fetch(`${BASE_URL}/admin/all-questions`,{
                                  method: 'GET',
                                  credentials: "include",
                                  headers: {
                                     Authorization: "Bearer "+localStorage.getItem("token"),
                                    "Content-Type" : "application/json"}
              })

              const result = await response.json();

              setQuestions(result)
              } catch (error) {
                alert('Network Error, Something is wrong')
              }
  }

  // handle Logout API
  const handleLogout = async () => {
       try {
        const response = await fetch(`${BASE_URL}/admin/logout`,
                                                {
                                                  method: 'GET',
                                                  credentials: "include",
                                                  headers: {
                                                     Authorization: "Bearer "+localStorage.getItem("token"),
                                                    "Content-Type" : "application/json"}
                                                })
      const result = await response.json();
      const {status} = result;

      if(status){
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        navigate('/login');        
      }
       } catch (error) {
        alert('Network Error, something is wrong...')
       }
  }

  
  // handle Input section
  const handleInputChange =  (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // handle Add reference tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };


   // handle Remove reference tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  //handle Add Question API
  const handleSubmit = async () => {
    if (!formData.topic || !formData.subTopic || !formData.question || !formData.answer) {
      alert('Please fill in all required fields');
      return;
    }


    let summary = {
      title: formData.topic,
      subTitle: formData.subTopic,
      question: formData.question,
      answer: formData.answer,
      refTag: formData.tags,
    }


    let result
    if(isEditing){

      summary = {...summary, id: editingId}

      const response = await fetch(`${BASE_URL}/admin/update-topic`,
                                {
                                  method: 'PATCH',
                                  body: JSON.stringify({ summary }),
                                  credentials: "include",
                                  headers: {
                                     Authorization: "Bearer "+localStorage.getItem("token"),
                                    "Content-Type" : "application/json"}
                                })

     result = await response.json();

     setIsEditing(false);
     setFormData(null)
      
    } else {

      const response = await fetch(`${BASE_URL}/admin/add-topic`,
                                {
                                  method: 'POST',
                                  body: JSON.stringify(summary),
                                  credentials: "include",
                                  
                                  headers: {
                                     Authorization: "Bearer "+localStorage.getItem("token"),
                                    "Content-Type" : "application/json"}
                                })

       result = await response.json();
      }

    const {status} = result

    if(status){
       allQuestion()
       resetForm();
       setActiveView('list'); 
    }



    let newQuestions;
    if (isEditing && editingId !== null) {
      newQuestions = questions.map(q => 
        q.id === editingId ? { ...formData, id: editingId } : q
      );
    } else {
      const newQuestion = {
        ...formData,
        id: Date.now()
      };
      newQuestions = [...questions, newQuestion];
    }

    const newTopics = [...new Set([...topics, formData.topic])];
    
    setQuestions(newQuestions);
    setTopics(newTopics);
    // saveData(newQuestions, newTopics);
    
  };

  
  const resetForm = () => {
    setFormData({
      topic: '',
      subTopic: '',
      question: '',
      answer: '',
      tags: []
    });
    setCurrentTag('');
    setIsEditing(false);
    setEditingId(null);
  };


  //handle Update Question etc. API
  const handleEdit = (question) => {
    setFormData({
    topic: question.title,
    subTopic: question.subtopics[0].subTitle,
    question: question.subtopics[0].questions[0].question,
    answer: question.subtopics[0].questions[0].answer,
    tags: question.subtopics?.[0]?.questions?.[0]?.reference_tags,
  });
    setActiveView('add');
    setIsEditing(true);
    setEditingId(question._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // handle Delete Question etc. API
  const handleDelete = async () => {

    console.log("===========")
    console.log(delPopup)
    if(delPopup){}
      const newQuestions = questions.filter(q => q._id !== delId);
      setQuestions(newQuestions);

   try {
     const response = await fetch(`${BASE_URL}/admin/delete-que`,
                                {
                                  method: "DELETE",
                                  body: JSON.stringify({delId}),
                                  credentials: "include",
                                  headers: {
                                     Authorization: "Bearer "+localStorage.getItem("token"),
                                    "Content-Type" : "application/json"}

                                })

    const result = await response.json(); 
    
    const {status} = result;

    if(status){
      allQuestion();
    }
   } catch (error) {
    alert("Network Error, Something is wrong...")
   }
    
  
  }  




  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add', label: 'Add Question', icon: Plus },
    { id: 'list', label: 'All Questions', icon: List },
  ];






  return (

    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out 
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Q&A Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      if(item.id === 'list' || item.id === 'dashboard'){
                        allQuestion()
                      } 
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4  border-t border-gray-700">
          <div className="text-sm text-gray-400 pb-7">
            <p className="font-semibold text-white mb-1">Statistics</p>
            <p>Total Questions: {questions.length}</p>
          </div>

           <div  onClick={handleLogout}
                 className='text-white py-4 border-t border-gray-700 hover:cursor'>
              <div className='flex gap-x-2.5 justify-center items-center text-lg bg-blue-600 px-4 py-2.5 rounded-lg transition-colors hover:cursor-pointer'>
                <div>Logout</div> 
                <LogOut/>
              </div>
           </div>
        </div>

      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">


        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h2>
            <div className="w-6 lg:w-auto"></div>
          </div>
        </header>




        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12">

          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Questions</p>
                      <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
                    </div>
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Topics</p>
                      <p className="text-3xl font-bold text-gray-900">{[...new Set(questions.map(q => q.title))].length}</p>
                    </div>
                    <List className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Sub Topics</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {[...new Set(questions.map(q => q.subtopics[0].subTitle))].length}
                      </p>
                    </div>
                    <Tag className="w-12 h-12 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Questions</h3>
                <div className="space-y-3">
                  {questions.slice(-5).reverse().map(q => (
                    <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{q.subtopics[0].questions[0].question}</p>
                        <p className="text-sm text-gray-600">{q.title} - {q.subTopic}</p>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No questions yet</p>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Add/Edit Question View */}
          {activeView === 'add' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Question' : 'Add New Question'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic *
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Namaz"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Topic *
                    </label>
                    <input
                      type="text"
                      name="subTopic"
                      value={formData.subTopic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Conditions of prayer"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your question here..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer *
                  </label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the answer here..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (References)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors hover:cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                  
                  {isEditing && (
                    <button
                      onClick={resetForm}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors hover:cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}



          {/* Questions List View */}
          {activeView === 'list' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                All Questions ({questions.length})
              </h2>
              
              {questions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No questions added yet</p>
              ) : (
                <div className="space-y-4">
                  {questions.map(question => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {question.title}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {question.subtopics?.[0]?.subTitle}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {question.subtopics?.[0]?.questions?.[0]?.question}
                          </h3>
                          
                           <p className="text-gray-700 mb-2">{question.subtopics?.[0]?.questions?.[0]?.answer}</p>
                          
                          
                          {question.subtopics?.[0]?.questions?.[0]?.reference_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {question.subtopics?.[0]?.questions?.[0]?.reference_tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors hover:cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {setDelId(question._id), setOpenPop(true)}}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors hover:cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          { openPop &&
            
           ( <div class="fixed inset-0 z-50 bg-gray-400/30 backdrop-blur-sm flex items-center justify-center animate-fade-in">
           
                <div class="relative bg-white rounded-[15px] text-center p-6 w-1/2 h-1/3  md:w-1/2 md:h-1/3">
  
                  <div onClick={()=>{ setOpenPop(false)}}><button class="absolute top-4 right-5 text-2xl leading-none text-black hover:opacity-90 hover:cursor-pointer">&times;</button></div>

                    <div class="w-full md:w-full h-full md:h-full flex flex-col items-center justify-start gap-4 pl-0 p-5 ">
                      <h1 class="text-black text-center text-sm md:text-[1.2rem] lg:text-1xl">Are you sure you want to delete this question?</h1>

                      <div className='w-full h-full flex justify-center items-center gap-x-8 md:gap-x-14 pt-5'>
                         <button  onClick={()=> {setOpenPop(false), setDelPopup(true), handleDelete()}} class="bg-[#155DFC] hover:bg-blue-700 sm:text-lg md:text-1xl text-white font-bold py-1 px-5 hover:cursor-pointer rounded-sm" >Yes</button>
                         <button  onClick={()=> {setOpenPop(false), setDelPopup(false)}} class="text-blue-400 hover:bg-gray-200 border-2 sm:text-lg md:text-1xl border-blue-400 bg-white py-1 px-5 hover:cursor-pointer rounded-sm" >No</button>
                       </div>

                     </div>
                 </div>
            </div>
           )
          }


        </main>


      </div>
    </div>
  );


}





