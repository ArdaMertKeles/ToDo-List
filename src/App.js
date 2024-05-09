import React, { useEffect, useState } from "react";
import './style.css'
import SearchBar from "./components/SearchBar";
import AddBar from "./components/AddBar";
import Tasks from "./components/Tasks";
import Buttons from "./components/Buttons";
import DeleteAlert from "./components/DeleteAlert";
import AddAlert from "./components/AddAlert";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import serialize from "form-serialize";


// Yapılacaklar 
// Butonla Filtreleme
// Checkleyince class name değiştirme.
// Check olayı için daha optimal bir yol (opsiyonel)
// FİKİRRR Hoverleyince data id alıp cheklemeyi dene. ID si ile setState yap


// Burhan abi 122. satırda sorun yaşıyorum ya uygulamam bitmişti ama şu butonla filtreleme özelliği ekleyeyim dedim 3 gündür uğraşıyorum
// kafayı yiyecem farklı farklı şeyler denedim onla uğraşırken başka özellikler buldum ama yine onu yapamadım onu düzeltince başka bug
// çıkıyor o bugu düzeltince başkası bozuluyor yok mu bunun bi çzüöü

function App() {

  const [data, setData] = useState()

  // Data fetching.
  useEffect(() => {
    const axiosData = async () => {
      setIsLoading(true)
      const response = await axios.get('http://localhost:3002/tasks');
      setData(response.data)
      setDataFilter(response.data)
      setIsLoading(false)
    };
    axiosData()
  }, [])

  const [dataFilter, setDataFilter] = useState(data)
  const [isLoading, setIsLoading] = useState(false);


  // Task search.
  function searchTask(event) {
    let filter = data.filter((data) => {
      return data.task.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
    })
    setDataFilter(filter)
  }

  // Task adding event handler.
  const [deleteAlready, setDeleteAlready] = useState(false)
  const [addAlready, setAddAlready] = useState(false)
  const handleKeyPress = (event) => {
    console.log(event.target)
    event.preventDefault()
    if (serialize(event.target) !== '') {
      axios.post('http://localhost:3002/tasks/', serialize(event.target, { hash: true }));
      let error = document.getElementById('blankErrorDiv')
      const addAlert = document.getElementById('addAlert')
      setAddAlready(true)
      if (deleteAlready === false) {
        addAlert.style.opacity = '1'
        addAlert.style.transform = 'translate(-20px,-15px)'
        addAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
      } else if (deleteAlready === true) {
        addAlert.style.opacity = '1'
        addAlert.style.transform = 'translate(-20px,-75px)'
        addAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
      }
      setTimeout(() => {
        addAlert.style.opacity = '0'
        addAlert.style.transform = 'translate(-20px,-1px)'
        addAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
        setAddAlready(false)
      }, 1500);
      error.style.display = 'none'
    } else {
      let error = document.getElementById('blankErrorDiv')
      error.style.display = 'flex'
    }
    const axiosData = async () => {
      setIsLoading(true)
      const response = await axios.get('http://localhost:3002/tasks');
      setData(response.data)
      setDataFilter(response.data)
      setIsLoading(false)
    };
    setTimeout(() => {
      axiosData()
    }, 25);
  }

  // Task remove button.

  function removeList(id) {
    const newList = dataFilter.filter((d) => d.id !== id);
    axios.delete('http://localhost:3002/tasks/' + id)
    setDataFilter(newList)
    setData(newList)
    const deleteAlert = document.getElementById('deleteAlert')
    setDeleteAlready(true)
    if (addAlready === false) {
      deleteAlert.style.opacity = '1'
      deleteAlert.style.transform = 'translate(-20px,-15px)'
      deleteAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
    }else if(addAlready === true){
      deleteAlert.style.opacity = '1'
      deleteAlert.style.transform = 'translate(-20px,-75px)'
      deleteAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
    }
    setTimeout(() => {
      deleteAlert.style.opacity = '0'
      deleteAlert.style.transform = 'translate(-20px,-1px)'
      deleteAlert.style.transition = '0.3s cubic-bezier(.75,.07,1,.97)'
      setDeleteAlready(false)
    }, 1500);
  }


  // Button filters.
  const filterCompleted = () => {
    let filterCompleted = data.filter((data) => {
      return data.isChecked === true
    })
    setDataFilter(filterCompleted)
  }
  const filterActive = () => {
    let filterActive = data.filter((data) => {
      return data.isChecked === false
    })
    setDataFilter(filterActive)
  }
  const filterAll = () => {
    let filterActive = data.filter((data) => {
      return data.isChecked === false || true
    })
    setDataFilter(filterActive)
  }

  //  if post checked true, false or all

  const [checkbox, setCheckbox] = useState()
  console.log('data',data)
  function checkList(id) {

    setCheckbox(!checkbox)
    const axiosData = async () => {
      const response = await axios.get('http://localhost:3002/tasks/' + id);
      axios.put('http://localhost:3002/tasks/' + id, {
        task: response.data.task,
        isChecked: checkbox,
      })
      // console.log('response data' ,response.data)
      setData(dataFilter)
      console.log('data2', dataFilter)
    };
    axiosData()
    const axiosFetch = async () =>{
      const responsed = await axios.get('http://localhost:3002/tasks');
      setData(responsed.data)
      setDataFilter(responsed.data)
    };axiosFetch()
  }



  return (
    <div className="wrapper">
      <div className="header">
        <h1>To Do List!</h1>
      </div>
      <div className="media">
        <Routes>
          <Route path="/" element={<SearchBar search={searchTask} />} />
          <Route path="/add" Component={() => (<AddBar handleKeyPress={handleKeyPress} />)} />
        </Routes>
        <div className="blankErrorDiv" id="blankErrorDiv">
          <p className="blankError">This field cannot be left blank*</p>
        </div>
        <div className="taskWrapper">
          {isLoading && <div>Loading...</div>}
          {data && dataFilter?.map((task, key) => (
            <Tasks key={key} id={task.id} task={task.task}
              click={() => checkList(task.id)} remove={() => removeList(task.id)} />
          ))}
        </div>
        <Buttons completed={filterCompleted} active={filterActive} all={filterAll} left={dataFilter?.length + ' tasks left'} />
      </div>
      <DeleteAlert />
      <AddAlert />
    </div>
  );
}

export default App;
