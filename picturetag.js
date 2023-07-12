function fetchAllTags() {
    console.log("hehe...")
    const tagsContainer = document.getElementById('uploadForm');
    tagsContainer.style.display = 'none';
    const uploadedContainer = document.getElementById('uploadedContainer')
    uploadedContainer.style.display = 'none'
    while (uploadedContainer.firstChild) {
        uploadedContainer.removeChild(uploadedContainer.firstChild);
      }

    
    fetch('https://innovision-server.erajuzoqov.repl.co/alltags')
        .then(response => response.json())
        .then(res => {
            var tags=res['data']
            displayTags(tags);
        })
        .catch(error => {
            console.log('Error:', error);
        });
        var elements = document.querySelectorAll(".option");

        // Add event listener to the tag button
        elements.forEach(element => {
            element.addEventListener('click', () => {
                // Remove active class from all tag buttons
                const options = document.querySelectorAll('.option');
                options.forEach(button => button.classList.remove('active'));
                // Add active class to clicked option
                element.classList.add('active');
            });
        });
    
    
}

function displayTags(tags) {
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';
    tagsContainer.style.margin = '20px';
    tagsContainer.style.display = 'flex';
    tagsContainer.style.flexWrap = 'wrap';

    const tagsholder = document.getElementById('fieldcontainer');

    tagsholder.innerHTML = 'click on tag to see image(s) associated with it'
    tagsholder.style.display = 'flex';

    tags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.textContent = tag;
        tagButton.classList.add('tag-button');
        tagsContainer.appendChild(tagButton);

        // Add event listener to the tag button
        tagButton.addEventListener('click', () => {
            // Remove active class from all tag buttons
            const tagButtons = document.querySelectorAll('.tag-button');
            tagButtons.forEach(button => button.classList.remove('active'));
            // Add active class to clicked tag button
            tagButton.classList.add('active');
            displayImagesByTag(tag);

        }); 
    });
}

//DISPLAY IMAGE BY TAG
function displayImagesByTag(tag) {
    const formcontainer = document.getElementById('imagesContainer');
    formcontainer.innerHTML = '';
    formcontainer.style.display = 'flex';
    
    fetch(`https://innovision-server.erajuzoqov.repl.co/tag/${tag}`)
        .then(response => response.json())
        .then(res => {
            var imageUrls = res.data;
            imageUrls.forEach(image => {
                //https://photoapp-iphigenie-cs310.s3.us-east-2.amazonaws.com/t2.jpg
                var imageUrl = `https://photoapp-eraj-14.s3.us-east-2.amazonaws.com/${image}`;
                console.log(imageUrl)
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.classList.add('image');
                imagesContainer.appendChild(imgElement);
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

//UPLOAD

function upload() {
    const field = document.getElementById('fieldcontainer');
    const images = document.getElementById('imagesContainer');
    const tags = document.getElementById('tagsContainer');
    const tagsContainer = document.getElementById('uploadForm');
    const uploadedContainer = document.getElementById('uploadedContainer');
    
    images.style.display = 'none';
    tags.style.display = 'none';
    uploadedContainer.style.display = 'none';
    while (uploadedContainer.firstChild) {
        uploadedContainer.removeChild(uploadedContainer.firstChild);
      }

    tagsContainer.style.display = 'flex';
    field.innerHTML = 'upload only .jpg images'

}

// Add event listener to the form submit event
var form = document.getElementById('uploadForm');
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  console.log("handleFormSubmit function processing...");
  
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (file) {
    // Call your upload function and pass the file as an argument
    uploadImage(file);
  }
}

function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name); // Pass the file name to the server
    const url = 'https://innovision-server.erajuzoqov.repl.co/upload';
  
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(data => {
        console.log('File uploaded successfully:', data);
        const tags = JSON.parse(data).data; // Parse the response string to JSON
        var filename = file.name;
        displayextracted(filename, tags);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle errors if needed
      });
  }
  

  function displayextracted(filename, extractedtags) {
    const field = document.getElementById('fieldcontainer');
    const images = document.getElementById('imagesContainer');
    const tags = document.getElementById('tagsContainer');
    const tagsContainer = document.getElementById('uploadForm');
    const uploadedContainer = document.getElementById('uploadedContainer');
  
    field.style.display = 'none';
    images.style.display = 'none';
    tags.style.display = 'none';
    tagsContainer.style.display = 'none';
    uploadedContainer.style.display = 'flex';
  
    var imageUrl = `https://photoapp-eraj-14.s3.us-east-2.amazonaws.com/${filename}`;
    console.log(imageUrl);
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.classList.add('image');
    uploadedContainer.appendChild(imgElement);
  
    const tagElements = document.createElement('div');
  
    extractedtags.forEach(tag => {
      const tagButton = document.createElement('div');
      tagButton.textContent = tag;
      tagButton.classList.add('tag-button');
      tagElements.appendChild(tagButton);
    });
  
    side = document.createElement('div');
    const title = document.createElement('div');
    title.textContent = 'Tags extracted from image';
    title.classList.add('tagtitle');
  
    side.appendChild(title);
    side.classList.add('side');
    side.append(tagElements);
    uploadedContainer.appendChild(side);
  }
  