import './App.css';
import React from 'react';
import axios from 'axios';
import Posts from './components/Posts';

class App extends React.Component {


constructor(props) {
  super(props);
  this.state = {
    toDoList:[],
    activeItem : {
      id : null,
      title : "",
      description : "",
      done : false,
      date_created: ""
    },
    editing: false, 
    user: {
      username: props.username,
      password: props.password,
      isLoggedIn: props.isLoggedIn
    },
    token: {
      access_token: "",
      refresh_token: ""
    },
    currentPage: 1,
    postsPerPage: 6,

    filter: {
      title: "",
      id:""
    },
    totalNotes: 0,
    isFetching : false
  };
  this.fetchTasks = this.fetchTasks.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.getToken = this.getToken.bind(this);
  this.deleteTask = this.deleteTask.bind(this);
  this.startEdit = this.startEdit.bind(this);
  this.doneTask = this.doneTask.bind(this);
  this.setActiveItemToDefault = this.setActiveItemToDefault.bind(this); 
  this.refreshToken = this.refreshToken.bind(this);
  this.handleFilterChange = this.handleFilterChange.bind(this);
  this.handleFilter = this.handleFilter.bind(this);
  this.setDefaultFilter = this.setDefaultFilter.bind(this);
  this.clearFilter = this.clearFilter.bind(this);
  this.getPages = this.getPages.bind(this);
  this.addPages = this.addPages.bind(this);
  this.getNoteLength = this.getNoteLength.bind(this);
};

componentWillMount() {
  this.getToken();
  this.fetchTasks();
}

getNoteLength = async () => {
  await axios.get('http://127.0.0.1:8000/api/note/size').then(res => {
    
    // this.setState({
    //   totalNotes: res.data
    // })
    this.state.totalNotes = res.data;
  })
}

fetchTasks = () => {
  this.setState({
    user: {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      isLoggedIn: this.props.isLoggedIn, 
    }
  })
  console.log(this.state.user);

  if (this.state.user.isLoggedIn === false) {
    this.setState({
      token: {
        access_token: "",
        refresh_token: ""
      }
    })
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
  } else {
    axios.get('http://127.0.0.1:8000/api/note/page/')
    .then(response => {
      this.getNoteLength();
      // if (this.state.toDoList.length === 0 || this.state.toDoList.length !== this.state.totalNotes) {
      //   this.getPages()
      //   this.state.isFetching = false;
      // }
      this.getPages()
      this.setState({
        toDoList: response.data
      })
    })
    .catch(err => {});
  }
  
  // document.addEventListener('scroll', (async () => {
  //   var res = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
  //   if ((res >= 200 && res <= 400) || !this.state.isFetching) {
  //       this.state.isFetching = true;
  //       this.addPages()
  //   }
  // }))
}


//for numirate pagination
getPages = async () => {
  if (this.state.toDoList.length > 0) {
    // this.addPages()
    await axios({
      method: "GET",
      url: 'http://127.0.0.1:8000/api/note/page/',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.state.token.access_token
      },
      params: {
        "page" : this.state.currentPage,
        "pagesize" : this.state.pageSize
      }
    })
    .then(response => {
      this.setState({
        toDoList: response.data
      })
    })
    .catch(e => {})
  }
  
}


//for scrolling pagination
addPages = async () => {
  if (this.state.currentPage <= this.state.totalNotes / this.state.postsPerPage) {
    this.state.currentPage = this.state.currentPage + 1;
    await axios({
      method: "GET",
      url: 'http://127.0.0.1:8000/api/note/page/',
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        "page" : this.state.currentPage,
        "pagesize" : this.state.pageSize
      }
    })
    .then(response => {
      this.setState({
        toDoList: this.state.toDoList.concat(response.data)
      })
    })
    .catch(e => {})
  }
}

handleChange = (event) => {
  var name = event.target.name;
  var value = event.target.value;
  if (name === "title") {
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value.slice(0, 50)
      }
    });
  } else {
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        description : value.slice(0, 300)
      }
    })
  }
}

handleSubmit = async (event) => {
  // event.preventDefault();
  var url = "http://127.0.0.1:8000/api/note/"
  var response;
  this.fetchTasks()


  if (this.state.user.isLoggedIn === true) {
    this.refreshToken()
    if (this.state.editing === true) {
       response = await axios({
        method : "PUT",
        url: url + this.state.activeItem.id + '/',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.state.token.access_token
        },
        data: JSON.stringify(this.state.activeItem)
      }).catch(() => {this.refreshToken()});
      
      this.setActiveItemToDefault()
      this.fetchTasks()
      .then(() => {
        this.setActiveItemToDefault()
        this.setState({editing: false})
      })
      document.location.reload();
    } else {

      response = await axios({
        method : "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.state.token.access_token
        },
        data: JSON.stringify(this.state.activeItem)
      }).catch((e) => {this.refreshToken()});
  
      const res = response.data
      // this.fetchTasks()
      // this.setActiveItemToDefault()
      this.setState({
        toDoList: res.json()
      })
      document.location.reload();
    }
  }
 
}

refreshToken = () => {
  console.log(this.state.token)
  axios({
    method: "POST",
    url: 'http://127.0.0.1:8000/api/token/refresh/',
    headers: {"Content-Type": "application/json"},
    data: JSON.stringify({"refresh":this.state.token.refresh_token})
  })
  .then((response) => response.json())
  .then(data => {
    this.setState({
      token: {
        access_token: data.access
      }
    })
  })
}

