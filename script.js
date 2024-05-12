//prevent the form from submission

document.getElementById("insertForm")
.addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("Eame").value;
  let email = document.getElementById("Email").value;
  let phone = document.getElementById("Phone").value;
  let password = document.getElementById("password").value;
  fetch("/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Name: name, Email: email, Phone: phone, Password: password}),
  })
  .then(function (response) {
    if (response.ok) {
      alert("Data inserted successfully!");
      document.getElementById("Name").value = "";
      document.getElementById("Email").value = "";
      document.getElementById("Phone").value = "";
      document.getElementById("password").value = "";
      getData();
    } else {
      alert("Failed to insert data!");
    }
  })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
});

function getData() {
  //clear any existing data
  const dataList = document.getElementById("dataList");
  while (dataList.firstChild) {
    dataList.removeChild(dataList.lastChild);
  }
  //refresh
  fetch("/view")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach(function (item) {
        let listItem = document.createElement("li");
        listItem.textContent = item.name + " - " +
          item.email;
        dataList.appendChild(listItem);
      });
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    });
}
//calling function
getData();