export function createGetRequest() {
  fetch('http://127.0.0.1:8000/api/note/')
  .then(response => response.json())
  .then(data => { 
    return data;
  }).catch(err => {console.log(err)})
}