setActiveItemToDefault(){
  this.setState({
    activeItem: {
      id : null,
      title : "",
      description : "",
      done : false,
      date_created: ""
    }
  })
}

getToken = async () => {
  if (this.state.user.isLoggedIn === false) {
    return;
  }
  if (this.state.token.access_token !== '' && this.state.token.refresh_token !== '') {
    this.setState({
      toke: {
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token")
      }
    })
  } 
  else {
    const url = "http://127.0.0.1:8000/api/token/"
    const response = await axios({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(this.state.user),
    })
    var data = response.data
    this.setState({
      token: {
        access_token: data.access,
        refresh_token: data.refresh
      }
    })
    localStorage.setItem("access_token", data.access)
    localStorage.setItem("refresh_token", data.refresh)
  }
  // need to store token in local storage since i dont have to make requests every time 
}

deleteTask = async(task) => {
  var url = 'http://127.0.0.1:8000/api/note-delete/' + task.id + '/';
  console.log(url)
  await axios({
    method : "DELETE",
    url: url,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.state.token.access_token
    }
  }).catch(() => {this.refreshToken()});
  document.location.reload()
}

startEdit(task) {
  this.setState({
    editing: true,
    activeItem: task
  })
}

doneTask = (task) => {
  if (this.state.token.access_token!== '') {
    var url = 'http://127.0.0.1:8000/api/note/' + task.id + '/'
  task.done = !task.done;
  axios({
    method : "PUT",
    url: url,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.state.token.access_token
    },
    data: JSON.stringify({
      'title': task.title,
      "description": task.description,
      "done": task.done,
      "date_created": task.date_created
    })
  }).then(this.fetchTasks)
  } else if (this.state.user.isLoggedIn === true && this.state.token.access_token === '') {
    this.getToken()
  } else {

  }
  
}

setDefaultFilter() {
  this.setState({
    filter: {
      title: "",
      id: ""
    }
  })
}

handleFilter = async () => { 
  if (this.state.filter.id === "" && this.state.filter.title === "") {
    this.setDefaultFilter()
    this.fetchTasks() 
    return;
  }

   await axios({
    method : "GET",
    url: 'http://127.0.0.1:8000/api/note/find',
    params: {
      "id": this.state.filter.id,
      "title": this.state.filter.title
    }
  }).then(repsonse => {
    this.setState({
      toDoList: repsonse.data
    })
  })
}

handleFilterChange (event) {
  if (event.target.name === "title"){
    this.setState({
      filter: {
      ...this.state.filter,
        title: event.target.value
      }
    })
  } else {
    this.setState({
      filter: {
      ...this.state.filter,
        id: event.target.value
      }
    })
  }
}

clearFilter() {
  document.location.reload()
}

  render() {
  // var tasks = this.state.toDoList.sort((a, b) => {
  //   if (a.id < b.id) {
  //     return -1;
  //   }
  // });
  var tasks = this.state.toDoList
  const currentPosts = tasks
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(this.state.totalNotes / this.state.postsPerPage); i++){
    pageNumbers.push(i);
  }
  const paginate = (pageNumber) => {
    this.setState({currentPage: pageNumber})
    // this.getPages()
    this.fetchTasks()
  };

  
    return (
      <div className="container">
        <div>
          <h2>Filter</h2>
          <div>
            <input type="text" onChange={this.handleFilterChange} name="title" className="form-control form-control-lg"  value={this.state.filter.title}></input>
            <label className="form-label" >By title</label>
          </div>
          <div>
            <input type="text" onChange={this.handleFilterChange} name="id" className="form-control form-control-lg"  value={this.state.filter.id}></input>
            <label className="form-label" >By ID</label>
          </div>
          <div>
            <button onClick={this.handleFilter} className="ripple ripple-surface btn btn-primary btn-lg" role="button">Find</button>
            <button onClick={this.clearFilter} id="clear-button" className="btn btn-lg btn-outline-dark delete">Clear</button>
            {/* <button onClick={() => {this.fetchTasks()}} id="fetch-button" className="btn btn-lg btn-outline-dark delete">Fetch</button> */}
          </div>
        </div>
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit}  id="form">
              <div className="flex-wrapper">
                  <div style={{flex: 4}}>
                      <input onChange={this.handleChange} className="form-control" id="title"  type="text" value={this.state.activeItem.title} name="title" placeholder="Add task.." />
                   </div>
                </div>
                <div className='flex-wrapper'>
                  <div style={{flex: 9}}>
                        <input onChange={this.handleChange} className="form-control" id="description"  type="text" value={this.state.activeItem.description} name="description" placeholder="Add description.." />
                     </div>
                </div>
                <div className='flex-wrapper'>
                  <div style={{flex: 1 }}>
                      <input id="submit" className="btn btn-warning " type="submit" name="Add" value="Submit"/>
                  </div>
                </div>
              </form>
          </div>
          <Posts tasks={currentPosts} deleteTask={this.deleteTask} startEdit={this.startEdit} doneTask={this.doneTask} />
          <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                  <li key={number} className='page-item'>
                    <a onClick={() => paginate(number)} href='!#' className='page-link'>
                      {number}
                    </a>
                  </li>
                ))}
            </ul>
        </nav>
        </div>
      </div>
    )
  }
}

export default App;
