
 const listVidReqElm = document.getElementById('listOfRequests');
function renderSingleVidReq(vidInfo ,isPrepend = false){
    const vidReqContainerElm = document.createElement('div');
    const vidReqTemplate = `
<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${vidInfo.topic_title} </h3>
              <p class="text-muted mb-2">${vidInfo.topic_details}</p>
              <p class="mb-0 text-muted">
                ${ vidInfo.expected_result && `<strong>Expected results:</strong> ${vidInfo.expected_result}`}
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a id="vote_up_${vidInfo._id}" class="btn btn-link">&#8593;</a>
              <h3 id="vote_num_${vidInfo._id}"> ${vidInfo.votes.ups - vidInfo.votes.downs} </h3>
              <a id="vote_down_${vidInfo._id}" class="btn btn-link">&#8595;</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${vidInfo.status}</span>
              &bullet; added by <strong>${vidInfo.author_name}</strong> on
              <strong>${new Date(vidInfo.submit_date).toLocaleString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
              ${vidInfo.target_level}
              </div>
            </div>
          </div>
        </div>
`;


vidReqContainerElm.innerHTML = vidReqTemplate;

if (isPrepend) {
    listVidReqElm.prepend(vidReqContainerElm);
} else {
    listVidReqElm.appendChild(vidReqContainerElm);
}


const voteUpsElm = document.getElementById(`vote_up_${vidInfo._id}`);
const voteDownElm = document.getElementById(`vote_down_${vidInfo._id}`);
const voteNumElm = document.getElementById(`vote_num_${vidInfo._id}`);


voteUpsElm.addEventListener('click', (e) =>{ 
    fetch('http://localhost:7777/video-request/vote', {
        method : 'PUT',
        headers : { 'content-Type' : 'application/json' },
        body : JSON.stringify({id: vidInfo._id, vote_type: 'ups'}) 
    })
    .then(bolb => bolb.json())
    .then(data => {
       voteNumElm.innerText = data.ups - data.downs
    })
    
   });
   voteDownElm.addEventListener('click', (e) =>{ 
       fetch('http://localhost:7777/video-request/vote', {
           method : 'PUT',
           headers : { 'content-Type' : 'application/json' },
           body : JSON.stringify({id: vidInfo._id, vote_type: 'downs'}) 
       })
       .then(bolb => bolb.json())
       .then(data => {
           voteNumElm.innerText = data.ups - data.downs
       })
       
      });

    
 

}

function loadAllVidReq(sortBy='newFirst'){

    fetch(`http://localhost:7777/video-request?sortBy=${sortBy}`  , {
        method: 'GET',
      })
    .then((blob)=> blob.json())
    .then(data => {
        listVidReqElm.innerHTML= '';
        data.forEach(vidInfo => {
            renderSingleVidReq(vidInfo);

        });
    });
}



document.addEventListener('DOMContentLoaded', function(){
    const FormVidReqElm = document.getElementById('FormVideoReq');

    const sortByElms = document.querySelectorAll('[id*=sortBy] ');
    sortByElms.forEach( elm => {
        elm.addEventListener('click', (e) => {
           
            e.preventDefault();
            
            const sortBy = elm.value;
            elm.classList.add('active')
            if (sortBy === 'topVotedFirst') {
                document.getElementById('sortByNew').classList.remove('active')
            }else{
                document.getElementById('sortByVoted').classList.remove('active')
            }
            console.log(sortBy);
            loadAllVidReq(sortBy)
          
           
          
        })
   

    })
   
  

    
   // get all video request from API
   loadAllVidReq()

// submit click event 
    FormVidReqElm.addEventListener('submit', (e) =>{
      e.preventDefault();
      const formData = new FormData(FormVidReqElm);
      
      fetch('http://localhost:7777/video-request', {
        method: 'POST',
        body: formData,
      })
      .then((resp) => resp.json())
      .then((data) => {
        renderSingleVidReq(data,true);
         });

  
    });
  });